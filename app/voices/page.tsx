import type { Metadata } from "next";
import Link from "next/link";
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
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="ELIA Future Readiness results home"><span className="wordmark-mark" aria-hidden="true">E·F</span><span>ELIA Future Readiness</span></Link>
      <nav aria-label="Report pages"><Link href="/">Results overview</Link><Link className="nav-current" aria-current="page" href="/voices">Respondent voices</Link></nav>
    </header>
    <main id="voices-content">
      <section className="voices-hero">
        <div>
          <p className="eyebrow">Written answers · a thematic reader</p>
          <h1>Respondent voices</h1>
          <p className="standfirst">Read what survey respondents wrote, organised by the three open questions and the overlapping themes used in the analysis.</p>
        </div>
        <aside className="scope-card voices-scope" aria-label="Written-answer scope">
          <p className="eyebrow">What is included</p>
          <div className="scope-grid"><div><strong>{voiceData.shownAnswers}</strong><span>written answers shown</span></div><div><strong>{voiceData.withheldAnswers}</strong><span>answers withheld</span></div></div>
          <p>All <strong>{voiceData.totalAnswers} answers</strong> are accounted for. {voiceData.redactedAnswers} shown answers are lightly redacted to remove direct identifiers.</p>
        </aside>
      </section>

      <section className="voices-reading-note" aria-label="How to read respondent voices">
        <div><p className="eyebrow">Privacy and interpretation</p><h2>These are quotations from survey respondents.</h2></div>
        <div><p>Spelling, grammar and wording are preserved except where square brackets mark a privacy redaction. Answers appear without role, age, country, institution, timestamps or respondent identifiers.</p><p>Themes overlap: selecting a theme retrieves every answer coded to it, and the same answer may appear under several theme filters. Coding is interpretive rather than a ranking of respondents.</p></div>
      </section>

      <VoiceExplorer sections={voiceData.sections as VoiceSection[]} />

      <section className="voices-method-note">
        <div><p className="eyebrow">A privacy boundary</p><h2>Three answers remain private.</h2></div>
        <p>Those answers contained a combination of personal roles, named organisations, project titles and locations. They are represented in the thematic counts, but their text is withheld because removing the identifying detail would substantially change their meaning.</p>
      </section>
    </main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>Respondent voices · 34 substantive responses</span></div><p><Link href="/">Return to the results overview</Link>. The original response-level workbook remains private.</p></footer>
  </>;
}
