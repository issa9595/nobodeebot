const BASE_URL = "https://newsapi.org/v2";
const { NEWS_API_KEY: API_KEY } = require("../secrets");

exports.fetchNewsApi = async (endpoint, options = {}) => {
  const { method = "GET", params = {} } = options;
  try {
    const url = `${BASE_URL}${endpoint}&apiKey=${API_KEY}`;
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Erreur lors de la requête à l'API News:", err);
    throw err;
  }
};
