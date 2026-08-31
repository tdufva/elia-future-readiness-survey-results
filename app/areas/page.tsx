import type { Metadata } from "next";
import SiteHeader from "../site-header";
import { sitePath } from "../site-path";
import areasData from "./areas-data.json";

const siteUrl = "https://tdufva.github.io/elia-future-readiness-survey-results/areas/";

export const metadata: Metadata = {
  title: "AREAS analysis · ELIA Future Readiness Survey Results",
  description: "A traceable strategic landscape analysis of the ELIA Future Readiness Survey through the five positions in the AREAS framework.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "AREAS analysis · ELIA Future Readiness Survey Results",
    description: "What the survey reveals about agency, constraint, vulnerability and possible coalitions in higher arts education.",
    url: siteUrl,
  },
};

function respondentLink(respondentId: string) {
  return sitePath(`/respondents/?respondent=${respondentId}`);
}

function respondentLabel(respondentId: string) {
  return `Respondent ${respondentId.slice(-2)}`;
}

function TraceLinks({ ids, label = "Evidence" }: { ids: string[]; label?: string }) {
  return <p className="areas-trace"><strong>{label}:</strong>{ids.map((id, index) => <span key={id}>{index > 0 && ", "}<a href={respondentLink(id)}>{respondentLabel(id)}</a></span>)}</p>;
}

