import assert from "node:assert/strict";
import { createDecipheriv, pbkdf2Sync } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const htmlUrl = new URL("../out/index.html", import.meta.url);
const voicesHtmlUrl = new URL("../out/voices/index.html", import.meta.url);
const allAnswersHtmlUrl = new URL("../out/all-answers/index.html", import.meta.url);
const methodsHtmlUrl = new URL("../out/methods/index.html", import.meta.url);
const respondentsHtmlUrl = new URL("../out/respondents/index.html", import.meta.url);
const voicesDataUrl = new URL("../app/voices/voice-data.json", import.meta.url);
const voiceExplorerUrl = new URL("../app/voices/voice-explorer.tsx", import.meta.url);
const encryptedDataUrl = new URL("../public/data/respondents.enc.json", import.meta.url);
const accessConfigUrl = new URL("../public/access-config.json", import.meta.url);
const stylesUrl = new URL("../app/globals.css", import.meta.url);

test("renders the complete public report", async () => {
  const html = await readFile(htmlUrl, "utf8");
  assert.match(html, /<title>ELIA Future Readiness Survey Results<\/title>/i);
  assert.match(html, /38 substantive responses/);
  assert.match(html, /<strong>18<\/strong><span>countries represented<\/span>/);
  assert.match(html, /3 test submissions excluded/);
  assert.doesNotMatch(html, /The numbers do not speak for themselves|Data Feminism sources|Discussion agenda|Turn relational intelligence into shared capacity/);
  assert.match(html, /AI will influence creative practices/);
  assert.match(html, /read the news locally and internationally/);
  assert.match(html, /informal group with two fellow research students/);
  assert.match(html, /finding-card finding-card--mint/);
  assert.match(html, /finding-card finding-card--pink/);
  assert.match(html, /finding-card finding-card--blue/);
  assert.match(html, /cultural, technical and civic choices need to be considered together/);
  assert.match(html, /Foresight here is social infrastructure as much as an analytical technique/);
  assert.match(html, /The gap is not an absence of attention or care/);
  assert.match(html, /finding-summary/);
  assert.match(html, /Quote from an anonymous survey respondent/);
  assert.match(html, /Countries represented in the substantive survey responses/);
  assert.match(html, /18 countries represented/);
  assert.match(html, /aria-label="Belgium represented"/);
  assert.match(html, /Age distribution: under 35, 10 respondents or 26 percent/);
  assert.doesNotMatch(html, />Sex and gender<|No pie chart can be calculated|>Not collected<\/strong>/);
  assert.match(html, /aria-label="Main pages"/);
  assert.match(html, /aria-label="Overview sections"/);
  assert.match(html, /All answers/);
  assert.match(html, /Methods/);
  assert.doesNotMatch(html, /readiness[ -]?score/i);
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
  assert.match(html, /<strong>111<\/strong><span>written answers shown<\/span>/);
  assert.match(html, /<strong>3<\/strong><span>answers withheld<\/span>/);
  assert.match(html, /Quote from an anonymous survey respondent/);
  assert.match(html, /Hover over or focus a quote/);
  assert.match(html, /All answers page/);
  assert.match(html, /Filter answers by theme/);
  assert.match(html, /aria-label="Main pages"/);
  assert.doesNotMatch(html, /aria-label="Overview sections"/);
  assert.doesNotMatch(html, /Newcastle|Lviv|Concordia|Unbroken University|Respondent ID|Collector ID|IP Address|Email Address/);
});

test("uses a three-page sticky main menu with All answers promoted", async () => {
  const [overviewHtml, voicesHtml, allAnswersHtml, methodsHtml, respondentsHtml, styles] = await Promise.all([
    readFile(htmlUrl, "utf8"),
    readFile(voicesHtmlUrl, "utf8"),
    readFile(allAnswersHtmlUrl, "utf8"),
    readFile(methodsHtmlUrl, "utf8"),
    readFile(respondentsHtmlUrl, "utf8"),
    readFile(stylesUrl, "utf8"),
  ]);
  for (const html of [overviewHtml, voicesHtml, allAnswersHtml, methodsHtml, respondentsHtml]) {
    const mainNav = html.match(/<nav class="primary-nav"[^>]*>(.*?)<\/nav>/)?.[1] ?? "";
    assert.equal((mainNav.match(/<a /g) ?? []).length, 3);
    assert.match(mainNav, />Overview<\/a>/);
    assert.match(mainNav, />Respondent voices<\/a>/);
    assert.match(mainNav, />All answers<\/a>/);
  }
  assert.match(allAnswersHtml, /class="nav-current" aria-current="page" href="\/elia-future-readiness-survey-results\/all-answers\/"/);
  assert.match(styles, /\.site-header\s*\{[^}]*position:\s*sticky;/s);
});

