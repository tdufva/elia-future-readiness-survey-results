import type { Respondent, SurveyData } from "../survey-data";
import { validateFrameworkRecord } from "./framework-prompts";
import {
  type ClaLayer,
  type CodebookEntry,
  type DatorArchetype,
  type FrameworkWorkspaceState,
  type FuturesOrientation,
  type MeaningUnit,
} from "./framework-types";

type ThemeRule = CodebookEntry & { pattern: RegExp; draftCode: string };

const RULES: ThemeRule[] = [
  { id: "arts-education", label: "Arts education and curricula", draftCode: "Reworking how arts are taught and learned", definition: "How arts learning, teaching, curricula and educational institutions are changing.", inclusion: "Teaching, learning, students, curricula, pedagogy or arts education.", exclusion: "Artistic practice without an educational dimension.", relatedCodes: ["Artistic practice and identity", "Institutional agency and governance"], pattern: /teach|student|curricul|learn|educat|pedagog|school|academ/i },
  { id: "ai-digital", label: "AI and digital change", draftCode: "Negotiating AI and digital systems", definition: "How AI, platforms and digital systems affect creative work, knowledge and institutions.", inclusion: "AI, algorithms, platforms, digital tools, social media or technological change.", exclusion: "General change with no technological dimension.", relatedCodes: ["Artistic practice and identity", "Work and professional futures"], pattern: /\bai\b|artificial intelligence|algorithm|technolog|digital|social media|platform|virtual|online/i },
  { id: "social-values", label: "Social cohesion, equity and human values", draftCode: "Protecting connection, equity and human values", definition: "Belonging, inclusion, rights, care, community and the human values attached to the arts.", inclusion: "Community, diversity, inclusion, inequality, rights, empathy, connection or social cohesion.", exclusion: "Networking discussed only as an information source.", relatedCodes: ["Political and democratic pressure", "Artistic practice and identity"], pattern: /community|social|inequal|equit|divers|inclus|human|empathy|peace|rights|belong|care|connection/i },
  { id: "politics", label: "Political and democratic pressure", draftCode: "Navigating conflict and democratic strain", definition: "Political conflict, polarisation, democratic strain, war and policy pressure affecting the arts.", inclusion: "War, conflict, safety, nationalism, far-right politics, democracy or political pressure.", exclusion: "Internal institutional governance without a political context.", relatedCodes: ["Social cohesion, equity and human values", "Funding and institutional pressure"], pattern: /war|conflict|safety|fasc|democra|politic|nationalis|far.right|human rights|polarisa|polariza/i },
  { id: "ecology", label: "Ecological crisis and liveability", draftCode: "Responding to ecological limits", definition: "Climate, ecology, sustainability and the conditions for liveable futures.", inclusion: "Climate, biodiversity, ecology, environmental sustainability or liveability.", exclusion: "Institutional financial sustainability alone.", relatedCodes: ["Political and democratic pressure", "Uncertainty and adaptation"], pattern: /climate|ecolog|environment|biodivers|liveab|planet|sustainab/i },
  { id: "funding", label: "Funding and institutional pressure", draftCode: "Sustaining institutions under financial pressure", definition: "Financial constraints, legitimacy, survival and performance pressure around arts institutions.", inclusion: "Funding, budgets, cuts, markets, employability, institutional survival or legitimacy.", exclusion: "Personal employment change without an institutional dimension.", relatedCodes: ["Institutional agency and governance", "Work and professional futures"], pattern: /fund|budget|cut|surviv|legitim|market|auster|resource|financial|econom/i },
  { id: "networks", label: "Networks and collaborative sensing", draftCode: "Learning through relationships and networks", definition: "Learning about change through dialogue, peers, partners, students and professional networks.", inclusion: "Colleagues, partners, conversations, networks, conferences or collaboration used to sense change.", exclusion: "Collective meetings described only as an institutional decision process.", relatedCodes: ["Research and horizon sensing", "Institutional foresight practices"], pattern: /network|partner|colleague|peer|conference|interdisciplin|international|dialog|conversation|talk|community of practice/i },
  { id: "research", label: "Research and horizon sensing", draftCode: "Scanning change through research and media", definition: "Following change through research, reading, news, media, reports and deliberate scanning.", inclusion: "Research, reading, news, reports, publications, exhibitions, media or scanning.", exclusion: "Student or peer dialogue without reference to published material.", relatedCodes: ["Networks and collaborative sensing", "Institutional foresight practices"], pattern: /research|read|news|media|report|publication|scan|signal|journal|book|podcast|exhibition/i },
  { id: "institutional-practice", label: "Institutional foresight practices", draftCode: "Making collective reflection routine", definition: "Formal and informal routines used to reflect, anticipate and make institutional decisions.", inclusion: "Workshops, meetings, quality cycles, strategy, governance, observatories or collective reflection.", exclusion: "Personal sensing routines without an institutional setting.", relatedCodes: ["Institutional agency and governance", "Networks and collaborative sensing"], pattern: /strategy|workshop|quality|govern|committee|meeting|retreat|reflection|foresight|observator|planning|plan\b/i },
  { id: "art-practice", label: "Artistic practice and identity", draftCode: "Reconsidering artistic practice and identity", definition: "Changing artistic practice, authorship, creativity, cultural meaning and the role of artists.", inclusion: "Artists, creative practice, authorship, originality, expression or the societal role of art.", exclusion: "Teaching practice without a wider artistic-practice claim.", relatedCodes: ["AI and digital change", "Arts education and curricula"], pattern: /artist|creative|creativity|practice|\bart\b|arts\b|author|original|expression|culture|cultural/i },
  { id: "work", label: "Work and professional futures", draftCode: "Anticipating changes in work and professional roles", definition: "Employment, professional roles, skills and changing conditions of work.", inclusion: "Jobs, work, professions, careers, skills or working conditions.", exclusion: "Institutional budgets without reference to work or professional roles.", relatedCodes: ["AI and digital change", "Funding and institutional pressure"], pattern: /job|employ|profession|career|work\b|worker|skill|labour|labor/i },
  { id: "agency", label: "Institutional agency and governance", draftCode: "Locating responsibility and capacity to act", definition: "Who can decide, organise, resource or act on signals of change.", inclusion: "Decision rights, leadership, resources, ownership, governance or capacity to act.", exclusion: "Awareness of change with no question of agency.", relatedCodes: ["Institutional foresight practices", "Funding and institutional pressure"], pattern: /decision|leadership|leader|authority|capacity|responsib|management|institution|organisation|organization/i },
  { id: "uncertainty", label: "Uncertainty and adaptation", draftCode: "Navigating uncertainty and rapid change", definition: "Ambiguity, rapid change and efforts to navigate conditions that remain unclear.", inclusion: "Uncertainty, unpredictability, adaptation, emerging change or difficulty keeping up.", exclusion: "A specific concern that fits another theme and contains no wider uncertainty claim.", relatedCodes: ["Research and horizon sensing", "Ecological crisis and liveability"], pattern: /uncertain|unpredict|adapt|emerg|change|future|complex|overload|vuca|unknown/i },
];

