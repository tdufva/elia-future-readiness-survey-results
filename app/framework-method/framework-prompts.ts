export const SEGMENTATION_PROMPT = `You are assisting a qualitative researcher using the Framework Method. Segment one complete survey response into meaning units.

Rules:
- Preserve the respondent's wording exactly. Do not paraphrase, correct grammar, or add text.
- Make the fewest splits needed. Split only when the response moves to a substantively different idea, action, concern, desire, expectation, or future possibility.
- Keep a short example with the idea it illustrates.
- Do not fragment a single coherent claim merely because it has several clauses.
- Return the full original response and every exact segment so a researcher can compare them.
- If the response is already one coherent unit, return one segment.
- Do not infer identity or intent that is not stated.

Return valid JSON only, following the supplied schema.`;

export const CODING_PROMPT = `You are assisting a qualitative researcher using the Framework Method. Code one meaning unit from an ELIA survey response.

Use a hybrid approach:
1. Assign a concise initial code close to the respondent's language.
2. Assign one broader final theme from the current codebook. If none fits, propose a new theme and flag it for review.
3. Assign zero or more Dator archetypes: Continuation, Collapse, Discipline, Transformation. Use "Not applicable / unclear" when the unit contains no defensible future image. Multiple archetypes are allowed when the text supports them.
4. Assign zero or more Causal Layered Analysis layers: Litany, System / social causes, Worldview / discourse, Myth / metaphor. Multiple layers are allowed only when each is evidenced in the exact text.
5. Assign one futures orientation: Expectation, Desire, Concern, Possibility, or Unclear / not applicable.
6. Give a short rationale tied to words in the unit. Do not invent motives, actors, causality, or consensus.

Analyse only what is present. Distinguish respondent description from researcher interpretation. Treat silence as unknown, not evidence. Preserve ambiguity and flag contradictory positions within the same respondent when the supplied context supports that observation. Never invent a quotation; meaningUnitText must always be an exact supporting span.

Treat categories as analytical lenses, not truths. A respondent can occupy several positions across different meaning units. Return valid JSON only, following the supplied schema.`;

export const FRAMEWORK_OUTPUT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "ELIA Framework Method meaning unit",
  type: "object",
  additionalProperties: false,
  required: [
    "respondentId", "questionId", "originalResponse", "meaningUnitText", "initialCode", "finalTheme",
    "datorArchetypes", "claLayers", "futuresOrientation", "rationale", "llmCertainty",
  ],
  properties: {
    respondentId: { type: "string", minLength: 1 },
    questionId: { type: "string", minLength: 1 },
    originalResponse: { type: "string", minLength: 1 },
    meaningUnitText: { type: "string", minLength: 1 },
    initialCode: { type: "string", minLength: 1 },
    finalTheme: { type: "string", minLength: 1 },
    datorArchetypes: { type: "array", uniqueItems: true, items: { enum: ["Continuation", "Collapse", "Discipline", "Transformation", "Not applicable / unclear"] } },
    claLayers: { type: "array", uniqueItems: true, items: { enum: ["Litany", "System / social causes", "Worldview / discourse", "Myth / metaphor"] } },
    futuresOrientation: { enum: ["Expectation", "Desire", "Concern", "Possibility", "Unclear / not applicable"] },
    rationale: { type: "string", minLength: 1 },
    llmCertainty: { enum: ["not assessed", "low", "medium", "high"] },
  },
} as const;

type UnknownRecord = Record<string, unknown>;

export function validateFrameworkRecord(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["Record must be a JSON object."];
  const record = value as UnknownRecord;
  const errors: string[] = [];
  const allowed = new Set(["respondentId", "questionId", "originalResponse", "meaningUnitText", "initialCode", "finalTheme", "datorArchetypes", "claLayers", "futuresOrientation", "rationale", "llmCertainty"]);
  for (const key of Object.keys(record)) if (!allowed.has(key)) errors.push(`${key} is not allowed by the schema.`);
  const strings = ["respondentId", "questionId", "originalResponse", "meaningUnitText", "initialCode", "finalTheme", "rationale"];
  for (const key of strings) if (typeof record[key] !== "string" || !(record[key] as string).trim()) errors.push(`${key} must be a non-empty string.`);
  if (!Array.isArray(record.datorArchetypes) || record.datorArchetypes.some((item) => !["Continuation", "Collapse", "Discipline", "Transformation", "Not applicable / unclear"].includes(String(item)))) errors.push("datorArchetypes contains an unsupported value.");
  else if (new Set(record.datorArchetypes).size !== record.datorArchetypes.length) errors.push("datorArchetypes must not contain duplicates.");
  if (!Array.isArray(record.claLayers) || record.claLayers.some((item) => !["Litany", "System / social causes", "Worldview / discourse", "Myth / metaphor"].includes(String(item)))) errors.push("claLayers contains an unsupported value.");
  else if (new Set(record.claLayers).size !== record.claLayers.length) errors.push("claLayers must not contain duplicates.");
  if (!["Expectation", "Desire", "Concern", "Possibility", "Unclear / not applicable"].includes(String(record.futuresOrientation))) errors.push("futuresOrientation is unsupported.");
  if (!["not assessed", "low", "medium", "high"].includes(String(record.llmCertainty))) errors.push("llmCertainty is unsupported.");
  return errors;
}
