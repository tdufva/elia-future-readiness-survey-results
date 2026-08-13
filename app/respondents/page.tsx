import type { Metadata } from "next";
import SiteHeader from "../site-header";
import { sitePath } from "../site-path";
import RespondentReader from "./respondent-reader";

export const metadata: Metadata = {
  title: "Respondent answers · ELIA Future Readiness Survey Results",
  description: "Read all three written answers from one anonymous survey respondent.",
};

export default function RespondentsPage() {
  return <>
    <a className="skip-link" href="#respondent-content">Skip to respondent answers</a>
    <SiteHeader />
    <main id="respondent-content"><RespondentReader /></main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>Anonymous respondent record · protected view</span></div><p><a href={sitePath("/all-answers/")}>Browse all written answers</a> · <a href={sitePath("/methods/")}>Methods, ethics and limits</a></p></footer>
  </>;
}
