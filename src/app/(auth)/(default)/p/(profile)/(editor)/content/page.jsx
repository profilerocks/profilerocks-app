"use client";

import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";
import { useDeferredValue, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import displayAttributes from "#shared/display.json";
import linkAttributes from "#shared/link.json";
import IconLink from "#src/icons/link.svg";
import IconPencil from "#src/icons/pencil.svg";
import IconPlus from "#src/icons/plus.svg";
import IconTextRight from "#src/icons/text/right.svg";
import { alertErrorApp, alertMessage } from "#src/lib/alert";
import { normalizeDisplayName } from "#src/lib/name";

import {
  requestProfileDataDelete,
  requestProfileDataInsert,
  requestProfileDataPositionUpdate,
  requestProfileDataUpdate
} from "#src/lib/request";

import globalState from "#src/lib/state";
import { deleteProfileDataEntry, updateProfileDataEntryContent } from "#src/lib/state/profile";
import Button from "#src/ui/button";
import ButtonAdd from "#src/ui/button/add";
import ButtonDanger from "#src/ui/button/danger";
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

  if (currentDataEntry.pending) {
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
    if (currentProfile.data[i].pending) {
      precedingPendingEntries++;
    }
  }

  if (precedingPendingEntries > 0) {
    const storedIndex = globalState.currentProfileDataStored?.findIndex(entry => entry.tag === currentDataEntry.tag);

    if (!storedIndex) {
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
      tag: crypto.randomUUID(),
      pending: true
    };

    if (currentProfile.data) {
      currentProfile.data.push(dataEntry);
    } else {
      currentProfile.data = [dataEntry];
    }
  }

  return (
    <ButtonAdd type="button" onClick={addDataEntryOnClick}>
      {children}
    </ButtonAdd>
  );
}

/**
 * @function ButtonDeleteEntry
 * @param {Object} props
 * @param {string} props.tag
 * @param {boolean} [props.pending]
 * @returns {React.ReactNode}
 */
