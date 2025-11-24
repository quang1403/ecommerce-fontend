export const BASE_API = "http://localhost:5000/api";
export const BASE_URL = "http://localhost:5000";

// Gemini AI Configuration
export const GEMINI_API_KEY =
  process.env.REACT_APP_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";
export const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