export const INITIAL_CODEBOOK: CodebookEntry[] = RULES.map((rule) => ({
  id: rule.id,
  label: rule.label,
  definition: rule.definition,
  inclusion: rule.inclusion,
  exclusion: rule.exclusion,
  relatedCodes: rule.relatedCodes,
}));

function conservativeSegments(response: string): string[] {
  // Paragraph boundaries are the only automatic split. Finer segmentation is a research decision.
  return response.split(/\n\s*\n+/).map((part) => part.trim()).filter(Boolean);
}

function classifyTheme(text: string) {
  const match = RULES.find((rule) => rule.pattern.test(text)) ?? RULES[RULES.length - 1];
  return { initialCode: match.draftCode, finalTheme: match.label };
}

function classifyOrientation(text: string): FuturesOrientation {
  if (/concern|worr|fear|threat|risk|crisis|problem|difficult|pressure|loss|losing|anx|danger/i.test(text)) return "Concern";
  if (/\bshould\b|\bneed\b|\bmust\b|\bhope\b|\bwant\b|\bwish\b|\baim\b|ideally|important to/i.test(text)) return "Desire";
  if (/\bwill\b|going to|likely|expect|predict|inevitable/i.test(text)) return "Expectation";
  if (/\bmay\b|\bmight\b|\bcould\b|possible|possibility|opportun|potential/i.test(text)) return "Possibility";
  return "Unclear / not applicable";
}

