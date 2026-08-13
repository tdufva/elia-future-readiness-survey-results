"use client";

import { useMemo, useState } from "react";
import DataUnlock from "../data-unlock";
import { useSurveyData } from "../survey-data";

export default function AllAnswersExplorer() {
  const { data, loading, locked, error, unlock } = useSurveyData();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [age, setAge] = useState("all");
  const [role, setRole] = useState("all");

  const filters = useMemo(() => {
    const respondents = data?.respondents ?? [];
    return {
      countries: [...new Set(respondents.map((respondent) => respondent.country))].sort(),
      ages: [...new Set(respondents.map((respondent) => respondent.age))].sort(),
      roles: [...new Set(respondents.flatMap((respondent) => respondent.roles))].sort(),
    };
  }, [data]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return (data?.respondents ?? []).filter((respondent) => {
      const searchable = [respondent.label, respondent.country, respondent.age, ...respondent.roles, ...respondent.answers.map((answer) => answer.text)].join(" ").toLocaleLowerCase();
      return (!normalized || searchable.includes(normalized))
        && (country === "all" || respondent.country === country)
        && (age === "all" || respondent.age === age)
        && (role === "all" || respondent.roles.includes(role));
    });
  }, [age, country, data, query, role]);

  const reset = () => {
    setQuery("");
    setCountry("all");
    setAge("all");
    setRole("all");
  };

  if (locked) return <div className="all-answers-shell"><DataUnlock error={error} loading={loading} onUnlock={unlock} /></div>;
  if (loading || !data) return <div className="all-answers-shell voice-loading" aria-live="polite">Loading the protected written answers…</div>;

  return <div className="all-answers-shell">
    <div className="raw-toolbar" aria-label="Search and filter respondent answers">
      <label className="raw-search"><span>Search all answers</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search respondent text or profile" /></label>
      <label><span>Country</span><select value={country} onChange={(event) => setCountry(event.target.value)}><option value="all">All countries</option>{filters.countries.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Age</span><select value={age} onChange={(event) => setAge(event.target.value)}><option value="all">All age groups</option>{filters.ages.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Position</span><select value={role} onChange={(event) => setRole(event.target.value)}><option value="all">All positions</option>{filters.roles.map((value) => <option key={value}>{value}</option>)}</select></label>
    </div>

    <div className="raw-results-line" aria-live="polite"><p><strong>{visible.length}</strong> of {data.respondentCount} respondents shown · {visible.length * 3} written answers</p><button type="button" onClick={reset}>Clear search and filters</button></div>

    <div className="respondent-list">
      {visible.map((respondent) => <article className="raw-respondent" id={respondent.id} key={respondent.id}>
        <header><div><p className="eyebrow">{respondent.label}</p><h2>{respondent.country} · {respondent.age}</h2></div><a className="text-link" href={`../respondents/?respondent=${respondent.id}`}>Open respondent page <span aria-hidden="true">→</span></a></header>
        <dl className="respondent-stats"><div><dt>Country</dt><dd>{respondent.country}</dd></div><div><dt>Age group</dt><dd>{respondent.age}</dd></div><div><dt>Position</dt><dd>{respondent.roles.join(", ")}</dd></div></dl>
        <div className="raw-answer-grid">{respondent.answers.map((answer, index) => <section key={answer.key}><div className="raw-question-number">Question {String(index + 1).padStart(2, "0")}</div><h3>{answer.question}</h3><p>{answer.text}</p></section>)}</div>
      </article>)}
    </div>
    {visible.length === 0 && <div className="no-results"><h3>No respondents match these filters.</h3><button type="button" onClick={reset}>Clear search and filters</button></div>}
  </div>;
}
