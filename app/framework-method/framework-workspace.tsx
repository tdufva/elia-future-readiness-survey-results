"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DataUnlock from "../data-unlock";
import { useSurveyData } from "../survey-data";
import { activeUnits, buildInitialWorkspace, reviewStateFor } from "./framework-engine";
import { CODING_PROMPT, FRAMEWORK_OUTPUT_SCHEMA, SEGMENTATION_PROMPT } from "./framework-prompts";
import {
  CLA_LAYERS,
  DATOR_ARCHETYPES,
  FUTURES_ORIENTATIONS,
  type ClaLayer,
  type CodebookEntry,
  type DatorArchetype,
  type FrameworkStage,
  type FrameworkWorkspaceState,
  type FuturesOrientation,
  type MeaningUnit,
  type ReviewDecision,
} from "./framework-types";

const STORAGE_KEY = "elia-framework-method-workspace-v1";
const STAGES: { id: FrameworkStage; step: string; label: string; process: string }[] = [
  { id: "familiarise", step: "01", label: "Familiarise", process: "Read complete responses" },
  { id: "coding", step: "02–03", label: "Segment & code", process: "Review meaning units and draft codes" },
  { id: "codebook", step: "04", label: "Codebook", process: "Develop the analytical framework" },
  { id: "matrix", step: "05–06", label: "Framework matrix", process: "Apply and chart the framework" },
  { id: "futures", step: "06", label: "Futures views", process: "Compare Dator, CLA and orientation" },
  { id: "interpret", step: "07", label: "Interpret", process: "Examine patterns, tensions and absences" },
  { id: "export", step: "↧", label: "Export", process: "Preserve the audit trail" },
];

const DATOR_COPY: Record<DatorArchetype, string> = {
  Continuation: "The current system extends: more growth, activity or familiar arrangements.",
  Collapse: "The current system breaks down or loses the capacity to continue.",
  Discipline: "Limits, rules or shared values reorganise how the system operates.",
  Transformation: "A fundamental change creates a substantially different system.",
  "Not applicable / unclear": "The exact unit does not support a defensible archetype.",
};

const CLA_COPY: Record<ClaLayer, string> = {
  Litany: "Visible events, headlines, trends or symptoms.",
  "System / social causes": "Institutions, policies, infrastructures and causal arrangements.",
  "Worldview / discourse": "Values, assumptions and ways of framing what matters.",
  "Myth / metaphor": "Deep stories, images and metaphors that organise meaning.",
};

function countBy<T extends string>(units: MeaningUnit[], getValues: (unit: MeaningUnit) => T[]) {
  const counts = new Map<T, number>();
  for (const unit of units) for (const value of new Set(getValues(unit))) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

function statusLabel(unit: MeaningUnit) {
  if (unit.reviewState === "human-reviewed") return "Human-reviewed";
  if (unit.reviewState === "human-modified") return "Human-modified";
  if (unit.reviewState === "rejected") return "Rejected";
  return "AI-assisted draft";
}

function csvCell(value: unknown) {
  let text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function DecisionButtons({ label, value, onChange }: { label: string; value: ReviewDecision; onChange: (decision: ReviewDecision) => void }) {
  return <fieldset className="fm-decision"><legend>{label}</legend><div>
    {(["accepted", "modified", "rejected"] as ReviewDecision[]).map((decision) => <button type="button" key={decision} className={value === decision ? "is-active" : ""} aria-pressed={value === decision} onClick={() => onChange(decision)}>{decision === "accepted" ? "Accept" : decision === "modified" ? "Mark modified" : "Reject"}</button>)}
  </div></fieldset>;
}

function EvidencePanel({ title, units, onClose }: { title: string; units: MeaningUnit[]; onClose: () => void }) {
  return <aside className="fm-evidence" aria-labelledby="fm-evidence-title" tabIndex={-1}>
    <header><div><p className="eyebrow">Supporting text</p><h3 id="fm-evidence-title">{title}</h3><p>{units.length} meaning {units.length === 1 ? "unit" : "units"}. Read the text before interpreting the count.</p></div><button type="button" onClick={onClose} aria-label="Close supporting text">Close</button></header>
    {units.length ? <div className="fm-evidence-list">{units.map((unit) => <article key={unit.id}><div><span className={`fm-status fm-status--${unit.reviewState}`}>{statusLabel(unit)}</span><span>{unit.questionLabel}</span></div><blockquote><p>“{unit.meaningUnitText}”</p></blockquote><footer><strong>{unit.respondentLabel}</strong><a href={`../respondents/?respondent=${unit.respondentId}`}>Open all answers <span aria-hidden="true">→</span></a></footer></article>)}</div> : <p className="fm-empty">No included meaning units occupy this cell. This is an absence in the current coding, not proof that the perspective does not exist.</p>}
  </aside>;
}

function MatrixTable({ caption, rows, columns, units, rowValues, columnValues, onEvidence }: {
  caption: string;
  rows: string[];
  columns: string[];
  units: MeaningUnit[];
  rowValues: (unit: MeaningUnit) => string[];
  columnValues: (unit: MeaningUnit) => string[];
  onEvidence: (title: string, units: MeaningUnit[]) => void;
}) {
  return <div className="fm-table-scroll" role="region" tabIndex={0} aria-label={`${caption}. Scroll horizontally to see all columns.`}><table className="fm-matrix"><caption>{caption}</caption><thead><tr><th scope="col">{caption.split(" × ")[0]}</th>{columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row}><th scope="row">{row}</th>{columns.map((column) => {
    const evidence = units.filter((unit) => rowValues(unit).includes(row) && columnValues(unit).includes(column));
    const preview = evidence[0]?.meaningUnitText;
    return <td key={column}><button type="button" className={evidence.length ? "has-evidence" : ""} onClick={() => onEvidence(`${row} × ${column}`, evidence)} aria-label={`${evidence.length} meaning units for ${row}, ${column}. ${preview ? `Example: ${preview}` : "No supporting text."} Open supporting text.`}><span>{evidence.length}</span>{preview && <small>{preview}</small>}</button></td>;
  })}</tr>)}</tbody></table></div>;
}

function representativeExamples(units: MeaningUnit[], theme: string, limit = 2) {
  const candidates = units.filter((unit) => unit.finalTheme === theme);
  const selected: MeaningUnit[] = [];
  for (const unit of candidates) {
    const addsDifference = !selected.some((item) => item.respondentId === unit.respondentId)
      && !selected.some((item) => item.futuresOrientation === unit.futuresOrientation && item.datorArchetypes.join("|") === unit.datorArchetypes.join("|"));
    if (!selected.length || addsDifference) selected.push(unit);
    if (selected.length === limit) break;
  }
  for (const unit of candidates) {
    if (selected.length === limit) break;
    if (!selected.includes(unit)) selected.push(unit);
  }
  return selected;
}

