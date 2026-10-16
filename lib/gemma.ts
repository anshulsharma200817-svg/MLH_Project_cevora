/**
 * CEVORA PLATFORM — Gemma 4 AI Integration
 *
 * Google AI Studio powered by the @google/generative-ai SDK.
 * All AI functions (risk scoring, NIT generation, monitoring, coordination,
 * triggering, map insights, layouting, and decisions) run through Gemma 4.
 *
 * Environment variable: GEMMA_API_KEY  (Google AI Studio API key)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

type GemmaJsonResult = Record<string, unknown>;

type GemmaResponseOptions = {
  prompt: string;
  fallback: GemmaJsonResult;
};

const gemmaApiKey = process.env.GEMMA_API_KEY;
const gemmaClient = gemmaApiKey ? new GoogleGenerativeAI(gemmaApiKey) : null;

// Gemma 4 model name. Falls back to gemini-1.5-flash if Gemma 4 is not yet
// available on Google AI Studio in your region.
const MODEL_NAME = process.env.GEMMA_MODEL || 'gemma-4';
const FALLBACK_MODEL = 'gemini-1.5-flash';

const extractJson = (text: string): GemmaJsonResult | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const codeBlockMatch =
    trimmed.match(/```json\s*([\s\S]*?)```/i) ??
    trimmed.match(/```\s*([\s\S]*?)```/i);
  const jsonText = codeBlockMatch?.[1]?.trim() ?? trimmed;

  try {
    return JSON.parse(jsonText) as GemmaJsonResult;
  } catch {
    return null;
  }
};

const generateGemmaJson = async ({
  prompt,
  fallback,
}: GemmaResponseOptions): Promise<GemmaJsonResult> => {
  if (!gemmaClient) {
    return fallback;
  }

  let lastError: unknown = null;

  // Try Gemma 4 first, then fall back to Gemini 1.5 Flash.
  for (const modelName of [MODEL_NAME, FALLBACK_MODEL]) {
    try {
      const model = gemmaClient.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = extractJson(text);
      if (parsed) return parsed;
      return fallback;
    } catch (error) {
      lastError = error;
      // If the model isn't found, try the fallback model instead of failing.
      continue;
    }
  }

  console.error('Gemma AI error:', lastError);
  return fallback;
};

const stringifyPayload = (payload: unknown) => JSON.stringify(payload ?? {}, null, 2);

/* ------------------------------------------------------------------ */
/*  Risk scoring (replaces Groq scoreRisk)                            */
/* ------------------------------------------------------------------ */

export async function scoreRisk(params: {
  project_title: string;
  dept: string;
  clashing_dept: string;
  overlap_meters: number;
  combined_cost: number;
}): Promise<{
  waste_inr: number;
  risk_score: number;
  recommendation: string;
}> {
  const prompt = `You are an Indian infrastructure risk analyst. Given two overlapping government projects on the same road in Gwalior, analyze this scenario:

Project 1: ${params.dept} - ${params.project_title}
Project 2: ${params.clashing_dept}
Overlap distance: ${params.overlap_meters} meters
Combined cost: ₹${params.combined_cost.toLocaleString('en-IN')}

Calculate and provide in JSON format only (no markdown, no explanation):
1. Total financial waste in INR (estimate 15-25% of combined cost)
2. Risk score 1-10 (higher = worse)
3. Recommended action: "merge", "sequence", or "optimize"

Return ONLY valid JSON: {"waste_inr": number, "risk_score": number, "recommendation": "string"}`;

  const fallback = {
    waste_inr: Math.round(params.combined_cost * 0.2),
    risk_score: 8,
    recommendation: 'merge',
  };

  const result = await generateGemmaJson({ prompt, fallback });
  return {
    waste_inr: typeof result.waste_inr === 'number' ? result.waste_inr : fallback.waste_inr,
    risk_score: typeof result.risk_score === 'number' ? result.risk_score : fallback.risk_score,
    recommendation:
      typeof result.recommendation === 'string'
        ? result.recommendation
        : fallback.recommendation,
  };
}

/* ------------------------------------------------------------------ */
/*  NIT generation (replaces Groq generateNIT)                        */
/* ------------------------------------------------------------------ */

