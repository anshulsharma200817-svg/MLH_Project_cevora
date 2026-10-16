import { GoogleGenerativeAI } from '@google/generative-ai';

type GeminiJsonResult = Record<string, unknown>;

type GeminiResponseOptions = {
  prompt: string;
  fallback: GeminiJsonResult;
};

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiClient = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const MODEL_NAME = 'gemini-1.5-flash';

const extractJson = (text: string): GeminiJsonResult | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const codeBlockMatch = trimmed.match(/```json\s*([\s\S]*?)```/i) ?? trimmed.match(/```\s*([\s\S]*?)```/i);
  const jsonText = codeBlockMatch?.[1]?.trim() ?? trimmed;

  try {
    return JSON.parse(jsonText) as GeminiJsonResult;
  } catch {
    return null;
  }
};

const generateGeminiJson = async ({ prompt, fallback }: GeminiResponseOptions): Promise<GeminiJsonResult> => {
  if (!geminiClient) {
    return fallback;
  }

  const model = geminiClient.getGenerativeModel({ model: MODEL_NAME });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = extractJson(text);
  return parsed ?? fallback;
};

const stringifyPayload = (payload: unknown) => JSON.stringify(payload ?? {}, null, 2);

export const getAiMonitoringInsights = (payload: unknown) =>
  generateGeminiJson({
    prompt: `You are an infrastructure monitoring analyst for Gwalior city. Review the input JSON and return ONLY valid JSON with fields: summary, risk_level, anomalies (array), recommended_actions (array).\n\nInput:\n${stringifyPayload(payload)}`,
    fallback: {
      summary: 'Monitoring data received. No anomalies detected.',
      risk_level: 'low',
      anomalies: [],
      recommended_actions: ['Continue live monitoring.'],
    },
  });

export const getAiCoordinationPlan = (payload: unknown) =>
  generateGeminiJson({
    prompt: `You are a coordination planner for city infrastructure. Review the input JSON and return ONLY valid JSON with fields: coordination_plan, dependencies (array), next_steps (array).\n\nInput:\n${stringifyPayload(payload)}`,
    fallback: {
      coordination_plan: 'Align timelines across departments and confirm a shared work window.',
      dependencies: [],
      next_steps: ['Schedule an inter-department review meeting.'],
    },
  });

export const getAiTriggeringResponse = (payload: unknown) =>
  generateGeminiJson({
    prompt: `You are an alerting engine. Review the input JSON and return ONLY valid JSON with fields: trigger, priority, reason, recommended_actions (array).\n\nInput:\n${stringifyPayload(payload)}`,
    fallback: {
      trigger: 'monitor',
      priority: 'medium',
      reason: 'Awaiting verified risk signals before escalation.',
      recommended_actions: ['Continue monitoring and re-evaluate in 30 minutes.'],
    },
  });

export const getMapMonitoringInsights = (payload: unknown) =>
  generateGeminiJson({
    prompt: `You are a GIS monitoring assistant. Review the input JSON and return ONLY valid JSON with fields: anomalies (array), areas_to_review (array), confidence (0-1).\n\nInput:\n${stringifyPayload(payload)}`,
    fallback: {
      anomalies: [],
      areas_to_review: [],
      confidence: 0.45,
    },
  });

export const getMapLayoutRecommendations = (payload: unknown) =>
  generateGeminiJson({
    prompt: `You are a GIS layout advisor. Review the input JSON and return ONLY valid JSON with fields: layout_changes (array), layer_order (array), rationale.\n\nInput:\n${stringifyPayload(payload)}`,
    fallback: {
      layout_changes: ['Increase label spacing for dense project clusters.'],
      layer_order: ['High-risk zones', 'Active projects', 'Planned projects', 'Base map'],
      rationale: 'Highlights risk context before detail layers.',
    },
  });

export const getAiDecision = (payload: unknown) =>
  generateGeminiJson({
    prompt: `You are an infrastructure decision engine. Review the input JSON and return ONLY valid JSON with fields: decision, priority, owner, reasoning, next_steps (array).\n\nInput:\n${stringifyPayload(payload)}`,
    fallback: {
      decision: 'sequence',
      priority: 'high',
      owner: 'Department coordination cell',
      reasoning: 'Clash risk requires sequencing to prevent rework.',
      next_steps: ['Confirm shared work window.', 'Issue joint work order.'],
    },
  });