export default function AreasPage() {
  return <>
    <a className="skip-link" href="#areas-content">Skip to AREAS analysis</a>
    <SiteHeader current="areas" />
    <main id="areas-content">
      <section className="areas-hero">
        <div>
          <p className="eyebrow">A strategic landscape reading through AREAS</p>
          <h1>Who is steering—and who is navigating?</h1>
          <p className="standfirst">The survey shows local action inside a transformation whose technological, financial and political parameters are largely set elsewhere.</p>
          <p className="collection-note">Deductive coding of all 114 written answers · 38 respondents · analysis prepared 31 August 2026</p>
        </div>
        <aside className="scope-card areas-scope" aria-label="AREAS analysis scope">
          <p className="eyebrow">What was coded</p>
          <div className="scope-grid"><div><strong>{areasData.codedRespondentCount}</strong><span>respondents with clear position evidence</span></div><div><strong>{areasData.multiplePositionCount}</strong><span>expressed more than one position</span></div></div>
          <p><strong>Positions overlap.</strong> Counts describe actions in these answers, not permanent identities, personal scores or institutional rankings.</p>
        </aside>
      </section>

      <section className="reading-note areas-reading-note" aria-label="How to read the AREAS analysis"><p className="eyebrow">Read this first</p><p>This is not a validated map of named organisations. It is a map of actions narrated by anonymous respondents at personal, team, institutional and sectoral scales. It can show patterns in the survey; it cannot show the full power structure around higher arts education.</p></section>

      <section className="areas-framework-intro" aria-labelledby="areas-framework-title"><div><p className="eyebrow">What is AREAS?</p><h2 id="areas-framework-title">A framework for seeing position and power in transformation.</h2></div><div><p>AREAS is a strategic foresight framework developed by the 10F Consortium. It examines what actors are doing through five positions—Architecting, Resisting, Exploiting, Avoiding and Shaped—rather than treating identity or stated intention as strategy.</p><p>The same actor can occupy several positions at once: setting local rules while being constrained by a global platform, for example. Positions can also change as resources, crises and capabilities change. No position is treated as morally superior.</p><a href="https://www.10fconsortium.org/areas">Explore the AREAS framework at 10F Consortium <span aria-hidden="true">↗</span></a></div></section>

      <section className="section areas-transformation" id="transformation">
        <header className="section-head"><div className="section-index" aria-hidden="true">01</div><div><p className="eyebrow">The transformation being tracked</p><h2>From informal response to deliberate system-shaping.</h2><p className="section-intro">Higher arts education is responding to accelerating AI, funding, political, ecological and social pressures. The strategic question is not whether change is happening, but who can determine how institutions respond.</p></div></header>
        <div className="areas-transformation-grid">
          <article><h3>Why it matters to ELIA</h3><p>The distribution of agency affects who sets curricula, AI rules, quality processes and funding responses—and whether signals from staff, students and partners enter formal decisions.</p></article>
          <article><h3>What the map contains</h3><p>The units are respondent accounts, not verified organisations. A passage was coded only when it described an action, mechanism, opportunity, boundary or constraint. Eight records did not contain enough specific evidence for an AREAS position.</p></article>
          <article><h3>What it combines</h3><p>The survey brings several connected transformations into one view. AI, austerity, war, climate pressure and political change are not one system, so a position visible in one domain may not transfer to another.</p></article>
        </div>
      </section>

      <section className="section areas-overview" id="present-map">
        <header className="section-head"><div className="section-index" aria-hidden="true">02</div><div><p className="eyebrow">Present map</p><h2>Shaped is crowded. Architecting is local.</h2><p className="section-intro">The two largest positions coexist because many respondents are building responses within systems they do not control. The percentages overlap and should not be added.</p></div></header>
        <div className="areas-bars" role="img" aria-label="AREAS positions: Architecting 16 of 38 or 42 percent; Resisting 5 or 13 percent; Exploiting 5 or 13 percent; Avoiding 3 or 8 percent; Shaped 22 or 58 percent.">
          {areasData.positions.map((position) => <a className={`areas-bar areas-bar--${position.key}`} href={`#${position.key}`} key={position.key}>
            <span className="areas-bar-label"><strong>{position.label}</strong><small>{position.count} of {areasData.respondentCount}</small></span>
            <span className="areas-bar-track" aria-hidden="true"><span style={{ width: `${position.percent}%` }} /></span>
            <b>{position.percent}%</b>
          </a>)}
        </div>
        <aside className="areas-overlap-note"><strong>{areasData.multiplePositionCount} respondents</strong><span>had evidence for two or more positions. Eight records did not meet the evidence threshold; that means the answers were not specific enough for this lens, not that those respondents lack agency.</span></aside>
      </section>

      <section className="areas-strategic" aria-label="Strategic analysis of the present map">
        <section className="areas-analysis-section" id="landscape">
          <header className="areas-analysis-head"><div><p className="eyebrow">03 · Landscape reading</p><h2>The map is downstream-heavy.</h2></div><p>Respondents mainly describe adapting to forces or shaping local responses. The actors setting the wider rules—platform companies, funders, governments and regulators—appear as pressures, not as mapped participants.</p></header>
          <div className="areas-insight-grid">
            <article><span>01</span><h3>This map is downstream-heavy.</h3><p>Shaped is the most crowded position at 22 respondents. Architecting follows at 16, but no Global architects are observed in the sample and there are no C-level respondents. The trajectory described is therefore locally active but externally parameterised.</p><TraceLinks ids={["respondent-07", "respondent-22", "respondent-27", "respondent-32"]} /></article>
            <article><span>02</span><h3>Local architecture does not equal control.</h3><p>Ten of the 16 Architecting records are also Shaped. Respondents create guidelines, strategies, curricula and decision processes while platforms, fiscal pressure, war or policy define the conditions in which those mechanisms operate.</p><TraceLinks ids={["respondent-07", "respondent-11", "respondent-22", "respondent-27"]} /></article>
            <article><span>03</span><h3>There is no stable outside.</h3><p>Avoiding is the smallest position, with three respondents. Every one is also Resisting and Shaped. Their boundary-setting limits exposure, but it does not remove dependence on the systems they oppose.</p><TraceLinks ids={["respondent-01", "respondent-16", "respondent-29"]} /></article>
            <article><span>04</span><h3>Opportunity and rule-setting are disconnected.</h3><p>Only one respondent is coded as both Exploiting and Architecting. The people describing openings, brokerage or market positioning are mostly not the people described as setting institutional rules. The survey design may under-detect both activities, so this separation is suggestive rather than conclusive.</p><TraceLinks ids={["respondent-08", "respondent-12", "respondent-17"]} /></article>
          </div>
        </section>

        <section className="areas-analysis-section" id="vulnerabilities">
          <header className="areas-analysis-head"><div><p className="eyebrow">04 · Vulnerabilities</p><h2>Agency without control is the main fragility.</h2></div><p>The most exposed actors are not necessarily inactive. Several are doing substantial institutional work without controlling the resources or systems on which that work depends.</p></header>
          <div className="areas-insight-grid areas-insight-grid--three">
            <article><span>01</span><h3>Local architects depend on outside permissions.</h3><p>Guidelines, committees and strategies can steer an institution, but their capacity is vulnerable to imposed software, fiscal pressure and cuts. These accounts look active and stable until the scale of their authority is compared with the scale of the constraint.</p><TraceLinks ids={["respondent-07", "respondent-22", "respondent-27", "respondent-35"]} /></article>
            <article><span>02</span><h3>Resistance has little institutional cover.</h3><p>Four of the five Resisting respondents are also Shaped. The evidence is personal refusal, informal advocacy and network-building—not regulatory leverage or coordinated institutional opposition. It can register dissent, but the map does not show it changing the rules yet.</p><TraceLinks ids={["respondent-01", "respondent-06", "respondent-16", "respondent-29", "respondent-38"]} /></article>
            <article><span>03</span><h3>Avoidance is difficult to sustain.</h3><p>The three Avoiding accounts remain embedded in the technologies and power structures they seek to limit. Their position is better read as selective distance or a protected boundary than as an independent parallel system.</p><TraceLinks ids={["respondent-01", "respondent-16", "respondent-29"]} /></article>
            <article><span>04</span><h3>Some Shaped actors already have the beginnings of movement.</h3><p>Informal coalitions, peer groups, regular meetings and cross-field expertise could support movement toward Resisting or Architecting. The missing element in these accounts is not awareness; it is a mechanism that turns shared sensing into authority.</p><TraceLinks ids={["respondent-06", "respondent-21", "respondent-26", "respondent-36"]} /></article>
          </div>
        </section>

        <section className="areas-analysis-section" id="coalitions">
          <header className="areas-analysis-head"><div><p className="eyebrow">05 · Coalitions and interactions</p><h2>Shared interests cross the five positions.</h2></div><p>The overlaps reveal relationships that job title or institutional identity would miss. They also show where a coalition is absent rather than merely weak.</p></header>
          <div className="areas-coalition-layout">
            <div className="areas-coalition-list">
              <article><h3>Formal foresight builders + informal signal networks</h3><p>Respondents building strategy and quality processes share an interest with peer groups already noticing change outside formal structures: making weak signals count in decisions. The survey shows both sides, but not a durable bridge between them.</p><TraceLinks ids={["respondent-11", "respondent-22", "respondent-06", "respondent-21", "respondent-26"]} /></article>
              <article><h3>AI boundary-setters + curriculum and rule builders</h3><p>Refusal and selective distance are usually framed separately from governance. Here they concern the same system. Boundary-setters identify harms and limits; local architects decide how AI enters teaching and institutional practice.</p><TraceLinks ids={["respondent-16", "respondent-29", "respondent-07", "respondent-27"]} /></article>
              <article><h3>Opportunity brokers + institutional rule-setters</h3><p>This connection is mostly missing. Respondents 12 and 17 see market or partnership openings, while the Architecting group focuses on internal mechanisms. Respondent 08 is the only observed overlap. A coalition cannot be claimed from that evidence; the absence itself is the finding.</p><TraceLinks ids={["respondent-08", "respondent-12", "respondent-17"]} /></article>
            </div>
            <aside className="areas-overlap-table" aria-label="Observed overlaps between AREAS positions"><p className="eyebrow">Observed overlaps</p><h3>Where positions meet</h3><dl><div><dt>Architecting + Shaped</dt><dd>10</dd></div><div><dt>Resisting + Shaped</dt><dd>4</dd></div><div><dt>Resisting + Avoiding</dt><dd>3</dd></div><div><dt>Avoiding + Shaped</dt><dd>3</dd></div><div><dt>Exploiting + Shaped</dt><dd>2</dd></div><div><dt>Architecting + Exploiting</dt><dd>1</dd></div><div><dt>Architecting + Avoiding</dt><dd>0</dd></div></dl><p>Counts refer to respondent records coded in both positions.</p></aside>
          </div>
        </section>
      </section>

      <section className="areas-position-list" aria-label="Five AREAS position analyses">
        <header className="areas-evidence-intro"><p className="eyebrow">06 · Present-map evidence</p><h2>Inspect every position and its evidence.</h2><p>Each section gives the working definition, observed scale, interpretation, selected respondent quotations and the complete evidence ledger used for the count.</p></header>
        {areasData.positions.map((position, index) => <article className={`areas-position areas-position--${position.key}`} id={position.key} key={position.key}>
          <header className="areas-position-head">
            <div><span className="areas-letter" aria-hidden="true">{position.label[0]}</span><p className="eyebrow">Position {String(index + 1).padStart(2, "0")} of 05</p><h2>{position.label}</h2></div>
            <div className="areas-position-count"><strong>{position.percent}%</strong><span>{position.count} of {areasData.respondentCount} respondents</span></div>
          </header>
          <div className="areas-position-intro"><div><p className="areas-definition">{position.definition}</p><p className="areas-recognition"><strong>Recognition pattern</strong>{position.recognition}</p><p className="areas-scale"><strong>Observed scale</strong>{position.scale}</p></div><div className="areas-analysis">{position.analysis.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>

          <div className="areas-quote-grid">{position.quotes.map((quote) => <blockquote className="areas-quote" key={`${position.key}-${quote.respondentId}`}><p>“{quote.text}”</p><footer><span>Quote from an anonymous survey respondent · excerpt from {quote.question}</span><a href={respondentLink(quote.respondentId)}>Read all answers from {quote.respondentLabel} <span aria-hidden="true">→</span></a></footer></blockquote>)}</div>

          <details className="areas-evidence"><summary><span>Verify the coding evidence</span><strong>{position.evidence.length} respondent records</strong></summary><div><p>Each row shows the passage used for this position. Excerpts are shortened with ellipses where shown; spelling and wording otherwise follow the response. Follow a respondent link to read all three answers in context.</p><ul>{position.evidence.map((item) => <li key={`${position.key}-${item.respondentId}`}><div><span>{item.question}</span><q>{item.excerpt}</q></div><a href={respondentLink(item.respondentId)}>{item.respondentLabel} <span aria-hidden="true">→</span></a></li>)}</ul></div></details>
        </article>)}
      </section>

      <section className="areas-blind-spots" id="blind-spots">
        <header className="areas-analysis-head"><div><p className="eyebrow">07 · Blind spots</p><h2>The survey cannot map the actors with the most power.</h2></div><p>These limits change what can be concluded. They are not footnotes to the landscape reading; they define its boundary.</p></header>
        <div className="areas-blind-grid">
          <article><h3>Upstream actors are missing.</h3><p>Platforms, ministries, funders, regulators, accreditors and governing boards are named as forces or implied by constraints, but they did not answer the survey as mapped actors. Their strategies and dependencies are unknown.</p></article>
          <article><h3>Executive power is not represented.</h3><p>The sample contains no C-level respondents. The map therefore has more evidence about sensing and local implementation than about resource allocation, formal authority or institutional risk-taking.</p></article>
          <article><h3>An account is not an actor inventory.</h3><p>Anonymisation protects respondents but prevents checking whether several accounts refer to the same institution, tracing organisational networks or separating personal action from official institutional strategy.</p></article>
          <article><h3>The transformation is composite.</h3><p>AI, funding pressure, war, climate disruption and political change interact, but they do not have the same architects or pathways. Combining them can obscure a respondent who Architects in one domain and is Shaped in another.</p></article>
          <article><h3>Some positions are under-asked.</h3><p>The survey asked about concerns, sensing and institutional practice. It did not directly ask who profits from friction, who is blocking change, who is building parallel systems or who controls infrastructure. Exploiting, Resisting and Avoiding are therefore likely less visible.</p></article>
          <article><h3>The coding is interpretive.</h3><p>This is one AI-assisted deductive coding pass on self-reported answers. There is no second coder, respondent validation or independent actor evidence. The ledgers make the interpretation auditable, not objective.</p></article>
        </div>
        <aside className="areas-gap-note"><p className="eyebrow">Preferred future map</p><h3>No gap analysis was invented.</h3><p>No preferred future map was supplied, so this page does not claim which repositionings ELIA wants or which dependency chains would serve that future. The vulnerability and coalition sections describe the present evidence only.</p></aside>
      </section>

      <section className="areas-method" id="areas-method">
        <div className="areas-method-head"><p className="eyebrow">Method and verification</p><h2>How the AREAS reading was made</h2><p>This is a transparent, AI-assisted first coding pass. It extends the report’s earlier thematic analysis but does not replace participant interpretation or an independently reviewed qualitative study.</p></div>
        <div className="areas-method-grid">
          <article><span>01</span><h3>Corpus</h3><p>All three open-ended answers from each of the 38 substantive respondents were read together: 114 answers in total. The unit counted is a respondent record, not a keyword or sentence.</p></article>
          <article><span>02</span><h3>Deductive codebook</h3><p>The five positions and recognition patterns were adapted from the 10F Consortium’s AREAS framework. Codes were non-exclusive, so one record could receive any number of positions.</p></article>
          <article><span>03</span><h3>Evidence threshold</h3><p>A position required a passage describing an action, mechanism, opportunity, boundary or constraint. Naming a concern without saying how an actor responded did not qualify. Ambiguous cases were left uncoded.</p></article>
          <article><span>04</span><h3>Scale check</h3><p>Every position was read at Local, Regional/Sectoral or Global scale. This prevents local curriculum or policy work from being mistaken for control over platforms, finance or state policy.</p></article>
          <article><span>05</span><h3>Counting and overlap</h3><p>Each position was counted at most once per respondent. Percentages use 38 as the denominator and are rounded. Because positions overlap, their percentages should not be added together.</p></article>
          <article><span>06</span><h3>Audit trail</h3><p>Every position exposes its full evidence ledger. Selected quotations and analytical claims link to the anonymous respondent page, where all three original answers can be checked together.</p></article>
        </div>

        <div className="areas-codebook"><h3>Operational codebook</h3><div role="table" aria-label="Operational definitions used in the AREAS analysis">
          <div className="areas-codebook-row areas-codebook-row--head" role="row"><span role="columnheader">Position</span><span role="columnheader">Counted when the answer described</span><span role="columnheader">Not enough on its own</span></div>
          <div className="areas-codebook-row" role="row"><strong role="cell">Architecting</strong><span role="cell">Rules, curricula, governance, infrastructure, programmes or decision forums being designed or built.</span><span role="cell">A wish that change should happen.</span></div>
          <div className="areas-codebook-row" role="row"><strong role="cell">Resisting</strong><span role="cell">Deliberate refusal, opposition, advocacy or defence of a threatened practice or value.</span><span role="cell">Concern, dislike or criticism without action.</span></div>
          <div className="areas-codebook-row" role="row"><strong role="cell">Exploiting</strong><span role="cell">An opening used strategically through value creation, brokerage, positioning, new partners or a parallel service.</span><span role="cell">General curiosity about an opportunity.</span></div>
          <div className="areas-codebook-row" role="row"><strong role="cell">Avoiding</strong><span role="cell">Distance, insulation, withdrawal or a protected parallel practice intended to limit exposure.</span><span role="cell">No routine, no answer or simple inaction.</span></div>
          <div className="areas-codebook-row" role="row"><strong role="cell">Shaped</strong><span role="cell">Forced adaptation, constrained choice or navigation of rules and pressures set by more powerful actors.</span><span role="cell">Awareness that the wider world is changing.</span></div>
        </div></div>

        <div className="areas-source"><p className="eyebrow">Framework source</p><h3>The Five Positions in AREAS</h3><p>Definitions and recognition patterns were adapted from the 10F Consortium’s open AREAS framework. The source stresses that positions are relational, can overlap and shift, and describe what actors do rather than who they are.</p><a href="https://www.10fconsortium.org/areas">Read the AREAS framework at 10F Consortium <span aria-hidden="true">↗</span></a></div>
      </section>
    </main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>AREAS analysis · 38 substantive responses</span></div><p><a href={sitePath("/")}>Return to the overview</a> · <a href={sitePath("/all-answers/")}>Read all written answers</a> · <a href={sitePath("/methods/")}>Methods and limits</a></p></footer>
  </>;
}
