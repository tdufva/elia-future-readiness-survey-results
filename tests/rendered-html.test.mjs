import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const htmlUrl = new URL("../out/index.html", import.meta.url);

test("renders the complete public report", async () => {
  const html = await readFile(htmlUrl, "utf8");
  assert.match(html, /<title>ELIA Future Readiness Survey Results<\/title>/i);
  assert.match(html, /34 substantive responses/);
  assert.match(html, /<strong>17<\/strong><span>countries represented<\/span>/);
  assert.match(html, /3 test submissions excluded/);
  assert.match(html, /The numbers do not speak for themselves/);
  assert.match(html, /Data Feminism sources/);
  assert.match(html, /AI will influence creative practices/);
  assert.match(html, /read the news locally and internationally/);
  assert.match(html, /informal group with two fellow research students/);
  assert.match(html, /Three short quotations were selected/);
  assert.doesNotMatch(html, /Collector ID|IP Address|Email Address|115152734/);
});

test("ships the social card and no starter preview", async () => {
  await access(new URL("../out/og.png", import.meta.url));
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", root)));
});
