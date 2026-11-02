import { showAlertErrorServer } from "#src/lib/alert";
import { API } from "#src/lib/env";

export interface ProfileDataInsertPayload {
  content: string;
  display?: string;
  embed?: boolean | number | null;
  position?: number;
}

/**
 * @param props
 */
async function handleRequest(...props: Parameters<typeof fetch>): Promise<Response | undefined> {
  try {
    const res = await fetch(...props);
    if (res.status < 500) {
      return res;
    }
  } catch (error) {
    if (!(error instanceof TypeError)) {
      return;
    }
  }

  showAlertErrorServer();
}

/**
 * @param input
 */
function getResourceAPI(input: string): string {
  return API + input;
}

/**
 * @param provider
 */
export async function requestOauthDelete(provider: string): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/oauth/" + provider + "/delete"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param provider
 * @param update
 */
export async function requestOauthLink(provider: string, update = false): Promise<Response | undefined> {
  let path = "/s/oauth/" + provider;

  if (update) {
    path += "?update=1";
  }

  return await handleRequest(getResourceAPI(path), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param email
 */
export async function requestOtpEnterCreation(email: string): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/otp"), {
    method: "POST",
    credentials: "include",
    body: email
  });
}

/**
 * @param otp
 * @param email - Specify email for verification. If not set, the current email will be used.
 */
export async function requestOtpEnterVerification(otp: string, email?: string): Promise<Response | undefined> {
  let body = otp;

  if (email) {
    body += "," + email;
  }

  return await handleRequest(getResourceAPI("/s/otp/verify"), {
    method: "POST",
    credentials: "include",
    body
  });
}

/**
 * @param email - Specify email for verification. If not set, the current email will be used.
 */
export async function requestOtpResending(email?: string): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/otp/resend"), {
    method: "POST",
    credentials: "include",
    body: email
  });
}

/**
 * @param email
 */
export async function requestOtpUpdateCreation(email: string): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/otp/update"), {
    method: "POST",
    credentials: "include",
    body: email
  });
}

/**
 * @param otp
 * @param email - Specify email for verification. If not set, the current email will be used.
 */
export async function requestOtpUpdateVerification(otp: string, email?: string): Promise<Response | undefined> {
  let body = otp;

  if (email) {
    body += "," + email;
  }

  return await handleRequest(getResourceAPI("/s/otp/verify/update"), {
    method: "POST",
    credentials: "include",
    body
  });
}

export async function requestPolarSession(): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/user/polar"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param nameId
 */
export async function requestProfileCreation(nameId: string): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile"), {
    method: "POST",
    credentials: "include",
    body: nameId
  });
}

/**
 * @param profilePublicId
 */
export async function requestProfileData(profilePublicId: string): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param profilePublicId
 * @param tag
 */
export async function requestProfileDataDelete(profilePublicId: string, tag: string): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/delete/data/" + tag), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param profilePublicId
 * @param tag
 * @param embed
 */
export async function requestProfileDataEmbedUpdate(
  profilePublicId: string,
  tag: string,
  embed: boolean
): Promise<Response | undefined> {
  let href = getResourceAPI("/s/profile/" + profilePublicId + "/set/data/" + tag + "/embed");

  if (embed) {
    href += "?set=1";
  }

  return await handleRequest(href, {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param profilePublicId
 * @param data
 */
export async function requestProfileDataInsert(
  profilePublicId: string,
  data: ProfileDataInsertPayload
): Promise<Response | undefined> {
  let body: RequestInit["body"];
  let headers: RequestInit["headers"];

  if (data.embed == null && data.position == null) {
    body = data.content;
  } else {
    body = new URLSearchParams();
    body.append("content", data.content);

    if (data.embed != null) {
      body.append("embed", data.embed ? "1" : "0");

      if (data.display) {
        body.append("display", data.display);
      }
    }

    if (data.position != null) {
      body.append("position", data.position.toString());
    }

    headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
  }

  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/set/data"), {
    method: "POST",
    credentials: "include",
    body,
    headers
  });
}

/**
 * @param profilePublicId
 * @param tag
 * @param position
 */
export async function requestProfileDataPositionUpdate(
  profilePublicId: string,
  tag: string,
  position: number
): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/set/data/" + tag + "/position"), {
    method: "POST",
    credentials: "include",
    body: position.toString()
  });
}

