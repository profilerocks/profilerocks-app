"use client";

import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";
import { linkToIframe } from "link-to-iframe";
import { useDeferredValue, useState } from "react";
import { useSnapshot } from "valtio";
import displayAttributes from "#shared/display.json";
import linkAttributes from "#shared/link.json";
import IconExternal from "#src/icons/external.svg";
import IconLink from "#src/icons/link.svg";
import IconPencil from "#src/icons/pencil.svg";
import IconTextRight from "#src/icons/text/right.svg";
import { alertErrorApp, alertMessage } from "#src/lib/alert";
import { normalizeDisplayName } from "#src/lib/name";

import {
  requestProfileDataDelete,
  requestProfileDataEmbedUpdate,
  requestProfileDataInsert,
  requestProfileDataPositionUpdate,
  requestProfileDataUpdate
} from "#src/lib/request";

import globalState from "#src/lib/state";
import { deleteProfileDataEntry, updateProfileDataEntryContent } from "#src/lib/state/profile";
import Button from "#src/ui/button";
import ButtonAdd from "#src/ui/button/add";
import ButtonDanger from "#src/ui/button/danger";
import InputCheckbox from "#src/ui/input/checkbox";
import InputGroup from "#src/ui/input/group";
import TextEditor from "#src/ui/editor/text";
import styles from "./page.module.scss";

// TODO: Add Ctrl + S to save

/**
 * @import {ProfileDataEntryObject} from "#src/lib/state"
 */

/**
 * @type {React.ComponentProps<DragDropProvider>["onDragEnd"]}
 */
const updateProfileDataPositionOnDragEnd = async event => {
  if (event.canceled) {
    return;
  }

  const { source } = event.operation;

  if (!isSortable(source)) {
    return;
  }

  const { initialIndex } = source;

  let { index } = source;

  if (initialIndex === index) {
    return;
  }

  const { currentProfile } = globalState;

  if (!currentProfile?.data?.length) {
    alertErrorApp();
    return;
  }

  const [currentDataEntry] = currentProfile.data.splice(initialIndex, 1);

  currentProfile.data.splice(index, 0, currentDataEntry);

  if (!currentDataEntry.content) {
    return;
  }

  /**
   * Very important!
   * It is necessary to account for the fact that there may be pending entries
   * that haven't been sent to the server yet. Thus, it is necessary to account
   * for them when calculating the index of the current data entry in the stored
   * data entries.
   */

  let precedingPendingEntries = 0;

  for (let i = 0; i < index; i++) {
    if (!currentProfile.data[i].content) {
      precedingPendingEntries++;
    }
  }

  if (precedingPendingEntries > 0) {
    const storedIndex = globalState.currentProfileDataStored?.findIndex(entry => entry.tag === currentDataEntry.tag);

    if (!storedIndex || storedIndex < 0) {
      return;
    }

    index -= precedingPendingEntries;

    if (storedIndex === index) {
      return;
    }
  }

  const res = await requestProfileDataPositionUpdate(currentProfile.public_id, currentDataEntry.tag, index);

  if (!res) {
    return;
  }

  if (!res.ok) {
    alertErrorApp();
  }
};

/**
 * @function ButtonAddProfileData
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {(boolean|null)} props.embed
 * @returns {React.ReactNode}
 */
function ButtonAddProfileData({ children, embed }) {
  function addDataEntryOnClick() {
    const { currentProfile } = globalState;

    if (!currentProfile) {
      return;
    }

    /**
     * @type {ProfileDataEntryObject}
     */
    const dataEntry = {
      content: "",
      embed,
      tag: crypto.randomUUID()
    };

    if (currentProfile.data) {
      currentProfile.data.push(dataEntry);
    } else {
      currentProfile.data = [dataEntry];
    }
  }

  return (
    <ButtonAdd onClick={addDataEntryOnClick} type="button" title="Add">
      {children}
    </ButtonAdd>
  );
}

/**
 * @function ButtonDeleteEntry
 * @param {Object} props
 * @param {boolean} props.loading
 * @param {React.Dispatch<boolean>} props.setLoading
 * @param {string} props.tag
 * @param {boolean} [props.pending]
 * @returns {React.ReactNode}
 */
