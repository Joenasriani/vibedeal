import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { SearchParams, VibeDealResponse } from "../types";

// Schema definition for Structured Output - COMMENTED OUT as it's incompatible with googleSearch tool
// const vibeDealSchema: Schema = {
//   type: Type.OBJECT,
//   properties: {
//     product_query: { type: Type.STRING },
//     resolved_product: {
//       type: Type.OBJECT,
//       properties: {
//         title: { type: Type.STRING },
//         sku: { type: Type.STRING },
//         gtin: { type: Type.STRING },
//         notes: { type: Type.STRING },
//       },
//     },
//     location: { type: Type.STRING },
//     currency: { type: Type.STRING },
//     exchange_rate: {
//       type: Type.OBJECT,
//       properties: {
//         rate_to_base: { type: Type.NUMBER },
//         base_currency: { type: Type.STRING },
//         timestamp: { type: Type.STRING },
//       },
//     },
//     offers: {
//       type: Type.ARRAY,
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           rank: { type: Type.INTEGER },
//           seller: { type: Type.STRING },
//           url: { type: Type.STRING },
//           item_price: { type: Type.NUMBER },
//           shipping_cost: { type: Type.NUMBER },
//           taxes: { type: Type.NUMBER },
//           total_landed_price: { type: Type.NUMBER },
//           distance_km: { type: Type.NUMBER },
//           delivery_eta: { type: Type.STRING },
//           stock_status: { type: Type.STRING, enum: ['in_stock', 'limited', 'pre_order', 'out_of_stock'] },
//           seller_rating: { type: Type.NUMBER },
//           review_count: { type: Type.INTEGER },
//           coupon_codes: { type: Type.ARRAY, items: { type: Type.STRING } },
//           warranty: { type: Type.STRING },
//           return_policy: { type: Type.STRING },
//           condition: { type: Type.STRING },
//           risk_level: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
//           verification_notes: { type: Type.STRING },
//         },
//       },
//     },
//     top2_analysis: {
//       type: Type.OBJECT,
//       properties: {
//         offer1: {
//           type: Type.OBJECT,
//           properties: {
//             rank: { type: Type.INTEGER },
//             pros: { type: Type.ARRAY, items: { type: Type.STRING } },
//             cons: { type: Type.ARRAY, items: { type: Type.STRING } },
//             best_for: { type: Type.STRING },
//             warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
//             warranty_comparison: { type: Type.STRING },
//             return_comparison: { type: Type.STRING },
//           },
//         },
//         offer2: {
//           type: Type.OBJECT,
//           properties: {
//             rank: { type: Type.INTEGER },
//             pros: { type: Type.ARRAY, items: { type: Type.STRING } },
//             cons: { type: Type.ARRAY, items: { type: Type.STRING } },
//             best_for: { type: Type.STRING },
//             warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
//             warranty_comparison: { type: Type.STRING },
//             return_comparison: { type: Type.STRING },
//           },
//         },
//       },
//     },
//     optional_features_used: { type: Type.ARRAY, items: { type: Type.STRING } },
//     verification_summary: { type: Type.ARRAY, items: { type: Type.STRING } },
//     timestamp: { type: Type.STRING },
//     // Adding optional price history data for visualization
//     price_history_data: {
//       type: Type.ARRAY,
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           date: { type: Type.STRING },
//           price: { type: Type.NUMBER }
//         }
//       }
//     }
//   },
//   required: ["product_query", "resolved_product", "offers", "top2_analysis", "timestamp", "exchange_rate"],
// };

export const fetchDeals = async (params: SearchParams): Promise<GenerateContentResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing. Please set the API_KEY env variable.");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as VibeDeal, a precise, delivery-aware deal discovery engine.
    
    User Query: ${JSON.stringify(params)}

    Task:
    1. Resolve the product accurately using real-time search if needed.
    2. Provide a detailed, natural language (Markdown) summary of potential deals for the product '${params.product_query}' considering 'delivery_location: ${params.delivery_location}', 'max_distance_km: ${params.max_distance_km}', 'currency: ${params.currency}', and 'condition: ${params.condition}'.
    3. Include information about pricing, shipping, taxes, and stock status in your narrative.
    4. For any potential deals or products mentioned, ensure to use the googleSearch tool to find and provide actual, active URLs as grounding metadata.
    5. Discuss the top offers and any relevant verification notes.
    6. If 'price_history' is enabled in optional features, provide a general trend description in the text.
    7. Generate a comprehensive, human-readable response that incorporates real-time information from search results.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using gemini-2.5-flash which supports googleSearch grounding
      contents: prompt,
      config: {
        // responseMimeType and responseSchema are NOT ALLOWED when using googleSearch tool.
        // The model will return a natural language response (Markdown) and grounding metadata.
        temperature: 0.2, // Low temperature for factual/consistent data
        tools: [{googleSearch: {}}], // Integrate googleSearch for real-time grounding
      },
    });

    // The response.text will now contain natural language/markdown, not JSON.
    // The grounding metadata will be available separately in response.candidates?.[0]?.groundingMetadata.
    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};