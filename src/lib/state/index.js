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
 * @property {string} [title]
 * @property {boolean} [watermark]
 */

/**
 * @typedef {Object} GlobalState
 * @property {Profile} [currentProfile]
 * @property {ProfileDataEntryObject[]} [currentProfileDataStored] No pending profile data.
 *
 * User
 * @property {string} [displayName]
 * @property {string} [email]
 * @property {string} [email2]
 * @property {number} [fetched] - Last fetch timestamp in seconds.
 * @property {Record<string,number>} [oauth]
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
    get currentProfileDataStored() {
      return this.currentProfile?.data?.filter(({ content }) => content);
    }
  })
);

export default globalState;
// const bcSyn = new BroadcastChannel("syn")

// const bcSynTimeout = setTimeout(() => {
//   /**
//    * If no other tabs are listening, close the channel.
//    */
//   bcSyn.close()
// }, 100)

// bcSyn.addEventListener("message", function(event) {
//   console.log(event.data)
//   Object.assign(globalState, event.data)
//   clearTimeout(bcSynTimeout)
//   this.close()
// })

// const bcAck = new BroadcastChannel("ack")

// bcAck.addEventListener("message", () => {
//   if (Object.keys(globalState).length) {
//     const bcSynTemp = new BroadcastChannel("syn")
//     bcSynTemp.postMessage(snapshot(globalState))
//     bcSynTemp.close()
//   }
// })

// bcAck.postMessage(true)

// const bcState = new BroadcastChannel("state")

// /**
//  * Formats:
//  * - Object: assign
//  * - Array:
//  *   - Strings: delete keys.
//  *   - Array:
//  *     - Array (change nested value): [[key1, key2, ...], value]
//  *     - Array (delete a nested key): [key1, key2, ...]
//  */
// bcState.addEventListener("message", function(event) {
//   console.log(event.data)
//   if (Array.isArray(event.data)) {
//     for (const prop of event.data) {
//       // @ts-expect-error
//       delete globalState[prop]
//     }
//   } else if (typeof event.data === "object") {
//     switch (typeof event.data) {
//       case "object":
//         Object.assign(globalState, event.data)
//         break
//       case "string":
//         // @ts-expect-error
//         delete globalState[event.data]
//         break
//       default:
//         alertErrorApp()
//     }
//   }
// })

// export default globalState

// export {
//   bcState
// }
