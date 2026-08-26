import { AgeChart, CountryMap } from "./participation-charts";
import SiteHeader from "./site-header";
import { sitePath } from "./site-path";

type Datum = { label: string; count: number; percent: number; definition?: string };

const concerns: Datum[] = [
  { label: "Future of arts education and creative practice", count: 22, percent: 58, definition: "Curriculum, learning, artistic research or practice, creative work, and the societal role of arts institutions." },
  { label: "Social cohesion, equity and human values", count: 16, percent: 42, definition: "Belonging, community, diversity, inclusion, inequality, connection, peace, rights or humanistic values." },
  { label: "Politics, conflict and democratic pressure", count: 15, percent: 39, definition: "War, safety, political polarisation, nationalism, far-right influence, democracy, human rights or policy pressure." },
  { label: "AI, technology and digital change", count: 14, percent: 37, definition: "Explicit attention to AI, digital systems, social media, surveillance or information technology." },
  { label: "Adaptation and uncertainty", count: 9, percent: 24, definition: "Unpredictability, VUCA conditions, future-making, openness to change or uncertainty used as a resource." },
  { label: "Climate, ecology and liveability", count: 8, percent: 21, definition: "Climate change, ecological sustainability, biodiversity or liveable environments." },
  { label: "Funding, legitimacy and institutional pressure", count: 7, percent: 18, definition: "Pressure to justify the arts, funding insecurity, institutional survival or employability metrics." },
];

const sensing: Datum[] = [
  { label: "Reading, research and media", count: 28, percent: 74, definition: "News, publications, reports, policy documents, research, exhibitions, broadcasts or other published sources." },
  { label: "Dialogue and professional networks", count: 26, percent: 68, definition: "Conversation with colleagues, peers, partners, communities, professional groups or conference networks." },
  { label: "Listening to students and younger generations", count: 12, percent: 32, definition: "Students, learners or younger people used as sources of insight about emerging change." },
  { label: "Embodied, reflective and creative sensing", count: 8, percent: 21, definition: "Feeling, journaling, writing, making or reflecting on lived experience as a way to sense change." },
  { label: "Information overload or no structured method", count: 4, percent: 11, definition: "An explicit lack of method, difficulty keeping up, or desire for a more systematic practice." },
];

const practices: Datum[] = [
  { label: "Recurring dialogue and collective reflection", count: 31, percent: 82, definition: "Meetings, forums, retreats, workshops, consultations, discussion or shared reflection." },
  { label: "Informal, reactive or absent routines", count: 18, percent: 47, definition: "Practices described as informal, limited, late, momentum-driven, difficult to address, absent or primarily reactive." },
  { label: "External networks, partnerships and projects", count: 14, percent: 37, definition: "Professional associations, cross-institutional partners, research networks, grants or external stakeholders." },
  { label: "Student and young-person voice", count: 9, percent: 24, definition: "Students or younger people explicitly engaged in dialogue, consultation or co-creation." },
  { label: "Curriculum, learning and capability adaptation", count: 8, percent: 21, definition: "Courses, curricula, teaching practices, guidance or learning provision adjusted in response to change." },
  { label: "Formal foresight, strategy and quality processes", count: 8, percent: 21, definition: "Explicit future workshops, horizon scanning, observatories, multi-year projections, future strategy or structured governance and quality cycles." },
];

const roles: Datum[] = [
  { label: "Teacher / professor", count: 19, percent: 50 }, { label: "Researcher", count: 12, percent: 32 },
  { label: "Middle management", count: 7, percent: 18 }, { label: "Student", count: 7, percent: 18 },
  { label: "Staff", count: 6, percent: 16 }, { label: "Other relationship", count: 3, percent: 8 },
  { label: "C-level management", count: 0, percent: 0 },
];
const fields: Datum[] = [
  ["Fine Art", 12, 32], ["Design", 11, 29], ["Other field", 11, 29], ["Leadership, management and support", 11, 29],
  ["Animation", 6, 16], ["Media Art", 6, 16], ["Music", 6, 16], ["Architecture", 5, 13], ["Film", 5, 13], ["Theatre", 5, 13],
  ["Creative Writing", 4, 11], ["Photography", 3, 8], ["Dance", 2, 5], ["Conservation and Restoration", 1, 3], ["Fashion", 1, 3], ["Circus", 0, 0],
].map(([label, count, percent]) => ({ label: label as string, count: count as number, percent: percent as number }));

