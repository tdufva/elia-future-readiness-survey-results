"use client";

import { useSurveyData } from "../survey-data";

type AreasQuote = {
  respondentId: string;
  respondentLabel: string;
  question: string;
  text: string;
};

export default function AreasQuoteCard({ quote }: { quote: AreasQuote }) {
  const { data } = useSurveyData();
  const respondent = data?.respondents.find((item) => item.id === quote.respondentId);

  return <blockquote className="areas-quote" tabIndex={0}>
    <p>“{quote.text}”</p>
    <footer>
      <span>Quote from an anonymous survey respondent · excerpt from {quote.question}</span>
      <span className="areas-quote-hint">Hover or focus to preview all three answers</span>
      <div className="areas-quote-links"><a href={`../respondents/?respondent=${quote.respondentId}`}>Open {quote.respondentLabel} <span aria-hidden="true">→</span></a><a href={`../all-answers/#${quote.respondentId}`}>All answers page <span aria-hidden="true">→</span></a></div>
    </footer>
    {respondent && <aside className="areas-respondent-popover" aria-label={`All written answers from ${respondent.label}`}>
      <header><div><span>Anonymous respondent</span><h4>{respondent.label}</h4></div><small>{respondent.country} · {respondent.age} · {respondent.roles.join(", ")}</small></header>
      <div className="areas-popover-answers">{respondent.answers.map((answer, index) => <section key={answer.key}><span>Question {String(index + 1).padStart(2, "0")} · {answer.shortLabel}</span><p>{answer.text}</p></section>)}</div>
      <footer><a href={`../respondents/?respondent=${respondent.id}`}>Open this respondent’s page <span aria-hidden="true">→</span></a><a href={`../all-answers/#${respondent.id}`}>Find them on All answers <span aria-hidden="true">→</span></a></footer>
    </aside>}
  </blockquote>;
}
