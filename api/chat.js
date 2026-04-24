/**
 * Sprout Lawn & Landscape — Chatbot API Endpoint
 *
 * Receives chat messages from /js/chatbot.js, calls Anthropic Claude API,
 * returns response. Reads system prompt from chatbot-prompt.md (sibling file).
 *
 * Uses prompt caching to keep costs low at scale.
 *
 * Env vars required:
 *   ANTHROPIC_API_KEY — set in Vercel project Environment Variables
 */

const fs = require('fs');
const path = require('path');

// Load system prompt once at cold-start (cached for warm invocations)
const SYSTEM_PROMPT = fs.readFileSync(
  path.join(__dirname, 'chatbot-prompt.md'),
  'utf-8'
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 500; // Keep responses tight (chatbot, not essay generator)
const MAX_HISTORY = 20; // Cap conversation history to prevent runaway costs

module.exports = async function handler(req, res) {
  // --- CORS (allows widget on www.sproutlawns.com to call this endpoint) ---
  res.setHeader('Access-Control-Allow-Origin', 'https://www.sproutlawns.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- Validate API key is configured ---
  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set in environment');
    return res.status(500).json({
      error: "Sorry, I'm having trouble connecting. Please try again or call us at (317) 900-7151."
    });
  }

  // --- Parse and validate request body ---
  let messages;
  try {
    messages = req.body && req.body.messages;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  // Validate each message
  const validMessages = messages.filter(function (m) {
    return m
      && (m.role === 'user' || m.role === 'assistant')
      && typeof m.content === 'string'
      && m.content.length > 0
      && m.content.length < 2000; // Per-message length cap
  });

  if (validMessages.length === 0) {
    return res.status(400).json({ error: 'No valid messages in request' });
  }

  // Cap conversation length (oldest first dropped)
  const recentMessages = validMessages.slice(-MAX_HISTORY);

  // --- Call Anthropic API ---
  try {
    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // System prompt with caching enabled — cuts cost ~70% on cached reads
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' }
          }
        ],
        messages: recentMessages
      })
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error('Anthropic API error:', apiResponse.status, errorBody);
      return res.status(500).json({
        error: "Sorry, I'm having trouble responding right now. Please try again, or call us at (317) 900-7151."
      });
    }

    const data = await apiResponse.json();

    // Extract assistant's text response
    const assistantText = (data.content && data.content[0] && data.content[0].text)
      || "Sorry, I didn't quite catch that. Could you ask again?";

    // Optional usage logging (visible in Vercel function logs)
    if (data.usage) {
      console.log('Chat response sent', {
        input_tokens: data.usage.input_tokens,
        output_tokens: data.usage.output_tokens,
        cache_read_tokens: data.usage.cache_read_input_tokens,
        cache_creation_tokens: data.usage.cache_creation_input_tokens
      });
    }

    return res.status(200).json({
      message: assistantText
    });

  } catch (error) {
    console.error('Chat handler error:', error);
    return res.status(500).json({
      error: "Sorry, something went wrong. Please try again or call us at (317) 900-7151."
    });
  }
};
