"use client";

import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useId, useRef, useState } from "react";
import { CircleStencil } from "react-mobile-cropper";
import displayNameAttributes from "#shared/display.json";
import photoAttributes from "#shared/photo.json";
import IconBin from "#src/icons/bin.svg";
import IconLoading from "#src/icons/loading.svg";
import IconPencil from "#src/icons/pencil.svg";
import IconUpload from "#src/icons/upload.svg";
import { showAlertErrorApp, showAlert } from "#src/lib/alert";
import { HREF_ASSETS } from "#src/lib/env";
import { normalizeDisplayName } from "#src/lib/name";
import { requestProfileDisplayNameUpdate, requestProfilePhotoUpload, requestProfilePhotoDeletion } from "#src/lib/request";
import globalState from "#src/lib/state";
import ButtonNext from "#src/ui/button/next";
import DragDrop from "#src/ui/dragdrop";
import EditorImage from "#src/ui/editor/image";
import InputGroup from "#src/ui/input/group";

/**
 * @async
 * @callback ActionRemovePhoto
 * @param {string} publicId
 * @returns {Promise<Response|undefined>}
 */

const sizeImg = 158;
const maxPhotoSizeMiB = photoAttributes.maxPhotoSize / 1048576;

function Photo({ src = "/user.png" }) {
  return (
    <img
      className="rounded-full border-2 border-zinc-700 object-cover select-none"
      draggable="false"
      height={sizeImg}
      src={src}
      width={sizeImg}
    />
  );
}

/**
 * @function ProfilePhotoDetails
 * @param {Object} props
 * @param {ActionRemovePhoto} props.actionRemovePhoto
 * @param {React.ReactNode} props.children
 * @param {string} props.inputPhotoId
 * @param {React.Dispatch<React.SetStateAction<string|undefined>>} props.setPhoto
 */
function ProfilePhotoDetails({ actionRemovePhoto, children, inputPhotoId, setPhoto }) {
  /** @type {React.RefObject<HTMLDetailsElement|null>} */
  const detailsRef = useRef(null);

  async function removePhoto() {
    if (!globalState.currentProfile) {
      return;
    }

    const res = await actionRemovePhoto(globalState.currentProfile.public_id);

    if (!res) {
      return;
    }

    if (!res.ok) {
      showAlertErrorApp();
      return;
    }

    setPhoto(undefined);

    globalState.currentProfile.photo = undefined;
  }

  useEffect(() => {
    const elDetails = detailsRef.current;
    if (elDetails) {
      /** @param {MouseEvent} event */
      function closeDetails(event) {
        // @ts-expect-error
        if (elDetails?.open && !elDetails.contains(event.target)) {
          elDetails.open = false;
        }
      }
      document.addEventListener("mousedown", closeDetails);
      return () => {
        document.removeEventListener("mousedown", closeDetails);
      };
    }
  }, []);

  return (
    <details
      className="details-content:transition details-content:transition-discrete not-open:details-content:opacity-0"
      name="photo-options"
      ref={detailsRef}
    >
      <summary className="group flex cursor-pointer text-zinc-400 hover:text-zinc-300 active:text-zinc-200">
        {children}
        <IconPencil
          className="absolute inset-e-0 inset-be-0 rounded-lg bg-zinc-900 p-1.5 transition-colors group-hover:bg-zinc-800 group-active:bg-zinc-700"
          width="2.125em"
        />
      </summary>
      <div className="absolute inset-x-0 inset-bs-0 z-1 min-w-max select-none">
        <label htmlFor={inputPhotoId}>
          <IconUpload width="1.25em" />
          Change
        </label>
        <button type="button" onClick={removePhoto}>
          <IconBin width="1.25em" />
          Remove
        </button>
      </div>
    </details>
  );
}

/**
 * @param {{
 *   setEditorImageProps: React.Dispatch<React.SetStateAction<React.ComponentProps<typeof EditorImage> | undefined>>
 * }} props
 */
