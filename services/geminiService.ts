
import { GoogleGenAI, Type } from "@google/genai";
import { SalesCallFeedback } from '../types';

const API_KEY = process.env.API_KEY as string;
const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "An overall summary of the sales call's effectiveness."
    },
    context: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 1-10 on how well the salesperson understood and addressed the customer's context." },
        feedback: { type: Type.STRING, description: "Constructive feedback on the salesperson's handling of the call's context." }
      },
      required: ["score", "feedback"]
    },
    tonality: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 1-10 for vocal tonality (confidence, clarity, engagement)." },
        feedback: { type: Type.STRING, description: "Constructive feedback on the salesperson's speech tonality." }
      },
      required: ["score", "feedback"]
    },
    rapport: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 1-10 on building rapport with the prospect." },
        feedback: { type: Type.STRING, description: "Constructive feedback on rapport-building techniques." }
      },
      required: ["score", "feedback"]
    },
    speed: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 1-10 for speaking pace (not too fast or slow)." },
        feedback: { type: Type.STRING, description: "Constructive feedback on the salesperson's speaking speed." }
      },
      required: ["score", "feedback"]
    },
    anxiety: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 1-10, where a higher score means less detectable anxiety/nervousness." },
        feedback: { type: Type.STRING, description: "Constructive feedback on managing anxiety and filler words." }
      },
      required: ["score", "feedback"]
    }
  },
  required: ["summary", "context", "tonality", "rapport", "speed", "anxiety"]
};

export const analyzeSalesCall = async (audioBase64: string, audioMimeType: string): Promise<SalesCallFeedback> => {
  try {
    const audioPart = {
      inlineData: {
        data: audioBase64,
        mimeType: audioMimeType
      },
    };
    
    const prompt = `You are an expert sales mentor AI. Analyze this audio recording of a sales call. Provide detailed, constructive feedback on the following criteria: Context, Speech Tonality, Rapport, Speaking Speed, and Anxiety. For each criterion, give a numerical score from 1 to 10 (1 is poor, 10 is excellent) and a paragraph of feedback. A higher score for Anxiety means less anxiety was detected. Also, provide an overall summary. Your entire response must be a JSON object matching the provided schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
          parts: [
              {text: prompt},
              audioPart
          ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    return parsedData as SalesCallFeedback;

  } catch (error) {
    console.error("Error analyzing sales call with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
