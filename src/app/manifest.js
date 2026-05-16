import { PLATFORM_NAME, PLATFORM_DESCRIPTION } from "#src/lib/env";
import { metadata } from "#src/app/layout";

/**
 * @import { MetadataRoute } from "next"
 */

export const dynamic = "force-static";

/**
 * @function
 * @returns {MetadataRoute.Manifest}
 */
export default function manifest() {
  /**
   * @type {MetadataRoute.Manifest}
   */
  const manifest = {
    background_color: "#000",
    description: PLATFORM_DESCRIPTION,
    display: "standalone",
    // display_override,
    // file_handlers
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    // id: "/",
    launch_handler: {
      client_mode: "auto"
    },
    name: PLATFORM_NAME,
    orientation: "natural",
    // prefer_related_applications: false,
    // protocol_handlers: [],
    // related_applications,
    // scope,
    // scope_extensions
    // screenshots, https://developer.mozilla.org/en-US/docs/Web/Manifest/screenshots
    // share_target
    // short_name: PLATFORM_NAME,
    start_url: "/",
    /*shortcuts: [
      { name: "Account settings", icons: [], url: "/u/settings" }
    ]*/
    theme_color: "#000"
  };

  if (metadata?.keywords) {
    manifest.categories = Array.isArray(metadata.keywords) ? metadata.keywords : [metadata.keywords];
  }

  return manifest;
}
