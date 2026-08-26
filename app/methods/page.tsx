import type { Metadata } from "next";
import SiteHeader from "../site-header";
import { sitePath } from "../site-path";

const siteUrl = "https://tdufva.github.io/elia-future-readiness-survey-results/methods/";

export const metadata: Metadata = {
  title: "Methods, ethics and limits · ELIA Future Readiness Survey Results",
  description: "How the ELIA Future Readiness Survey responses were prepared, counted, coded and presented.",
  alternates: { canonical: siteUrl },
};

export default function MethodsPage() {
  return <>
    <a className="skip-link" href="#methods-content">Skip to methods</a>
    <SiteHeader current="overview" />
    <main id="methods-content">
      <section className="subpage-hero">
        <p className="eyebrow">Methods, ethics and limits</p>
        <h1>The numbers do not speak for themselves.</h1>
        <p className="standfirst">This report follows data-feminist commitments to context, pluralism, visible labour and attention to power.</p>
      </section>

      <section className="method-section method-section--page">
        <div className="method-grid"><article><h3>Data preparation</h3><p>The 25 August export held 41 response rows plus one SurveyMonkey subheader row. Three rows answered all three open questions with the literal word “test”; they were excluded. The primary base is <strong>n = 38</strong>. All 38 supplied the fields and open answers analysed here. Compared with the 12 August analysis, four substantive responses were added and none of the earlier responses changed.</p></article><article><h3>Counting</h3><p>Role and field allowed multiple selections. Percentages are rounded and paired with counts. Because categories overlap, totals can exceed 100%. No weighting or statistical inference was applied.</p></article><article><h3>Qualitative analysis</h3><p>One analyst used reflexive thematic coding across the three open questions, assigning any number of relevant themes per answer. The four added responses were coded with the same codebook and all theme totals were recalculated. Counts mean “responses coded to this theme,” not keyword frequency. No second coder or participant validation has yet been completed.</p></article><article><h3>Privacy and protected access</h3><p>The public source identifiers, timestamps, IP and email fields are excluded. The thematic reader keeps five privacy redactions and three withheld answers. The password-protected All answers view adds country, age group and standardised institutional position and shows the original wording of all 114 open answers. Because combinations of profile details and answer text can identify people, the password should only be shared with intended readers.</p></article></div>

        <div className="feminism-grid"><article><span>01</span><h3>Examine power</h3><p>Show who is over- and under-represented, including the absence of C-level responses.</p></article><article><span>02</span><h3>Elevate lived knowledge</h3><p>Open accounts sit beside counts; emotion, embodiment and creative practice remain legitimate knowledge.</p></article><article><span>03</span><h3>Rethink hierarchy</h3><p>Multi-select identities and overlapping themes are preserved. Institutions are not ranked.</p></article><article><span>04</span><h3>Consider context</h3><p>Dates, provenance, exclusions, denominator, choices and limits travel with the results.</p></article><article><span>05</span><h3>Make labour visible</h3><p>Respondents created the knowledge. Analysis and site preparation used AI assistance and need community review.</p></article></div>

        <aside className="limitations"><div><p className="eyebrow">What this does not say</p><h3>No sector-wide claims.</h3></div><ul><li>The workbook has no sampling frame, invitation count or population benchmark, so response rate and representativeness cannot be assessed.</li><li>The sample is small, self-reported and likely self-selected; one person equals roughly three percentage points.</li><li>Demographic coverage is too sparse for responsible intersectional comparisons.</li><li>English-language survey design may shape participation and expression.</li><li>The coding is interpretive; a second coding pass and participant review would strengthen trustworthiness.</li></ul></aside>

        <div className="sources"><h3>Data Feminism sources</h3><p>Methodological choices were informed by Catherine D’Ignazio and Lauren F. Klein’s open-access <cite>Data Feminism</cite> (MIT Press, 2020), especially its principles to examine power, elevate emotion and embodiment, embrace pluralism, consider context and make labour visible.</p><ul><li><a href="https://data-feminism.mitpress.mit.edu/pub/frfa9szd/release/6">Introduction and seven principles</a></li><li><a href="https://data-feminism.mitpress.mit.edu/pub/vi8obxh7/release/4">Examine power</a></li><li><a href="https://data-feminism.mitpress.mit.edu/pub/5evfe9yd/release/5">Elevate emotion and embodiment</a></li><li><a href="https://data-feminism.mitpress.mit.edu/pub/czq9dfs5/release/3">Consider context</a></li><li><a href="https://data-feminism.mitpress.mit.edu/pub/0vgzaln4/release/3">Make labour visible</a></li><li><a href="https://direct.mit.edu/books/book/4660/Data-Feminism">Book record and DOI</a></li></ul></div>
      </section>
    </main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>Methods, ethics and limits</span></div><p><a href={sitePath("/")}>Return to the overview</a> · <a href={sitePath("/all-answers/")}>Read all written answers</a></p></footer>
  </>;
}
