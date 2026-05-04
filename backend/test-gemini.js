const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const ai = new GoogleGenAI({});
const text = 'CSE-209 DBMS REPORT 1.pdf 42 characters text...';
const prompt = `Generate a JSON array of flashcards from the following text. 
Return ONLY valid JSON. Limit answers to 1-2 lines. Remove duplicates.
Format: [{"question": "...", "answer": "...", "difficulty": "unrated"}]
Text: ${text.substring(0, 10000)}`;

ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
}).then(res => {
  console.log('RAW RESPONSE TEXT:', res.text);
}).catch(err => {
  console.error('ERROR:', err);
});
