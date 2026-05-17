"use client";

import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import displayAttributes from "#shared/display.json";
import linkAttributes from "#shared/link.json";
import IconLink from "#src/icons/link.svg";
import IconPencil from "#src/icons/pencil.svg";
import IconPlus from "#src/icons/plus.svg";
import IconTextRight from "#src/icons/text/right.svg";
import { alertErrorApp, alertMessage } from "#src/lib/alert";

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

  const { initialIndex, index } = source;

  if (initialIndex === index) {
    return;
  }

  const { currentProfile } = globalState;

  if (!currentProfile || !currentProfile.data?.length) {
    alertErrorApp();
    return;
  }

  const [dataEntry] = currentProfile.data.splice(initialIndex, 1);

  currentProfile.data.splice(index, 0, dataEntry);

  if (dataEntry.pending) {
    return;
  }

  const res = await requestProfileDataPositionUpdate(currentProfile.public_id, source.id.toString(), index);

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
    const { currentProfile } = globalState

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
      pending: true,
    }

    if (currentProfile.data) {
      currentProfile.data.push(dataEntry);
    } else {
      currentProfile.data = [dataEntry];
    }
  }

  return (
    <ButtonAdd type="button" onClick={addDataEntryOnClick}>{children}</ButtonAdd>
  )
}

/**
 * @function ButtonDeleteEntry
 * @param {Object} props
 * @param {string} props.tag
 * @returns {React.ReactNode}
 */
function ButtonDeleteEntry({ tag }) {
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

    const res = await requestProfileDataDelete(profilePublicId, tag);

    el.disabled = false;

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    deleteProfileDataEntry(profilePublicId, tag);
  }

  return (
    <ButtonDanger type="button" onClick={deleteDataEntryOnClick} className={styles["btn-delete-data-entry"]}>
      Delete
    </ButtonDanger>
  )
}

/**
 * @function LinkEntry
 * @param {Object} props
 * @param {string} props.tag
 * @param {boolean} [props.embed]
 * @param {React.Ref<HTMLDivElement>} [props.handleRef]
 * @param {string} [props.initialDisplay]
 * @param {string} [props.initialUrl]
 * @returns {React.ReactNode}
 */
function LinkEntry({ tag, embed = false, handleRef, initialDisplay = "", initialUrl = "" }) {
  const [display, setDisplay] = useState(initialDisplay);
  const [urlString, setUrlString] = useState(initialUrl);

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

    const res = await requestProfileDataUpdate(profilePublicId, tag, urlString, embed, display);

    el.disabled = false;

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    updateProfileDataEntryContent(profilePublicId, tag, display ? JSON.stringify([urlString, display]) : urlString);
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
    setUrlString((event.currentTarget ?? event.target).value)
  }

  return (
    <>
      <div className={styles["link-entry"]}>
        <InputGroup
          type="url"
          onChange={updateUrlStringOnChange}
          maxLength={linkAttributes.maxLength}
        >
          *URL
        </InputGroup>
        <InputGroup
          maxLength={displayAttributes.maxLength}
          onChange={updateDisplayOnChange}
          placeholder="e.g. Visit my page"
          type="text"
          value={urlString}
        >
          Display
        </InputGroup>
      </div>
      <div className={styles["entry-actions"]}>
        <ButtonDeleteEntry tag={tag} />
        <div ref={handleRef} className={styles.grab} title="Press to drag and move" />
        <Button
          className={styles["btn-save-data-entry"]}
          disabled={!urlString || initialUrl === urlString}
          onClick={saveOnClick}
          type="button"
        >
          Save<IconPencil width="1.25em" />
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
  let initialDisplay = ""
  let initialUrl = "";

  if (entry.content[0] === "[") {
    try {
      [initialUrl, initialDisplay] = JSON.parse(entry.content);
    } catch {}
  } else {
    initialUrl = entry.content
  }

  return (
    <LinkEntry
      embed={Boolean(entry.embed)}
      initialDisplay={initialDisplay}
      initialUrl={initialUrl}
      tag={entry.tag}
    />
  )
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
        <ButtonDeleteEntry tag={entry.tag} />
        <div ref={handleRef} className={styles.grab} title="Press to drag and move" />
        <Button
          className={styles["btn-save-data-entry"]}
          disabled={!trimmedValue || trimmedValue === entry.content}
          onClick={saveOnClick}
          type="button"
        >
          Save<IconPencil width="1.25em" />
        </Button>
      </div>
    </>
  )
}