test("uses ELIA's website palette and pronounced bundled rounded headings", async () => {
  const styles = await readFile(stylesUrl, "utf8");
  assert.match(styles, /--elia-pink:\s*#db0962/);
  assert.match(styles, /--elia-mint:\s*#00fdcb/);
  assert.match(styles, /--elia-slate:\s*#2d3c41/);
  assert.match(styles, /--paper:\s*#f0f0f0/);
  assert.match(styles, /--serif:\s*"Nunito Sans Variable"/);
  assert.match(styles, /--sans:\s*"Inter Variable"/);
  assert.match(styles, /body\s*\{[^}]*background:\s*var\(--paper\)/s);
  assert.match(styles, /h1, h2, h3,[^{]*\{[^}]*font-weight:\s*900;/s);
  assert.match(styles, /\.scope-card,\s*\.finding-card[^{]*\{[^}]*border-radius:\s*22px/s);
  assert.match(styles, /\.finding-card--mint\s*\{[^}]*background:\s*rgb\(0 253 203 \/ 22%\)/s);
  assert.match(styles, /\.finding-card--pink\s*\{[^}]*background:\s*rgb\(219 9 98 \/ 10%\)/s);
  assert.match(styles, /\.finding-card--blue\s*\{[^}]*background:\s*rgb\(30 131 158 \/ 15%\)/s);
  assert.match(styles, /html\[data-text-size="large"\]\s*\{[^}]*font-size:\s*17px;/s);
  assert.match(styles, /@media \(prefers-color-scheme:\s*dark\)/);
});

test("keeps respondent profile links clickable and makes All answers information dense", async () => {
  const [voiceExplorer, styles, allAnswersHtml] = await Promise.all([
    readFile(voiceExplorerUrl, "utf8"),
    readFile(stylesUrl, "utf8"),
    readFile(allAnswersHtmlUrl, "utf8"),
  ]);
  assert.match(voiceExplorer, /<a className="voice-profile-trigger" href=\{`\.\.\/respondents\/\?respondent=\$\{respondent\.id\}`\}/);
  assert.match(styles, /\.voice-profile:hover \.respondent-popover, \.voice-profile:focus-within \.respondent-popover/);
  assert.match(styles, /\.respondent-list\s*\{[^}]*gap:\s*14px;/s);
  assert.match(styles, /\.raw-respondent\s*\{[^}]*padding:\s*24px;/s);
  assert.match(styles, /\.raw-answer-grid p\s*\{[^}]*font-size:\s*\.88rem;/s);
  assert.match(allAnswersHtml, /class="text-size-button"/);
});

test("renders separate methods, all-answers, and respondent pages", async () => {
  const [methodsHtml, allAnswersHtml, respondentsHtml] = await Promise.all([
    readFile(methodsHtmlUrl, "utf8"),
    readFile(allAnswersHtmlUrl, "utf8"),
    readFile(respondentsHtmlUrl, "utf8"),
  ]);
  assert.match(methodsHtml, /The numbers do not speak for themselves/);
  assert.match(methodsHtml, /Data Feminism sources/);
  assert.match(methodsHtml, /Privacy and protected access/);
  assert.match(methodsHtml, /primary base is <strong>n = 38<\/strong>/);
  assert.match(allAnswersHtml, /All written answers/);
  assert.match(allAnswersHtml, /38<\/strong><span>respondents/);
  assert.match(allAnswersHtml, /114<\/strong><span>written answers/);
  assert.match(allAnswersHtml, /Handle with care/);
  assert.match(respondentsHtml, /Loading the respondent/);
});

test("accounts for every substantive written answer without source identifiers", async () => {
  const dataText = await readFile(voicesDataUrl, "utf8");
  const data = JSON.parse(dataText);
  assert.equal(data.totalAnswers, 114);
  assert.equal(data.shownAnswers, 111);
  assert.equal(data.redactedAnswers, 5);
  assert.equal(data.withheldAnswers, 3);
  assert.deepEqual(data.sections.map((section) => section.entries.length), [38, 38, 38]);
  assert.deepEqual(data.sections.map((section) => section.themes[0].count), [22, 28, 31]);
  assert.doesNotMatch(dataText, /"sourceId"|Newcastle|Lviv|Concordia|Unbroken University|https?:\/\//);
});

test("encrypted respondent data links every voice to one anonymous profile", async () => {
  const password = process.env.ELIA_SURVEY_PASSWORD;
  assert.ok(password, "ELIA_SURVEY_PASSWORD is required for the protected-data test");
  const [config, payload] = await Promise.all([
    readFile(accessConfigUrl, "utf8").then(JSON.parse),
    readFile(encryptedDataUrl, "utf8").then(JSON.parse),
  ]);
  const key = pbkdf2Sync(password, Buffer.from(config.salt, "base64"), config.iterations, 32, "sha256");
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(payload.iv, "base64"));
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  const cleartext = Buffer.concat([decipher.update(Buffer.from(payload.ciphertext, "base64")), decipher.final()]).toString("utf8");
  const data = JSON.parse(cleartext);
  assert.equal(data.respondentCount, 38);
  assert.equal(data.answerCount, 114);
  assert.equal(Object.keys(data.voiceIndex).length, 114);
  assert.ok(data.respondents.every((respondent) => respondent.answers.length === 3));
  assert.ok(data.respondents.every((respondent) => respondent.country && respondent.age && respondent.roles.length));
  assert.doesNotMatch(cleartext, /Collector ID|IP Address|Email Address|Respondent ID/);
});

test("ships the social card and no starter preview", async () => {
  await access(new URL("../out/og.png", import.meta.url));
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", root)));
});