function CheckboxGroup<T extends string>({ legend, values, selected, descriptions, onChange }: { legend: string; values: readonly T[]; selected: T[]; descriptions?: Record<T, string>; onChange: (values: T[]) => void }) {
  return <fieldset className="fm-checkbox-group"><legend>{legend}</legend>{values.map((value) => <label key={value}><input type="checkbox" checked={selected.includes(value)} onChange={(event) => onChange(event.target.checked ? [...selected, value] : selected.filter((item) => item !== value))} /><span><strong>{value}</strong>{descriptions && <small>{descriptions[value]}</small>}</span></label>)}</fieldset>;
}

export default function FrameworkWorkspace() {
  const { data, loading, locked, error, unlock } = useSurveyData();
  const [stage, setStage] = useState<FrameworkStage>("familiarise");
  const [workspace, setWorkspace] = useState<FrameworkWorkspaceState | null>(null);
  const [query, setQuery] = useState("");
  const [question, setQuestion] = useState("all");
  const [theme, setTheme] = useState("all");
  const [code, setCode] = useState("all");
  const [review, setReview] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [matrixView, setMatrixView] = useState<"respondent" | "question">("question");
  const [futureView, setFutureView] = useState("theme-dator");
  const [evidence, setEvidence] = useState<{ title: string; units: MeaningUnit[] } | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [bulkCode, setBulkCode] = useState("");
  const [bulkTheme, setBulkTheme] = useState("");
  const [bulkDator, setBulkDator] = useState("");
  const [bulkCla, setBulkCla] = useState("");
  const [bulkOrientation, setBulkOrientation] = useState("");
  const unitTextRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!data) return;
    const timer = window.setTimeout(() => {
      const draft = buildInitialWorkspace(data);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) { setWorkspace(draft); return; }
        const parsed = JSON.parse(stored) as FrameworkWorkspaceState;
        if (!parsed.units || !parsed.codebook) { setWorkspace(draft); return; }
        const storedById = new Map(parsed.units.map((unit) => [unit.id, unit]));
        const merged = draft.units.map((unit) => storedById.get(unit.id) ?? unit);
        const extraHumanUnits = parsed.units.filter((unit) => !draft.units.some((candidate) => candidate.id === unit.id) && unit.reviewState === "human-modified");
        setWorkspace({ ...parsed, dataVersion: data.version, units: [...merged, ...extraHumanUnits] });
      } catch { setWorkspace(draft); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    if (!workspace) return;
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...workspace, updatedAt: new Date().toISOString() }));
      setSaveMessage("Saved on this device");
    }, 350);
    return () => window.clearTimeout(timer);
  }, [workspace]);

  const included = useMemo(() => activeUnits(workspace?.units ?? []), [workspace]);
  const themes = useMemo(() => [...new Set((workspace?.codebook ?? []).map((entry) => entry.label))].sort(), [workspace]);
  const codes = useMemo(() => [...new Set((workspace?.units ?? []).map((unit) => unit.initialCode))].sort(), [workspace]);
  const questions = useMemo(() => [...new Map((workspace?.units ?? []).map((unit) => [unit.questionId, unit.questionLabel])).entries()], [workspace]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return (workspace?.units ?? []).filter((unit) => {
      const searchable = [unit.respondentLabel, unit.questionLabel, unit.originalResponse, unit.meaningUnitText, unit.initialCode, unit.finalTheme, unit.researcherNotes].join(" ").toLocaleLowerCase();
      return (!normalized || searchable.includes(normalized))
        && (question === "all" || unit.questionId === question)
        && (theme === "all" || unit.finalTheme === theme)
        && (code === "all" || unit.initialCode === code)
        && (review === "all" || unit.reviewState === review);
    });
  }, [code, query, question, review, theme, workspace]);
  const familiariseFiltered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return (workspace?.units ?? []).filter((unit) => (!normalized || [unit.respondentLabel, unit.questionLabel, unit.originalResponse].join(" ").toLocaleLowerCase().includes(normalized)) && (question === "all" || unit.questionId === question));
  }, [query, question, workspace]);
  const selected = workspace?.units.find((unit) => unit.id === selectedId) ?? filtered[0];
  const analysisUnits = included.filter((unit) => (question === "all" || unit.questionId === question) && (theme === "all" || unit.finalTheme === theme));
  const analysisThemes = theme === "all" ? themes : [theme];
  const analysisQuestions = question === "all" ? questions : questions.filter(([id]) => id === question);
  const analysisRespondents = [...new Set(analysisUnits.map((unit) => unit.respondentLabel))];

  const setUnits = (next: (units: MeaningUnit[]) => MeaningUnit[]) => setWorkspace((current) => current ? { ...current, updatedAt: new Date().toISOString(), units: next(current.units) } : current);
  const updateUnit = (id: string, patch: Partial<MeaningUnit>, markModified = true) => setUnits((units) => units.map((unit) => {
    if (unit.id !== id) return unit;
    const next = { ...unit, ...patch };
    if (markModified) {
      next.manuallyReviewed = true;
      if (!("codingDecision" in patch) && !("segmentationDecision" in patch)) next.codingDecision = "modified";
    }
    next.reviewState = reviewStateFor(next);
    return next;
  }));
  const decide = (id: string, field: "segmentationDecision" | "codingDecision", decision: ReviewDecision) => setUnits((units) => units.map((unit) => {
    if (unit.id !== id) return unit;
    const next = { ...unit, [field]: decision };
    if (field === "segmentationDecision" && decision === "rejected") next.excluded = true;
    if (field === "segmentationDecision" && decision !== "rejected") next.excluded = false;
    next.manuallyReviewed = next.segmentationDecision === "accepted" && next.codingDecision === "accepted";
    next.reviewState = reviewStateFor(next);
    return next;
  }));

  const splitSelected = () => {
    if (!selected || !unitTextRef.current) return;
    const cursor = unitTextRef.current.selectionStart;
    const before = selected.meaningUnitText.slice(0, cursor).trim();
    const after = selected.meaningUnitText.slice(cursor).trim();
    if (!before || !after) { setSaveMessage("Place the cursor between two ideas before splitting."); return; }
    setUnits((units) => {
      const index = units.findIndex((unit) => unit.id === selected.id);
      const first = { ...selected, meaningUnitText: before, segmentationDecision: "modified" as const, manuallyReviewed: true, reviewState: "human-modified" as const };
      const second = { ...selected, id: `${selected.id}--split-${Date.now()}`, meaningUnitText: after, segmentationDecision: "modified" as const, codingDecision: "pending" as const, manuallyReviewed: true, reviewState: "human-modified" as const };
      return [...units.slice(0, index), first, second, ...units.slice(index + 1)];
    });
  };

  const mergePrevious = () => {
    if (!selected || !workspace) return;
    const index = workspace.units.findIndex((unit) => unit.id === selected.id);
    const previousIndex = workspace.units.slice(0, index).findLastIndex((unit) => unit.respondentId === selected.respondentId && unit.questionId === selected.questionId && !unit.excluded);
    if (previousIndex < 0) { setSaveMessage("There is no earlier active unit in this response."); return; }
    setUnits((units) => units.map((unit, unitIndex) => unitIndex === previousIndex
      ? { ...unit, meaningUnitText: `${unit.meaningUnitText} ${selected.meaningUnitText}`, segmentationDecision: "modified", manuallyReviewed: true, reviewState: "human-modified" }
      : unit.id === selected.id ? { ...unit, excluded: true, segmentationDecision: "rejected", reviewState: "rejected" } : unit));
    setSelectedId(workspace.units[previousIndex].id);
  };

  const applyBulkCoding = () => {
    if (!bulkIds.length || !(bulkCode || bulkTheme || bulkDator || bulkCla || bulkOrientation)) { setSaveMessage("Select units and at least one coding value first."); return; }
    setUnits((units) => units.map((unit) => bulkIds.includes(unit.id) ? {
      ...unit,
      ...(bulkCode ? { initialCode: bulkCode } : {}),
      ...(bulkTheme ? { finalTheme: bulkTheme } : {}),
      ...(bulkDator ? { datorArchetypes: [bulkDator as DatorArchetype] } : {}),
      ...(bulkCla ? { claLayers: [bulkCla as ClaLayer] } : {}),
      ...(bulkOrientation ? { futuresOrientation: bulkOrientation as FuturesOrientation } : {}),
      codingDecision: "modified",
      manuallyReviewed: true,
      reviewState: "human-modified",
    } : unit));
    setSaveMessage(`Applied human-modified coding to ${bulkIds.length} units`);
  };

  const resetDraft = () => {
    if (!data || !window.confirm("Discard every local review and rebuild the draft from the protected survey data? Export first if you need an audit copy.")) return;
    localStorage.removeItem(STORAGE_KEY);
    setWorkspace(buildInitialWorkspace(data));
    setSelectedId("");
    setSaveMessage("Draft rebuilt");
  };

  if (locked) return <div className="fm-shell"><DataUnlock error={error} loading={loading} onUnlock={unlock} /></div>;
  if (loading || !data || !workspace) return <div className="fm-shell fm-loading" aria-live="polite">Preparing the protected qualitative workspace…</div>;

  const reviewedCount = workspace.units.filter((unit) => unit.reviewState === "human-reviewed" || unit.reviewState === "human-modified").length;
  const excludedCount = workspace.units.filter((unit) => unit.excluded || unit.reviewState === "rejected").length;
  const completeAnswers = data.respondents.flatMap((respondent) => respondent.answers);
  const totalWords = completeAnswers.reduce((sum, answer) => sum + (answer.text.trim().match(/\S+/g)?.length ?? 0), 0);
  const missingAnswers = (data.respondentCount * questions.length) - data.answerCount;
  const answersByQuestion = questions.map(([id, label]) => ({ id, label, count: completeAnswers.filter((answer) => answer.key === id && answer.text.trim()).length }));
  const themeCounts = countBy(included, (unit) => [unit.finalTheme]);
  const archetypeCounts = countBy(included, (unit) => unit.datorArchetypes);
  const claCounts = countBy(included, (unit) => unit.claLayers);
  const orientationCounts = countBy(included, (unit) => [unit.futuresOrientation]);

  const showEvidence = (title: string, units: MeaningUnit[]) => {
    setEvidence({ title, units });
    window.setTimeout(() => document.querySelector<HTMLElement>(".fm-evidence")?.focus(), 0);
  };

  return <div className="fm-shell">
    <section className="fm-workspace-status" aria-label="Workspace status"><div><strong>{workspace.units.length}</strong><span>meaning units</span></div><div><strong>{reviewedCount}</strong><span>human-reviewed or modified</span></div><div><strong>{excludedCount}</strong><span>rejected or excluded</span></div><p><span className="fm-save-dot" aria-hidden="true" />{saveMessage || "Review state is kept on this browser"}</p></section>

    <nav className="fm-stage-nav" aria-label="Framework Method stages">{STAGES.map((item) => <button type="button" key={item.id} className={stage === item.id ? "is-active" : ""} aria-current={stage === item.id ? "step" : undefined} onClick={() => { setStage(item.id); setEvidence(null); }}><span>{item.step}</span><strong>{item.label}</strong><small>{item.process}</small></button>)}</nav>

    {stage === "familiarise" && <section className="fm-stage" aria-labelledby="fm-familiarise-title"><header className="fm-stage-head"><div><p className="eyebrow">Framework Method · phase 1</p><h2 id="fm-familiarise-title">Read complete responses before reducing them to codes.</h2></div><p>Use the search and question filter to move through every full response. Meaning units are shown beneath the complete wording, so context remains visible.</p></header>
      <div className="fm-familiar-stats"><article><strong>{data.respondentCount}</strong><span>respondents</span></article><article><strong>{data.answerCount}</strong><span>complete answers</span></article><article><strong>{missingAnswers}</strong><span>missing answers</span></article><article><strong>{totalWords.toLocaleString()}</strong><span>words in complete answers</span></article><article><strong>{Math.round(totalWords / Math.max(data.answerCount, 1))}</strong><span>average words per answer</span></article><article className="fm-question-counts"><strong>Answers by question</strong><ul>{answersByQuestion.map((item, index) => <li key={item.id}><span>Q{index + 1} · {item.label}</span><b>{item.count}</b></li>)}</ul></article></div>
      <div className="fm-toolbar"><label className="fm-wide"><span>Search complete responses</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search respondent wording" /></label><label><span>Question</span><select value={question} onChange={(event) => setQuestion(event.target.value)}><option value="all">All three questions</option>{questions.map(([id, label], index) => <option value={id} key={id}>Question {index + 1}: {label}</option>)}</select></label></div>
      <p className="fm-results-line"><strong>{new Set(familiariseFiltered.map((unit) => `${unit.respondentId}-${unit.questionId}`)).size}</strong> complete responses shown</p>
      <div className="fm-response-list">{[...new Map(familiariseFiltered.map((unit) => [`${unit.respondentId}-${unit.questionId}`, unit])).values()].map((unit) => {
        const responseUnits = workspace.units.filter((candidate) => candidate.respondentId === unit.respondentId && candidate.questionId === unit.questionId);
        return <details key={`${unit.respondentId}-${unit.questionId}`}><summary><span><strong>{unit.respondentLabel}</strong><small>{unit.questionLabel}</small></span><em>{responseUnits.length} proposed {responseUnits.length === 1 ? "unit" : "units"}</em></summary><div><p className="fm-original-label">Complete original response</p><blockquote><p>{unit.originalResponse}</p></blockquote><label className="fm-familiarise-memo"><span>Initial note / familiarisation memo</span><textarea rows={3} value={responseUnits[0]?.researcherNotes ?? ""} onChange={(event) => responseUnits[0] && updateUnit(responseUnits[0].id, { researcherNotes: event.target.value, codingDecision: "modified" })} placeholder="Record a first impression, question or possible connection." /></label><ol>{responseUnits.map((candidate) => <li key={candidate.id}><button type="button" onClick={() => { setSelectedId(candidate.id); setStage("coding"); }}>{candidate.meaningUnitText}<span>Review unit →</span></button></li>)}</ol></div></details>;
      })}</div>
    </section>}

    {stage === "coding" && <section className="fm-stage" aria-labelledby="fm-coding-title"><header className="fm-stage-head"><div><p className="eyebrow">Framework Method · phases 2 and 3</p><h2 id="fm-coding-title">Review segmentation and code each meaning unit.</h2></div><p>The first pass is AI-assisted and deliberately conservative. Compare it with the complete response, then accept, modify or reject both segmentation and coding.</p></header>
      <div className="fm-toolbar fm-toolbar--coding"><label className="fm-wide"><span>Search units, codes and notes</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label><span>Question</span><select value={question} onChange={(event) => setQuestion(event.target.value)}><option value="all">All questions</option>{questions.map(([id, label], index) => <option value={id} key={id}>Q{index + 1} · {label}</option>)}</select></label><label><span>Theme</span><select value={theme} onChange={(event) => setTheme(event.target.value)}><option value="all">All themes</option>{themes.map((value) => <option key={value}>{value}</option>)}</select></label><label><span>Initial code</span><select value={code} onChange={(event) => setCode(event.target.value)}><option value="all">All codes</option>{codes.map((value) => <option key={value}>{value}</option>)}</select></label><label><span>Review status</span><select value={review} onChange={(event) => setReview(event.target.value)}><option value="all">All states</option><option value="ai-generated">AI-assisted draft</option><option value="human-reviewed">Human-reviewed</option><option value="human-modified">Human-modified</option><option value="rejected">Rejected</option></select></label></div>
      <section className="fm-bulk-panel" aria-labelledby="fm-bulk-title"><header><div><p className="eyebrow">Apply framework in a batch</p><h3 id="fm-bulk-title">Code one or many selected units.</h3></div><strong>{bulkIds.length} selected</strong></header><div><label><span>Initial code</span><input value={bulkCode} onChange={(event) => setBulkCode(event.target.value)} placeholder="Leave blank to keep existing" /></label><label><span>Final theme</span><select value={bulkTheme} onChange={(event) => setBulkTheme(event.target.value)}><option value="">Keep existing</option>{themes.map((value) => <option key={value}>{value}</option>)}</select></label><label><span>Dator archetype set</span><select value={bulkDator} onChange={(event) => setBulkDator(event.target.value)}><option value="">Keep existing</option>{DATOR_ARCHETYPES.map((value) => <option key={value}>{value}</option>)}</select></label><label><span>CLA layer set</span><select value={bulkCla} onChange={(event) => setBulkCla(event.target.value)}><option value="">Keep existing</option>{CLA_LAYERS.map((value) => <option key={value}>{value}</option>)}</select></label><label><span>Orientation</span><select value={bulkOrientation} onChange={(event) => setBulkOrientation(event.target.value)}><option value="">Keep existing</option>{FUTURES_ORIENTATIONS.map((value) => <option key={value}>{value}</option>)}</select></label><button type="button" onClick={applyBulkCoding}>Apply to selected</button></div><p>Applying a value replaces that category set on the selected units and marks them human-modified. Blank fields keep their current values.</p></section>
      <div className="fm-coding-layout"><aside className="fm-unit-list" aria-label="Meaning units"><p><strong>{filtered.length}</strong> units match</p><label className="fm-bulk-all"><input type="checkbox" checked={filtered.length > 0 && filtered.every((unit) => bulkIds.includes(unit.id))} onChange={(event) => setBulkIds(event.target.checked ? [...new Set([...bulkIds, ...filtered.map((unit) => unit.id)])] : bulkIds.filter((id) => !filtered.some((unit) => unit.id === id)))} /> Select all visible units</label>{filtered.map((unit) => <div className="fm-unit-row" key={unit.id}><input type="checkbox" checked={bulkIds.includes(unit.id)} aria-label={`Select ${unit.respondentLabel}, ${unit.questionLabel} for batch coding`} onChange={(event) => setBulkIds(event.target.checked ? [...bulkIds, unit.id] : bulkIds.filter((id) => id !== unit.id))} /><button type="button" className={selected?.id === unit.id ? "is-active" : ""} onClick={() => setSelectedId(unit.id)}><span className={`fm-status fm-status--${unit.reviewState}`}>{statusLabel(unit)}</span><strong>{unit.respondentLabel} · {unit.questionLabel}</strong><small>{unit.meaningUnitText}</small></button></div>)}</aside>
        {selected ? <article className="fm-unit-editor" aria-labelledby="fm-unit-editor-title"><header><div><p className="eyebrow">{selected.respondentLabel} · {selected.questionLabel}</p><h3 id="fm-unit-editor-title">Meaning unit review</h3></div><span className={`fm-status fm-status--${selected.reviewState}`}>{statusLabel(selected)}</span></header>
          <details className="fm-original"><summary>Compare with the complete original response</summary><p>{selected.originalResponse}</p></details>
          <label className="fm-editor-field"><span>Exact meaning-unit text</span><textarea ref={unitTextRef} rows={5} value={selected.meaningUnitText} onChange={(event) => updateUnit(selected.id, { meaningUnitText: event.target.value, segmentationDecision: "modified" })} /></label>
          <div className="fm-segment-actions"><button type="button" onClick={splitSelected}>Split at text cursor</button><button type="button" onClick={mergePrevious}>Merge into previous unit</button><label><input type="checkbox" checked={selected.excluded} onChange={(event) => updateUnit(selected.id, { excluded: event.target.checked, segmentationDecision: event.target.checked ? "rejected" : "modified" }, false)} /> Exclude from analysis</label></div>
          <DecisionButtons label="Segmentation decision" value={selected.segmentationDecision} onChange={(value) => decide(selected.id, "segmentationDecision", value)} />
          <div className="fm-editor-grid"><label className="fm-editor-field"><span>Initial code</span><input value={selected.initialCode} onChange={(event) => updateUnit(selected.id, { initialCode: event.target.value, codingDecision: "modified" })} /></label><label className="fm-editor-field"><span>Final theme</span><select value={selected.finalTheme} onChange={(event) => updateUnit(selected.id, { finalTheme: event.target.value, codingDecision: "modified" })}>{themes.map((value) => <option key={value}>{value}</option>)}</select></label></div>
          <div className="fm-lens-grid"><CheckboxGroup legend="Dator archetype(s)" values={DATOR_ARCHETYPES} selected={selected.datorArchetypes} descriptions={DATOR_COPY} onChange={(values) => updateUnit(selected.id, { datorArchetypes: values, codingDecision: "modified" })} /><CheckboxGroup legend="CLA layer(s)" values={CLA_LAYERS} selected={selected.claLayers} descriptions={CLA_COPY} onChange={(values) => updateUnit(selected.id, { claLayers: values, codingDecision: "modified" })} /></div>
          <div className="fm-editor-grid"><label className="fm-editor-field"><span>Futures orientation</span><select value={selected.futuresOrientation} onChange={(event) => updateUnit(selected.id, { futuresOrientation: event.target.value as FuturesOrientation, codingDecision: "modified" })}>{FUTURES_ORIENTATIONS.map((value) => <option key={value}>{value}</option>)}</select></label><label className="fm-editor-field"><span>AI coding certainty</span><select value={selected.llmCertainty} onChange={(event) => updateUnit(selected.id, { llmCertainty: event.target.value as MeaningUnit["llmCertainty"], codingDecision: "modified" })}><option>not assessed</option><option>low</option><option>medium</option><option>high</option></select><small>A coding aid, not a statistical probability.</small></label></div>
          <label className="fm-editor-field"><span>Coding rationale</span><textarea rows={3} value={selected.rationale} onChange={(event) => updateUnit(selected.id, { rationale: event.target.value, codingDecision: "modified" })} /></label><label className="fm-editor-field"><span>Researcher notes / memo</span><textarea rows={3} value={selected.researcherNotes} onChange={(event) => updateUnit(selected.id, { researcherNotes: event.target.value, codingDecision: "modified" })} placeholder="Record uncertainty, an alternative reading, or a decision trail." /></label>
          <DecisionButtons label="Coding decision" value={selected.codingDecision} onChange={(value) => decide(selected.id, "codingDecision", value)} />
          <label className="fm-reviewed-check"><input type="checkbox" checked={selected.manuallyReviewed} onChange={(event) => updateUnit(selected.id, { manuallyReviewed: event.target.checked }, false)} /><span><strong>Manually reviewed</strong><small>Confirms that a researcher compared the code with the original response.</small></span></label>
        </article> : <p className="fm-empty">No meaning unit matches these filters.</p>}</div>
    </section>}

    {stage === "codebook" && <CodebookStage workspace={workspace} setWorkspace={setWorkspace} units={included} />}

    {stage === "matrix" && <section className="fm-stage" aria-labelledby="fm-matrix-title"><header className="fm-stage-head"><div><p className="eyebrow">Framework Method · phases 5 and 6</p><h2 id="fm-matrix-title">Chart coded text in a framework matrix.</h2></div><p>Counts help navigation; they are not the result by themselves. Select any cell to read the exact meaning units that produce it.</p></header>
      <div className="fm-analysis-filters"><label><span>Filter by question</span><select value={question} onChange={(event) => setQuestion(event.target.value)}><option value="all">All questions</option>{questions.map(([id, label], index) => <option value={id} key={id}>Q{index + 1} · {label}</option>)}</select></label><label><span>Filter by theme</span><select value={theme} onChange={(event) => setTheme(event.target.value)}><option value="all">All themes</option>{themes.map((value) => <option key={value}>{value}</option>)}</select></label><p><strong>{analysisUnits.length}</strong> included meaning units in this view</p></div>
      <div className="fm-view-switch" role="group" aria-label="Choose framework matrix"><button type="button" className={matrixView === "question" ? "is-active" : ""} aria-pressed={matrixView === "question"} onClick={() => setMatrixView("question")}>Question × theme</button><button type="button" className={matrixView === "respondent" ? "is-active" : ""} aria-pressed={matrixView === "respondent"} onClick={() => setMatrixView("respondent")}>Respondent × theme</button></div>
      {matrixView === "question" ? <MatrixTable caption="Question × broader theme" rows={analysisQuestions.map(([, label]) => label)} columns={analysisThemes} units={analysisUnits} rowValues={(unit) => [unit.questionLabel]} columnValues={(unit) => [unit.finalTheme]} onEvidence={showEvidence} /> : <MatrixTable caption="Respondent × broader theme" rows={analysisRespondents} columns={analysisThemes} units={analysisUnits} rowValues={(unit) => [unit.respondentLabel]} columnValues={(unit) => [unit.finalTheme]} onEvidence={showEvidence} />}
      {evidence && <EvidencePanel {...evidence} onClose={() => setEvidence(null)} />}
    </section>}

    {stage === "futures" && <section className="fm-stage" aria-labelledby="fm-futures-title"><header className="fm-stage-head"><div><p className="eyebrow">Framework Method · layered futures comparison</p><h2 id="fm-futures-title">Compare future images without flattening the text.</h2></div><p>One unit may carry several Dator archetypes or CLA layers. The respondent’s exact text remains one click away from every count.</p></header>
      <div className="fm-analysis-filters"><label><span>Filter by question</span><select value={question} onChange={(event) => setQuestion(event.target.value)}><option value="all">All questions</option>{questions.map(([id, label], index) => <option value={id} key={id}>Q{index + 1} · {label}</option>)}</select></label><label><span>Filter by theme</span><select value={theme} onChange={(event) => setTheme(event.target.value)}><option value="all">All themes</option>{themes.map((value) => <option key={value}>{value}</option>)}</select></label><p><strong>{analysisUnits.length}</strong> included meaning units in this view</p></div>
      <div className="fm-view-switch fm-view-switch--wrap" role="group" aria-label="Choose futures comparison">{[["theme-dator", "Theme × Dator"], ["theme-orientation", "Theme × orientation"], ["dator-orientation", "Dator × orientation"], ["cla-theme", "CLA × theme"], ["question-dator", "Question × Dator"]].map(([id, label]) => <button type="button" key={id} className={futureView === id ? "is-active" : ""} aria-pressed={futureView === id} onClick={() => { setFutureView(id); setEvidence(null); }}>{label}</button>)}</div>
      {futureView === "theme-dator" && <MatrixTable caption="Broader theme × Dator archetype" rows={analysisThemes} columns={[...DATOR_ARCHETYPES]} units={analysisUnits} rowValues={(unit) => [unit.finalTheme]} columnValues={(unit) => unit.datorArchetypes} onEvidence={showEvidence} />}
      {futureView === "theme-orientation" && <MatrixTable caption="Broader theme × futures orientation" rows={analysisThemes} columns={[...FUTURES_ORIENTATIONS]} units={analysisUnits} rowValues={(unit) => [unit.finalTheme]} columnValues={(unit) => [unit.futuresOrientation]} onEvidence={showEvidence} />}
      {futureView === "dator-orientation" && <MatrixTable caption="Dator archetype × futures orientation" rows={[...DATOR_ARCHETYPES]} columns={[...FUTURES_ORIENTATIONS]} units={analysisUnits} rowValues={(unit) => unit.datorArchetypes} columnValues={(unit) => [unit.futuresOrientation]} onEvidence={showEvidence} />}
      {futureView === "cla-theme" && <MatrixTable caption="CLA layer × broader theme" rows={[...CLA_LAYERS]} columns={analysisThemes} units={analysisUnits} rowValues={(unit) => unit.claLayers} columnValues={(unit) => [unit.finalTheme]} onEvidence={showEvidence} />}
      {futureView === "question-dator" && <MatrixTable caption="Question × Dator archetype" rows={analysisQuestions.map(([, label]) => label)} columns={[...DATOR_ARCHETYPES]} units={analysisUnits} rowValues={(unit) => [unit.questionLabel]} columnValues={(unit) => unit.datorArchetypes} onEvidence={showEvidence} />}
      {evidence && <EvidencePanel {...evidence} onClose={() => setEvidence(null)} />}
    </section>}

    {stage === "interpret" && <InterpretStage units={included} themeCounts={themeCounts} archetypeCounts={archetypeCounts} claCounts={claCounts} orientationCounts={orientationCounts} onEvidence={showEvidence} evidence={evidence} onCloseEvidence={() => setEvidence(null)} />}

    {stage === "export" && <ExportStage workspace={workspace} included={included} resetDraft={resetDraft} />}
  </div>;
}

