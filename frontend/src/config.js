// src/config.js
// Central place to read environment-based configuration
const config = {
  // Backend API base URL
  apiUrl:
    process.env.REACT_APP_API_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:3300/api",

  // Optional: Spoonacular API key if you ever need it on the client
  spoonacularApiKey:
    process.env.REACT_APP_SPOONACULAR_API_KEY ||
    process.env.SPOONACULAR_API_KEY ||
    '',
};

export default config;
  