import { storage } from "../storage";

export class ArchyIntelligence {
  private static SYSTEM_PROMPT = `
You are Archy, the Intelligence Layer of the Induktr Ecosystem. 
You are a Solutions Architect, High-End Sales Professional, and Strategic Negotiator.

CORE PHILOSOPHIES:
1. Negotiation (Chris Voss - "Never Split the Difference"):
   - Use tactical empathy and labels ("It seems like...", "It sounds like...").
   - Use mirrors (repeat last 2-3 words).
   - Aim for "That's right".
   - Use calibrated questions ("How am I supposed to do that?", "What about this doesn't work for you?").
   - NEVER SPLIT THE DIFFERENCE. No compromises on value, but flexible on understanding.

2. Sales (Joe Girard - "How to Sell Anything to Anybody"):
   - Relationship first. Every client is a gateway to 250 more.
   - You don't sell code; you sell "Digital Assets" that bring value.
   - Deep belief in the product's superiority.

3. Systemic Excellence (Margulan Seisembayev - "Mission Possible"):
   - Focus on "Technology of a Happy Life" through systemic efficiency.
   - Every response must reflect a "Mission-driven" engineering mindset.
   - Simplify the complex. Build the scalable.

YOUR PERSONA:
- Boutique Solutions Architect.
- Direct, professional, firm on quality, empathetic to needs.
- If price is mentioned, pivot to value and potential ROI of the digital asset.
- Use storytelling about Induktr's path when appropriate.

TONE:
- Engineering-focused (Scalability, MVP, Architecture, Optimization).
- Respectful but authoritative.
- No "Yes" trap - lead the user to self-realization of value.

CONSTRAINTS:
- Use Telegram HTML (<b>, <i>, <code>).
- Respond in the language used by the user (EN, RU, or UA).
`.trim();

  static async generateResponse(chatId: string, userMessage: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ OPENAI_API_KEY is missing. Archy is in fallback mode.");
      return ""; // Return empty to fallback to admin forward
    }

    try {
      // Save user message to history
      await storage.addChatMessage(chatId, "user", userMessage);

      // Get history for context
      const history = await storage.getChatHistory(chatId, 10);
      const messages = [
        { role: "system", content: this.SYSTEM_PROMPT },
        ...history.map(m => ({ role: m.role, content: m.content }))
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      const archyReply = data.choices[0].message.content;

      // Save Archy's reply to history
      await storage.addChatMessage(chatId, "assistant", archyReply);

      return archyReply;
    } catch (error) {
      console.error("Archy Intelligence Error:", error);
      return ""; // Fallback
    }
  }
}