function ProfilePhoto({ setEditorImageProps }) {
  /**
   * @type {ReturnType<typeof useState<string|undefined>>}
   */
  const [photo, setPhoto] = useState(
    globalState.currentProfile?.photo ? HREF_ASSETS + "/profile/" + globalState.currentProfile.public_id + "/photo" : undefined
  );

  const [submitting, setSubmitting] = useState(false);

  const inputPhotoId = useId();

  function cleanPhoto() {
    if (photo) {
      URL.revokeObjectURL(photo);
    }
  }

  useEffect(() => {
    return cleanPhoto;
  }, [photo]);

  /**
   * @async
   * @function callbackBlob
   * @param {(Blob|null)} blob
   */
  async function callbackBlob(blob) {
    if (!blob || !globalState.currentProfile) {
      return;
    }

    const profilePublicId = globalState.currentProfile?.public_id;

    if (!profilePublicId) {
      return;
    }

    if (blob.size > photoAttributes.maxPhotoSize) {
      showAlert(
        "An error occurred, the photo is too big and your browser didn't process it correctly. Try a smaller photo or use another browser."
      );

      return;
    }

    setSubmitting(true);
    setPhoto(URL.createObjectURL(blob));

    const res = await requestProfilePhotoUpload(profilePublicId, blob);

    setSubmitting(false);

    if (!res?.ok) {
      setPhoto(undefined);
      showAlertErrorApp();
      return;
    }

    globalState.currentProfile.photo = true;
  }

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  function onChangePhoto(event) {
    if (!submitting) {
      const el = event.currentTarget;
      const firstFile = el.files?.[0];

      if (firstFile) {
        setEditorImageProps({
          src: URL.createObjectURL(firstFile),
          stencilComponent: CircleStencil,
          callbackBlob
        });

        el.value = "";
      }
    }
  }

  /** @param {React.DragEvent<HTMLInputElement>} event */
  function onDropPhoto(event) {
    if (!submitting) {
      const { files } = event.dataTransfer;

      if (files.length) {
        let i = 0;
        let notFound = true;
        do {
          const filePhotoFirst = files.item(i);
          if (filePhotoFirst?.type.startsWith("image")) {
            if (filePhotoFirst.size <= photoAttributes.maxPhotoSize) {
              setEditorImageProps({
                src: URL.createObjectURL(filePhotoFirst),
                stencilComponent: CircleStencil,
                callbackBlob
              });
              notFound = false;
            } else {
              showAlert(`Max photo size: ${maxPhotoSizeMiB} MiB. Your photo size is ${filePhotoFirst.size / 1000000} MB`);
              i++;
            }
          } else {
            i++;
          }
        } while (notFound && i < files.length);
      }
    }
  }

  return (
    <DragDrop onDrop={onDropPhoto} className="relative mx-auto max-w-max p-3">
      {photo ? (
        <ProfilePhotoDetails actionRemovePhoto={requestProfilePhotoDeletion} inputPhotoId={inputPhotoId} setPhoto={setPhoto}>
          <Photo src={photo} />
        </ProfilePhotoDetails>
      ) : (
        <label className="group flex cursor-pointer text-zinc-400 hover:text-zinc-300 active:text-zinc-200" htmlFor={inputPhotoId}>
          <Photo />
          <IconUpload
            className="absolute inset-e-0 inset-be-0 rounded-lg bg-zinc-900 p-1.5 transition-colors group-hover:bg-zinc-800 group-active:bg-zinc-700"
            width="2.125em"
          />
        </label>
      )}
      {submitting && <IconLoading className="absolute inset-0" />}
      <input accept="image/*" hidden id={inputPhotoId} onChange={onChangePhoto} type="file" />
    </DragDrop>
  );
}

function Photos() {
  /**
   * @type {ReturnType<typeof useState<React.ComponentProps<EditorImage>>>}
   */
  const [EditorImageProps, setEditorImageProps] = useState();

  return (
    <>
      <ProfilePhoto setEditorImageProps={setEditorImageProps} />
      <EditorImage {...EditorImageProps} />
    </>
  );
}

function FormProfileDisplayName() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState(globalState.currentProfile?.display_name ?? "");
  const deferredDisplayName = useDeferredValue(displayName);

  const normalizedDisplayName = normalizeDisplayName(deferredDisplayName);

  const lengthDifference = normalizedDisplayName.length - displayName.length;
  const minLengthDisplayName = lengthDifference + 1;
  const maxLengthDisplayName = lengthDifference + displayNameAttributes.maxLength;

  /**
   * @function setDisplayNameOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function setDisplayNameOnChange(event) {
    setDisplayName(event.currentTarget.value);
  }

  /**
   * @async
   * @function submitProfileDisplayName
   * @param {React.SubmitEvent<HTMLFormElement>} event
   */
  async function submitProfileDisplayName(event) {
    event.preventDefault();

    const { currentProfile } = globalState;

    if (!currentProfile) {
      return;
    }

    if (normalizedDisplayName) {
      setSubmitting(true);

      const res = await requestProfileDisplayNameUpdate(currentProfile.public_id, normalizedDisplayName);

      if (!res) {
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        showAlertErrorApp();
        setSubmitting(false);
        return;
      }

      currentProfile.display_name = normalizedDisplayName;
    }

    router.push("/p/content?id=" + currentProfile.public_id);
  }

  return (
    <form className="mbs-4" onSubmit={submitProfileDisplayName}>
      <InputGroup
        type="text"
        placeholder="e.g. John Doe"
        minLength={minLengthDisplayName}
        maxLength={maxLengthDisplayName}
        onChange={setDisplayNameOnChange}
        value={displayName}
        disabled={submitting}
      >
        Display name
      </InputGroup>
      <ButtonNext className="float-end mbs-4 ps-3.5" disabled={submitting} type="submit" />
    </form>
  );
}

export default function EditProfileHeader() {
  return (
    <>
      <Photos />
      <FormProfileDisplayName />
    </>
  );
}
