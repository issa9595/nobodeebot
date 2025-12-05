require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { OPENAI_API_KEY: API_KEY } = require("../secrets");
const BASE_URL = "https://api.openai.com/v1";

exports.fetchOpenAi = async (endpoint, { method = "GET", data = null }) => {
  try {
    if (!endpoint) throw new Error("fetchOpenAi function requires an endpoint");

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      ...(data && { body: JSON.stringify(data) }),
    });
    const responseBody = await response.json();
    return responseBody;
  } catch (err) {
    throw new Error(err.code);
  }
};