function ButtonDeleteEntry({ pending, tag }) {
  /**
   * @async
   * @function deleteDataEntryOnClick
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  async function deleteDataEntryOnClick(event) {
    const el = event.currentTarget || event.target;

    if (el.disabled || !confirm("Are you sure you want to delete this data?")) {
      return;
    }

    const profilePublicId = globalState.currentProfile?.public_id;

    if (!profilePublicId) {
      return;
    }

    el.disabled = true;

    if (!pending) {
      const res = await requestProfileDataDelete(profilePublicId, tag);

      if (!res) {
        el.disabled = false;
        return;
      }

      if (!res.ok) {
        el.disabled = false;
        alertErrorApp();
        return;
      }
    }

    if (!deleteProfileDataEntry(profilePublicId, tag)) {
      el.disabled = false;
    }
  }

  return (
    <ButtonDanger type="button" onClick={deleteDataEntryOnClick} className={styles["btn-delete-data-entry"]}>
      Delete
    </ButtonDanger>
  );
}

/**
 * @function LinkEntry
 * @param {Object} props
 * @param {string} props.tag
 * @param {boolean} [props.embed]
 * @param {React.Ref<HTMLDivElement>} [props.handleRef]
 * @param {string} [props.initialDisplay]
 * @param {string} [props.initialUrl]
 * @param {boolean} [props.pending]
 * @returns {React.ReactNode}
 */
function LinkEntry({
  embed = false,
  handleRef,
  initialDisplay = "",
  initialUrl = "",
  pending = false,
  tag
}) {
  const [display, setDisplay] = useState(initialDisplay);
  const [urlString, setUrlString] = useState(initialUrl);
  const deferredDisplay = useDeferredValue(display);
  const normalizedDisplay = normalizeDisplayName(deferredDisplay);
  const urlValid = URL.canParse(urlString);

  /**
   * @async
   * @function saveOnClick
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  async function saveOnClick(event) {
    const el = event.currentTarget || event.target;

    if (el.disabled) {
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

    el.disabled = true;

    if (pending) {
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
        const entry = profileDataEntries[profileDataIndex];

        if (entry.tag === tag) {
          profileDataEntry = entry;
        } else {
          profileDataIndex++;
        }
      } while (!profileDataEntry && profileDataIndex < profileDataEntries.length);
      
      if (profileDataEntry && profileDataEntries.length !== (profileDataIndex + 1)) {
        data.position = profileDataIndex;
      }

      const res = await requestProfileDataInsert(
        profilePublicId,
        data
      );

      el.disabled = false;

      if (!res) {
        return;
      }

      if (!res.ok) {
        alertErrorApp();
        return;
      }

      /**
       * TODO: `currentProfile` doesn't work for this case, research why.
       */
      const profile = globalState.profiles?.find(profile => profile.public_id === profilePublicId);

      if (!profile) {
        alertErrorApp();
        return;
      }

      profile.data ??= [];

      profile.data.push({
        content: urlString,
        embed,
        // @ts-expect-error
        tag: (await res.bytes()).toBase64({ alphabet: "base64url" })
      });
    } else {
      const res = await requestProfileDataUpdate(profilePublicId, tag, urlString, embed, normalizedDisplay);

      el.disabled = false;

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

  if (pending) {
    classNameEntryActions += ` ${styles.pending}`;
  }

  return (
    <>
      <div className={styles["link-entry"]} title={pending ? "Insert to save this entry" : undefined}>
        <InputGroup
          aria-invalid={urlString ? !urlValid : false}
          autoFocus={pending}
          type="url"
          onChange={updateUrlStringOnChange}
          maxLength={linkAttributes.maxLength}
          value={urlString}
        >
          *URL
        </InputGroup>
        <InputGroup
          maxLength={display.length - normalizedDisplay.length + displayAttributes.maxLength}
          onChange={updateDisplayOnChange}
          placeholder="e.g. Visit my page"
          type="text"
        >
          Display
        </InputGroup>
      </div>
      <div className={classNameEntryActions}>
        <ButtonDeleteEntry pending={pending} tag={tag} />
        <div ref={handleRef} className={styles.grab} title="Press to drag and move" />
        <Button
          className={styles["btn-save-data-entry"]}
          disabled={!urlString || !urlValid || (urlString === initialUrl && normalizedDisplay === initialDisplay)}
          onClick={saveOnClick}
          type="button"
        >
          {pending ? "Insert" : "Save"}
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
      embed={Boolean(entry.embed)}
      initialDisplay={initialDisplay}
      initialUrl={initialUrl}
      pending={entry.pending}
      tag={entry.tag}
    />
  );
}

/**
 * @function TextEditorWrapper
 * @param {Object} props
 * @param {ProfileDataEntryObject} props.entry
 * @param {React.Ref<HTMLDivElement>} [props.handleRef]
 * @returns {React.ReactNode}
 */
function TextEditorWrapper({ entry, handleRef }) {
  const [value, setValue] = useState(entry.content ?? "");
  const trimmedValue = value.trim();

  /**
   * @async
   * @function saveOnClick
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  async function saveOnClick(event) {
    if (!trimmedValue) {
      return;
    }

    const el = event.currentTarget || event.target;

    if (el.disabled) {
      return;
    }

    const profilePublicId = globalState.currentProfile?.public_id;

    if (!profilePublicId) {
      return;
    }

    el.disabled = true;

    const res = await requestProfileDataUpdate(profilePublicId, entry.tag, trimmedValue, entry.embed);

    el.disabled = false;

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    updateProfileDataEntryContent(profilePublicId, entry.tag, trimmedValue);
  }

  return (
    <>
      <TextEditor value={value} setValue={setValue} />
      <div className={styles["entry-actions"]}>
        <ButtonDeleteEntry pending={entry.pending} tag={entry.tag} />
        <div ref={handleRef} className={styles.grab} title="Press to drag and move" />
        <Button
          className={styles["btn-save-data-entry"]}
          disabled={!trimmedValue || trimmedValue === entry.content}
          onClick={saveOnClick}
          type="button"
        >
          Save
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
            Add link
            <IconLink width="1.25em" />
          </ButtonAddProfileData>
          <ButtonAddProfileData embed={null}>
            Add text
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
