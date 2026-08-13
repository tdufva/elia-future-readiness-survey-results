import assert from "node:assert/strict";
import { createDecipheriv, pbkdf2Sync } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const outDir = fileURLToPath(new URL("../out/", import.meta.url));

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(target) : [target];
  }));
  return nested.flat();
}

test("every exported page is password protected and page-data files are removed", async () => {
  const files = await filesBelow(outDir);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  assert.ok(htmlFiles.length >= 8);
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    assert.match(html, /Enter the password to continue/);
    assert.match(html, /Incorrect password/);
    assert.match(html, /--signal:#db0962/);
    assert.match(html, /--mint:#00fdcb/);
    assert.match(html, /h1\{[^}]*font-weight:900/);
    assert.doesNotMatch(html, /34 substantive responses|That we are loosing all contacts|The numbers do not speak for themselves/);
  }
  assert.equal(files.filter((file) => file.endsWith(".txt")).length, 0);
});

test("public assets contain no readable respondent-linked records", async () => {
  const files = await filesBelow(outDir);
  const searchable = files.filter((file) => /\.(?:js|json|html)$/.test(file));
  for (const file of searchable) {
    const text = await readFile(file, "utf8");
    assert.doesNotMatch(text, /That we are loosing all contacts to the real world|No habitual routine for the cohort|Teacher \/ professor.*Portugal/);
    assert.doesNotMatch(text, /Palma2026!/);
  }
});

test("the configured password decrypts the protected overview", async () => {
  const password = process.env.ELIA_SURVEY_PASSWORD;
  assert.ok(password, "ELIA_SURVEY_PASSWORD is required for decryption verification");
  const html = await readFile(path.join(outDir, "index.html"), "utf8");
  const match = html.match(/const C=(\{.*?\}),P=(\{.*?\}),F=/);
  assert.ok(match, "encrypted page payload was not found");
  const config = JSON.parse(match[1]);
  const payload = JSON.parse(match[2]);
  const key = pbkdf2Sync(password, Buffer.from(config.salt, "base64"), config.iterations, 32, "sha256");
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(payload.iv, "base64"));
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  const clear = Buffer.concat([decipher.update(Buffer.from(payload.ciphertext, "base64")), decipher.final()]).toString("utf8");
  assert.match(clear, /<title>ELIA Future Readiness Survey Results<\/title>/i);
  assert.match(clear, /Three findings organise the picture/);
});
