import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const htmlUrl = new URL("../out/index.html", import.meta.url);
const voicesHtmlUrl = new URL("../out/voices/index.html", import.meta.url);
const voicesDataUrl = new URL("../app/voices/voice-data.json", import.meta.url);
const stylesUrl = new URL("../app/globals.css", import.meta.url);

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
  assert.match(html, /Quote from an anonymous survey respondent/);
  assert.match(html, /Respondent voices page shows 99 answers/);
  assert.match(html, /Countries represented in the substantive survey responses/);
  assert.match(html, /17 countries represented/);
  assert.match(html, /Age distribution: under 35, 9 respondents or 26 percent/);
  assert.match(html, /The survey workbook contains no sex or gender question/);
  assert.match(html, /aria-label="Main pages"/);
  assert.match(html, /aria-label="Overview sections"/);
  assert.doesNotMatch(html, /Collector ID|IP Address|Email Address|115152734/);
});

test("renders a navigable and privacy-checked respondent voices page", async () => {
  const html = await readFile(voicesHtmlUrl, "utf8");
  assert.match(html, /<title>Respondent voices · ELIA Future Readiness Survey Results<\/title>/i);
  assert.match(html, /Choose a question, then explore its answers/);
  assert.match(html, /The survey included three open-ended questions/);
  assert.match(html, /Select a question to see its answers/);
  assert.match(html, /Select one of the three open-ended survey questions/);
  assert.match(html, /Question (?:<!-- -->)?01/);
  assert.match(html, /Question (?:<!-- -->)?02/);
  assert.match(html, /Question (?:<!-- -->)?03/);
  assert.match(html, /What are your interests or concerns regarding the future/);
  assert.match(html, /How do you sense or keep track of emerging change/);
  assert.match(html, /What regular practices help your institution navigate what comes next/);
  assert.match(html, /Showing the answers respondents gave to this question/);
  assert.match(html, /<strong>99<\/strong><span>written answers shown<\/span>/);
  assert.match(html, /<strong>3<\/strong><span>answers withheld<\/span>/);
  assert.match(html, /Quote from an anonymous survey respondent/);
  assert.match(html, /Filter answers by theme/);
  assert.match(html, /aria-label="Main pages"/);
  assert.doesNotMatch(html, /aria-label="Overview sections"/);
  assert.doesNotMatch(html, /Newcastle|Lviv|Concordia|Unbroken University|Respondent ID|Collector ID|IP Address|Email Address/);
});

test("uses a two-tab sticky main menu", async () => {
  const [overviewHtml, voicesHtml, styles] = await Promise.all([
    readFile(htmlUrl, "utf8"),
    readFile(voicesHtmlUrl, "utf8"),
    readFile(stylesUrl, "utf8"),
  ]);
  for (const html of [overviewHtml, voicesHtml]) {
    const mainNav = html.match(/<nav class="primary-nav"[^>]*>(.*?)<\/nav>/)?.[1] ?? "";
    assert.equal((mainNav.match(/<a /g) ?? []).length, 2);
    assert.match(mainNav, />Overview<\/a>/);
    assert.match(mainNav, />Respondent voices<\/a>/);
  }
  assert.match(styles, /\.site-header\s*\{[^}]*position:\s*sticky;/s);
});

test("accounts for every substantive written answer without source identifiers", async () => {
  const dataText = await readFile(voicesDataUrl, "utf8");
  const data = JSON.parse(dataText);
  assert.equal(data.totalAnswers, 102);
  assert.equal(data.shownAnswers, 99);
  assert.equal(data.redactedAnswers, 5);
  assert.equal(data.withheldAnswers, 3);
  assert.deepEqual(data.sections.map((section) => section.entries.length), [34, 34, 34]);
  assert.doesNotMatch(dataText, /"sourceId"|Newcastle|Lviv|Concordia|Unbroken University|https?:\/\//);
});

test("ships the social card and no starter preview", async () => {
  await access(new URL("../out/og.png", import.meta.url));
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", root)));
});
