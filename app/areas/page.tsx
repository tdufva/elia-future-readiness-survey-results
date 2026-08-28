import type { Metadata } from "next";
import SiteHeader from "../site-header";
import { sitePath } from "../site-path";
import areasData from "./areas-data.json";

const siteUrl = "https://tdufva.github.io/elia-future-readiness-survey-results/areas/";

export const metadata: Metadata = {
  title: "AREAS analysis · ELIA Future Readiness Survey Results",
  description: "A transparent secondary analysis of the ELIA Future Readiness Survey through the five positions in the AREAS framework.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "AREAS analysis · ELIA Future Readiness Survey Results",
    description: "How respondents describe architecting, resisting, exploiting, avoiding and being shaped by transformation.",
    url: siteUrl,
  },
};

function respondentLink(respondentId: string) {
  return sitePath(`/respondents/?respondent=${respondentId}`);
}

export default function AreasPage() {
  return <>
    <a className="skip-link" href="#areas-content">Skip to AREAS analysis</a>
    <SiteHeader current="areas" />
    <main id="areas-content">
      <section className="areas-hero">
        <div>
          <p className="eyebrow">A secondary reading through AREAS</p>
          <h1>Five positions in transformation</h1>
          <p className="standfirst">The survey shows arts communities building local futures while navigating rules, pressures and technologies often set elsewhere.</p>
          <p className="collection-note">Deductive coding of all 114 written answers · 38 respondents · analysis prepared 28 August 2026</p>
        </div>
        <aside className="scope-card areas-scope" aria-label="AREAS analysis scope">
          <p className="eyebrow">What was coded</p>
          <div className="scope-grid"><div><strong>{areasData.codedRespondentCount}</strong><span>respondents with clear position evidence</span></div><div><strong>{areasData.multiplePositionCount}</strong><span>expressed more than one position</span></div></div>
          <p><strong>Positions overlap.</strong> Counts describe what appeared in the answers, not permanent identities, personal scores or institutional rankings.</p>
        </aside>
      </section>

      <section className="reading-note areas-reading-note" aria-label="How to read the AREAS analysis"><p className="eyebrow">Read this first</p><p>AREAS maps what actors do in relation to transformation. A respondent can architect one response while being shaped by another force. “Exploiting” is the framework’s neutral term for strategic use of an opening; it is not a moral judgement.</p></section>

      <section className="areas-framework-intro" aria-labelledby="areas-framework-title"><div><p className="eyebrow">What is AREAS?</p><h2 id="areas-framework-title">A framework for seeing position and power in transformation.</h2></div><div><p>AREAS is a strategic foresight framework developed by the 10F Consortium. It examines how actors respond to systemic change through five positions—Architecting, Resisting, Exploiting, Avoiding and Shaped—focusing on what they do and the power they can exercise rather than treating identity as fixed.</p><p>An actor can occupy several positions at once and move between them as circumstances change. This survey analysis uses those positions as interpretive lenses, not as permanent labels.</p><a href="https://www.10fconsortium.org/areas">Explore the AREAS framework at 10F Consortium <span aria-hidden="true">↗</span></a></div></section>

      <section className="section areas-overview" id="areas-overview">
        <header className="section-head"><div className="section-index" aria-hidden="true">A–S</div><div><p className="eyebrow">The distribution</p><h2>Local agency sits inside larger constraints.</h2><p className="section-intro">Shaped is the most visible position. Architecting is also substantial, which shows that constraint and agency are not opposites in these accounts.</p></div></header>
        <div className="areas-bars" role="img" aria-label="AREAS positions: Architecting 16 of 38 or 42 percent; Resisting 5 or 13 percent; Exploiting 5 or 13 percent; Avoiding 3 or 8 percent; Shaped 22 or 58 percent.">
          {areasData.positions.map((position) => <a className={`areas-bar areas-bar--${position.key}`} href={`#${position.key}`} key={position.key}>
            <span className="areas-bar-label"><strong>{position.label}</strong><small>{position.count} of {areasData.respondentCount}</small></span>
            <span className="areas-bar-track" aria-hidden="true"><span style={{ width: `${position.percent}%` }} /></span>
            <b>{position.percent}%</b>
          </a>)}
        </div>
        <aside className="areas-overlap-note"><strong>{areasData.multiplePositionCount} respondents</strong><span>had evidence for two or more positions. Eight records did not meet the evidence threshold for any position; that means the answers were not specific enough for this lens, not that those respondents lack agency.</span></aside>
      </section>

      <section className="areas-position-list" aria-label="Five AREAS position analyses">
        {areasData.positions.map((position, index) => <article className={`areas-position areas-position--${position.key}`} id={position.key} key={position.key}>
          <header className="areas-position-head">
            <div><span className="areas-letter" aria-hidden="true">{position.label[0]}</span><p className="eyebrow">Position {String(index + 1).padStart(2, "0")} of 05</p><h2>{position.label}</h2></div>
            <div className="areas-position-count"><strong>{position.percent}%</strong><span>{position.count} of {areasData.respondentCount} respondents</span></div>
          </header>
          <div className="areas-position-intro"><div><p className="areas-definition">{position.definition}</p><p className="areas-recognition"><strong>Recognition pattern</strong>{position.recognition}</p></div><div className="areas-analysis">{position.analysis.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>

          <div className="areas-quote-grid">{position.quotes.map((quote) => <blockquote className="areas-quote" key={`${position.key}-${quote.respondentId}`}><p>“{quote.text}”</p><footer><span>Quote from an anonymous survey respondent · excerpt from {quote.question}</span><a href={respondentLink(quote.respondentId)}>Read all answers from {quote.respondentLabel} <span aria-hidden="true">→</span></a></footer></blockquote>)}</div>

          <details className="areas-evidence"><summary><span>Verify the coding evidence</span><strong>{position.evidence.length} respondent records</strong></summary><div><p>Each row shows the passage used for this position. Excerpts are shortened with ellipses where shown; spelling and wording otherwise follow the response. Follow a respondent link to read all three answers in context.</p><ul>{position.evidence.map((item) => <li key={`${position.key}-${item.respondentId}`}><div><span>{item.question}</span><q>{item.excerpt}</q></div><a href={respondentLink(item.respondentId)}>{item.respondentLabel} <span aria-hidden="true">→</span></a></li>)}</ul></div></details>
        </article>)}
      </section>

      <section className="areas-method" id="areas-method">
        <div className="areas-method-head"><p className="eyebrow">Method and verification</p><h2>How the AREAS reading was made</h2><p>This is a transparent, AI-assisted first coding pass. It extends the report’s earlier thematic analysis but does not replace participant interpretation or an independently reviewed qualitative study.</p></div>
        <div className="areas-method-grid">
          <article><span>01</span><h3>Corpus</h3><p>All three open-ended answers from each of the 38 substantive respondents were read together: 114 answers in total. The unit counted is a respondent record, not a keyword or sentence.</p></article>
          <article><span>02</span><h3>Deductive codebook</h3><p>The five positions and recognition patterns were adapted from the 10F Consortium’s AREAS framework. Codes were non-exclusive, so one record could receive any number of positions.</p></article>
          <article><span>03</span><h3>Evidence threshold</h3><p>A position required a passage describing an action, mechanism, opportunity, boundary or constraint. Naming a concern without saying how an actor responded did not qualify. Ambiguous cases were left uncoded.</p></article>
          <article><span>04</span><h3>Counting</h3><p>Each position was counted at most once per respondent. Percentages use 38 as the denominator and are rounded. Because positions overlap, their percentages should not be added together.</p></article>
          <article><span>05</span><h3>Audit trail</h3><p>Every position section exposes its full evidence ledger. Selected quotations and ledger rows link to the anonymous respondent page, where all three original answers can be checked together.</p></article>
          <article><span>06</span><h3>Review status</h3><p>No second coder or respondent validation has yet been completed. Re-coding by ELIA members—especially disputed Exploiting, Avoiding and Shaped cases—would strengthen the analysis.</p></article>
        </div>

        <div className="areas-codebook"><h3>Operational codebook</h3><div role="table" aria-label="Operational definitions used in the AREAS analysis">
          <div className="areas-codebook-row areas-codebook-row--head" role="row"><span role="columnheader">Position</span><span role="columnheader">Counted when the answer described</span><span role="columnheader">Not enough on its own</span></div>
          <div className="areas-codebook-row" role="row"><strong role="cell">Architecting</strong><span role="cell">Rules, curricula, governance, infrastructure, programmes or decision forums being designed or built.</span><span role="cell">A wish that change should happen.</span></div>
          <div className="areas-codebook-row" role="row"><strong role="cell">Resisting</strong><span role="cell">Deliberate refusal, opposition, advocacy or defence of a threatened practice or value.</span><span role="cell">Concern, dislike or criticism without action.</span></div>
          <div className="areas-codebook-row" role="row"><strong role="cell">Exploiting</strong><span role="cell">An opening used strategically through value creation, brokerage, positioning, new partners or a parallel service.</span><span role="cell">General curiosity about an opportunity.</span></div>
          <div className="areas-codebook-row" role="row"><strong role="cell">Avoiding</strong><span role="cell">Distance, insulation, withdrawal or a protected parallel practice intended to limit exposure.</span><span role="cell">No routine, no answer or simple inaction.</span></div>
          <div className="areas-codebook-row" role="row"><strong role="cell">Shaped</strong><span role="cell">Forced adaptation, constrained choice or navigation of rules and pressures set by more powerful actors.</span><span role="cell">Awareness that the wider world is changing.</span></div>
        </div></div>

        <aside className="areas-limits"><div><p className="eyebrow">Interpretive limits</p><h3>This is a snapshot of narrated positions.</h3></div><ul><li>AREAS maps positioning at a moment in time; it does not define who a respondent or institution is.</li><li>The questions favour concerns, sensing and institutional practice. They did not directly ask about strategic advantage, resistance or avoidance.</li><li>The survey is small and self-selected, with no C-level respondents, so it cannot represent the whole ELIA community.</li><li>The 10F Consortium notes that AREAS comes from Western strategic-planning traditions and may not capture every cultural logic of agency or collective decision-making.</li></ul></aside>

        <div className="areas-source"><p className="eyebrow">Framework source</p><h3>The Five Positions in AREAS</h3><p>Definitions and recognition patterns were adapted from the 10F Consortium’s open AREAS framework. The source stresses that positions are relational, can overlap and shift, and describe what actors do rather than who they are.</p><a href="https://www.10fconsortium.org/areas">Read the AREAS framework at 10F Consortium <span aria-hidden="true">↗</span></a></div>
      </section>
    </main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>AREAS analysis · 38 substantive responses</span></div><p><a href={sitePath("/")}>Return to the overview</a> · <a href={sitePath("/all-answers/")}>Read all written answers</a> · <a href={sitePath("/methods/")}>Methods and limits</a></p></footer>
  </>;
}
