// services/gemini.js

const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Fetches a Gemini AI summary based on the provided notes.
 * @param {string} notes - The text input to summarize.
 * @returns {Promise<string>} - The AI-generated summary or empty string.
 */
async function getGeminiSummary(notes) {
  if (!notes || typeof notes !== 'string' || notes.trim() === "") {
    return "";
  }

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: notes.trim()
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Summary not found.";
    return summary;

  } catch (error) {
    console.error("Error calling Gemini API:", error?.response?.data || error.message);
    return "";
  }
}

module.exports = { getGeminiSummary };