function ButtonDeleteEntry({ loading, pending, setLoading, tag }) {
  /**
   * @async
   * @function deleteDataEntryOnClick
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  async function deleteDataEntryOnClick(event) {
    if (loading || !confirm("Are you sure you want to delete this data?")) {
      return;
    }

    const profilePublicId = globalState.currentProfile?.public_id;

    if (!profilePublicId) {
      return;
    }

    setLoading(true);

    if (!pending) {
      const res = await requestProfileDataDelete(profilePublicId, tag);

      if (!res) {
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setLoading(false);
        alertErrorApp();
        return;
      }
    }

    if (!deleteProfileDataEntry(profilePublicId, tag)) {
      setLoading(false);
    }
  }

  return (
    <ButtonDanger
      className={styles["btn-delete-data-entry"]}
      disabled={loading}
      onClick={deleteDataEntryOnClick}
      type="button"
    >
      Delete
    </ButtonDanger>
  );
}

/**
 * @function LinkEntry
 * @param {Object} props
 * @param {string} props.tag
 * @param {React.Ref<HTMLDivElement>} [props.handleRef]
 * @param {string} [props.initialDisplay]
 * @param {boolean} [props.initialEmbed]
 * @param {string} [props.initialUrl] - If not defined, it is considered a new entry.
 * @returns {React.ReactNode}
 */
function LinkEntry({
  handleRef,
  initialDisplay = "",
  initialEmbed = false,
  initialUrl = "",
  tag
}) {
  const [display, setDisplay] = useState(initialDisplay);
  const [embed, setEmbed] = useState(initialEmbed);
  const [loading, setLoading] = useState(false);
  const [urlString, setUrlString] = useState(initialUrl);
  const deferredDisplay = useDeferredValue(display);

  const normalizedDisplay = normalizeDisplayName(deferredDisplay);
  const urlValid = URL.canParse(urlString);
  const embedEnabled = urlValid && Boolean(linkToIframe(urlString, { returnObject: true }));

  /**
   * @async
   * @function setEmbedOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  async function setEmbedOnChange(event) {
    const embedChecked = (event.currentTarget || event.target).checked;

    /**
     * If `initialUrl` is not set, it means that it is a new entry.
     */
    if (initialUrl) {
      if (loading || !globalState.currentProfile) {
        return;
      }

      const { data, public_id: profilePublicId } = globalState.currentProfile;

      setLoading(true);

      const res = await requestProfileDataEmbedUpdate(profilePublicId, tag, embedChecked);

      setLoading(false);

      if (!res?.ok) {
        if (embedChecked) {
          alert("URL does not appear to be embeddable");
        } else {
          alertErrorApp();
        }

        return;
      }

      if (!data?.length) {
        alertErrorApp();
        return;
      }

      const profileDataEntry = data.find(dataEntry => dataEntry.tag === tag);

      if (!profileDataEntry) {
        alertErrorApp();
        return;
      }

      profileDataEntry.embed = embedChecked;
    }

    setEmbed(embedChecked);
  }

  /**
   * @async
   * @function saveOnClick
   */
  async function saveOnClick() {
    if (loading) {
      return;
    }

    const profilePublicId = globalState.currentProfile?.public_id;

    if (!profilePublicId) {
      return;
    }

    if (!URL.canParse(urlString)) {
      alertMessage("The URL is incorrect.");
      return;
    }

    if (initialUrl) {
      setLoading(true);

      const res = await requestProfileDataUpdate(profilePublicId, tag, urlString, embed, normalizedDisplay);

      setLoading(false);

      if (!res) {
        return;
      }

      if (!res.ok) {
        alertErrorApp();
        return;
      }

      updateProfileDataEntryContent(
        profilePublicId,
        tag,
        normalizedDisplay ? JSON.stringify([urlString, normalizedDisplay]) : urlString
      );
    } else {
      const profileDataEntries = globalState.currentProfile?.data;

      if (!profileDataEntries) {
        return
      }

      /**
       * @type {Parameters<requestProfileDataInsert>[1]}
       */
      const data = {
        content: urlString,
        embed,
        display: normalizedDisplay
      };

      let profileDataIndex = 0;

      /**
       * @type {(ProfileDataEntryObject|undefined)}
       */
      let profileDataEntry;

      do {
        const currentProfileDataEntry = profileDataEntries[profileDataIndex];

        if (currentProfileDataEntry.tag === tag) {
          profileDataEntry = currentProfileDataEntry;
        } else {
          profileDataIndex++;
        }
      } while (!profileDataEntry && profileDataIndex < profileDataEntries.length);
      
      if (profileDataEntry && profileDataEntries.length !== (profileDataIndex + 1)) {
        /**
         * Very important!
         * It is necessary to account for the fact that there may be pending entries
         * that haven't been sent to the server yet. Thus, it is necessary to account
         * for them when calculating the index of the current data entry in the stored
         * data entries.
         */

        let precedingPendingEntries = 0;

        for (let i = 0; i < profileDataIndex; i++) {
          if (!profileDataEntries[i].content) {
            precedingPendingEntries++;
          }
        }

        data.position = profileDataIndex - precedingPendingEntries;
      }

      setLoading(true);

      const res = await requestProfileDataInsert(
        profilePublicId,
        data
      );

      setLoading(false);

      if (!res) {
        return;
      }

      if (!res.ok || !profileDataEntry) {
        alertErrorApp();
        return;
      }

      // @ts-expect-error
      profileDataEntry.tag = (await res.bytes()).toBase64({ alphabet: "base64url" });

      profileDataEntry.content = normalizedDisplay ? JSON.stringify([urlString, normalizedDisplay]) : urlString;
    }
  }

  /**
   * @function updateDisplayOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function updateDisplayOnChange(event) {
    setDisplay((event.currentTarget ?? event.target).value);
  }

  /**
   * @function updateUrlStringOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function updateUrlStringOnChange(event) {
    setUrlString((event.currentTarget ?? event.target).value);
  }

  let classNameEntryActions = styles["entry-actions"];

  if (!initialUrl) {
    classNameEntryActions += ` ${styles.pending}`;
  }

  return (
    <>
      <InputCheckbox
        checked={embed}
        className={styles["checkbox-load-external-content"]}
        disabled={loading || (!embed && !embedEnabled)}
        onChange={setEmbedOnChange}
        title={embedEnabled ? undefined : "This URL cannot be embedded"}
      >Load external content</InputCheckbox>
      <div className={styles["link-entry"]} title={initialUrl ? undefined : "Insert to save this link"}>
        <InputGroup
          aria-invalid={!urlValid || (embed && !embedEnabled)}
          autoFocus={!initialUrl}
          disabled={loading}
          maxLength={linkAttributes.maxLength}
          onChange={updateUrlStringOnChange}
          title={(!embed || embedEnabled) ? undefined : "Invalid URL for embedding"}
          type="url"
          value={urlString}
        >
          *URL
        </InputGroup>
        <InputGroup
          defaultValue={initialDisplay}
          disabled={loading}
          maxLength={display.length - normalizedDisplay.length + displayAttributes.maxLength}
          onChange={updateDisplayOnChange}
          placeholder="e.g. Visit my page"
          type="text"
        >
          Display
        </InputGroup>
      </div>
      <div className={classNameEntryActions}>
        <ButtonDeleteEntry loading={loading} pending={!initialUrl} setLoading={setLoading} tag={tag} />
        <div ref={handleRef} className={styles.grab} title="Press to drag and move" />
        <Button
          className={styles["btn-save-data-entry"]}
          disabled={loading || !urlValid || (embed && !embedEnabled) || (urlString === initialUrl && normalizedDisplay === initialDisplay)}
          onClick={saveOnClick}
          type="button"
        >
          {initialUrl ? "Save" : "Insert"}
          <IconPencil width="1.25em" />
        </Button>
      </div>
    </>
  );
}

/**
 * @function LinkEntryWrapper
 * @param {Object} props
 * @param {ProfileDataEntryObject} props.entry
 * @param {React.Ref<HTMLDivElement>} [props.handleRef]
 * @returns {React.ReactNode}
 */
function LinkEntryWrapper({ entry }) {
  let initialDisplay = "";
  let initialUrl = "";

  if (entry.content[0] === "[") {
    try {
      [initialUrl, initialDisplay] = JSON.parse(entry.content);
    } catch {}
  } else {
    initialUrl = entry.content;
  }

  return (
    <LinkEntry
      initialDisplay={initialDisplay}
      initialEmbed={Boolean(entry.embed)}
      initialUrl={initialUrl}
      tag={entry.tag}
    />
  );
}

/**
 * If `entry.content` is empty, it is considered a new entry.
 * 
 * @function TextEditorWrapper
 * @param {Object} props
 * @param {ProfileDataEntryObject} props.entry
 * @param {React.Ref<HTMLDivElement>} [props.handleRef]
 * @returns {React.ReactNode}
 */
function TextEditorWrapper({ entry, handleRef }) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(entry.content ?? "");
  const trimmedValue = value.trim();

  /**
   * @async
   * @function saveOnClick
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  async function saveOnClick(event) {
    if (loading || !trimmedValue) {
      return;
    }

    const profilePublicId = globalState.currentProfile?.public_id;

    if (!profilePublicId) {
      return;
    }

    if (entry.content) {
      setLoading(true);

      const res = await requestProfileDataUpdate(profilePublicId, entry.tag, trimmedValue, entry.embed);

      setLoading(false);

      if (!res) {
        return;
      }

      if (!res.ok) {
        alertErrorApp();
        return;
      }

      updateProfileDataEntryContent(profilePublicId, entry.tag, trimmedValue);
    } else {
      const profileDataEntries = globalState.currentProfile?.data;

      if (!profileDataEntries) {
        return
      }

      /**
       * @type {Parameters<requestProfileDataInsert>[1]}
       */
      const data = {
        content: trimmedValue
      };

      let profileDataIndex = 0;

      /**
       * @type {(ProfileDataEntryObject|undefined)}
       */
      let profileDataEntry;

      do {
        const currentProfileDataEntry = profileDataEntries[profileDataIndex];

        if (currentProfileDataEntry.tag === entry.tag) {
          profileDataEntry = currentProfileDataEntry;
        } else {
          profileDataIndex++;
        }
      } while (!profileDataEntry && profileDataIndex < profileDataEntries.length);
      
      if (profileDataEntry && profileDataEntries.length !== (profileDataIndex + 1)) {
        /**
         * Very important!
         * It is necessary to account for the fact that there may be pending entries
         * that haven't been sent to the server yet. Thus, it is necessary to account
         * for them when calculating the index of the current data entry in the stored
         * data entries.
         */

        let precedingPendingEntries = 0;

        for (let i = 0; i < profileDataIndex; i++) {
          if (!profileDataEntries[i].content) {
            precedingPendingEntries++;
          }
        }

        data.position = profileDataIndex - precedingPendingEntries;
      }

      setLoading(true);

      const res = await requestProfileDataInsert(
        profilePublicId,
        data
      );

      setLoading(false);

      if (!res) {
        return;
      }

      if (!res.ok || !profileDataEntry) {
        alertErrorApp();
        return;
      }

      // @ts-expect-error
      profileDataEntry.tag = (await res.bytes()).toBase64({ alphabet: "base64url" });

      profileDataEntry.content = trimmedValue;
    }
  }

  let classNameEntryActions = styles["entry-actions"];

  if (!entry.content) {
    classNameEntryActions += ` ${styles.pending}`;
  }

  return (
    <>
      <TextEditor
        autoFocus={!entry.content}
        setValue={setValue}
        title={entry.content ? undefined : "Insert to save this text"}
        value={value}
      />
      <div className={classNameEntryActions}>
        <ButtonDeleteEntry loading={loading} pending={!entry.content} setLoading={setLoading} tag={entry.tag} />
        <div ref={handleRef} className={styles.grab} title="Press to drag and move" />
        <Button
          className={styles["btn-save-data-entry"]}
          disabled={loading || !trimmedValue || trimmedValue === entry.content}
          onClick={saveOnClick}
          type="button"
        >
          {entry.content ? "Save" : "Insert"}
          <IconPencil width="1.25em" />
        </Button>
      </div>
    </>
  );
}

