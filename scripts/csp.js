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
      hashes.push(`'sha256-${crypto.createHash("sha256").update(content).digest("base64")}'`);
    }
  }

  if (hashes.length > 0) {
    const cspMetaTag = `<meta http-equiv="content-security-policy" content="script-src 'self' 'wasm-unsafe-eval' https://challenges.cloudflare.com https://assets.profile.rocks ${hashes.join(" ")}">`;

    html = html.replace(/<meta charset=.*?>/i, `<meta charset="utf-8">${cspMetaTag}`);

    fs.writeFileSync(filePath, html, "utf8");

    console.log(`✅ Injected CSP with ${hashes.length} hashes into: ${path.relative(OUT_DIR, filePath)}`);
  }
});