/**
 * @function
 * @param {Object} props
 * @param {(boolean|number|null)} props.embed
 * @param {React.Dispatch<React.SetStateAction<boolean|null|undefined>>} props.setEmbed
 * @returns {React.ReactNode}
 */
function PreviewData({ embed, setEmbed }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
  }, [embed]);

  /**
   * @async
   * @function deleteDataEntryOnClick
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  async function deleteDataEntryOnClick(event) {
    if (!confirm("Are you sure you want to delete this data?")) {
      return;
    }

    setEmbed(undefined);
  }

  /**
   * @async
   * @function saveOnClick
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  async function saveOnClick(event) {
    const el = event.currentTarget || event.target || {};

    if (el.disabled) {
      return;
    }

    const profilePublicId = globalState.currentProfile?.public_id;

    if (!profilePublicId) {
      return;
    }

    /**
     * @type {string}
     */
    let content;

    /**
     * @type {(string|undefined)}
     */
    let display;

    if (embed != null) {
      if (value[0] === "[") {
        [content, display] = JSON.parse(value);
      } else {
        content = value;
      }
      if (!URL.canParse(content)) {
        alertMessage("The URL is incorrect.");
        return;
      }
    } else {
      content = value;
    }

    el.disabled = true;

    const res = await requestProfileDataInsert(profilePublicId, content.trim(), embed, display?.trim());

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
      content: value,
      embed,
      // @ts-expect-error
      tag: (await res.bytes()).toBase64({ alphabet: "base64url" })
    });

    setEmbed(undefined);
  }

  return (
    <div className={styles["entry-preview"]}>
      {embed == null ? (
        <TextEditor value={value} setValue={setValue} />
      ) : (
        <LinkEntry value={value} setValue={setValue} />
      )}
      <div className={styles["entry-actions"]}>
        <ButtonDanger type="button" onClick={deleteDataEntryOnClick}>
          Delete
        </ButtonDanger>
        <Button type="button" className={styles["btn-save-data-entry"]} disabled={!value} onClick={saveOnClick}>
          Insert<IconPlus width="1.25em" />
        </Button>
      </div>
    </div>
  );
}

/**
 * @function ProfileDataEntryContent
 * @param {Object} props
 * @param {ProfileDataEntryObject} props.entry
 * @param {React.Ref<HTMLDivElement>} [props.handleRef]
 */
function ProfileDataEntryContent({ entry, handleRef }) {
  return (
    entry.embed == null ? (
      <TextEditorWrapper entry={entry} handleRef={handleRef} />
    ) : (
      <LinkEntryWrapper entry={entry} handleRef={handleRef} />
    )
  )
}

/**
 * @function ProfileDataEntry
 * @param {Object} props
 * @param {ProfileDataEntryObject} props.entry
 * @param {number} props.index
 * @returns {React.ReactNode}
 */
function ProfileDataEntry({ entry, index }) {
  const { handleRef, ref } = useSortable({
    id: entry.tag,
    index
  });

  return (
    <li ref={ref}><ProfileDataEntryContent entry={entry} handleRef={handleRef} /></li>
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
      {currentProfile?.data?.length ? (
        <ul className={styles["list-data-entries"]}>
          <DragDropProvider
            modifiers={[RestrictToVerticalAxis]}
            onDragEnd={updateProfileDataPositionOnDragEnd}
          >
            {currentProfile.data.map((entry, i) => (
              <ProfileDataEntry entry={entry} index={i} key={entry.tag} />
            ))}
          </DragDropProvider>
        </ul>
      ) : (
        <p className={styles["message-empty"]}>Content will appear here</p>
      )}
      {(currentProfile?.data?.length ?? 0) < 100 ? (
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