function classifyDator(text: string): DatorArchetype[] {
  const values: DatorArchetype[] = [];
  if (/continue|current|maintain|preserv|remain|ongoing|business as usual|growth/i.test(text)) values.push("Continuation");
  if (/collapse|crisis|war|cut|threat|surviv|fasc|catastroph|breakdown|disappear|loss|losing/i.test(text)) values.push("Collapse");
  if (/limit|regulat|ethic|responsib|sustainab|slow|refus|disciplin|guideline|protect|care/i.test(text)) values.push("Discipline");
  if (/transform|radical|reinvent|paradigm|fundamental|new system|reimagin|artificial intelligence|\bai\b/i.test(text)) values.push("Transformation");
  return values.length ? values : ["Not applicable / unclear"];
}

function classifyCla(text: string): ClaLayer[] {
  const values: ClaLayer[] = [];
  if (/headline|news|trend|increase|decrease|crisis|problem|symptom|visible/i.test(text)) values.push("Litany");
  if (/fund|policy|institution|university|curricul|platform|market|govern|structure|network|system|law|resource/i.test(text)) values.push("System / social causes");
  if (/value|democra|relevance|role of art|role of the arts|community|original|ideolog|culture|society|human/i.test(text)) values.push("Worldview / discourse");
  if (/story|narrative|identity|metaphor|dream|imagin|soul|worldview|way of seeing/i.test(text)) values.push("Myth / metaphor");
  return values.length ? values : ["Litany"];
}

function makeRationale(theme: string, orientation: FuturesOrientation, cla: ClaLayer[]) {
  const orientationCopy = orientation === "Unclear / not applicable" ? "does not clearly state a future orientation" : `is phrased mainly as a ${orientation.toLocaleLowerCase()}`;
  return `Drafted from wording associated with ${theme.toLocaleLowerCase()}; the unit ${orientationCopy} and is read at ${cla.join(" and ").toLocaleLowerCase()} level.`;
}

export function buildInitialWorkspace(data: SurveyData): FrameworkWorkspaceState {
  const units = data.respondents.flatMap((respondent: Respondent) => respondent.answers.flatMap((answer) => {
    const segments = conservativeSegments(answer.text);
    return segments.map((meaningUnitText, index): MeaningUnit => {
      const theme = classifyTheme(meaningUnitText);
      const orientation = classifyOrientation(meaningUnitText);
      const cla = classifyCla(meaningUnitText);
      const unit: MeaningUnit = {
        id: `${respondent.id}--${answer.key}--${index + 1}`,
        respondentId: respondent.id,
        respondentLabel: respondent.label,
        questionId: answer.key,
        questionLabel: answer.question,
        originalResponse: answer.text,
        meaningUnitText,
        initialCode: theme.initialCode,
        finalTheme: theme.finalTheme,
        datorArchetypes: classifyDator(meaningUnitText),
        claLayers: cla,
        futuresOrientation: orientation,
        rationale: makeRationale(theme.finalTheme, orientation, cla),
        llmCertainty: "not assessed",
        researcherNotes: "",
        manuallyReviewed: false,
        excluded: false,
        segmentationDecision: "pending",
        codingDecision: "pending",
        reviewState: "ai-generated",
      };
      const errors = validateFrameworkRecord({
        respondentId: unit.respondentId,
        questionId: unit.questionId,
        originalResponse: unit.originalResponse,
        meaningUnitText: unit.meaningUnitText,
        initialCode: unit.initialCode,
        finalTheme: unit.finalTheme,
        datorArchetypes: unit.datorArchetypes,
        claLayers: unit.claLayers,
        futuresOrientation: unit.futuresOrientation,
        rationale: unit.rationale,
        llmCertainty: unit.llmCertainty,
      });
      if (errors.length) throw new Error(`Invalid framework draft ${unit.id}: ${errors.join(" ")}`);
      return unit;
    });
  }));
  return { version: 1, dataVersion: data.version, updatedAt: new Date().toISOString(), units, codebook: INITIAL_CODEBOOK };
}

export function activeUnits(units: MeaningUnit[]) {
  return units.filter((unit) => !unit.excluded && unit.reviewState !== "rejected");
}

export function reviewStateFor(unit: MeaningUnit): MeaningUnit["reviewState"] {
  if (unit.excluded || unit.segmentationDecision === "rejected" || unit.codingDecision === "rejected") return "rejected";
  if (unit.segmentationDecision === "modified" || unit.codingDecision === "modified") return "human-modified";
  if (unit.manuallyReviewed || (unit.segmentationDecision === "accepted" && unit.codingDecision === "accepted")) return "human-reviewed";
  return "ai-generated";
}
