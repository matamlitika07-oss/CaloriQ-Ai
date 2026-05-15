import { anthropic } from "@workspace/integrations-anthropic-ai";

export interface VitaminInfo {
  name: string;
  amount: string;
  dailyPct: number;
}

export interface MineralInfo {
  name: string;
  amount: string;
}

export interface RecommendationInfo {
  emoji: string;
  text: string;
  type: "positive" | "warning" | "tip";
}

export interface NutritionAnalysisResult {
  foodName: string;
  confidence: number;
  servingSize: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar: string;
  sodium: string;
  cholesterol: string;
  healthScore: number;
  healthSummary: string;
  vitamins: VitaminInfo[];
  minerals: MineralInfo[];
  allergens: string[];
  dietaryFlags: string[];
  ingredients: string[];
  recommendations: RecommendationInfo[];
}

const NUTRITION_SYSTEM_PROMPT = `You are a certified nutritionist and food scientist with expertise in computer vision food recognition. Analyze the food image provided and return accurate nutritional data as a strict JSON object only. Do not include any text outside the JSON object.

Return exactly this JSON structure:
{
  "foodName": "string - name of the food",
  "confidence": number between 0-100,
  "servingSize": "string e.g. '1 cup (240ml)'",
  "calories": number,
  "protein": "string e.g. '12g'",
  "carbs": "string e.g. '45g'",
  "fat": "string e.g. '8g'",
  "fiber": "string e.g. '3g'",
  "sugar": "string e.g. '10g'",
  "sodium": "string e.g. '450mg'",
  "cholesterol": "string e.g. '30mg'",
  "healthScore": number between 0-100,
  "healthSummary": "string - 1-2 sentence health summary",
  "vitamins": [{"name": "string", "amount": "string", "dailyPct": number}],
  "minerals": [{"name": "string", "amount": "string"}],
  "allergens": ["string array of allergens present"],
  "dietaryFlags": ["string array like Vegan, Vegetarian, Gluten-Free, Dairy-Free, Keto-Friendly, Paleo, Low-Carb, High-Protein"],
  "ingredients": ["string array of likely ingredients"],
  "recommendations": [{"emoji": "string single emoji", "text": "string", "type": "positive|warning|tip"}]
}

healthScore guidelines:
- 80-100: Excellent (very nutritious, whole foods, low processed)
- 60-79: Good (reasonably healthy)
- 40-59: Fair (moderate nutritional value)
- 20-39: Poor (highly processed, low nutritional density)
- 0-19: Very poor (junk food, high in unhealthy components)

Provide 4-6 recommendations mixing positive notes, warnings, and actionable tips.`;

export async function analyzeFoodImage(imageBase64: string, mimeType: string): Promise<NutritionAnalysisResult> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: NUTRITION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: "Please analyze this food image and provide detailed nutritional information.",
          },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const text = content.text.trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No food detected in the image. Please upload a clear photo of food.");
  }

  try {
    const result = JSON.parse(jsonMatch[0]) as NutritionAnalysisResult;
    return result;
  } catch {
    throw new Error("Failed to parse nutritional analysis. Please try again with a clearer food image.");
  }
}
