import type { Metadata } from "next";
import SiteHeader from "../site-header";
import { sitePath } from "../site-path";
import FrameworkWorkspace from "./framework-workspace";

const siteUrl = "https://tdufva.github.io/elia-future-readiness-survey-results/framework-method/";

export const metadata: Metadata = {
  title: "Framework Method · ELIA Future Readiness Survey Results",
  description: "An auditable qualitative coding and futures-analysis workspace for the ELIA survey responses.",
  alternates: { canonical: siteUrl },
};

export default function FrameworkMethodPage() {
  return <>
    <a className="skip-link" href="#framework-content">Skip to the Framework Method workspace</a>
    <SiteHeader current="framework" />
    <main id="framework-content">
      <section className="fm-hero">
        <div><p className="eyebrow">Qualitative research workspace</p><h1>Framework Method</h1><p className="standfirst">Move from complete survey responses to reviewable meaning units, a living codebook, text-based matrices and careful futures interpretation.</p><p className="collection-note">Protected respondent data · 38 respondents · 114 open-ended answers · human review required</p></div>
        <aside><p className="eyebrow">Analytical position</p><h2>Trace every interpretation back to text.</h2><p>This workspace combines inductive thematic coding with Dator’s Four Futures, Causal Layered Analysis and futures-orientation coding. Categories are analytical lenses, not facts about respondents.</p><ul><li>AI-assisted draft is visibly marked.</li><li>Original responses remain available.</li><li>Human edits are preserved locally.</li><li>Every matrix cell opens its evidence.</li></ul></aside>
      </section>

      <section className="fm-reading-note"><p className="eyebrow">Before coding</p><p>The unit of analysis is a segment of respondent text, not the respondent as a person. A single account can express contradictory positions. Counts support navigation and comparison; they do not substitute for qualitative interpretation.</p></section>

      <FrameworkWorkspace />

      <section className="fm-about" id="about-framework-method" aria-labelledby="fm-about-title"><header><p className="eyebrow">About the method</p><h2 id="fm-about-title">A systematic comparison that keeps context in view.</h2><p>The Framework Method organises qualitative material through familiarisation, coding, development and application of an analytical framework, charting in a matrix, and interpretation. It is systematic without implying that interpretation is neutral or automatic.</p></header>
        <div className="fm-process" aria-label="Seven phases in this implementation"><article><span>01</span><strong>Familiarisation</strong><p>Read the complete answers and record first impressions.</p></article><article><span>02</span><strong>Segmentation</strong><p>Make the fewest defensible meaning units while preserving exact wording.</p></article><article><span>03</span><strong>Initial coding</strong><p>Describe what each unit does or says in language close to the account.</p></article><article><span>04</span><strong>Analytical framework</strong><p>Consolidate codes into defined themes with clear boundaries.</p></article><article><span>05</span><strong>Apply framework</strong><p>Use the codebook consistently while retaining ambiguity and overlap.</p></article><article><span>06</span><strong>Charting</strong><p>Place text—not only counts—into respondent, question and futures matrices.</p></article><article><span>07</span><strong>Interpretation</strong><p>Examine patterns, contrasts, tensions, absences and alternative readings.</p></article></div>
        <details className="fm-method-details"><summary>Read methodological rationale, assumptions and limits</summary><div><section><h3>Hybrid framework</h3><p>Broader themes are built inductively from survey language. Three deductive lenses are then applied: Dator’s archetypes of Continuation, Collapse, Discipline and Transformation; Inayatullah’s Causal Layered Analysis; and a distinction between expectation, desire, concern and possibility. Multiple Dator and CLA labels are permitted when the exact unit supports them.</p></section><section><h3>Human-in-the-loop review</h3><p>The initial segmentation and coding are machine-assisted drafts. Researchers can accept, modify or reject them; edit, split, merge or exclude units; revise the codebook; and add memos. The interface distinguishes AI-assisted, human-reviewed, human-modified and rejected records. A certainty label, if used, describes coding confidence only and is never a statistical probability.</p></section><section><h3>Technical boundary</h3><p>This is a static GitHub Pages site. It does not send protected respondent text to an external model or database. The included prompts and JSON Schema make a future model-assisted pass reproducible, while current human decisions remain in the browser until exported. Browser state is not a shared research database.</p></section><section><h3>Limits</h3><p>The draft lexicon and futures rules are prompts for review, not validated findings. No second coder, inter-coder process or respondent validation is built into the current dataset. Meaning-unit frequencies are sensitive to segmentation. Absence from a code is not proof that an idea is absent from the wider community.</p></section></div></details>
        <div className="fm-references"><h3>References</h3><ul><li>Gale, N. K., Heath, G., Cameron, E., Rashid, S. & Redwood, S. (2013). <a href="https://doi.org/10.1186/1471-2288-13-117">Using the framework method for the analysis of qualitative data in multi-disciplinary health research</a>. <cite>BMC Medical Research Methodology, 13</cite>, 117.</li><li>Inayatullah, S. (1998). <a href="https://doi.org/10.1016/S0016-3287(98)00086-X">Causal layered analysis: Poststructuralism as method</a>. <cite>Futures, 30</cite>(8), 815–829.</li><li>Dator, J. (2009). <a href="https://jfsdigital.org/articles-and-essays/2009-2/vol-14-no-2-november/articles/futuristsalternative-futures-at-the-manoa-school/">Alternative Futures at the Manoa School</a>. <cite>Journal of Futures Studies, 14</cite>(2), 1–18.</li></ul></div>
      </section>
    </main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>Framework Method · protected qualitative workspace</span></div><p><a href={sitePath("/methods/")}>Methods, ethics and limits</a> · <a href={sitePath("/areas/")}>AREAS analysis</a></p></footer>
  </>;
}
