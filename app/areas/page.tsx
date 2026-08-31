import type { Metadata } from "next";
import SiteHeader from "../site-header";
import { sitePath } from "../site-path";
import areasData from "./areas-data.json";
import AreasQuoteCard from "./areas-quote-card";

const siteUrl = "https://tdufva.github.io/elia-future-readiness-survey-results/areas/";

const positionGuide = [
  { key: "architecting", label: "Architecting", description: "Designing and building rules, curricula, governance, infrastructure, programmes or decision forums." },
  { key: "resisting", label: "Resisting", description: "Actively opposing change or defending threatened practices and values." },
  { key: "exploiting", label: "Exploiting", description: "Using openings created by change through value creation, brokerage, positioning, partnerships or new services." },
  { key: "avoiding", label: "Avoiding", description: "Limiting exposure through distance, insulation, withdrawal or protected parallel practices." },
  { key: "shaped", label: "Shaped", description: "Adapting within constraints set by more powerful actors, without enough control to determine the direction." },
] as const;

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

function AreasPositionMap() {
  return <figure className="areas-map-card">
    <figcaption><p className="eyebrow">Position view</p><h3>Where the five positions sit</h3><p>Vertical placement shows how much influence actors have. Horizontal placement shows whether they oppose, step away from, adapt to or help produce the change. Larger circles represent more respondents.</p></figcaption>
    <div className="areas-map-scroll"><svg className="areas-map" viewBox="0 0 900 610" role="img" aria-labelledby="position-map-title position-map-desc">
      <title id="position-map-title">AREAS position landscape for the survey</title>
      <desc id="position-map-desc">Conceptual map with Architecting at high agency, Exploiting and Resisting at moderate agency, Avoiding at variable agency and Shaped at minimal agency. Circle size represents respondent counts.</desc>
      <defs><marker id="areas-axis-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
      <rect className="areas-map-field" x="86" y="52" width="752" height="476" rx="24" />
      <g className="areas-map-grid" aria-hidden="true"><line x1="86" y1="170" x2="838" y2="170" /><line x1="86" y1="290" x2="838" y2="290" /><line x1="86" y1="410" x2="838" y2="410" /><line x1="274" y1="52" x2="274" y2="528" /><line x1="462" y1="52" x2="462" y2="528" /><line x1="650" y1="52" x2="650" y2="528" /></g>
      <g className="areas-map-axes" aria-hidden="true"><line x1="66" y1="518" x2="66" y2="66" markerEnd="url(#areas-axis-arrow)" /><line x1="100" y1="554" x2="824" y2="554" markerEnd="url(#areas-axis-arrow)" /><text x="42" y="92" transform="rotate(-90 42 92)">MORE AGENCY</text><text x="42" y="514" transform="rotate(-90 42 514)">LESS AGENCY</text><text x="100" y="584">OPPOSE / STEP AWAY</text><text x="824" y="584" textAnchor="end">BUILD / USE</text></g>
      <a href="#architecting" aria-label="Architecting: 16 respondents, maximum agency"><g className="areas-map-node areas-map-node--architecting"><circle cx="690" cy="142" r="67" /><text x="690" y="134" textAnchor="middle">Architecting</text><text className="areas-map-count" x="690" y="166" textAnchor="middle">16</text></g></a>
      <a href="#resisting" aria-label="Resisting: 5 respondents, moderate agency"><g className="areas-map-node areas-map-node--resisting"><circle cx="235" cy="278" r="46" /><text x="235" y="272" textAnchor="middle">Resisting</text><text className="areas-map-count" x="235" y="298" textAnchor="middle">5</text></g></a>
      <a href="#exploiting" aria-label="Exploiting: 5 respondents, moderate-high agency"><g className="areas-map-node areas-map-node--exploiting"><circle cx="675" cy="305" r="46" /><text x="675" y="299" textAnchor="middle">Exploiting</text><text className="areas-map-count" x="675" y="325" textAnchor="middle">5</text></g></a>
      <a href="#avoiding" aria-label="Avoiding: 3 respondents, variable agency"><g className="areas-map-node areas-map-node--avoiding"><ellipse cx="275" cy="420" rx="42" ry="32" /><text x="275" y="414" textAnchor="middle">Avoiding</text><text className="areas-map-count" x="275" y="440" textAnchor="middle">3</text></g></a>
      <a href="#shaped" aria-label="Shaped: 22 respondents, minimal agency"><g className="areas-map-node areas-map-node--shaped"><circle cx="520" cy="454" r="76" /><text x="520" y="445" textAnchor="middle">Shaped</text><text className="areas-map-count" x="520" y="480" textAnchor="middle">22</text></g></a>
      <text className="areas-map-note" x="275" y="474" textAnchor="middle">variable agency</text>
    </svg></div>
    <p className="areas-map-caveat"><strong>How to read:</strong> Placement is conceptual, based on the AREAS definitions—not a measured score. Select a circle to inspect that position’s respondent evidence.</p>
  </figure>;
}

