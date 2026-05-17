import { alertErrorServer } from "#src/lib/alert";
import { API } from "#src/lib/env";

/**
 * @function handleRequest
 * @param {Parameters<fetch>} props
 * @returns {Promise<Response|undefined>}
 */
async function handleRequest(...props) {
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

  alertErrorServer();
}

/**
 * @function getResourceAPI
 * @param {string} input
 * @returns {string}
 */
function getResourceAPI(input) {
  return API + input;
}

/**
 * @async
 * @function requestOauthDelete
 * @param {string} provider
 * @returns {Promise<Response|undefined>}
 */
export async function requestOauthDelete(provider) {
  return await handleRequest(getResourceAPI("/s/oauth/" + provider + "/delete"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @async
 * @function requestOauthLink
 * @param {string} provider
 * @param {boolean} [update]
 * @returns {Promise<Response|undefined>}
 */
export async function requestOauthLink(provider, update = false) {
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
 * @async
 * @function requestOtpEnterCreation
 * @param {string} email
 * @returns {Promise<Response|undefined>}
 */
export async function requestOtpEnterCreation(email) {
  return await handleRequest(getResourceAPI("/s/otp"), {
    method: "POST",
    credentials: "include",
    body: email
  });
}

/**
 * @async
 * @function requestOtpEnterVerification
 * @param {string} otp
 * @param {string} [email] Specify email for verification. If not set, the current email will be used.
 * @returns {Promise<Response|undefined>}
 */
export async function requestOtpEnterVerification(otp, email) {
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
 * @async
 * @function requestOtpResending
 * @param {string} [email] Specify email for verification. If not set, the current email will be used.
 * @returns {Promise<Response|undefined>}
 */
export async function requestOtpResending(email) {
  return await handleRequest(getResourceAPI("/s/otp/resend"), {
    method: "POST",
    credentials: "include",
    body: email
  });
}

/**
 * @async
 * @function requestOtpUpdateCreation
 * @param {string} email
 * @returns {Promise<Response|undefined>}
 */
export async function requestOtpUpdateCreation(email) {
  return await handleRequest(getResourceAPI("/s/otp/update"), {
    method: "POST",
    credentials: "include",
    body: email
  });
}

/**
 * @async
 * @function requestOtpUpdateVerification
 * @param {string} otp
 * @param {string} [email] Specify email for verification. If not set, the current email will be used.
 * @returns {Promise<Response|undefined>}
 */
export async function requestOtpUpdateVerification(otp, email) {
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

/**
 * @async
 * @function requestPolarSession
 * @returns {Promise<Response|undefined>}
 */
export async function requestPolarSession() {
  return await handleRequest(getResourceAPI("/s/user/polar"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @async
 * @function requestProfileBackgroundDeletion
 * @param {string} profilePublicId
 * @returns {Promise<Response|undefined>}
 */
/*export async function requestProfileBackgroundDeletion(profilePublicId) {
  return await handleRequest(getResourceAPI("/s/profile/delete/" + profilePublicId + "/background"), POST);
}*/

/**
 * @async
 * @function requestProfileBackgroundUpload
 * @param {string} profilePublicId
 * @param {Blob} photo
 * @returns {Promise<Response|undefined>}
 */
/*export async function requestProfileBackgroundUpload(profilePublicId, photo) {
  const formData = new FormData()
  formData.append("background", photo)

  return await handleRequest(getResourceAPI("/s/profile/update/" + profilePublicId + "/background"), {
    method: "POST",
    credentials: "include",
    body: formData
  });
}*/

/**
 * @async
 * @function requestProfileCreation
 * @param {string} nameId
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileCreation(nameId) {
  return await handleRequest(getResourceAPI("/s/profile"), {
    method: "POST",
    credentials: "include",
    body: nameId
  });
}

/**
 * @async
 * @function requestProfileData
 * @param {string} profilePublicId
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileData(profilePublicId) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @async
 * @function requestProfileDataDelete
 * @param {string} profilePublicId
 * @param {string} tag
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileDataDelete(profilePublicId, tag) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/delete/data/" + tag), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @async
 * @function requestProfileDataEmbedUpdate
 * @param {string} profilePublicId
 * @param {string} tag
 * @param {boolean} embed
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileDataEmbedUpdate(profilePublicId, tag, embed) {
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
 * @async
 * @function requestProfileDataInsert
 * @param {string} profilePublicId
 * @param {Object} data
 * @param {string} data.content
 * @param {string} [data.display]
 * @param {(boolean|number|null)} [data.embed]
 * @param {number} [data.position]
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileDataInsert(profilePublicId, data) {
  /**
   * @type {RequestInit["body"]}
   */
  let body;

  /**
   * @type {RequestInit["headers"]}
   */
  let headers;

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
    }
  }

  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/set/data"), {
    method: "POST",
    credentials: "include",
    body,
    headers
  });
}

/**
 * @async
 * @function requestProfileDataPositionUpdate
 * @param {string} profilePublicId
 * @param {string} tag
 * @param {number} position
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileDataPositionUpdate(profilePublicId, tag, position) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/set/data/" + tag + "/position"), {
    method: "POST",
    credentials: "include",
    body: position.toString()
  });
}

/**
 * @async
 * @function requestProfileDataUpdate
 * @param {string} profilePublicId
 * @param {string} tag
 * @param {string} content
 * @param {(boolean|number|null)} [embed]
 * @param {string} [display]
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileDataUpdate(profilePublicId, tag, content, embed, display) {
  /**
   * @type {RequestInit["body"]}
   */
  let body;

  /**
   * @type {RequestInit["headers"]}
   */
  let headers;

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
 * @async
 * @function requestProfileDisplayNameUpdate
 * @param {string} profilePublicId
 * @param {string} newDisplayName
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileDisplayNameUpdate(profilePublicId, newDisplayName) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/display"), {
    method: "POST",
    credentials: "include",
    body: newDisplayName
  });
}

/**
 * @async
 * @function requestProfileMembershipDelete
 * @param {string} profilePublicId
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileMembershipDelete(profilePublicId) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/delete"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @async
 * @function requestProfileMetaDescriptionUpdate
 * @param {string} profilePublicId
 * @param {string} [newMetaDescription]
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileMetaDescriptionUpdate(profilePublicId, newMetaDescription) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/meta/description"), {
    method: "POST",
    credentials: "include",
    body: newMetaDescription
  });
}

/**
 * @async
 * @function requestProfileNameIdUpdate
 * @param {string} profilePublicId
 * @param {string} newNameId
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileNameIdUpdate(profilePublicId, newNameId) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/name"), {
    method: "POST",
    credentials: "include",
    body: newNameId
  });
}

/**
 * @async
 * @function requestProfilePremiumPlanUpgrade
 * @param {string} profilePublicId
 * @param {boolean} [forever]
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfilePremiumPlanUpgrade(profilePublicId, forever = false) {
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
 * @async
 * @function requestProfilePhotoDeletion
 * @param {string} profilePublicId
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfilePhotoDeletion(profilePublicId) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/delete/photo"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * It wil send the photo as a FormData with the key "photo"; CORS safelist only supports:
 *
 * - application/x-www-form-urlencoded
 * - multipart/form-data
 * - text/plain
 *
 *
 * @async
 * @function requestProfilePhotoUpload
 * @param {string} profilePublicId
 * @param {Blob} photo
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfilePhotoUpload(profilePublicId, photo) {
  const formData = new FormData();
  formData.append("photo", photo);

  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/set/photo"), {
    method: "POST",
    credentials: "include",
    body: formData
  });
}

/**
 * @async
 * @function requestProfileTitleUpdate
 * @param {string} profilePublicId
 * @param {string} [newTitle]
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileTitleUpdate(profilePublicId, newTitle) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/title"), {
    method: "POST",
    credentials: "include",
    body: newTitle
  });
}

/**
 * @async
 * @function requestProfileVisibilityUpdate
 * @param {string} profilePublicId
 * @param {boolean} visibility
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileVisibilityUpdate(profilePublicId, visibility) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/visibility?set=") + (visibility ? "1" : "0"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @async
 * @function requestProfileWatermarkToggle
 * @param {string} profilePublicId
 * @param {boolean} watermark
 * @returns {Promise<Response|undefined>}
 */
export async function requestProfileWatermarkToggle(profilePublicId, watermark) {
  return await handleRequest(getResourceAPI("/s/profile/" + profilePublicId + "/watermark?set=") + (watermark ? "1" : "0"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @async
 * @function requestUser
 * @param {AbortController} [controller]
 * @returns {Promise<Response|undefined>}
 */
export async function requestUser(controller) {
  return await handleRequest(getResourceAPI("/s/user"), {
    method: "POST",
    credentials: "include",
    signal: controller?.signal
  });
}

/**
 * @async
 * @function requestUserAllSessionsLogout
 * @returns {Promise<Response|undefined>}
 */
export async function requestUserAllSessionsLogout() {
  return await handleRequest(getResourceAPI("/s/user/logout/all"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @async
 * @function requestUserDeletion
 * @returns {Promise<Response|undefined>}
 */
export async function requestUserDeletion() {
  return await handleRequest(getResourceAPI("/s/user/delete"), {
    method: "POST",
    credentials: "include"
  });
}

/**
 * @async
 * @function requestUserDisplayNameUpdate
 * @param {string} newDisplayName
 * @returns {Promise<Response|undefined>}
 */
export async function requestUserDisplayNameUpdate(newDisplayName) {
  return await handleRequest(getResourceAPI("/s/user/display"), {
    method: "POST",
    credentials: "include",
    body: newDisplayName
  });
}

/**
 * @async
 * @function requestUserLogout
 * @returns {Promise<Response|undefined>}
 */
export async function requestUserLogout() {
  return await handleRequest(getResourceAPI("/s/user/logout"), {
    method: "POST",
    credentials: "include"
  });
}