/**
 * @param profilePublicId
 * @param tag
 * @param content
 * @param embed
 * @param display
 */
export async function requestProfileDataUpdate(
  profilePublicId: string,
  tag: string,
  content: string,
  embed?: boolean | number | null,
  display?: string
): Promise<Response | undefined> {
  let body: RequestInit["body"];
  let headers: RequestInit["headers"];

  if (embed == null) {
    body = content;
  } else {
    body = new URLSearchParams();
    body.append("content", content);
    body.append("embed", embed ? "1" : "0");

    if (display) {
      body.append("display", display);
    }

    headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
  }

  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/set/data/" + tag), {
    method: "POST",
    credentials: "include",
    body,
    headers
  });
}

/**
 * @param profilePublicId
 * @param newDisplayName
 */
export async function requestProfileDisplayNameUpdate(
  profilePublicId: string,
  newDisplayName: string
): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/display"), {
    method: "POST",
    credentials: "include",
    body: newDisplayName
  });
}

/**
 * @param profilePublicId
 */
export async function requestProfileMembershipDelete(profilePublicId: string): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/delete"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param profilePublicId
 * @param newMetaDescription
 */
export async function requestProfileMetaDescriptionUpdate(
  profilePublicId: string,
  newMetaDescription: string
): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/meta/description"), {
    method: "POST",
    credentials: "include",
    body: newMetaDescription
  });
}

/**
 * @param profilePublicId
 * @param newNameId
 */
export async function requestProfileNameIdUpdate(
  profilePublicId: string,
  newNameId: string
): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/name"), {
    method: "POST",
    credentials: "include",
    body: newNameId
  });
}

/**
 * @param profilePublicId
 * @param forever
 */
export async function requestProfilePremiumPlanUpgrade(
  profilePublicId: string,
  forever = false
): Promise<Response | undefined> {
  let href = getResourceAPI("/s/profile/" + profilePublicId + "/plan/premium");

  if (forever) {
    href += "?forever=1";
  }

  return await handleRequest(href, {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param profilePublicId
 */
export async function requestProfilePhotoDeletion(profilePublicId: string): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/delete/photo"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * It will send the photo as a FormData with the key "photo"; CORS safelist only supports:
 *
 * - application/x-www-form-urlencoded
 * - multipart/form-data
 * - text/plain
 *
 * @param profilePublicId
 * @param photo
 */
export async function requestProfilePhotoUpload(
  profilePublicId: string,
  photo: Blob
): Promise<Response | undefined> {
  const formData = new FormData();
  formData.append("photo", photo);

  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/set/photo"), {
    method: "POST",
    credentials: "include",
    body: formData
  });
}

/**
 * @param profilePublicId
 * @param profileThemePublicId
 */
export async function requestProfileThemeChange(
  profilePublicId: string,
  profileThemePublicId: string
): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/theme/" + profileThemePublicId), {
    credentials: "include",
    method: "POST"
  });
}

export async function requestProfileThemes(): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/themes"), {
    method: "POST"
  });
}

/**
 * @param profilePublicId
 * @param newTitle
 */
export async function requestProfileTitleUpdate(
  profilePublicId: string,
  newTitle: string
): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/title"), {
    method: "POST",
    credentials: "include",
    body: newTitle
  });
}

/**
 * @param profilePublicId
 * @param visibility
 */
export async function requestProfileVisibilityUpdate(
  profilePublicId: string,
  visibility: boolean
): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/visibility?set=") + (visibility ? "1" : "0"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param profilePublicId
 * @param watermark
 */
export async function requestProfileWatermarkToggle(
  profilePublicId: string,
  watermark: boolean
): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/watermark?set=") + (watermark ? "1" : "0"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param controller
 */
export async function requestUser(controller?: AbortController): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/user"), {
    method: "POST",
    credentials: "include",
    signal: controller?.signal
  });
}

export async function requestUserAllSessionsLogout(): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/user/logout/all"), {
    method: "POST",
    credentials: "include"
  });
}

export async function requestUserDeletion(): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/user/delete"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @param newDisplayName
 */
export async function requestUserDisplayNameUpdate(newDisplayName: string): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/user/display"), {
    method: "POST",
    credentials: "include",
    body: newDisplayName
  });
}

export async function requestUserLogout(): Promise<Response | undefined> {
  return await handleRequest(getResourceAPI("/s/user/logout"), {
    method: "POST",
    credentials: "include"
  });
}
