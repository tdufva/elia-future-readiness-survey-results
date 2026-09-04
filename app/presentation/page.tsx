import type { Metadata } from "next";
import SiteHeader from "../site-header";
import { sitePath } from "../site-path";
import voiceData from "../voices/voice-data.json";
import PresentationQuote from "./presentation-quote";
import presentationData from "./presentation-data.json";

const siteUrl = "https://tdufva.github.io/elia-future-readiness-survey-results/presentation/";
const base = 38;

type PresentationQuestion = {
  headline: string;
  reading: string;
  quotes: Record<string, { entryId: string; text: string }>;
};

export const metadata: Metadata = {
  title: "Presentation · ELIA Future Readiness Survey Results",
  description: "A concise presentation of the three leading themes and respondent excerpts for each open-ended survey question.",
  alternates: { canonical: siteUrl },
  openGraph: { title: "Presentation · ELIA Future Readiness Survey Results", description: "The three leading themes for each survey question, supported by counts and respondent excerpts.", url: siteUrl },
};

export default function PresentationPage() {
  return <>
    <a className="skip-link" href="#presentation-content">Skip to the presentation</a>
    <SiteHeader current="presentation" />
    <main id="presentation-content">
      <section className="presentation-hero"><div><p className="eyebrow">Survey summary</p><h1>Presentation</h1><p className="standfirst">The three strongest themes emerging from each open-ended question—shown with counts, proportions and the respondent words behind them.</p><p className="collection-note">38 substantive responses · 114 written answers · three open-ended questions</p></div><aside><p className="eyebrow">How to read the figures</p><p>Counts show how many of the 38 responses to that question were coded to each theme. Themes overlap, so a response can appear in more than one theme and percentages should not be added together.</p><a href={sitePath("/methods/")}>Read the analysis method <span aria-hidden="true">→</span></a></aside></section>

      <nav className="presentation-nav" aria-label="Presentation sections"><span>Jump to a question</span><div>{voiceData.sections.map((section, index) => <a key={section.key} href={`#presentation-${section.key}`}><b>{String(index + 1).padStart(2, "0")}</b>{section.shortLabel}</a>)}</div></nav>

      <section className="presentation-scope" aria-label="Survey scope"><article><strong>38</strong><span>respondents in the analysed sample</span></article><article><strong>114</strong><span>written answers across three questions</span></article><article><strong>18</strong><span>countries represented</span></article><article><strong>9</strong><span>leading themes presented below</span></article></section>

      {voiceData.sections.map((section, questionIndex) => {
        const presentation = (presentationData as Record<string, PresentationQuestion>)[section.key];
        const leadingThemes = section.themes.slice(0, 3);
        return <section className={`presentation-question presentation-question--${questionIndex + 1}`} id={`presentation-${section.key}`} key={section.key} aria-labelledby={`presentation-title-${section.key}`}>
          <header className="presentation-question-head"><div><span>Question {String(questionIndex + 1).padStart(2, "0")}</span><p className="eyebrow">{section.shortLabel}</p></div><div><h2 id={`presentation-title-${section.key}`}>{section.title}</h2><p>{presentation.headline}</p></div></header>
          <div className="presentation-reading"><p className="eyebrow">Overall reading</p><p>{presentation.reading}</p></div>
          <div className="presentation-bars" role="img" aria-label={`Three leading themes for ${section.shortLabel}: ${leadingThemes.map((theme) => `${theme.label}, ${theme.count} of ${base}`).join("; ")}.`}>
            {leadingThemes.map((theme, index) => { const percent = Math.round((theme.count / base) * 100); return <div key={theme.key}><span>{index + 1}</span><strong>{theme.label}</strong><i aria-hidden="true"><b style={{ width: `${percent}%` }} /></i><em>{theme.count} of {base} · {percent}%</em></div>; })}
          </div>
          <div className="presentation-theme-grid">{leadingThemes.map((theme, index) => { const percent = Math.round((theme.count / base) * 100); const quote = presentation.quotes[theme.key]; return <article key={theme.key}><header><span>Theme {index + 1}</span><div><strong>{percent}%</strong><small>{theme.count} of {base} responses</small></div></header><h3>{theme.label}</h3><p>{theme.definition}</p>{quote && <PresentationQuote entryId={quote.entryId} text={quote.text} question={section.shortLabel} />}</article>; })}</div>
          <footer className="presentation-question-footer"><p>These are the three most frequent themes in this question. Other coded themes remain visible in the full results.</p><a href={sitePath(`/voices/#question-selector`)}>Explore all answers and themes <span aria-hidden="true">→</span></a></footer>
        </section>;
      })}

      <section className="presentation-takeaway"><div><p className="eyebrow">Across the three questions</p><h2>A connected picture of concern, sensing and institutional response.</h2></div><ol><li><span>01</span><p><strong>What matters</strong>Arts education is discussed alongside social cohesion and democratic pressure.</p></li><li><span>02</span><p><strong>How change is noticed</strong>Published information is interpreted through colleagues, networks and students.</p></li><li><span>03</span><p><strong>How institutions respond</strong>Collective reflection is widespread, but formal and proactive routines are uneven.</p></li></ol></section>
    </main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>Presentation · nine leading themes</span></div><p><a href={sitePath("/")}>Full overview</a> · <a href={sitePath("/all-answers/")}>All written answers</a></p></footer>
  </>;
}
