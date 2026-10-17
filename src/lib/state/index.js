import { proxy } from "valtio";

/**
 * @import { OtpState } from "#src/lib/state/otp"
 */

/**
 * @callback DialogConfirmFunction
 * @param {boolean} confirmResult
 */

/**
 * @typedef {Object} ProfileDataEntryObject
 * @prop {string} content
 * @prop {string} tag
 * @prop {(boolean|number|null)} [embed]
 */

/**
 * @typedef {Object} ProfilePremium
 * @prop {number} [canceled_at]
 * @prop {number} [current_period_end]
 * @prop {string} [order_status]
 * @prop {string} [subscription_status]
 */

/**
 * @typedef {Object} Profile
 * @prop {string} public_id
 * @prop {string} name_id
 * @prop {ProfilePremium} [premium]
 * @prop {number} [created_at]
 * @prop {ProfileDataEntryObject[]} [data]
 * @prop {string} [display_name]
 * @prop {string} [meta_description]
 * @prop {number} [name_id_updated_at]
 * @prop {boolean} [photo]
 * @prop {string} [theme]
 * @prop {string} [theme_preview]
 * @prop {string} [title]
 * @prop {boolean} [watermark]
 */

/**
 * @typedef {Object} GlobalState
 * @prop {Profile} [currentProfile]
 * @prop {ProfileDataEntryObject[]} [currentProfileDataStored] No pending profile data. TODO: [DELETE IT]
 *
 * User
 * @prop {React.ReactNode} [dialogContent]
 * @prop {DialogConfirmFunction} [dialogConfirmFunction]
 * @prop {boolean} [dialogOpen]
 * @prop {string} [displayName]
 * @prop {string} [email]
 * @prop {string} [email2]
 * @prop {number} [fetched] - Last fetch timestamp in seconds.
 * @prop {Record<string,number|undefined>} [oauth]
 * @prop {number} [polarShCreatedAt]
 * @prop {string} [polarShSessionUrl]
 * @prop {number} [polarShSessionUrlExpires] - Expires in seconds.
 * @prop {Profile[]} [profiles]
 *
 * Login
 * @prop {(OtpState[]|null)} [otp]
 * @prop {boolean} [otpSwitchPending]
 */

/**
 * Valtio getters are optimized by default.
 */
const globalState = proxy(
  /** @type {GlobalState} */ ({
    //  TODO: [DELETE IT]
    get currentProfileDataStored() {
      return this.currentProfile?.data?.filter(({ content }) => content);
    }
  })
);

export default globalState;
