// backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const fetch = require('node-fetch'); // For making HTTP requests to Hugging Face
const { knowledgeBase } = require('../knowledgeBase'); // Import comprehensive knowledge base

// Simple in-memory session storage for conversation history (in production, use Redis or DB)
const sessions = new Map();

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    // Always handle greetings first, regardless of API key
    const lowerMessage = message.toLowerCase();
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const isGreeting = greetings.some(greet => lowerMessage.includes(greet));
    if (isGreeting) {
      const greetingResponses = [
        "Hi! Welcome to Shoolini University's Feedback Assistant. I'm here to help you with the feedback form. What can I assist you with today? 😊",
        "Hello! Great to see you. As Shoolini Assistant, I can guide you through the feedback process. How may I help? 🤗",
        "Hey there! Ready to tackle the feedback form? Ask me about courses, ratings, or anything academic! 🚀",
        "Good day! I'm Shoolini Assistant, your guide for the feedback system. What would you like to know? 📚"
      ];
      const randomGreeting = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
      return res.json({ reply: randomGreeting });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      // Use comprehensive knowledge base for rule-based responses
      const lowerMessage = message.toLowerCase();
      let reply = knowledgeBase.default;
      for (const [key, value] of Object.entries(knowledgeBase)) {
        if (key !== 'default' && lowerMessage.includes(key)) {
          reply = value;
          break;
        }
      }

      // Advanced sentiment analysis with scoring
      const negativeWords = [
        'frustrated', 'angry', 'annoyed', 'upset', 'disappointed', 'confused', 'stuck', 'error', 'bug', 'slow', 'problem', 'issue', 'fail', 'broken',
        'not working', 'bad', 'hate', 'terrible', 'worst', 'sucks', 'horrible', 'awful', 'disgusting', 'pathetic', 'useless', 'waste', 'stupid',
        'ridiculous', 'absurd', 'crazy', 'mad', 'furious', 'irritated', 'bothered', 'troubled', 'worried', 'sad', 'depressed', 'unhappy',
        'miserable', 'painful', 'difficult', 'hard', 'tough', 'challenging', 'complicated', 'messy', 'chaotic', 'disorganized', 'inefficient',
        'poor', 'weak', 'lame', 'boring', 'dull', 'tedious', 'monotonous', 'repetitive', 'tiresome', 'exhausting', 'overwhelming'
      ];
      const positiveWords = [
        'great', 'excellent', 'love', 'good', 'amazing', 'best', 'awesome', 'happy', 'thank', 'thanks', 'appreciate', 'helpful', 'nice', 'perfect', 'wonderful',
        'fantastic', 'superb', 'outstanding', 'brilliant', 'marvelous', 'splendid', 'fabulous', 'terrific', 'super', 'incredible', 'phenomenal',
        'exceptional', 'remarkable', 'impressive', 'admirable', 'commendable', 'praiseworthy', 'laudable', 'commendable', 'praiseworthy',
        'joyful', 'cheerful', 'delighted', 'pleased', 'satisfied', 'content', 'grateful', 'blessed', 'fortunate', 'lucky', 'privileged',
        'easy', 'simple', 'straightforward', 'convenient', 'comfortable', 'relaxed', 'peaceful', 'calm', 'serene', 'tranquil'
      ];

      const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
      const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
      const sentimentScore = positiveCount - negativeCount;

      // Adjust reply based on sentiment score
      if (sentimentScore < 0) {
        if (sentimentScore < -1) {
          reply = "I'm really sorry to hear that. " + reply;
        } else {
          reply = "I'm sorry to hear that. " + reply;
        }
      } else if (sentimentScore > 0) {
        if (sentimentScore > 1) {
          reply = "That's wonderful! " + reply;
        } else {
          reply = "I'm glad! " + reply;
        }
      }

      // Add emojis based on sentiment score
      if (sentimentScore < 0) {
        reply += " 😔";
      } else if (sentimentScore > 0) {
        reply += " 😊";
      } else {
        reply += " 🤖";
      }

      return res.json({ reply });
    }

    // Get or create session history (last 5 messages for context)
    let history = sessions.get(sessionId) || [];
    history.push({ role: 'user', content: message });
    // Keep only last 5 exchanges
    if (history.length > 10) history = history.slice(-10);

    // Enhanced system prompt with greeting handling
    const systemPrompt = "You are Shoolini Assistant, a friendly expert AI for the Student Feedback System at Shoolini University. Always start conversations with a warm greeting if the user says hi/hello/hey. Then provide accurate, step-by-step guidance on the feedback form: registration (pre-filled), email/name (personal info), course/year selection (B.Tech CSE AI:1-4yrs tech/AI; BBA:1-3yrs business; MBA:1-2yrs management; BCA:1-3yrs computing), subject ratings (1-5 stars for concept clarity), suggestions (constructive ideas). Answer academic queries, encourage completion. Be friendly, concise, use bullet points if helpful. Reference previous messages for context. Greet users personally and make them feel welcome.";

    // Build full prompt with history
    let fullPrompt = systemPrompt + '\n\nConversation History:\n';
    history.forEach(msg => fullPrompt += `${msg.role}: ${msg.content}\n`);
    fullPrompt += `User: ${message}\nAssistant:`;

    // Use improved model: gpt2 for better coherence and Q&A
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_length: 200,
          temperature: 0.8,
          top_p: 0.9,
          return_full_text: false,
          do_sample: true
        }
      }),
    });

    if (!hfResponse.ok) {
      throw new Error(`Hugging Face API error: ${hfResponse.status}`);
    }

    const data = await hfResponse.json();
    let reply = "Thanks for asking! How can I assist with your feedback or studies?";

    if (data && data[0] && data[0].generated_text) {
      reply = data[0].generated_text.trim().replace(/Assistant:/i, '').trim();
      // Add to history
      history.push({ role: 'assistant', content: reply });
      sessions.set(sessionId, history);
    } else if (data.error) {
      console.error("Hugging Face error:", data.error);
      reply = "The AI is processing... Try rephrasing your question about the form!";
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

module.exports = router;
