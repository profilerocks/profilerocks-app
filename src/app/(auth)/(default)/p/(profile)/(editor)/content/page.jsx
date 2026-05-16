"use client";

import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";
import { useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import linkAttributes from "#shared/link.json";
import IconLink from "#src/icons/link.svg";
import IconPencil from "#src/icons/pencil.svg";
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

  const res = await requestProfileDataPositionUpdate(currentProfile.public_id, source.id.toString(), index);

  if (!res) {
    return;
  }

  if (!res.ok) {
    alertErrorApp();
  }
};

/**
 * @function LinkEntry
 * @param {Object} props
 * @param {string} props.value
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setValue
 * @returns {React.ReactNode}
 */
function LinkEntry({ value, setValue }) {
  const contentArrayResult = value[0] === "[";
  const content = contentArrayResult ? JSON.parse(value) : value;

  /**
   * @function updateDisplayOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function updateDisplayOnChange(event) {
    const { value } = event.currentTarget;
    const urlString = contentArrayResult ? content[0] : content;

    setValue(value ? JSON.stringify([urlString, value]) : urlString);
  }

  /**
   * @function updateUrlStringOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function updateUrlStringOnChange(event) {
    setValue(contentArrayResult ? JSON.stringify([event.currentTarget.value, content[1]]) : event.currentTarget.value);
  }

  return (
    <div className={styles["link-entry"]}>
      <InputGroup
        type="url"
        onChange={updateUrlStringOnChange}
        value={contentArrayResult ? content[0] : content}
        maxLength={linkAttributes.maxLength}
      >
        *URL
      </InputGroup>
      <InputGroup
        maxLength={linkAttributes.displayMaxLength}
        onChange={updateDisplayOnChange}
        placeholder="e.g. Visit my page"
        type="text"
        value={contentArrayResult ? content[1] : ""}
      >
        Display
      </InputGroup>
    </div>
  );
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
        <Button type="button" disabled={!value} onClick={saveOnClick}>
          Insert
        </Button>
      </div>
    </div>
  );
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

  const [value, setValue] = useState(entry.content);

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

    const res = await requestProfileDataDelete(profilePublicId, entry.tag);

    el.disabled = false;

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    deleteProfileDataEntry(profilePublicId, entry.tag);
  }

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

    /**
     * @type {string}
     */
    let content;

    /**
     * @type {(string|undefined)}
     */
    let display;

    if (entry.embed != null) {
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

    const res = await requestProfileDataUpdate(profilePublicId, entry.tag, content.trim(), entry.embed, display?.trim());

    el.disabled = false;

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    updateProfileDataEntryContent(profilePublicId, entry.tag, value);
  }

  return (
    <li ref={ref}>
      {entry.embed == null ? (
        <TextEditor value={value} setValue={setValue} />
      ) : (
        <LinkEntry value={value} setValue={setValue} />
      )}
      <div className={styles["entry-actions"]}>
        <ButtonDanger type="button" onClick={deleteDataEntryOnClick} className={styles["btn-delete-data-entry"]}>
          Delete
        </ButtonDanger>
        <div ref={handleRef} className={styles["grab"]} title="Press to drag and move" />
        <Button className={styles["btn-save-data-entry"]} disabled={!value || entry.content === value} onClick={saveOnClick} type="button">
          Save<IconPencil width="1.25em" />
        </Button>
      </div>
    </li>
  );
}

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function PageProfileContent() {
  /**
   * @type {ReturnType<typeof useState<boolean|null>>}
   */
  const [embed, setEmbed] = useState();

  /**
   * @type {React.RefObject<HTMLUListElement|null>}
   */
  const profileDataListUlRef = useRef(null);

  const { currentProfile } = useSnapshot(globalState);

  if (!currentProfile) {
    return null;
  }

  return (
    <>
      {currentProfile?.data?.length ? (
        <ul className={styles["list-data-entries"]} ref={profileDataListUlRef}>
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
        <>
          {embed !== undefined && <PreviewData embed={embed} setEmbed={setEmbed} />}
          <div className={styles.actions}>
            <ButtonAdd type="button" onClick={() => setEmbed(false)}>
              Add link
              <IconLink width="1.25em" />
            </ButtonAdd>
            <ButtonAdd type="button" onClick={() => setEmbed(null)}>
              Add text
              <IconTextRight width="1.25em" />
            </ButtonAdd>
          </div>
        </>
      ) : (
        <p className={styles["message-empty"]}>
          Maximum number of data entries reached. Modify or delete one of the entries above to add a new one.
        </p>
      )}
    </>
  );
}
