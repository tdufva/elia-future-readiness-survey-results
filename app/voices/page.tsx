import type { Metadata } from "next";
import SiteHeader from "../site-header";
import { sitePath } from "../site-path";
import VoiceExplorer, { type VoiceSection } from "./voice-explorer";
import voiceData from "./voice-data.json";

const siteUrl = "https://tdufva.github.io/elia-future-readiness-survey-results/voices/";

export const metadata: Metadata = {
  title: "Respondent voices · ELIA Future Readiness Survey Results",
  description: "Navigate anonymized written responses to the ELIA Future Readiness Survey by question and theme.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Respondent voices · ELIA Future Readiness Survey Results",
    description: "Navigate anonymized written responses by question and theme.",
    url: siteUrl,
  },
};

export default function VoicesPage() {
  return <>
    <a className="skip-link" href="#voices-content">Skip to respondent voices</a>
    <SiteHeader current="voices" />
    <main id="voices-content">
      <section className="voices-hero">
        <div>
          <p className="eyebrow">Written answers · a thematic reader</p>
          <h1>Respondent voices</h1>
          <p className="standfirst">The survey included three open-ended questions. Select a question below to read its answers, explore themes and connect each quote to the respondent’s other answers.</p>
          <a className="voices-jump-link" href="#question-selector">Choose an open-ended question <span aria-hidden="true">↓</span></a>
        </div>
        <aside className="scope-card voices-scope" aria-label="Written-answer scope">
          <p className="eyebrow">What is included</p>
          <div className="scope-grid"><div><strong>{voiceData.shownAnswers}</strong><span>written answers shown</span></div><div><strong>{voiceData.withheldAnswers}</strong><span>answers withheld</span></div></div>
          <p>All <strong>{voiceData.totalAnswers} answers</strong> are accounted for. {voiceData.redactedAnswers} shown answers are lightly redacted to remove direct identifiers.</p>
        </aside>
      </section>

      <section className="voices-reading-note" aria-label="How to read respondent voices">
        <div><p className="eyebrow">How this reader works</p><h2>Choose a question, then explore its answers.</h2></div>
        <div><p>Each of the three question selectors opens the 38 answers given to that open-ended question. Once selected, you can read every answer, filter by theme, or search for a word or phrase.</p><p><strong>Hover over or focus a quote</strong> to see the respondent’s country, age group and position. Follow the link in that profile to read the same respondent’s other two answers.</p><p>Spelling, grammar and wording are preserved except where square brackets mark a privacy redaction. Themes overlap: the same answer can belong to several themes.</p></div>
      </section>

      <VoiceExplorer sections={voiceData.sections as VoiceSection[]} />

      <section className="voices-method-note">
        <div><p className="eyebrow">Read every response</p><h2>The complete written-answer reader is available.</h2></div>
        <p>The <a href={sitePath("/all-answers/")}>All answers page</a> groups the original wording of all three answers by respondent and offers search and profile filters. This protected view can contain identifying context; share the password only with intended readers.</p>
      </section>
    </main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>Respondent voices · 38 substantive responses</span></div><p><a href={sitePath("/")}>Return to the results overview</a> · <a href={sitePath("/methods/")}>Read the methods and limits</a></p></footer>
  </>;
}
