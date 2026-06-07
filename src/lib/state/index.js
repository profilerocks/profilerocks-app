import { proxy } from "valtio";

/**
 * @import { OtpState } from "#src/lib/state/otp"
 */

/**
 * @typedef {Object} ProfileDataEntryObject
 * @property {string} content
 * @property {string} tag
 * @property {(boolean|number|null)} [embed]
 */

/**
 * @typedef {Object} ProfilePremium
 * @property {number} [canceled_at]
 * @property {number} [current_period_end]
 * @property {string} [order_status]
 * @property {string} [subscription_status]
 */

/**
 * @typedef {Object} Profile
 * @property {string} public_id
 * @property {string} name_id
 * @property {ProfilePremium} [premium]
 * @property {number} [created_at]
 * @property {ProfileDataEntryObject[]} [data]
 * @property {string} [display_name]
 * @property {string} [meta_description]
 * @property {number} [name_id_updated_at]
 * @property {boolean} [photo]
 * @property {string} [theme]
 * @property {string} [theme_preview]
 * @property {string} [title]
 * @property {boolean} [watermark]
 */

/**
 * @typedef {Object} GlobalState
 * @property {Profile} [currentProfile]
 * @property {ProfileDataEntryObject[]} [currentProfileDataStored] No pending profile data. TODO: [DELETE IT]
 *
 * User
 * @property {string} [displayName]
 * @property {string} [email]
 * @property {string} [email2]
 * @property {number} [fetched] - Last fetch timestamp in seconds.
 * @property {Record<string,number|undefined>} [oauth]
 * @property {number} [polarShCreatedAt]
 * @property {string} [polarShSessionUrl]
 * @property {number} [polarShSessionUrlExpires] - Expires in seconds.
 * @property {Profile[]} [profiles]
 *
 * Login
 * @property {(OtpState[]|null)} [otp]
 * @property {boolean} [otpSwitchPending]
 * @property {string} [redirect]
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
