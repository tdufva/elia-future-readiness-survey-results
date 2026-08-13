import type { Metadata } from "next";
import SiteHeader from "../site-header";
import { sitePath } from "../site-path";
import AllAnswersExplorer from "./all-answers-explorer";

const siteUrl = "https://tdufva.github.io/elia-future-readiness-survey-results/all-answers/";

export const metadata: Metadata = {
  title: "All written answers · ELIA Future Readiness Survey Results",
  description: "Read all three original written answers grouped by anonymous respondent.",
  alternates: { canonical: siteUrl },
};

export default function AllAnswersPage() {
  return <>
    <a className="skip-link" href="#all-answers-content">Skip to all written answers</a>
    <SiteHeader current="answers" />
    <main id="all-answers-content">
      <section className="subpage-hero subpage-hero--raw"><div><p className="eyebrow">Protected raw-data reader</p><h1>All written answers</h1><p className="standfirst">Read the original wording of all 102 open-ended answers, grouped by anonymous respondent. Search the text or filter the profiles to move through the data.</p></div><aside className="scope-card"><p className="eyebrow">What is included</p><div className="scope-grid"><div><strong>34</strong><span>respondents</span></div><div><strong>102</strong><span>written answers</span></div></div><p>Names, source respondent IDs, timestamps, IP addresses and email fields are not included.</p></aside></section>
      <section className="raw-caution"><p className="eyebrow">Handle with care</p><p>Country, age group, position and unedited answer text can combine to identify people. This view is encrypted and intended only for readers who have been given the password.</p></section>
      <AllAnswersExplorer />
    </main>
    <footer className="footer"><div><strong>ELIA Future Readiness Survey Results</strong><span>All written answers · protected view</span></div><p><a href={sitePath("/voices/")}>Return to respondent voices</a> · <a href={sitePath("/methods/")}>Methods, ethics and limits</a></p></footer>
  </>;
}
