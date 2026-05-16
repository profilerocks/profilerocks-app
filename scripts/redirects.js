import fs from "node:fs";
import path from "node:path";
import { HREF_BLOG, HREF_FAQ, HREF_HELP, HREF_PRICING, HREF_PRIVACY, HREF_TERMS } from "../src/lib/env.js";
import redirects from "../shared/redirects.json" with { type: "json" };

const REDIRECT_PATHS = Object.freeze({
  app: "/",
  blog: HREF_BLOG,
  faq: HREF_FAQ,
  help: HREF_HELP,
  pricing: HREF_PRICING,
  privacy: HREF_PRIVACY,
  settings: "/u/settings",
  terms: HREF_TERMS
});

let result = "";

for (const profileName in redirects) {
  const href = REDIRECT_PATHS[redirects[profileName]];
  if (href) {
    result += profileName + " " + href + " 301\n";
  }
}

const filePath = path.resolve(import.meta.dirname, "../dist/_redirects");

fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, result);
