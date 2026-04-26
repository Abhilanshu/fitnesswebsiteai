const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
let genAI;

if (API_KEY && !API_KEY.includes('your_gemini')) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

const parseCrisisMessage = async (message) => {
  // If no AI, use regex-based fallback
  if (!genAI) {
    console.log("No Gemini API key found, using fallback parser.");
    return mockParse(message);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Extract structured data from the following NGO field report or WhatsApp message:
    "${message}"

    Respond ONLY with a JSON object containing:
    - category (one of: Medical, Food, Education, Shelter, Other)
    - urgency (integer 1-5, where 5 is most critical)
    - affectedPeople (integer)
    - location (string)
    - description (brief summary)

    If any value is missing, use a reasonable default.
  `;

  try {
    if (!genAI) throw new Error("No Gemini API key provided");
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Extract JSON from response (handling potential markdown formatting)
    const jsonStr = text.match(/\{.*\}/s)[0];
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Parsing Error (Falling back to mock):", error.message);
    return mockParse(message); // Fallback on error
  }
};

const mockParse = (message) => {
  const msg = message.toLowerCase();
  let category = "Other";
  if (msg.includes("med") || msg.includes("injur") || msg.includes("hosp")) category = "Medical";
  else if (msg.includes("food") || msg.includes("hungr") || msg.includes("eat")) category = "Food";
  else if (msg.includes("shelter") || msg.includes("home") || msg.includes("stay")) category = "Shelter";
  else if (msg.includes("school") || msg.includes("teach") || msg.includes("educ")) category = "Education";

  let urgency = 3;
  if (msg.includes("urgent") || msg.includes("critical") || msg.includes("die") || msg.includes("emergency")) urgency = 5;
  else if (msg.includes("help") || msg.includes("soon")) urgency = 4;

  const peopleMatch = msg.match(/(\d+)\s*people/) || msg.match(/(\d+)\s*person/);
  const affectedPeople = peopleMatch ? parseInt(peopleMatch[1]) : 5;

  return {
    category,
    urgency,
    affectedPeople,
    location: "Unknown Location",
    description: message.substring(0, 100)
  };
};

module.exports = { parseCrisisMessage };