function BarChart({ data, label, compact = false }: { data: Datum[]; label: string; compact?: boolean }) {
  return <div className={`bars${compact ? " bars--compact" : ""}`} role="img" aria-label={label}>{data.map((item) => <div className="bar-row" key={item.label}>
    <span className="bar-label">{item.label}</span><span className="bar-track" aria-hidden="true"><span className="bar-fill" style={{ width: `${item.percent}%` }} /></span>
    <span className="bar-value"><strong>{item.percent}%</strong><small>{item.count} of 38</small></span>
  </div>)}</div>;
}
function ThemeDefinitions({ data }: { data: Datum[] }) {
  return <details className="definitions"><summary>How these themes were defined</summary><dl>{data.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.definition}</dd></div>)}</dl></details>;
}
function SectionHead({ index, eyebrow, title, children }: { index: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return <header className="section-head"><div className="section-index" aria-hidden="true">{index}</div><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children}</div></header>;
}

export default function Home() {
  return <>
    <a className="skip-link" href="#main-content">Skip to results</a>
    <SiteHeader current="overview" />
    <main id="main-content">
      <section className="hero" id="top" aria-labelledby="page-title"><div className="hero-copy"><p className="eyebrow">Survey results</p><h1 id="page-title">ELIA Future Readiness Survey Results</h1><p className="standfirst">Arts communities are looking outward with urgency. Their most common readiness practice is conversation; the opportunity is to turn that collective intelligence into deliberate, sustained foresight.</p><p className="collection-note">Responses collected July–August 2026 · Updated export 25 August 2026 · Analysis updated 26 August 2026</p></div>
        <aside className="scope-card" aria-label="Survey scope"><p className="eyebrow">Who is in this view</p><div className="scope-grid"><div><strong>38</strong><span>substantive responses</span></div><div><strong>18</strong><span>countries represented</span></div></div><p><strong>3 test submissions excluded.</strong> Percentages use 38 as their base; counts are shown with every percentage.</p></aside>
      </section>
      <section className="reading-note" aria-label="How to read this report"><p className="eyebrow">Read this first</p><p>This is a snapshot of the people who answered, not an estimate for the whole ELIA community. Themes overlap because one response can hold several concerns or practices at once.</p></section>

      <section className="section section--findings" id="findings"><SectionHead index="01" eyebrow="Overview" title="Three findings organise the picture."><p className="section-intro">Together, the responses show how cultural, technical and civic questions are being noticed and navigated.</p></SectionHead>
        <div className="finding-grid">
          <article className="finding-card finding-card--mint"><span className="finding-number">01</span><h3>The future is cultural, technical and civic at once.</h3><div className="finding-summary"><p>Arts education and creative practice led the concerns, while social cohesion, political pressure and AI appeared as closely connected forces—not separate lanes. Respondents were not simply asking how arts institutions should adopt new technologies. They were asking what and how people will learn, create and participate amid democratic strain, conflict, changing working conditions and ecological uncertainty.</p><p>This overlap matters because a decision about AI, curriculum or artistic work can also affect authorship, employment, access, human connection and the public role of the arts. The responses therefore point towards a joined-up view of the future: cultural, technical and civic choices need to be considered together, including their consequences for different people and communities.</p></div><blockquote className="respondent-quote"><p>“I am interested in/concerned about how AI will influence creative practices and our perception of the world … I am also very concerned with how the arts will be perceived in times of conflict, war, climate change, far-right extremism.”</p><cite>Quote from an anonymous survey respondent · excerpt</cite></blockquote><div className="mini-stats" aria-label="Leading concern themes"><span><strong>58%</strong> arts education</span><span><strong>42%</strong> social cohesion</span><span><strong>39%</strong> politics &amp; conflict</span></div></article>
          <article className="finding-card finding-card--pink"><span className="finding-number">02</span><h3>People sense change through information and relationships.</h3><div className="finding-summary"><p>Reading and research were widespread, but dialogue with peers, partners and students was nearly as central. Respondents combined reports, news and published research with conversations that bring professional experience, local knowledge and the perspectives of younger generations into view. Foresight here is social infrastructure as much as an analytical technique.</p><p>In practice, the ability to notice change depends not only on access to information, but also on trusted relationships, time to compare interpretations and spaces where different experiences can meet. Institutions can strengthen this capacity by connecting what people notice across roles and networks, then giving those signals a clear route into shared learning and planning.</p></div><blockquote className="respondent-quote"><p>“I read the news locally and internationally at least once a day, and try to keep abreast of what my peers/colleagues/students are discussing.”</p><cite>Quote from an anonymous survey respondent</cite></blockquote><div className="mini-stats" aria-label="Leading sensing practices"><span><strong>74%</strong> reading &amp; research</span><span><strong>68%</strong> dialogue &amp; networks</span></div></article>
          <article className="finding-card finding-card--blue"><span className="finding-number">03</span><h3>Conversation is common; formal foresight is not.</h3><div className="finding-summary"><p>Collective reflection appeared in most accounts: 31 of 38 respondents mentioned recurring dialogue, meetings or workshops. Only eight described formal foresight, strategy or quality processes, while 18 also named routines that were informal, reactive or absent. These categories overlap, so an institution can host valuable conversations and still lack a consistent way to carry insights forward.</p><p>The gap is not an absence of attention or care. It is the step from reflection to an institutional capability with protected time, clear ownership, documentation and a route into decisions. Formalising that step need not mean adding heavy bureaucracy; even a simple, repeatable rhythm for gathering signals, testing interpretations and revisiting choices could make existing collective intelligence more durable.</p></div><blockquote className="respondent-quote"><p>“No habitual routine … but I have an informal group with two fellow research students where we meet once a month.”</p><cite>Quote from an anonymous survey respondent · excerpt</cite></blockquote><div className="mini-stats" aria-label="Leading institutional practice themes"><span><strong>82%</strong> collective reflection</span><span><strong>21%</strong> formal foresight</span><span><strong>47%</strong> informal or reactive</span></div></article>
        </div>
        <div className="voices-cta"><div><p className="eyebrow">Read in context</p><h3>Explore the written answers behind the themes.</h3><p>Navigate all three open questions by theme, view respondent profiles and follow each voice across all three answers.</p></div><a className="button-link" href={sitePath("/voices/")}>Browse respondent voices <span aria-hidden="true">→</span></a></div>
      </section>

      <section className="section section--data" id="concerns"><SectionHead index="02" eyebrow="Future concerns" title="What is claiming attention now?"><p className="section-intro">Coding of “What are your interests/concerns regarding the future?” Themes are non-exclusive.</p></SectionHead><div className="chart-layout"><BarChart data={concerns} label="Concern themes: arts education and creative practice 22 of 38 or 58 percent; social cohesion, equity and human values 16 or 42 percent; politics, conflict and democratic pressure 15 or 39 percent; AI, technology and digital change 14 or 37 percent; adaptation and uncertainty 9 or 24 percent; climate, ecology and liveability 8 or 21 percent; funding, legitimacy and institutional pressure 7 or 18 percent." /><aside className="interpretation-note"><p className="eyebrow">Interpretation</p><p>Technology is prominent, but it is not the whole story. Respondents tied future readiness to learning, artistic practice, democracy, war, human connection, institutional legitimacy and ecology.</p></aside></div><ThemeDefinitions data={concerns} /></section>

      <section className="section section--data" id="sensing"><SectionHead index="03" eyebrow="Personal sensing" title="How do respondents notice change?"><p className="section-intro">Coding of habits used to track emerging changes, trends and uncertainties. Themes are non-exclusive.</p></SectionHead><div className="chart-layout"><BarChart data={sensing} label="Personal sensing themes: reading, research and media 28 of 38 or 74 percent; dialogue and professional networks 26 or 68 percent; listening to students and younger generations 12 or 32 percent; embodied, reflective and creative sensing 8 or 21 percent; information overload or no structured method 4 or 11 percent." /><aside className="interpretation-note interpretation-note--green"><p className="eyebrow">Interpretation</p><p>Published knowledge and lived knowledge work together. Reports, news and research sit alongside conversations, student insight, making, feeling and reflection.</p></aside></div><ThemeDefinitions data={sensing} /></section>

      <section className="section section--data" id="practices"><SectionHead index="04" eyebrow="Institutional practice" title="How does readiness currently happen?"><p className="section-intro">Coding of regular team and institutional practices. Categories can coexist—even within the same response.</p></SectionHead><div className="chart-layout"><BarChart data={practices} label="Institutional practice themes: recurring dialogue and collective reflection 31 of 38 or 82 percent; informal, reactive or absent routines 18 or 47 percent; external networks, partnerships and projects 14 or 37 percent; student and young-person voice 9 or 24 percent; curriculum, learning and capability adaptation 8 or 21 percent; formal foresight, strategy and quality processes 8 or 21 percent." /><aside className="interpretation-note interpretation-note--gold"><p className="eyebrow">Read the overlap</p><p><strong>82% and 47% are not a contradiction.</strong> The same institution can host rich conversations while lacking protected time, a repeatable method or a route from signals into decisions.</p></aside></div><ThemeDefinitions data={practices} /></section>

      <section className="section section--who" id="who"><SectionHead index="05" eyebrow="Participation" title="Whose perspectives shape this snapshot?"><p className="section-intro">Role and field were multi-select questions. Age is grouped into broader bands, and the country map shows presence rather than frequency.</p></SectionHead>
        <div className="participation-role"><article><h3>Relationship to institution</h3><BarChart compact data={roles} label="Relationships: teacher or professor 19 of 38; researcher 12; middle management 7; student 7; staff 6; other relationship 3; C-level management 0." /></article><aside className="absence-note absence-note--compact"><div><p className="eyebrow">A visible absence</p><h3>No C-level respondents</h3></div><p>Teachers and professors form the largest role group, while no included respondent selected C-level management. That shapes how institutional readiness can be interpreted.</p></aside></div>
        <div className="participation-visuals"><article className="participation-block"><div className="participation-block-head"><p className="eyebrow">Geographic reach</p><h3>18 countries represented</h3><p>Current country of work, study or residence.</p></div><CountryMap /></article><AgeChart /></div>
        <details className="field-list"><summary>See all fields of work, teaching, research or study</summary><ul>{fields.map((item) => <li key={item.label}><span>{item.label}</span><strong>{item.count} <small>({item.percent}%)</small></strong></li>)}</ul></details>
        <div className="absence-note"><p className="eyebrow">Limits to intersectional reading</p><p>The workbook contains no sex, gender, disability or institution-type variables. Those absences limit whose power and experiences can be examined, and no values have been inferred from names or open-text answers.</p></div>
      </section>

    </main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>38 substantive responses · 18 countries · July–August 2026</span></div><p><a href={sitePath("/all-answers/")}>Read all written answers</a> · <a href={sitePath("/methods/")}>Methods, ethics and limits</a></p></footer>
  </>;
}
