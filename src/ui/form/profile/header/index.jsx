"use client";

import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { CircleStencil } from "react-mobile-cropper";
import displayNameAttributes from "#shared/display.json";
import photoAttributes from "#shared/photo.json";
import { alertErrorApp, alertMessage } from "#src/lib/alert";
import { HREF_ASSETS } from "#src/lib/env";
import { normalizeDisplayName } from "#src/lib/name";
import { requestProfileDisplayNameUpdate, requestProfilePhotoUpload, requestProfilePhotoDeletion } from "#src/lib/request";
import globalState from "#src/lib/state";
import ButtonNext from "#src/ui/button/next";
import DragDrop from "#src/ui/dragdrop";
import EditorImage from "#src/ui/editor/image";
import Loading from "#src/ui/loading";
import InputGroup from "#src/ui/input/group";
import IconUpload from "#src/icons/upload.svg";
import IconPencil from "#src/icons/pencil.svg";
import IconBin from "#src/icons/bin.svg";
import styles from "./index.module.scss";

const sizeImg = 158;

function Photo({ src = "/user.png" }) {
  return <img src={src} width={sizeImg} height={sizeImg} draggable="false" className={styles.photo} />;
}

function ProfilePhotoEmpty() {
  return (
    <label htmlFor="input-photo" className={styles["profile-photo-edit"]}>
      <Photo />
      <IconUpload width="2em" className={styles["icon-photo-edit"]} />
    </label>
  );
}

/**
 * @param {{
 *   children: React.ReactNode,
 *   actionRemove: (publicId: string) => Promise<Response | undefined>,
 *   setPhoto: React.Dispatch<React.SetStateAction<string | undefined>>
 * }} props
 */
function ProfilePhotoDetails({ setPhoto, actionRemove, children }) {
  /** @type {React.RefObject<HTMLDetailsElement|null>} */
  const detailsRef = useRef(null);

  async function removePhoto() {
    if (!globalState.currentProfile) {
      return;
    }

    const res = await actionRemove(globalState.currentProfile.public_id);

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    setPhoto(undefined);

    delete globalState.currentProfile.photo;
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
    <details className={styles["profile-image-details"]} name="photo-options" ref={detailsRef}>
      <summary className={styles["profile-photo-edit"]}>
        {children}
        <IconPencil width="2em" className={styles["icon-photo-edit"]} />
      </summary>
      <div className={styles["profile-photo-actions"]}>
        <label htmlFor="input-photo">
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
   * @param {Blob} blob
   */
  async function callbackBlob(blob) {
    if (!globalState.currentProfile) {
      return;
    }

    const profilePublicId = globalState.currentProfile?.public_id;

    if (!profilePublicId) {
      return;
    }

    if (blob.size > photoAttributes.maxPhotoSize) {
      alertMessage(
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
      alertErrorApp();
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
          // @ts-ignore
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
            // @ts-ignore
            if (filePhotoFirst.size <= maxSizeProfilePhoto) {
              setEditorImageProps({
                src: URL.createObjectURL(filePhotoFirst),
                stencilComponent: CircleStencil,
                // @ts-ignore
                callbackBlob
              });
              notFound = false;
            } else {
              // @ts-ignore
              alert(`Max photo size: ${maxSizeProfilePhotoMiB} MiB. Your photo size is ${filePhotoFirst.size / 1000000} MB`);
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
    <DragDrop onDrop={onDropPhoto} className={styles["container-photo-profile"]}>
      {photo ? (
        <ProfilePhotoDetails setPhoto={setPhoto} actionRemove={requestProfilePhotoDeletion}>
          <Photo src={photo} />
        </ProfilePhotoDetails>
      ) : (
        <ProfilePhotoEmpty />
      )}
      {submitting && <Loading />}
      <input type="file" accept="image/*" onChange={onChangePhoto} hidden id="input-photo" />
    </DragDrop>
  );
}

// /**
//  * @param {{
//  *   setEditorImageProps: React.Dispatch<React.SetStateAction<React.ComponentProps<typeof EditorImage> | undefined>>
//  * }} props
//  */
// function ProfileBackground({ setEditorImageProps }) {
//   const [photo, setPhoto] = useState();

//   function cleanPhoto() {
//     if (photo) {
//       URL.revokeObjectURL(photo);
//     }
//   }

//   useEffect(() => {
//     return cleanPhoto;
//   }, [photo]);

//   /** @param {Blob | null} blob */
//   async function callbackBlob(blob) {
//     const profilePublicId = globalState.currentProfile?.publicId;

//     if (profilePublicId && blob) {
//       // Send image to server
//       setPhoto(URL.createObjectURL(blob));
//       // setLoading(true)
//       // Send image to server
//       // @ts-ignore
//       if (!(await uploadBackground(profilePublicId))) {
//         setPhoto(undefined);
//       }
//       // setLoading(false)
//     }
//   }

//   /** @type {React.ChangeEventHandler<HTMLInputElement>} */
//   const onChangePhoto = event => {
//     const el = event.currentTarget;
//     const firstFile = el.files?.[0];

//     if (firstFile) {
//       setEditorImageProps({
//         src: URL.createObjectURL(firstFile),
//         // @ts-ignore
//         callbackBlob
//       });
//       el.value = "";
//     }
//   };

//   /** @param {React.DragEvent<HTMLInputElement>} event */
//   function onDropPhoto(event) {
//     const { files } = event.dataTransfer;

//     if (files.length) {
//       let i = 0;
//       let notFound = true;
//       do {
//         const filePhotoFirst = files.item(i);
//         if (filePhotoFirst?.type.startsWith("image")) {
//           // @ts-ignore
//           if (filePhotoFirst.size <= maxSizeProfilePhoto) {
//             setEditorImageProps({
//               src: URL.createObjectURL(filePhotoFirst),
//               // @ts-ignore
//               callbackBlob
//             });
//             notFound = false;
//           } else {
//             // @ts-ignore
//             alert(`Max photo size: ${maxSizeProfilePhotoMiB} MiB`);
//             i++;
//           }
//         } else {
//           i++;
//         }
//       } while (notFound && i < files.length);
//     }
//   }

//   return (
//     <DragDrop onDrop={onDropPhoto} className={styles["container-photo-background"]}>
//       {photo ? (
//         // @ts-ignore
//         <ProfilePhotoDetails setPhoto={setPhoto} actionRemove={removeBackgroundBackend}>
//           <img src={photo} draggable={false} className={styles["photo-background"]} />
//         </ProfilePhotoDetails>
//       ) : (
//         <label htmlFor="input-background">
//           <IconPhoto width="5em" />
//           Background
//         </label>
//       )}
//       <input type="file" accept="image/*" onChange={onChangePhoto} hidden id="input-background" />
//     </DragDrop>
//   );
// }

function Photos() {
  /**
   * @type {ReturnType<typeof useState<React.ComponentProps<EditorImage>>>}
   */
  const [EditorImageProps, setEditorImageProps] = useState();

  return (
    <>
      {/*<div className={styles["container-photos"]}>
        <ProfilePhoto setEditorImageProps={setEditorImageProps} />
        {/* <ProfileBackground setEditorImageProps={setEditorImageProps} /> */}
      {/*</div>*/}
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
        alertErrorApp();
        setSubmitting(false);
        return;
      }

      currentProfile.display_name = normalizedDisplayName;
    }

    router.push("/p/content?id=" + currentProfile.public_id);
  }

  return (
    <form onSubmit={submitProfileDisplayName}>
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
      <ButtonNext type="submit" disabled={submitting} className={styles["btn-next"]} />
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
