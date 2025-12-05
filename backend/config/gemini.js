// import { GoogleGenerativeAI } from "@google/generative-ai";

// export const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// // prefer pro model for reasoning
// export const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro" });


// // config/gemini.js
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI("AIzaSyC1nhlfwtLew1mrK3P7VZNU7Dd02iuqpcA");

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-pro",
// });

// module.exports = model;




// -------------------------------------------------------------
// FIX for Node.js v22 (Gemini SDK needs a fetch polyfill)
// -------------------------------------------------------------
globalThis.fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Instead of hardcoding API Key, load from .env
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.0-flash-lite"
});

module.exports = model;
