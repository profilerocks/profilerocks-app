/**
 * Deconstructing the `env` object doesn't return NEXT_PUBLIC_ variables.
 * So we need to access them using `env.NEXT_PUBLIC_`.
 */

const { env } = process;

export const API = env.NEXT_PUBLIC_API || "http://localhost:4000";

export const HREF_ABOUT = env.NEXT_PUBLIC_HREF_ABOUT || "https://www.profile.rocks/i/about";
export const HREF_ASSETS = env.NEXT_PUBLIC_HREF_ASSETS || "https://assets.profile.rocks";
export const HREF_BLOG = env.NEXT_PUBLIC_HREF_BLOG || "https://www.profile.rocks/b";
export const HREF_CONTACT = env.NEXT_PUBLIC_HREF_CONTACT || "https://www.profile.rocks/i/contact";
export const HREF_FAQ = env.NEXT_PUBLIC_HREF_FAQ || "https://www.profile.rocks/i/faq";
export const HREF_HELP = env.NEXT_PUBLIC_HREF_HELP || "https://www.profile.rocks/i/help";
export const HREF_WEB = env.NEXT_PUBLIC_HREF_WEB || "https://www.profile.rocks";
export const HREF_LEGAL = env.NEXT_PUBLIC_HREF_LEGAL || "https://www.profile.rocks/i/legal-notice";
export const HREF_PRICING = env.NEXT_PUBLIC_HREF_PRICING || "https://www.profile.rocks/i/pricing";
export const HREF_PRIVACY = env.NEXT_PUBLIC_HREF_PRIVACY || "https://www.profile.rocks/i/privacy";
export const HREF_PROFILE = env.NEXT_PUBLIC_HREF_PROFILE || "https://profile.rocks";
export const HREF_TERMS = env.NEXT_PUBLIC_HREF_TERMS || "https://www.profile.rocks/i/terms";

export const PLATFORM_NAME = env.NEXT_PUBLIC_PLATFORM_NAME || "profile.rocks";
export const PLATFORM_DESCRIPTION = env.NEXT_PUBLIC_PLATFORM_DESCRIPTION || "The Map of Your Online Presence";
export const SITE = env.NEXT_PUBLIC_SITE || "https://app.profile.rocks";