function CodebookStage({ workspace, setWorkspace, units }: { workspace: FrameworkWorkspaceState; setWorkspace: React.Dispatch<React.SetStateAction<FrameworkWorkspaceState | null>>; units: MeaningUnit[] }) {
  const frequency = countBy(units, (unit) => [unit.finalTheme]);
  const updateEntry = (id: string, patch: Partial<CodebookEntry>) => setWorkspace((current) => current ? { ...current, codebook: current.codebook.map((entry) => entry.id === id ? { ...entry, ...patch } : entry) } : current);
  const renameEntry = (entry: CodebookEntry, label: string) => setWorkspace((current) => current ? { ...current, codebook: current.codebook.map((item) => item.id === entry.id ? { ...item, label } : item), units: current.units.map((unit) => unit.finalTheme === entry.label ? { ...unit, finalTheme: label, codingDecision: "modified", manuallyReviewed: true, reviewState: "human-modified" } : unit) } : current);
  const addCode = () => setWorkspace((current) => current ? { ...current, codebook: [...current.codebook, { id: `code-${Date.now()}`, label: "New theme", definition: "Define the analytical idea this theme captures.", inclusion: "State what text belongs here.", exclusion: "State what similar text does not belong here.", relatedCodes: [] }] } : current);
  const splitCode = (entry: CodebookEntry) => setWorkspace((current) => current ? { ...current, codebook: [...current.codebook, { ...entry, id: `${entry.id}-split-${Date.now()}`, label: `${entry.label} — new distinction`, definition: "Define how this split differs from the source theme.", relatedCodes: [entry.label] }] } : current);
  const mergeCode = (source: CodebookEntry, targetLabel: string) => setWorkspace((current) => current ? { ...current, codebook: current.codebook.filter((entry) => entry.id !== source.id), units: current.units.map((unit) => unit.finalTheme === source.label ? { ...unit, finalTheme: targetLabel, codingDecision: "modified", manuallyReviewed: true, reviewState: "human-modified" } : unit) } : current);
  const deleteCode = (source: CodebookEntry) => {
    if (!window.confirm(`Delete “${source.label}”? Assigned units will be moved to “Unassigned / needs review”.`)) return;
    setWorkspace((current) => {
      if (!current) return current;
      const fallback: CodebookEntry = { id: "unassigned", label: "Unassigned / needs review", definition: "A temporary holding category for units that require recoding.", inclusion: "Use only while a coding decision remains unresolved.", exclusion: "Do not use as a substantive analytical theme.", relatedCodes: [] };
      const remaining = current.codebook.filter((entry) => entry.id !== source.id);
      return { ...current, codebook: remaining.some((entry) => entry.id === fallback.id) ? remaining : [...remaining, fallback], units: current.units.map((unit) => unit.finalTheme === source.label ? { ...unit, finalTheme: fallback.label, codingDecision: "modified", manuallyReviewed: true, reviewState: "human-modified" } : unit) };
    });
  };
  return <section className="fm-stage" aria-labelledby="fm-codebook-title"><header className="fm-stage-head"><div><p className="eyebrow">Framework Method · phase 4</p><h2 id="fm-codebook-title">Develop and revise the analytical framework.</h2></div><p>Definitions, boundaries and examples keep coding decisions visible. Rename, split or merge themes; affected units are marked as human-modified.</p></header><div className="fm-codebook-actions"><button type="button" onClick={addCode}>Add a new theme</button><p>{workspace.codebook.length} themes · frequency counts included units, not respondents</p></div><div className="fm-codebook-grid">{workspace.codebook.map((entry) => {
    const examples = representativeExamples(units, entry.label);
    return <article key={entry.id}><header><label><span>Theme name</span><input value={entry.label} onChange={(event) => renameEntry(entry, event.target.value)} /></label><strong>{frequency.get(entry.label) ?? 0}<small> units</small></strong></header><label><span>Definition</span><textarea rows={3} value={entry.definition} onChange={(event) => updateEntry(entry.id, { definition: event.target.value })} /></label><div className="fm-codebook-boundaries"><label><span>Include when…</span><textarea rows={2} value={entry.inclusion} onChange={(event) => updateEntry(entry.id, { inclusion: event.target.value })} /></label><label><span>Exclude when…</span><textarea rows={2} value={entry.exclusion} onChange={(event) => updateEntry(entry.id, { exclusion: event.target.value })} /></label></div><label><span>Related codes or themes · separate with commas</span><input value={entry.relatedCodes.join(", ")} onChange={(event) => updateEntry(entry.id, { relatedCodes: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></label><div className="fm-codebook-examples"><strong>Typical contrasting examples</strong>{examples.length ? examples.map((unit) => <blockquote key={unit.id}>“{unit.meaningUnitText}” <cite>— {unit.respondentLabel} · {unit.futuresOrientation}</cite></blockquote>) : <p>No included unit is assigned yet.</p>}</div><footer><div><button type="button" onClick={() => splitCode(entry)}>Create a split</button><button type="button" className="fm-delete-code" onClick={() => deleteCode(entry)}>Delete theme</button></div><label><span>Merge into</span><select defaultValue="" onChange={(event) => { if (event.target.value) mergeCode(entry, event.target.value); }}><option value="">Choose theme…</option>{workspace.codebook.filter((candidate) => candidate.id !== entry.id).map((candidate) => <option key={candidate.id}>{candidate.label}</option>)}</select></label></footer></article>;
  })}</div></section>;
}

function InterpretStage({ units, themeCounts, archetypeCounts, claCounts, orientationCounts, onEvidence, evidence, onCloseEvidence }: { units: MeaningUnit[]; themeCounts: Map<string, number>; archetypeCounts: Map<DatorArchetype, number>; claCounts: Map<ClaLayer, number>; orientationCounts: Map<FuturesOrientation, number>; onEvidence: (title: string, units: MeaningUnit[]) => void; evidence: { title: string; units: MeaningUnit[] } | null; onCloseEvidence: () => void }) {
  const topThemes = [...themeCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const substantiveArchetypes = DATOR_ARCHETYPES.filter((item) => item !== "Not applicable / unclear");
  const rareDator = [...substantiveArchetypes].sort((a, b) => (archetypeCounts.get(a) ?? 0) - (archetypeCounts.get(b) ?? 0))[0];
  const rareCla = [...CLA_LAYERS].sort((a, b) => (claCounts.get(a) ?? 0) - (claCounts.get(b) ?? 0))[0];
  const respondentOrientations = new Map<string, Set<FuturesOrientation>>();
  for (const unit of units) respondentOrientations.set(unit.respondentLabel, new Set([...(respondentOrientations.get(unit.respondentLabel) ?? []), unit.futuresOrientation]));
  const tensions = [...respondentOrientations.entries()].filter(([, values]) => values.has("Concern") && (values.has("Desire") || values.has("Possibility")));
  const multiArchetype = units.filter((unit) => unit.datorArchetypes.filter((value) => value !== "Not applicable / unclear").length > 1);
  const excerpts = topThemes.map(([theme]) => units.find((unit) => unit.finalTheme === theme && unit.meaningUnitText.length > 65)).filter((unit): unit is MeaningUnit => Boolean(unit));
  const orientationGap = [...themeCounts.keys()].map((theme) => ({ theme, concern: units.filter((unit) => unit.finalTheme === theme && unit.futuresOrientation === "Concern").length, desire: units.filter((unit) => unit.finalTheme === theme && unit.futuresOrientation === "Desire").length })).sort((a, b) => (b.concern - b.desire) - (a.concern - a.desire))[0];
  const questionBreadth = [...new Set(units.map((unit) => unit.questionLabel))].map((question) => ({ question, archetypes: new Set(units.filter((unit) => unit.questionLabel === question).flatMap((unit) => unit.datorArchetypes.filter((value) => value !== "Not applicable / unclear"))) })).sort((a, b) => a.archetypes.size - b.archetypes.size)[0];
  return <section className="fm-stage" aria-labelledby="fm-interpret-title"><header className="fm-stage-head"><div><p className="eyebrow">Framework Method · phase 7</p><h2 id="fm-interpret-title">Interpret patterns, tensions and underrepresented futures.</h2></div><p>These are prompts grounded in the current coding. They describe what appears in this sample; they do not establish prevalence across ELIA or explain why a pattern exists.</p></header>
    <div className="fm-interpret-grid"><article><p className="eyebrow">Dominant in the coded units</p><h3>Several themes recur across the answers.</h3><p>The three most frequent draft themes are {topThemes.map(([label, count]) => `${label} (${count})`).join(", ")}. Frequency indicates how often the theme was assigned to a meaning unit, not how important respondents consider it.</p><button type="button" onClick={() => onEvidence(topThemes[0]?.[0] ?? "Dominant theme", units.filter((unit) => unit.finalTheme === topThemes[0]?.[0]))}>Read the leading theme’s text</button></article><article><p className="eyebrow">Tension within accounts</p><h3>Concern can coexist with desire or possibility.</h3><p>{tensions.length} respondents currently have units coded both as concern and as desire or possibility. This may indicate ambivalence, competing ideas, or simply different topics within the same account; the text must decide.</p><button type="button" onClick={() => onEvidence("Concern alongside desire or possibility", units.filter((unit) => tensions.some(([respondent]) => respondent === unit.respondentLabel)))}>Inspect these accounts</button></article><article><p className="eyebrow">Archetype overlap</p><h3>Future images need not occupy one lane.</h3><p>{multiArchetype.length} units currently carry more than one substantive Dator archetype. Review these closely: overlap may be analytically useful, or it may signal that a segment should be split.</p><button type="button" onClick={() => onEvidence("Units with multiple Dator archetypes", multiArchetype)}>Review overlaps</button></article></div>
    <section className="fm-distributions" aria-labelledby="fm-distributions-title"><header><p className="eyebrow">Current coded distribution</p><h3 id="fm-distributions-title">Counts are doors back into the material.</h3></header><div><article><h4>Dator archetypes</h4><ul>{DATOR_ARCHETYPES.map((value) => <li key={value}><button type="button" onClick={() => onEvidence(value, units.filter((unit) => unit.datorArchetypes.includes(value)))}><span>{value}</span><strong>{archetypeCounts.get(value) ?? 0}</strong></button></li>)}</ul></article><article><h4>Futures orientation</h4><ul>{FUTURES_ORIENTATIONS.map((value) => <li key={value}><button type="button" onClick={() => onEvidence(value, units.filter((unit) => unit.futuresOrientation === value))}><span>{value}</span><strong>{orientationCounts.get(value) ?? 0}</strong></button></li>)}</ul></article><article><h4>CLA layers</h4><ul>{CLA_LAYERS.map((value) => <li key={value}><button type="button" onClick={() => onEvidence(value, units.filter((unit) => unit.claLayers.includes(value)))}><span>{value}</span><strong>{claCounts.get(value) ?? 0}</strong></button></li>)}</ul></article></div></section>
    <section className="fm-absence" aria-labelledby="fm-absence-title"><header><p className="eyebrow">Absences and underrepresented futures</p><h3 id="fm-absence-title">Use gaps as empirical questions, not conclusions.</h3></header><div><article><strong>{rareDator}</strong><span>{archetypeCounts.get(rareDator) ?? 0} coded units</span><p>What futures are difficult to imagine here? Does the low count reflect respondents’ accounts, the questions asked, segmentation, or how the draft framework was applied?</p><button type="button" onClick={() => onEvidence(`${rareDator} evidence`, units.filter((unit) => unit.datorArchetypes.includes(rareDator)))}>See available text</button></article><article><strong>{rareCla}</strong><span>{claCounts.get(rareCla) ?? 0} coded units</span><p>Which ideas remain mainly at surface or system level? Could deeper stories be implicit but unsupported by wording, or did the survey format make them difficult to express?</p><button type="button" onClick={() => onEvidence(`${rareCla} evidence`, units.filter((unit) => unit.claLayers.includes(rareCla)))}>See available text</button></article><article><strong>Unclear / not applicable</strong><span>{orientationCounts.get("Unclear / not applicable") ?? 0} orientation units · {archetypeCounts.get("Not applicable / unclear") ?? 0} archetype units</span><p>What ambiguity is being preserved? Do not force a future image onto descriptions of present routines simply to fill the framework.</p><button type="button" onClick={() => onEvidence("Units where a futures lens is unclear", units.filter((unit) => unit.futuresOrientation === "Unclear / not applicable" || unit.datorArchetypes.includes("Not applicable / unclear")))}>Review ambiguity</button></article>{orientationGap && <article><strong>{orientationGap.theme}</strong><span>{orientationGap.concern} concern units · {orientationGap.desire} desire units</span><p>This theme is currently framed more often as concern than desire. Is that contrast supported by the wording, or does the draft orientation coding need revision?</p><button type="button" onClick={() => onEvidence(`${orientationGap.theme}: concerns and desires`, units.filter((unit) => unit.finalTheme === orientationGap.theme && ["Concern", "Desire"].includes(unit.futuresOrientation)))}>Compare the text</button></article>}{questionBreadth && <article><strong>{questionBreadth.question}</strong><span>{questionBreadth.archetypes.size} substantive archetypes coded</span><p>This question currently produces the narrowest Dator repertoire. Did its wording invite present-practice descriptions rather than future images?</p><button type="button" onClick={() => onEvidence(`${questionBreadth.question}: futures repertoire`, units.filter((unit) => unit.questionLabel === questionBreadth.question))}>Inspect this question</button></article>}</div></section>
    <section className="fm-excerpts"><header><p className="eyebrow">Representative excerpts</p><h3>Claims remain linked to respondent wording.</h3></header><div>{excerpts.map((unit) => <article key={unit.id}><span>{unit.finalTheme}</span><blockquote><p>“{unit.meaningUnitText}”</p></blockquote><footer><strong>{unit.respondentLabel} · {unit.questionLabel}</strong><a href={`../respondents/?respondent=${unit.respondentId}`}>All answers <span aria-hidden="true">→</span></a></footer></article>)}</div></section>
    {evidence && <EvidencePanel {...evidence} onClose={onCloseEvidence} />}
  </section>;
}

function ExportStage({ workspace, included, resetDraft }: { workspace: FrameworkWorkspaceState; included: MeaningUnit[]; resetDraft: () => void }) {
  const exportUnitsCsv = () => {
    const headers = ["respondent_id", "respondent_label", "question_id", "question", "original_response", "meaning_unit", "initial_code", "final_theme", "dator_archetypes", "cla_layers", "futures_orientation", "rationale", "llm_certainty", "researcher_notes", "manually_reviewed", "segmentation_decision", "coding_decision", "review_state", "excluded"];
    const rows = workspace.units.map((unit) => [unit.respondentId, unit.respondentLabel, unit.questionId, unit.questionLabel, unit.originalResponse, unit.meaningUnitText, unit.initialCode, unit.finalTheme, unit.datorArchetypes, unit.claLayers, unit.futuresOrientation, unit.rationale, unit.llmCertainty, unit.researcherNotes, unit.manuallyReviewed, unit.segmentationDecision, unit.codingDecision, unit.reviewState, unit.excluded]);
    downloadFile("elia-framework-method-coded-data.csv", [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n"), "text/csv;charset=utf-8");
  };
  const exportCodebook = () => {
    const rows = [["theme", "definition", "inclusion", "exclusion", "related_codes", "included_unit_count"], ...workspace.codebook.map((entry) => [entry.label, entry.definition, entry.inclusion, entry.exclusion, entry.relatedCodes, included.filter((unit) => unit.finalTheme === entry.label).length])];
    downloadFile("elia-framework-method-codebook.csv", rows.map((row) => row.map(csvCell).join(",")).join("\r\n"), "text/csv;charset=utf-8");
  };
  const exportMatrix = () => {
    const themes = workspace.codebook.map((entry) => entry.label);
    const respondents = [...new Set(included.map((unit) => unit.respondentLabel))];
    const rows = [["respondent", ...themes], ...respondents.map((respondent) => [respondent, ...themes.map((theme) => included.filter((unit) => unit.respondentLabel === respondent && unit.finalTheme === theme).map((unit) => unit.meaningUnitText).join(" || "))])];
    downloadFile("elia-framework-method-respondent-theme-matrix.csv", rows.map((row) => row.map(csvCell).join(",")).join("\r\n"), "text/csv;charset=utf-8");
  };
  const exportJson = () => downloadFile("elia-framework-method-audit-export.json", JSON.stringify({ exportedAt: new Date().toISOString(), method: "Framework Method; hybrid inductive and deductive coding", ...workspace }, null, 2), "application/json");
  const exportProtocol = () => downloadFile("elia-framework-method-llm-protocol.json", JSON.stringify({ segmentationPrompt: SEGMENTATION_PROMPT, codingPrompt: CODING_PROMPT, outputSchema: FRAMEWORK_OUTPUT_SCHEMA }, null, 2), "application/json");
  return <section className="fm-stage" aria-labelledby="fm-export-title"><header className="fm-stage-head"><div><p className="eyebrow">Preserve and share the analysis</p><h2 id="fm-export-title">Export the data, codebook and audit trail.</h2></div><p>Browser storage is convenient, not durable or collaborative. Export after a review session. Spreadsheet text is escaped to reduce formula-injection risk.</p></header><div className="fm-export-grid"><article><span>CSV · spreadsheet-ready</span><h3>Complete coded dataset</h3><p>Every draft, reviewed, modified, rejected and excluded meaning unit with original response, coding and audit fields.</p><button type="button" onClick={exportUnitsCsv}>Download coded data CSV</button></article><article><span>CSV · spreadsheet-ready</span><h3>Codebook</h3><p>Theme definitions, inclusion and exclusion criteria, relationships and current included-unit frequencies.</p><button type="button" onClick={exportCodebook}>Download codebook CSV</button></article><article><span>CSV · text matrix</span><h3>Respondent × theme matrix</h3><p>Meaning-unit text charted into respondent rows and theme columns for close comparison.</p><button type="button" onClick={exportMatrix}>Download matrix CSV</button></article><article><span>JSON · audit copy</span><h3>Complete workspace</h3><p>The full local state, including decisions, human edits, notes and rejected material.</p><button type="button" onClick={exportJson}>Download workspace JSON</button></article></div>
    <details className="fm-protocol"><summary>Inspect the explicit LLM prompts and structured-output schema</summary><div><section><h3>Segmentation prompt</h3><pre>{SEGMENTATION_PROMPT}</pre></section><section><h3>Coding prompt</h3><pre>{CODING_PROMPT}</pre></section><section><h3>JSON Schema</h3><pre>{JSON.stringify(FRAMEWORK_OUTPUT_SCHEMA, null, 2)}</pre></section><button type="button" onClick={exportProtocol}>Download protocol JSON</button></div></details>
    <aside className="fm-local-warning"><div><p className="eyebrow">Local research state</p><h3>Human edits never get silently replaced.</h3></div><p>Saved edits are merged back onto stable meaning-unit identifiers when the protected survey data reloads. They remain only in this browser and are not synced to other researchers. Export JSON to transfer or archive them.</p><button type="button" className="fm-danger" onClick={resetDraft}>Discard local reviews and rebuild draft</button></aside>
  </section>;
}
