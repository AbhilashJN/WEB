const axios = require("axios");
const {generalQuery, stockAnalyze, portfolioAdvice} = require("../helpers/promptGeneration")

/*

curl "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer GEMINI_API_KEY" \
-d '{
    "model": "gemini-2.0-flash",
    "messages": [
        {"role": "user", "content": "Explain to me how AI works"}
    ]
    }'

*/

const chatWithAI = async (req, res) => {
  const { message } = req.body;

  const token = "AIzaSyBsFoGt1d-82xVUOLIjzWy8ITyAd_ZCxko"
  const headersConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  if (!message) {
    return res.status(400).json({ reply: 'Message is required.' });
  }

  try {
    const msg = generalQuery(message);
    console.log("Full prompt",msg);
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      model: 'gemini-2.0-flash', 
      messages: [
        {"role": "user", "content": msg}
      ]
    },headersConfig);

    console.log(response.data.choices[0].message);

    const reply = response.data?.choices[0].message.content || 'No response received from model.';
    res.json({ reply });
  } catch (err) {
    console.log('Gemini error1:', err.message);
    res.status(500).json({ reply: 'Gemini API error' });
  }
};


const aiStockAnalyze =async (req, res) => {
  const {symbol} = req.body;
  const token = "AIzaSyBsFoGt1d-82xVUOLIjzWy8ITyAd_ZCxko"
  const headersConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  try {
    const {fullPrompt, stockInfo} = await stockAnalyze(symbol);
    const msg = fullPrompt;
    console.log("Full prompt",msg);
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      model: 'gemini-2.0-flash', 
      messages: [
        {"role": "user", "content": msg}
      ]
    },headersConfig);

    console.log(response.data.choices[0].message);

    const reply = response.data?.choices[0].message.content || 'No response received from model.';
    res.json({ reply, stockInfo });
  } catch (err) {
    console.log('Gemini error1:', err.message);
    res.status(500).json({ reply: 'Gemini API error' });
  }
}


const aiAdvice = async(req,res) =>{
  const {message} = req.body;
  const userId = req.user.id;
  const token = "AIzaSyBsFoGt1d-82xVUOLIjzWy8ITyAd_ZCxko"
  const headersConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };
  try {
    const fullPrompt = await portfolioAdvice(message, userId);
    const msg = fullPrompt;
    console.log("Full prompt",msg);
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      model: 'gemini-2.0-flash', 
      messages: [
        {"role": "user", "content": msg}
      ]
    },headersConfig);

    console.log(response.data.choices[0].message);

    const reply = response.data?.choices[0].message.content || 'No response received from model.';
    res.json({ reply });
  } catch (err) {
    console.log('Gemini error2:', err.message);
    res.status(500).json({ reply: 'Gemini API error' });
  }
}

module.exports = { chatWithAI,aiStockAnalyze,aiAdvice };
