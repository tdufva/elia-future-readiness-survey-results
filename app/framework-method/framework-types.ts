export const DATOR_ARCHETYPES = ["Continuation", "Collapse", "Discipline", "Transformation", "Not applicable / unclear"] as const;
export const CLA_LAYERS = ["Litany", "System / social causes", "Worldview / discourse", "Myth / metaphor"] as const;
export const FUTURES_ORIENTATIONS = ["Expectation", "Desire", "Concern", "Possibility", "Unclear / not applicable"] as const;
export const REVIEW_STATES = ["ai-generated", "human-reviewed", "human-modified", "rejected"] as const;

export type DatorArchetype = typeof DATOR_ARCHETYPES[number];
export type ClaLayer = typeof CLA_LAYERS[number];
export type FuturesOrientation = typeof FUTURES_ORIENTATIONS[number];
export type ReviewState = typeof REVIEW_STATES[number];
export type ReviewDecision = "pending" | "accepted" | "modified" | "rejected";
export type Certainty = "not assessed" | "low" | "medium" | "high";

export type MeaningUnit = {
  id: string;
  respondentId: string;
  respondentLabel: string;
  questionId: string;
  questionLabel: string;
  originalResponse: string;
  meaningUnitText: string;
  initialCode: string;
  finalTheme: string;
  datorArchetypes: DatorArchetype[];
  claLayers: ClaLayer[];
  futuresOrientation: FuturesOrientation;
  rationale: string;
  llmCertainty: Certainty;
  researcherNotes: string;
  manuallyReviewed: boolean;
  excluded: boolean;
  segmentationDecision: ReviewDecision;
  codingDecision: ReviewDecision;
  reviewState: ReviewState;
};

export type CodebookEntry = {
  id: string;
  label: string;
  definition: string;
  inclusion: string;
  exclusion: string;
  relatedCodes: string[];
};

export type FrameworkWorkspaceState = {
  version: number;
  dataVersion: number;
  updatedAt: string;
  units: MeaningUnit[];
  codebook: CodebookEntry[];
};

export type FrameworkStage = "familiarise" | "coding" | "codebook" | "matrix" | "futures" | "interpret" | "export";
