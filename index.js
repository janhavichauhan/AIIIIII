const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const OpenAI = require("openai");
const googleTTS = require("google-tts-api");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  progress: Object,
  transcripts: [String],
});
const User = mongoose.model("User", UserSchema);

// OpenAI Setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// AI-Generated Quiz
app.post("/generate-quiz", async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: `Generate a ${difficulty} level quiz on ${topic}.` }],
    });
    res.json({ quiz: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI-Generated Course Content
app.post("/generate-content", async (req, res) => {
  try {
    const { topic } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: `Generate course content on ${topic}.` }],
    });
    res.json({ content: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Summarize Content
app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: text },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );
    res.json({ summary: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
