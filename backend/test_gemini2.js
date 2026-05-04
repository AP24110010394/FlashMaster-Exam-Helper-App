const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const text = "Machine learning is a field of study in artificial intelligence concerned with the development and study of statistical algorithms that can learn from data and generalize to unseen data, and thus perform tasks without explicit instructions. Recently, artificial neural networks have been able to surpass many previous approaches in performance.";
const prompt = `Generate a JSON array of flashcards from the following text. 
Return ONLY valid JSON. Limit answers to 1-2 lines. Remove duplicates.
Format: [{"question": "...", "answer": "...", "difficulty": "unrated"}]
Text: ${text.substring(0, 10000)}`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  console.log("Running...");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let rawContent = response.text;
    console.log("----- RAW CONTENT START -----");
    console.log(rawContent);
    console.log("----- RAW CONTENT END -----");

    if (rawContent.includes('```json')) {
      rawContent = rawContent.split('```json')[1].split('```')[0].trim();
    } else if (rawContent.includes('```')) {
      rawContent = rawContent.split('```')[1].split('```')[0].trim();
    }

    const parsed = JSON.parse(rawContent);
    console.log("Parsed Array Length:", parsed.length);
    console.log("Parsed Array:", parsed);
  } catch (e) {
    console.error("Error:", e.message);
  }
}

run();