function AreasOverlapMap() {
  return <figure className="areas-map-card">
    <figcaption><p className="eyebrow">Overlap view</p><h3>How the positions coexist</h3><p>Each line connects positions found in the same respondent’s answers. Wider lines mean more shared respondents; the number gives the exact overlap.</p></figcaption>
    <div className="areas-map-scroll"><svg className="areas-map areas-overlap-map" viewBox="0 0 900 610" role="img" aria-labelledby="overlap-map-title overlap-map-desc">
      <title id="overlap-map-title">Network map of overlaps between the five AREAS positions</title>
      <desc id="overlap-map-desc">The strongest overlap is Architecting and Shaped with 10 respondents. All other non-zero pairwise overlaps range from one to four respondents. Architecting and Avoiding have no overlap.</desc>
      <rect className="areas-map-field" x="38" y="38" width="824" height="530" rx="24" />
      <g className="areas-map-links" aria-hidden="true">
        <path className="areas-link areas-link--1" d="M392 134 C305 150 230 184 191 218" />
        <path className="areas-link areas-link--1" d="M508 134 C598 150 669 184 709 218" />
        <path className="areas-link areas-link--10" d="M465 172 C482 290 535 375 575 414" />
        <path className="areas-link areas-link--1" d="M207 250 C355 205 548 205 693 250" />
        <path className="areas-link areas-link--3" d="M181 291 C197 358 222 420 240 452" />
        <path className="areas-link areas-link--4" d="M198 281 C331 344 459 406 535 452" />
        <path className="areas-link areas-link--1" d="M700 275 C565 334 411 420 290 477" />
        <path className="areas-link areas-link--2" d="M706 286 C675 353 645 392 628 410" />
        <path className="areas-link areas-link--3" d="M291 492 C399 519 494 511 530 495" />
      </g>
      <g className="areas-map-link-labels" aria-hidden="true">
        <g transform="translate(286 167)"><circle r="16" /><text y="5" textAnchor="middle">1</text></g>
        <g transform="translate(614 167)"><circle r="16" /><text y="5" textAnchor="middle">1</text></g>
        <g transform="translate(516 301)"><circle r="19" /><text y="6" textAnchor="middle">10</text></g>
        <g transform="translate(450 214)"><circle r="16" /><text y="5" textAnchor="middle">1</text></g>
        <g transform="translate(207 378)"><circle r="16" /><text y="5" textAnchor="middle">3</text></g>
        <g transform="translate(363 375)"><circle r="16" /><text y="5" textAnchor="middle">4</text></g>
        <g transform="translate(493 386)"><circle r="16" /><text y="5" textAnchor="middle">1</text></g>
        <g transform="translate(674 359)"><circle r="16" /><text y="5" textAnchor="middle">2</text></g>
        <g transform="translate(414 516)"><circle r="16" /><text y="5" textAnchor="middle">3</text></g>
      </g>
      <a href="#architecting" aria-label="Architecting, 16 respondents"><g className="areas-map-node areas-map-node--architecting"><circle cx="450" cy="110" r="72" /><text x="450" y="102" textAnchor="middle">Architecting</text><text className="areas-map-count" x="450" y="136" textAnchor="middle">16</text></g></a>
      <a href="#resisting" aria-label="Resisting, 5 respondents"><g className="areas-map-node areas-map-node--resisting"><circle cx="160" cy="250" r="48" /><text x="160" y="244" textAnchor="middle">Resisting</text><text className="areas-map-count" x="160" y="270" textAnchor="middle">5</text></g></a>
      <a href="#exploiting" aria-label="Exploiting, 5 respondents"><g className="areas-map-node areas-map-node--exploiting"><circle cx="740" cy="250" r="48" /><text x="740" y="244" textAnchor="middle">Exploiting</text><text className="areas-map-count" x="740" y="270" textAnchor="middle">5</text></g></a>
      <a href="#avoiding" aria-label="Avoiding, 3 respondents"><g className="areas-map-node areas-map-node--avoiding"><circle cx="250" cy="490" r="38" /><text x="250" y="484" textAnchor="middle">Avoiding</text><text className="areas-map-count" x="250" y="510" textAnchor="middle">3</text></g></a>
      <a href="#shaped" aria-label="Shaped, 22 respondents"><g className="areas-map-node areas-map-node--shaped"><circle cx="610" cy="480" r="82" /><text x="610" y="471" textAnchor="middle">Shaped</text><text className="areas-map-count" x="610" y="506" textAnchor="middle">22</text></g></a>
    </svg></div>
    <p className="areas-map-caveat"><strong>Missing line:</strong> Architecting + Avoiding has no shared respondents. The network shows all nine non-zero pairwise overlaps, not only the strongest ones.</p>
  </figure>;
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

      <section className="areas-quick-guide" id="position-guide">
        <header><p className="eyebrow">The five positions</p><h2>AREAS at a glance.</h2><p>A concise guide to how actors respond to transformation.</p></header>
        <div className="areas-quick-list">{positionGuide.map((position) => <a className={`areas-quick-item areas-quick-item--${position.key}`} href={`#${position.key}`} key={position.key}><span className="areas-quick-letter" aria-hidden="true">{position.label[0]}</span><div><h3>{position.label}</h3><p>{position.description}</p></div></a>)}</div>
      </section>

      <section className="section areas-overview" id="present-map">
        <header className="section-head"><div className="section-index" aria-hidden="true">01</div><div><p className="eyebrow">What the responses show</p><h2>Most respondents are adapting to change. Some are also shaping local responses.</h2><p className="section-intro">In AREAS, <strong>Shaped</strong> means adapting to conditions set by others. <strong>Architecting</strong> means designing rules or responses. Shaped appears in 22 responses. Architecting appears in 16, mainly through local work such as guidelines, curricula, committees and institutional strategies. The same respondent can appear in both groups, so the percentages overlap.</p></div></header>
        <div className="areas-bars" role="img" aria-label="AREAS positions: Architecting 16 of 38 or 42 percent; Resisting 5 or 13 percent; Exploiting 5 or 13 percent; Avoiding 3 or 8 percent; Shaped 22 or 58 percent.">
          {areasData.positions.map((position) => <a className={`areas-bar areas-bar--${position.key}`} href={`#${position.key}`} key={position.key}>
            <span className="areas-bar-label"><strong>{position.label}</strong><small>{position.count} of {areasData.respondentCount}</small></span>
            <span className="areas-bar-track" aria-hidden="true"><span style={{ width: `${position.percent}%` }} /></span>
            <b>{position.percent}%</b>
          </a>)}
        </div>
        <aside className="areas-overlap-note"><strong>{areasData.multiplePositionCount} respondents</strong><span>had evidence for two or more positions. Eight records did not meet the evidence threshold; that means the answers were not specific enough for this lens, not that those respondents lack agency.</span></aside>
        <div className="areas-visual-map-grid"><AreasPositionMap /><AreasOverlapMap /></div>
      </section>

      <section className="areas-strategic" aria-label="Strategic analysis of the present map">
        <section className="areas-analysis-section" id="landscape">
          <header className="areas-analysis-head"><div><p className="eyebrow">02 · Where power sits</p><h2>The biggest decisions are mostly made elsewhere.</h2></div><p>Respondents can act inside their teams and institutions, but platforms, funders, governments and regulators usually set the wider conditions.</p></header>
          <div className="areas-insight-grid">
            <article><span>01</span><h3>Most respondents are responding to decisions made elsewhere.</h3><p>Shaped is the largest position, with 22 respondents. Architecting follows with 16. Because no global actors or C-level decision-makers answered the survey, it mainly shows local action under outside constraints.</p><TraceLinks ids={["respondent-07", "respondent-22", "respondent-27", "respondent-32"]} /></article>
            <article><span>02</span><h3>Shaping a local response is not the same as controlling the wider change.</h3><p>Ten of the 16 Architecting respondents are also Shaped. They create guidelines, strategies, curricula and decision processes while platforms, funding, war or policy set the wider conditions.</p><TraceLinks ids={["respondent-07", "respondent-11", "respondent-22", "respondent-27"]} /></article>
            <article><span>03</span><h3>No one is completely outside the change.</h3><p>Avoiding is the smallest position, with three respondents. All three are also Resisting and Shaped. They can limit their exposure, but they still depend on the systems they oppose.</p><TraceLinks ids={["respondent-01", "respondent-16", "respondent-29"]} /></article>
            <article><span>04</span><h3>People finding opportunities are rarely the ones setting institutional rules.</h3><p>Only one respondent is both Exploiting and Architecting. This may reflect a real separation, but the survey did not directly ask about profit, advantage or brokerage, so the finding remains tentative.</p><TraceLinks ids={["respondent-08", "respondent-12", "respondent-17"]} /></article>
          </div>
        </section>

        <section className="areas-analysis-section" id="vulnerabilities">
          <header className="areas-analysis-head"><div><p className="eyebrow">03 · Where positions may be fragile</p><h2>Local action depends on decisions and resources from elsewhere.</h2></div><p>Respondents may be active inside their institutions while still depending on outside software, funding, policy and authority.</p></header>
          <div className="areas-insight-grid areas-insight-grid--three">
            <article><span>01</span><h3>Local change-makers depend on outside support.</h3><p>Guidelines, committees and strategies can guide an institution, but imposed software, funding pressure and cuts can quickly limit what they achieve.</p><TraceLinks ids={["respondent-07", "respondent-22", "respondent-27", "respondent-35"]} /></article>
            <article><span>02</span><h3>Resistance lacks formal backing.</h3><p>Four of the five Resisting respondents are also Shaped. The evidence shows personal refusal, informal advocacy and networks—not regulatory power or coordinated institutional opposition.</p><TraceLinks ids={["respondent-01", "respondent-06", "respondent-16", "respondent-29", "respondent-38"]} /></article>
            <article><span>03</span><h3>Staying outside the change is difficult.</h3><p>The three Avoiding respondents still depend on the technologies and power structures they seek to limit. They are setting boundaries, not building fully independent alternatives.</p><TraceLinks ids={["respondent-01", "respondent-16", "respondent-29"]} /></article>
            <article><span>04</span><h3>Some constrained actors are already organising.</h3><p>Informal coalitions, peer groups, regular meetings and cross-field expertise could help people move from adapting to influencing decisions.</p><TraceLinks ids={["respondent-06", "respondent-21", "respondent-26", "respondent-36"]} /></article>
          </div>
        </section>

        <section className="areas-analysis-section" id="coalitions">
          <header className="areas-analysis-head"><div><p className="eyebrow">04 · Possible connections</p><h2>Different positions can still share practical interests.</h2></div><p>The same issue can connect people who are building, resisting, finding opportunities, stepping away or adapting.</p></header>
          <div className="areas-coalition-layout">
            <div className="areas-coalition-list">
              <article><h3>People who build formal plans + peer networks</h3><p>Both groups want early signs of change to influence decisions. The survey shows formal planning on one side and informal discussion on the other, but it does not show a reliable way of connecting them.</p><TraceLinks ids={["respondent-11", "respondent-22", "respondent-06", "respondent-21", "respondent-26"]} /></article>
              <article><h3>People who set AI boundaries + people who write rules and curricula</h3><p>These groups deal with the same issue from different positions. One identifies harms and sets limits; the other decides how AI enters teaching and institutional practice.</p><TraceLinks ids={["respondent-16", "respondent-29", "respondent-07", "respondent-27"]} /></article>
              <article><h3>People who see opportunities + people who set institutional rules</h3><p>This connection is mostly missing. Respondents 12 and 17 describe market or partnership opportunities, while most Architecting respondents focus on internal rules and processes. Only Respondent 08 appears in both groups, which is too little evidence to claim a wider alliance.</p><TraceLinks ids={["respondent-08", "respondent-12", "respondent-17"]} /></article>
            </div>
            <aside className="areas-overlap-table" aria-label="Observed overlaps between AREAS positions"><p className="eyebrow">Observed overlaps</p><h3>Where positions meet</h3><dl><div><dt>Architecting + Shaped</dt><dd>10</dd></div><div><dt>Resisting + Shaped</dt><dd>4</dd></div><div><dt>Resisting + Avoiding</dt><dd>3</dd></div><div><dt>Avoiding + Shaped</dt><dd>3</dd></div><div><dt>Exploiting + Shaped</dt><dd>2</dd></div><div><dt>Architecting + Resisting</dt><dd>1</dd></div><div><dt>Architecting + Exploiting</dt><dd>1</dd></div><div><dt>Resisting + Exploiting</dt><dd>1</dd></div><div><dt>Exploiting + Avoiding</dt><dd>1</dd></div><div><dt>Architecting + Avoiding</dt><dd>0</dd></div></dl><p>All ten pairwise combinations are shown. Counts refer to respondent records coded in both positions.</p></aside>
          </div>
        </section>
      </section>

      <section className="areas-position-list" aria-label="Five AREAS position analyses">
        <header className="areas-evidence-intro"><p className="eyebrow">05 · Position details</p><h2>Scan first. Expand when needed.</h2><p>Open a position for its interpretation, respondent quotations and complete coding evidence.</p></header>
        {areasData.positions.map((position, index) => <details className={`areas-position areas-position--${position.key}`} id={position.key} key={position.key}>
          <summary className="areas-position-summary">
            <span className="areas-summary-letter" aria-hidden="true">{position.label[0]}</span>
            <div className="areas-summary-copy"><p className="eyebrow">Position {String(index + 1).padStart(2, "0")} of 05</p><h2>{position.label}</h2><p>{position.definition}</p></div>
            <div className="areas-position-count"><strong>{position.percent}%</strong><span>{position.count} of {areasData.respondentCount}</span><em>Expand details</em></div>
          </summary>
          <div className="areas-position-body">
            <div className="areas-position-intro"><div><p className="areas-recognition"><strong>Look for</strong>{position.recognition}</p><p className="areas-scale"><strong>Observed scale</strong>{position.scale}</p></div><div className="areas-analysis">{position.analysis.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
            <h3 className="areas-quote-heading">Respondent examples</h3>
            <p className="areas-quote-intro">Hover over or focus a quotation to preview all three written answers from that respondent.</p>
            <div className="areas-quote-grid">{position.quotes.map((quote) => <AreasQuoteCard quote={quote} key={`${position.key}-${quote.respondentId}`} />)}</div>
            <details className="areas-evidence"><summary><span>Verify the coding evidence</span><strong>{position.evidence.length} respondent records</strong></summary><div><p>Each row shows the passage used for this position. Excerpts are shortened with ellipses where shown; spelling and wording otherwise follow the response. Follow a respondent link to read all three answers in context.</p><ul>{position.evidence.map((item) => <li key={`${position.key}-${item.respondentId}`}><div><span>{item.question}</span><q>{item.excerpt}</q></div><a href={respondentLink(item.respondentId)}>{item.respondentLabel} <span aria-hidden="true">→</span></a></li>)}</ul></div></details>
          </div>
        </details>)}
      </section>

      <section className="areas-blind-spots" id="blind-spots">
        <header className="areas-analysis-head"><div><p className="eyebrow">06 · What the survey cannot show</p><h2>The most powerful actors are missing from the responses.</h2></div><p>These limits affect what we can conclude from the AREAS analysis.</p></header>
        <div className="areas-blind-grid">
          <article><h3>The main decision-makers are missing.</h3><p>Platforms, ministries, funders, regulators, accreditors and governing boards are mentioned, but they did not answer the survey. We therefore do not know how they understand the change or why they make their decisions.</p></article>
          <article><h3>No senior executives answered.</h3><p>The responses tell us more about noticing change and acting locally than about budgets, formal authority or organisation-wide decisions.</p></article>
          <article><h3>One response does not represent a whole institution.</h3><p>Anonymity protects respondents, but it also prevents us from checking whether several people come from the same institution or whether a personal action reflects official policy.</p></article>
          <article><h3>Several kinds of change are combined.</h3><p>AI, funding pressure, war, climate disruption and political change interact, but different actors shape each one. A respondent may help set rules in one area while adapting to decisions made elsewhere in another.</p></article>
          <article><h3>The survey did not ask equally about all five positions.</h3><p>It asked about concerns, ways of noticing change and institutional practice. It did not directly ask who profits, blocks change, builds alternatives or controls infrastructure. Exploiting, Resisting and Avoiding may therefore appear less often than they really occur.</p></article>
          <article><h3>The coding involves judgement.</h3><p>This is one AI-assisted reading of self-reported answers. No second researcher, respondent review or outside evidence was used. The evidence lists make the reasoning checkable, but they do not make it objective.</p></article>
        </div>
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

        <div className="areas-source"><p className="eyebrow">Framework source</p><h3>The Five Positions in AREAS</h3><p>Definitions and recognition patterns were adapted from the 10F Consortium’s open AREAS framework. The source stresses that positions are relational, can overlap and shift, and describe what actors do rather than who they are.</p><a href="https://www.10fconsortium.org/areas">Read the AREAS framework at 10F Consortium <span aria-hidden="true">↗</span></a></div>
      </section>
    </main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>AREAS analysis · 38 substantive responses</span></div><p><a href={sitePath("/")}>Return to the overview</a> · <a href={sitePath("/all-answers/")}>Read all written answers</a> · <a href={sitePath("/methods/")}>Methods and limits</a></p></footer>
  </>;
}
