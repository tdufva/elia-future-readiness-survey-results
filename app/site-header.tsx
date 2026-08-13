import LockButton from "./lock-button";
import { sitePath } from "./site-path";

const overviewSections = [
  { href: "/#findings", label: "Findings" },
  { href: "/#concerns", label: "Concerns" },
  { href: "/#sensing", label: "Sensing" },
  { href: "/#practices", label: "Practices" },
  { href: "/#who", label: "Participation" },
  { href: "/all-answers/", label: "All answers" },
  { href: "/methods/", label: "Methods" },
];

export default function SiteHeader({ current }: { current?: "overview" | "voices" }) {
  return <header className="site-header">
    <div className="site-header-main">
      <a className="wordmark" href={sitePath("/")} aria-label="ELIA Future Readiness results home"><span className="wordmark-mark" aria-hidden="true">E·F</span><span>ELIA Future Readiness</span></a>
      <div className="header-actions"><nav className="primary-nav" aria-label="Main pages">
        <a className={current === "overview" ? "nav-current" : ""} aria-current={current === "overview" ? "page" : undefined} href={sitePath("/")}>Overview</a>
        <a className={current === "voices" ? "nav-current" : ""} aria-current={current === "voices" ? "page" : undefined} href={sitePath("/voices/")}>Respondent voices</a>
      </nav><LockButton /></div>
    </div>
    {current === "overview" && <nav className="overview-subnav" aria-label="Overview sections">
      <span>Overview</span>
      <div>{overviewSections.map((item) => <a key={item.href} href={sitePath(item.href)}>{item.label}</a>)}</div>
    </nav>}
  </header>;
}
