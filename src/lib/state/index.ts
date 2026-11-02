import type React from "react";
import { proxy } from "valtio";
import type { OtpState } from "#src/lib/state/otp";

export type DialogConfirmFunction = (confirmResult: boolean) => void;

export interface ProfileDataEntryObject {
  content: string;
  tag: string;
  embed?: boolean | number | null;
}

export interface ProfilePremium {
  canceled_at?: number;
  current_period_end?: number;
  order_status?: string;
  subscription_status?: string;
}

export interface Profile {
  public_id: string;
  name_id: string;
  premium?: ProfilePremium;
  created_at?: number;
  data?: ProfileDataEntryObject[];
  display_name?: string;
  meta_description?: string;
  name_id_updated_at?: number;
  photo?: boolean;
  theme?: string;
  theme_preview?: string;
  title?: string;
  watermark?: boolean;
}

export interface GlobalState {
  currentProfile?: Profile;
  /** No pending profile data. TODO: [DELETE IT] */
  readonly currentProfileDataStored?: ProfileDataEntryObject[];

  /* User */
  dialogContent?: React.ReactNode;
  dialogConfirmFunction?: DialogConfirmFunction;
  dialogOpen?: boolean;
  displayName?: string;
  email?: string;
  email2?: string;
  /** Last fetch timestamp in seconds. */
  fetched?: number;
  oauth?: Record<string, number | undefined>;
  polarShCreatedAt?: number;
  polarShSessionUrl?: string;
  /** Expires in seconds. */
  polarShSessionUrlExpires?: number;
  profiles?: Profile[];

  /* Login */
  otp?: OtpState[] | null;
  otpSwitchPending?: boolean;
}

/**
 * Valtio getters are optimized by default.
 */
const globalState = proxy<GlobalState>({
  //  TODO: [DELETE IT]
  get currentProfileDataStored() {
    return this.currentProfile?.data?.filter(({ content }: ProfileDataEntryObject) => content);
  }
});

export default globalState;
