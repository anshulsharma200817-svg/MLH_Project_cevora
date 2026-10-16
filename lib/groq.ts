import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function scoreRisk(params: {
  project_title: string;
  dept: string;
  clashing_dept: string;
  overlap_meters: number;
  combined_cost: number;
}): Promise<{ waste_inr: number; risk_score: number; recommendation: string }> {
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

  try {
    const message = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    try {
      const content = message.choices[0]?.message?.content;
      if (content) {
        // Extract JSON from potential markdown code blocks
        let jsonStr = content;
        if (jsonStr.includes('```json')) {
          jsonStr = jsonStr.split('```json')[1].split('```')[0];
        } else if (jsonStr.includes('```')) {
          jsonStr = jsonStr.split('```')[1].split('```')[0];
        }
        const result = JSON.parse(jsonStr.trim());
        return result;
      }
    } catch (error) {
      console.error('Error parsing Groq response:', error);
    }
  } catch (error) {
    console.error('Error calling Groq:', error);
  }

  // Fallback response
  return {
    waste_inr: Math.round(params.combined_cost * 0.2),
    risk_score: 8,
    recommendation: 'merge'
  };
}

export async function generateNIT(projects: any[]): Promise<string> {
  const projectsText = projects
    .map(p => `- ${p.dept}: ${p.title} (₹${p.cost.toLocaleString('en-IN')})`)
    .join('\n');

  const prompt = `Generate a combined NIT (Notice Inviting Tender) document in formal Indian government format for the following merged infrastructure projects in Gwalior city:

${projectsText}

Include in plain text format:
1. NIT number: NIT/KARANA/2026/001
2. Scope of work for all departments
3. Estimated combined cost in INR
4. Timeline (start: 2026-03-01, end: 2026-03-25)
5. Eligibility criteria for contractors
6. Submission deadline

Keep response under 300 words.`;

  try {
    const message = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.choices[0]?.message?.content;
    if (content) {
      return content;
    }
  } catch (error) {
    console.error('Error generating NIT with Groq:', error);
  }

  return 'NIT document could not be generated';
}
