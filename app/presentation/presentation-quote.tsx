"use client";

import { useSurveyData } from "../survey-data";

export default function PresentationQuote({ entryId, text, question }: { entryId: string; text: string; question: string }) {
  const { data } = useSurveyData();
  const respondentId = data?.voiceIndex[entryId];
  const respondent = data?.respondents.find((item) => item.id === respondentId);
  const answersHref = respondentId ? `../all-answers/#${respondentId}` : "../all-answers/";

  return <blockquote className="presentation-quote">
    <p>“{text}”</p>
    <footer><div><span>Quote from an anonymous survey respondent · excerpt</span><small>{question}</small></div><a href={answersHref}>{respondent ? `Find ${respondent.label} in All answers` : "Open All answers"} <span aria-hidden="true">→</span></a></footer>
  </blockquote>;
}