export async function generateNIT(projects: any[]): Promise<string> {
  const projectsText = projects
    .map((p) => `- ${p.dept}: ${p.title} (₹${p.cost?.toLocaleString('en-IN') ?? 'N/A'})`)
    .join('\n');

  const prompt = `Generate a combined NIT (Notice Inviting Tender) document in formal Indian government format for the following merged infrastructure projects in Gwalior city:

${projectsText}

Include in plain text format:
1. NIT number: NIT/CEVORA/2026/001
2. Scope of work for all departments
3. Estimated combined cost in INR
4. Timeline (start: 2026-03-01, end: 2026-03-25)
5. Eligibility criteria for contractors
6. Submission deadline

Keep response under 300 words. Return ONLY the NIT document text, no markdown, no preamble.`;

  const fallback = `NIT/CEVORA/2026/001
Notice Inviting Tender for merged infrastructure projects in Gwalior.
Scope of work: ${projects.map((p) => p.title).join(', ')}.
Estimated combined cost: ₹${projects.reduce((s, p) => s + (p.cost || 0), 0).toLocaleString('en-IN')}.
Timeline: 2026-03-01 to 2026-03-25.`;

  const result = await generateGemmaJson({
    prompt,
    fallback: { nit: fallback },
  });

  return typeof result.nit === 'string' ? result.nit : fallback;
}

/* ------------------------------------------------------------------ */
/*  AI Monitoring (replaces Gemini)                                   */
/* ------------------------------------------------------------------ */

export const getAiMonitoringInsights = (payload: unknown) =>
  generateGemmaJson({
    prompt: `You are an infrastructure monitoring analyst for Gwalior city. Review the input JSON and return ONLY valid JSON with fields: summary, risk_level, anomalies (array), recommended_actions (array).

Input:
${stringifyPayload(payload)}`,
    fallback: {
      summary: 'Monitoring data received. No anomalies detected.',
      risk_level: 'low',
      anomalies: [],
      recommended_actions: ['Continue live monitoring.'],
    },
  });

export const getAiCoordinationPlan = (payload: unknown) =>
  generateGemmaJson({
    prompt: `You are a coordination planner for city infrastructure. Review the input JSON and return ONLY valid JSON with fields: coordination_plan, dependencies (array), next_steps (array).

Input:
${stringifyPayload(payload)}`,
    fallback: {
      coordination_plan: 'Align timelines across departments and confirm a shared work window.',
      dependencies: [],
      next_steps: ['Schedule an inter-department review meeting.'],
    },
  });

export const getAiTriggeringResponse = (payload: unknown) =>
  generateGemmaJson({
    prompt: `You are an alerting engine. Review the input JSON and return ONLY valid JSON with fields: trigger, priority, reason, recommended_actions (array).

Input:
${stringifyPayload(payload)}`,
    fallback: {
      trigger: 'monitor',
      priority: 'medium',
      reason: 'Awaiting verified risk signals before escalation.',
      recommended_actions: ['Continue monitoring and re-evaluate in 30 minutes.'],
    },
  });

export const getMapMonitoringInsights = (payload: unknown) =>
  generateGemmaJson({
    prompt: `You are a GIS monitoring assistant. Review the input JSON and return ONLY valid JSON with fields: anomalies (array), areas_to_review (array), confidence (0-1).

Input:
${stringifyPayload(payload)}`,
    fallback: {
      anomalies: [],
      areas_to_review: [],
      confidence: 0.45,
    },
  });

export const getMapLayoutRecommendations = (payload: unknown) =>
  generateGemmaJson({
    prompt: `You are a GIS layout advisor. Review the input JSON and return ONLY valid JSON with fields: layout_changes (array), layer_order (array), rationale.

Input:
${stringifyPayload(payload)}`,
    fallback: {
      layout_changes: ['Increase label spacing for dense project clusters.'],
      layer_order: ['High-risk zones', 'Active projects', 'Planned projects', 'Base map'],
      rationale: 'Highlights risk context before detail layers.',
    },
  });

export const getAiDecision = (payload: unknown) =>
  generateGemmaJson({
    prompt: `You are an infrastructure decision engine. Review the input JSON and return ONLY valid JSON with fields: decision, priority, owner, reasoning, next_steps (array).

Input:
${stringifyPayload(payload)}`,
    fallback: {
      decision: 'sequence',
      priority: 'high',
      owner: 'Department coordination cell',
      reasoning: 'Clash risk requires sequencing to prevent rework.',
      next_steps: ['Confirm shared work window.', 'Issue joint work order.'],
    },
  });