/**
 * @function ProfileDataEntryContent
 * @param {Object} props
 * @param {ProfileDataEntryObject} props.entry
 * @param {React.Ref<HTMLDivElement>} [props.handleRef]
 */
function ProfileDataEntryContent({ entry, handleRef }) {
  return entry.embed == null ? (
    <TextEditorWrapper entry={entry} handleRef={handleRef} />
  ) : (
    <LinkEntryWrapper entry={entry} handleRef={handleRef} />
  );
}

/**
 * @function ProfileDataEntry
 * @param {Object} props
 * @param {ProfileDataEntryObject} props.entry
 * @param {number} props.index
 * @returns {React.ReactNode}<TextEditor value={value} setValue={setValue} />
 */
function ProfileDataEntry({ entry, index }) {
  const { handleRef, ref } = useSortable({
    id: entry.tag,
    index
  });

  return (
    <li ref={ref}>
      <ProfileDataEntryContent entry={entry} handleRef={handleRef} />
    </li>
  );
}

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function PageProfileContent() {
  const { currentProfile } = useSnapshot(globalState);

  if (!currentProfile) {
    return null;
  }

  return (
    <>
      {currentProfile.data?.length ? (
        <ul className={styles["list-data-entries"]}>
          <DragDropProvider modifiers={[RestrictToVerticalAxis]} onDragEnd={updateProfileDataPositionOnDragEnd}>
            {currentProfile.data.map((entry, i) => (
              <ProfileDataEntry entry={entry} index={i} key={entry.tag} />
            ))}
          </DragDropProvider>
        </ul>
      ) : (
        <p className={styles["message-empty"]}>Content will appear here</p>
      )}
      {(currentProfile.data?.length ?? 0) < 100 ? (
        <div className={styles.actions}>
          <ButtonAddProfileData embed={false}>
            Link
            <IconLink width="1.25em" />
          </ButtonAddProfileData>
          <ButtonAddProfileData embed={true}>
            External content
            <IconExternal width="1.25em" />
          </ButtonAddProfileData>
          <ButtonAddProfileData embed={null}>
            Text
            <IconTextRight width="1.25em" />
          </ButtonAddProfileData>
        </div>
      ) : (
        <p className={styles["message-empty"]}>
          Maximum number of data entries reached. Modify or delete one of the entries above to add a new one.
        </p>
      )}
    </>
  );
}
