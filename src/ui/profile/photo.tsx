"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CircleStencil } from "react-mobile-cropper";
import photoAttributes from "#shared/photo.json";
import IconBin from "#src/icons/bin.svg";
import IconLoading from "#src/icons/loading.svg";
import IconPencil from "#src/icons/pencil.svg";
import IconUpload from "#src/icons/upload.svg";
import { showAlertErrorApp, showAlert } from "#src/lib/alert";
import { HREF_ASSETS } from "#src/lib/env";
import { requestProfilePhotoUpload, requestProfilePhotoDeletion } from "#src/lib/request";
import globalState from "#src/lib/state";
import DragDrop from "#src/ui/dragdrop";
import EditorImage from "#src/ui/editor/image";

const sizeImg = 158;
const maxPhotoSizeMiB = photoAttributes.maxPhotoSize / 1048576;

function Photo({ src = "/user.png" }): React.ReactNode {
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

interface ProfilePhotoDetailsProps {
  actionRemovePhoto: (publicId: string) => Promise<Response | undefined>;
  children: React.ReactNode;
  inputPhotoId: string;
  setPhoto: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function ProfilePhotoDetails({ actionRemovePhoto, children, inputPhotoId, setPhoto }: ProfilePhotoDetailsProps): React.ReactNode {
  const detailsRef = useRef<HTMLDetailsElement>(null);

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
      function closeDetails(event: MouseEvent) {
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
      className="group details-content:transition details-content:transition-discrete not-open:details-content:opacity-0"
      name="photo-options"
      ref={detailsRef}
    >
      <summary className="group flex cursor-pointer text-zinc-400 group-open:text-zinc-100! hover:text-zinc-300 active:text-zinc-200">
        {children}
        <IconPencil
          className="absolute inset-e-0 inset-be-0 rounded-lg bg-zinc-900 p-1.5 transition-colors hover:bg-zinc-800 active:bg-zinc-700"
          width="2.125em"
        />
      </summary>
      <div className="absolute inset-x-0 inset-bs-0 z-1 flex min-w-max flex-col divide-y divide-zinc-700 text-zinc-300 select-none *:flex *:cursor-pointer *:gap-2 *:border-x *:border-zinc-700 *:bg-zinc-900/90 *:p-2 *:transition-colors *:hover:bg-zinc-800/90 *:hover:text-zinc-200 *:active:bg-zinc-700/90 *:active:text-zinc-100">
        <label className="rounded-t-xl border-bs" htmlFor={inputPhotoId}>
          <IconUpload width="1.25em" />
          Change
        </label>
        <button className="rounded-b-xl border-be" onClick={removePhoto} type="button">
          <IconBin width="1.25em" />
          Remove
        </button>
      </div>
    </details>
  );
}

interface ProfilePhotoProps {
  setEditorImageProps: React.Dispatch<React.SetStateAction<React.ComponentProps<typeof EditorImage> | undefined>>;
}

function ProfilePhoto({ setEditorImageProps }: ProfilePhotoProps): React.ReactNode {
  const [photo, setPhoto] = useState<string | undefined>(
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

  async function callbackBlob(blob: Blob | null) {
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

  function onChangePhoto(event: React.ChangeEvent<HTMLInputElement>) {
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

  function onDropPhoto(event: React.DragEvent<HTMLInputElement>) {
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

export default function ProfilePhotoEditor(): React.ReactNode {
  const [EditorImageProps, setEditorImageProps] = useState<React.ComponentProps<typeof EditorImage>>();

  return (
    <>
      <ProfilePhoto setEditorImageProps={setEditorImageProps} />
      <EditorImage {...EditorImageProps} />
    </>
  );
}
