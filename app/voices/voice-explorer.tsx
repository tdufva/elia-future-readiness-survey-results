"use client";

import { useMemo, useState } from "react";
import DataUnlock from "../data-unlock";
import { type Respondent, useSurveyData } from "../survey-data";

export type Theme = {
  key: string;
  label: string;
  definition: string;
  count: number;
};

export type VoiceEntry = {
  id: string;
  text: string;
  themes: string[];
  redacted: boolean;
  withheld: boolean;
};

export type VoiceSection = {
  key: string;
  shortLabel: string;
  title: string;
  themes: Theme[];
  entries: VoiceEntry[];
};

function VoiceCard({ entry, themes, respondent }: { entry: VoiceEntry; themes: Theme[]; respondent?: Respondent }) {
  const entryThemes = entry.themes
    .map((key) => themes.find((theme) => theme.key === key))
    .filter((theme): theme is Theme => Boolean(theme));

  return <article className={`voice-card${entry.withheld ? " voice-card--withheld" : ""}`}>
    <div className="voice-card-head">
      <span>{entry.withheld ? "Answer withheld for privacy" : "Quote from an anonymous survey respondent"}</span>
      {entry.redacted && <span className="privacy-badge">{entry.withheld ? "Withheld" : "Lightly redacted"}</span>}
    </div>
    {entry.withheld
      ? <p className="withheld-copy">{entry.text}</p>
      : <blockquote><p>“{entry.text}”</p></blockquote>}
    {entryThemes.length > 0 && <ul className="voice-tags" aria-label="Themes assigned to this answer">
      {entryThemes.map((theme) => <li key={theme.key}>{theme.label}</li>)}
    </ul>}
    {respondent && <div className="voice-profile">
      <a className="voice-profile-trigger" href={`../respondents/?respondent=${respondent.id}`} aria-label={`See all answers from ${respondent.label}`}>
        Respondent profile <span aria-hidden="true">→</span>
      </a>
      <aside className="respondent-popover" aria-label={`${respondent.label} statistics`}>
        <p>{respondent.label}</p>
        <dl><div><dt>Country</dt><dd>{respondent.country}</dd></div><div><dt>Age</dt><dd>{respondent.age}</dd></div><div><dt>Position</dt><dd>{respondent.roles.join(", ")}</dd></div></dl>
        <a href={`../respondents/?respondent=${respondent.id}`}>See all answers from this respondent <span aria-hidden="true">→</span></a>
      </aside>
    </div>}
  </article>;
}

export default function VoiceExplorer({ sections }: { sections: VoiceSection[] }) {
  const { data, loading, locked, error, unlock } = useSurveyData();
  const [activeQuestion, setActiveQuestion] = useState(sections[0].key);
  const [activeTheme, setActiveTheme] = useState("all");
  const [query, setQuery] = useState("");
  const activeSection = sections.find((section) => section.key === activeQuestion) ?? sections[0];
  const activeQuestionIndex = sections.findIndex((section) => section.key === activeSection.key);
  const respondentsById = useMemo(() => new Map(data?.respondents.map((respondent) => [respondent.id, respondent]) ?? []), [data]);

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return activeSection.entries.filter((entry) => {
      const matchesTheme = activeTheme === "all" || entry.themes.includes(activeTheme);
      const matchesQuery = !normalizedQuery || entry.text.toLocaleLowerCase().includes(normalizedQuery);
      return matchesTheme && matchesQuery;
    });
  }, [activeSection, activeTheme, query]);

  const changeQuestion = (key: string) => {
    setActiveQuestion(key);
    setActiveTheme("all");
    setQuery("");
  };

  if (locked) return <div className="voice-explorer" id="question-selector"><DataUnlock error={error} loading={loading} onUnlock={unlock} /></div>;

  return <div className="voice-explorer" id="question-selector">
    <header className="question-selector-head">
      <div><p className="eyebrow">Three open-ended questions</p><h2>Select a question to see its answers.</h2></div>
      <p>Choose one of the three numbered questions. The selected question is highlighted, and its 34 answers appear directly below.</p>
    </header>
    {loading && <p className="voice-profile-status" aria-live="polite">Loading protected respondent profiles…</p>}
    <div className="question-tabs" role="tablist" aria-label="Select one of the three open-ended survey questions">
      {sections.map((section, index) => <button
        type="button"
        role="tab"
        aria-selected={section.key === activeQuestion}
        aria-controls="voices-panel"
        id={`tab-${section.key}`}
        key={section.key}
        onClick={() => changeQuestion(section.key)}
      ><span className="question-tab-number">Question {String(index + 1).padStart(2, "0")}</span><strong>{section.shortLabel}</strong><small>{section.title}</small><em>{section.entries.length} answers</em></button>)}
    </div>

    <section
      className="voices-panel"
      id="voices-panel"
      role="tabpanel"
      aria-labelledby={`tab-${activeSection.key}`}
      tabIndex={0}
    >
      <header className="voices-panel-head">
        <div><p className="eyebrow">Selected open-ended question · {activeQuestionIndex + 1} of {sections.length}</p><h2>{activeSection.title}</h2><p className="selected-question-note">Showing the answers respondents gave to this question.</p></div>
        <label className="voice-search"><span>Search these answers</span><input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search words or phrases"
        /></label>
      </header>

      <div className="theme-filter" aria-label="Filter answers by theme">
        <button type="button" className={activeTheme === "all" ? "is-active" : ""} aria-pressed={activeTheme === "all"} onClick={() => setActiveTheme("all")}>All answers <span>{activeSection.entries.length}</span></button>
        {activeSection.themes.map((theme) => <button
          type="button"
          className={activeTheme === theme.key ? "is-active" : ""}
          aria-pressed={activeTheme === theme.key}
          title={theme.definition}
          key={theme.key}
          onClick={() => setActiveTheme(theme.key)}
        >{theme.label} <span>{theme.count}</span></button>)}
      </div>

      <div className="voice-results-line" aria-live="polite">
        <span>Question {activeQuestionIndex + 1} of {sections.length}</span><strong>{visibleEntries.length}</strong> {visibleEntries.length === 1 ? "answer" : "answers"} shown
        {activeTheme !== "all" && <button type="button" onClick={() => setActiveTheme("all")}>Clear theme filter</button>}
      </div>

      {visibleEntries.length > 0
        ? <div className="voice-grid">{visibleEntries.map((entry) => <VoiceCard key={entry.id} entry={entry} themes={activeSection.themes} respondent={data ? respondentsById.get(data.voiceIndex[entry.id]) : undefined} />)}</div>
        : <div className="no-results"><h3>No answers match this search.</h3><button type="button" onClick={() => setQuery("")}>Clear search</button></div>}
    </section>
  </div>;
}
