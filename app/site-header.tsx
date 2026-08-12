import Link from "next/link";

const overviewSections = [
  { href: "/#findings", label: "Findings" },
  { href: "/#concerns", label: "Concerns" },
  { href: "/#sensing", label: "Sensing" },
  { href: "/#practices", label: "Practices" },
  { href: "/#who", label: "Participation" },
  { href: "/#next", label: "Discussion agenda" },
  { href: "/#methods", label: "Methods" },
];

export default function SiteHeader({ current }: { current: "overview" | "voices" }) {
  return <header className="site-header">
    <div className="site-header-main">
      <Link className="wordmark" href="/" aria-label="ELIA Future Readiness results home"><span className="wordmark-mark" aria-hidden="true">E·F</span><span>ELIA Future Readiness</span></Link>
      <nav className="primary-nav" aria-label="Main pages">
        <Link className={current === "overview" ? "nav-current" : ""} aria-current={current === "overview" ? "page" : undefined} href="/">Overview</Link>
        <Link className={current === "voices" ? "nav-current" : ""} aria-current={current === "voices" ? "page" : undefined} href="/voices">Respondent voices</Link>
      </nav>
    </div>
    {current === "overview" && <nav className="overview-subnav" aria-label="Overview sections">
      <span>Overview</span>
      <div>{overviewSections.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
    </nav>}
  </header>;
}
