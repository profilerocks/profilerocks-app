import fs from "fs";
import path from "path";
import crypto from "crypto";

const OUT_DIR = path.join(import.meta.dirname, "../dist");

console.log(OUT_DIR);

// Helper to recursively get all HTML files
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("Dist directory not found. Run 'next build' first.");
  process.exit(1);
}

getHtmlFiles(OUT_DIR).forEach(filePath => {
  let html = fs.readFileSync(filePath, "utf8");

  // Match <script> tags
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  const hashes = [];
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    const attributes = match[1];
    const content = match[2].trim();

    // Skip scripts with external sources or non-JS data scripts (like __NEXT_DATA__)
    if (attributes.includes("src=") || attributes.includes('type="application/json"')) {
      continue;
    }

    if (content) {
      // Calculate SHA-256 hash
      const hash = crypto.createHash("sha256").update(content).digest("base64");
      hashes.push(`'sha256-${hash}'`);
    }
  }

  if (hashes.length > 0) {
    const cspMetaTag = `<meta http-equiv="content-security-policy" content="base-uri 'self';connect-src 'self' blob: https://challenges.cloudflare.com https://profile.rocks;default-src 'self';frame-src 'self' https:;font-src 'self' https://cdn.jsdelivr.net;form-action 'self' https://profile.rocks;img-src 'self' blob: data: https://assets.profile.rocks https://www.profile.rocks;object-src 'none';script-src 'self' ${hashes.join(" ")} https://challenges.cloudflare.com https://assets.profile.rocks;script-src-attr 'none';style-src 'self' 'unsafe-inline' https://assets.profile.rocks;upgrade-insecure-requests">`;

    html = html.replace(/<meta charset=.*?>/i, `<meta charset="utf-8">${cspMetaTag}`);

    fs.writeFileSync(filePath, html, "utf8");

    console.log(`✅ Injected CSP with ${hashes.length} hashes into: ${path.relative(OUT_DIR, filePath)}`);
  }
});
