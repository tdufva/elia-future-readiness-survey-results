"use client";

import { useSyncExternalStore } from "react";
import DataUnlock from "../data-unlock";
import { useSurveyData } from "../survey-data";

export default function RespondentReader() {
  const { data, loading, locked, error, unlock } = useSurveyData();
  const respondentId = useSyncExternalStore(
    () => () => undefined,
    () => new URLSearchParams(window.location.search).get("respondent") ?? "",
    () => "",
  );

  if (locked) return <div className="respondent-reader"><DataUnlock error={error} loading={loading} onUnlock={unlock} /></div>;
  if (loading || !data || !respondentId) return <div className="respondent-reader voice-loading" aria-live="polite">Loading the respondent’s answers…</div>;

  const respondentIndex = data.respondents.findIndex((item) => item.id === respondentId);
  const respondent = data.respondents[respondentIndex];
  if (!respondent) return <div className="respondent-reader"><div className="no-results"><h2>Respondent not found.</h2><a href="../all-answers/">Browse all written answers</a></div></div>;

  const previous = data.respondents[(respondentIndex - 1 + data.respondents.length) % data.respondents.length];
  const next = data.respondents[(respondentIndex + 1) % data.respondents.length];

  return <div className="respondent-reader">
    <nav className="respondent-pagination" aria-label="Respondent navigation"><a href={`?respondent=${previous.id}`}><span aria-hidden="true">←</span> {previous.label}</a><a href="../all-answers/">All respondents</a><a href={`?respondent=${next.id}`}>{next.label} <span aria-hidden="true">→</span></a></nav>
    <header className="respondent-profile-head"><div><p className="eyebrow">Anonymous survey record</p><h1>{respondent.label}</h1></div><dl className="respondent-stats"><div><dt>Country</dt><dd>{respondent.country}</dd></div><div><dt>Age group</dt><dd>{respondent.age}</dd></div><div><dt>Position</dt><dd>{respondent.roles.join(", ")}</dd></div></dl></header>
    <div className="respondent-answer-stack">{respondent.answers.map((answer, index) => <article key={answer.key}><div className="raw-question-number">Open-ended question {String(index + 1).padStart(2, "0")}</div><h2>{answer.question}</h2><blockquote><p>{answer.text}</p></blockquote><a href={`../voices/#question-selector`}>Explore this question by theme <span aria-hidden="true">→</span></a></article>)}</div>
    <nav className="respondent-pagination respondent-pagination--bottom" aria-label="More respondents"><a href={`?respondent=${previous.id}`}><span aria-hidden="true">←</span> Previous</a><a href="../all-answers/">Back to all answers</a><a href={`?respondent=${next.id}`}>Next <span aria-hidden="true">→</span></a></nav>
  </div>;
}
