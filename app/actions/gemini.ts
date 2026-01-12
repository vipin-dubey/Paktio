'use server'

import { z } from 'zod'

const contractSchema = z.object({
  title: z.string(),
  blocks: z.array(z.object({
    id: z.string(),
    type: z.enum(['header', 'clause', 'list', 'footer']),
    content: z.string(),
  })),
  legal_context: z.string(),
})

export async function generateContract(prompt: string, locale: string = 'en') {
  // This would eventually use Vertex AI / Gemini 1.5 Pro
  // For now, I'll return a structured mock that matches the schema

  const systemInstruction = `You are the Paktio Legal Architect. Your output must be ONLY a raw JSON object. Use the following schema:
  {
    "title": "Contract Title",
    "blocks": [
      { "id": "uuid", "type": "header|clause|list|footer", "content": "text content" }
    ],
    "legal_context": "Reference regional law based on user input"
  }
  Maintain a Scandinavian minimalist tone: clear, direct, and avoiding archaic legalese.`

  console.log(`Generating contract with prompt: ${prompt} for locale: ${locale}`)

  // Simulated Gemini Response
  const mockResponse = {
    title: "Standard Service Agreement",
    blocks: [
      { id: "1", type: "header", content: "Service Agreement" },
      { id: "2", type: "clause", content: "This agreement is made between the Provider and the Client..." },
      { id: "3", type: "clause", content: "The services shall be performed with due diligence and according to industry standards." },
      { id: "4", type: "footer", content: "Signed and dated electronically." }
    ],
    legal_context: locale === 'no' ? 'Norwegian Avtaleloven' : 'Global Legal Standards'
  }

  return contractSchema.parse(mockResponse)
}
