
import { GoogleGenAI, Type } from "@google/genai";
import { ClaimResult, Policy } from "../types";

// Initialize Gemini Client following the system instructions: use process.env.API_KEY string directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_ADVISOR = `
You are ELIXER, an expert AI assistant specialized in the Insurance industry of Cambodia. 
You speak both English and Khmer fluently. 
Your goal is to assist Users, Agents, Brokers, and Students.
You have access to a "RAG" database (simulated) containing:
1. Cambodian Insurance Law.
2. Products from major Cambodian insurers (Forte, Caminco, etc. - theoretical).
3. Parametric insurance triggers (Weather data, Flood levels in Phnom Penh).
4. Telematic data interpretation.

Always answer politely. If the user asks in Khmer, answer in Khmer. If English, answer in English.
Keep answers concise and helpful.
`;

export const getAdvisorResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ADVISOR,
      },
      history: history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: h.parts
      })),
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Error in Advisor Chat:", error);
    return "Sorry, I am having trouble connecting to the ELIXER network. Please try again.";
  }
};

export const moderateSocialPost = async (content: string): Promise<{ isRelated: boolean; reason?: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following text. Determine if it is related to insurance, financial planning, safety, risk management, or health in the context of Cambodia or general insurance topics.
      
      Text: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isRelated: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
          },
          required: ["isRelated"],
        },
      },
    });

    const json = JSON.parse(response.text || '{}');
    return { isRelated: json.isRelated, reason: json.reason };
  } catch (error) {
    console.error("Moderation Error:", error);
    return { isRelated: true };
  }
};

export const analyzeClaimImage = async (base64Image: string, claimType: string): Promise<ClaimResult> => {
  try {
    // Switching to gemini-3-pro-preview as gemini-2.5-flash-image does not support responseSchema and is optimized for generation, not vision analysis
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `You are a Claims Adjuster AI for ELIXER. 
            Analyze this image for a ${claimType} insurance claim. 
            1. Identify the damage or document type.
            2. Estimate severity (Low, Medium, High).
            3. Determine if it looks authentic (not obviously photoshopped).
            4. Provide an estimated payout range in USD (Simulated).
            
            Return JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            approved: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            estimatedPayout: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as ClaimResult;
  } catch (error) {
    console.error("Claim Analysis Error:", error);
    return {
      approved: false,
      confidence: 0,
      estimatedPayout: "N/A",
      reasoning: "AI Analysis Failed. Manual review required."
    };
  }
};

export const summarizeConcern = async (topic: string, details: string, lang: 'en' | 'km'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user has a concern about: ${topic}. 
      Details: "${details}".
      
      Act as an insurance expert. Summarize this concern into a clear, professional problem statement (1-2 sentences) in ${lang === 'km' ? 'Khmer' : 'English'}.
      It should sound like a formal insurance risk assessment summary.
      
      Output ONLY the summary string.`,
    });
    return response.text || "Uncategorized Risk";
  } catch (error) {
    console.error("Summarization Error:", error);
    return topic;
  }
};

export const constructSentenceFromTopics = async (topics: string[], lang: 'en' | 'km'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Convert this list of topics into a natural, first-person sentence expressing a concern in ${lang === 'km' ? 'Khmer' : 'English'}.
      Topics: ${topics.join(', ')}.
      
      Output ONLY the sentence.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Drafting Error:", error);
    return "";
  }
};

export const generateConcernTopics = async (history: string[], excludedTopics: string[] = []): Promise<Array<{id: string, text: {en: string, km: string}, icon: string}>> => {
  try {
    const context = history.length > 0 
      ? `The user has navigated through: ${history.join(' > ')}. Propose 4-6 specific sub-topics or specific risks related to the last item.` 
      : "Propose 4-6 broad insurance concern categories relevant to people in Cambodia.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an insurance assistant for Cambodia.
      Task: ${context}
      Excluded: ${excludedTopics.join(', ')}
      Generate a JSON list of topics with id, text (en/km), and icon (emoji).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING },
                  km: { type: Type.STRING }
                }
              },
              icon: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Topic Generation Error:", error);
    return [];
  }
};

export const extractPolicyFromImage = async (base64Image: string): Promise<Partial<Policy> | null> => {
  try {
    // Switching to gemini-3-flash-preview for vision understanding; gemini-2.5-flash-image does not support JSON schema/mimeType
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Extract insurance policy details: Provider, Policy Number, Type, Coverage Amount, Expiry (YYYY-MM-DD), Holder. Return JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            provider: { type: Type.STRING },
            policyNumber: { type: Type.STRING },
            type: { type: Type.STRING },
            coverageAmount: { type: Type.STRING },
            expiryDate: { type: Type.STRING },
            holderName: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
        provider: result.provider,
        policyNumber: result.policyNumber,
        type: result.type,
        coverageAmount: result.coverageAmount,
        expiryDate: result.expiryDate ? new Date(result.expiryDate) : new Date(),
        holderName: result.holderName
    };
  } catch (error) {
    console.error("Policy Scan Error:", error);
    return null;
  }
};

export const getSecurityTip = async (password: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a very short (1 sentence) security tip for this password: ${password}. (Do not repeat the password).`,
    });
    return response.text || "Use a unique password.";
  } catch (error) {
    console.error("Security Tip Error:", error);
    return "Stay safe with complex passwords.";
  }
};

export const GeminiService = {
  getAdvisorResponse,
  moderateSocialPost,
  analyzeClaimImage,
  summarizeConcern,
  constructSentenceFromTopics,
  generateConcernTopics,
  extractPolicyFromImage,
  getSecurityTip
};
