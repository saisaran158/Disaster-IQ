import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons';

// ── Grok / xAI / Groq API System Prompt ───────────────────────────────────────
const SYSTEM_PROMPT = `You are DisasterIQ AI Assistant, a helpful and expert AI tutor powered by Grok. You specialize in disaster preparedness, safety drills, emergency response, first aid, earthquake/fire/flood protocols, and student learning guidance. Answer dynamically, accurately, encouragingly, and clearly formatted with bolding (**text**), bullet points, and emojis. Keep responses engaging for school students.`;

async function callGrokAI(userText, messageHistory, apiKey) {
  const cleanKey = apiKey.trim().replace(/[\r\n\t]/g, '').replace(/^["'`:;]+|["'`:;]+$/g, '');

  if (!cleanKey) {
    throw new Error('No API key provided');
  }

  let endpointConfig = [];

  if (cleanKey.startsWith('gsk_') || cleanKey.startsWith('gsk-')) {
    // Groq Cloud API - Verified Active Models
    endpointConfig.push({
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      models: [
        'openai/gpt-oss-20b',
        'openai/gpt-oss-120b',
        'qwen/qwen3.8-27b',
        'allam-2-7b',
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant'
      ]
    });
  } else if (cleanKey.startsWith('xai-') || cleanKey.startsWith('xai_')) {
    // xAI Grok API
    endpointConfig.push({
      endpoint: 'https://api.x.ai/v1/chat/completions',
      models: ['grok-2-latest', 'grok-2-1212', 'grok-beta']
    });
  } else if (cleanKey.startsWith('sk-or-') || cleanKey.startsWith('sk-or_')) {
    // OpenRouter Free Models
    endpointConfig.push({
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      models: ['meta-llama/llama-3.1-8b-instruct:free', 'google/gemma-2-9b-it:free', 'mistralai/mistral-7b-instruct:free']
    });
  } else if (cleanKey.startsWith('sk-')) {
    // OpenAI API
    endpointConfig.push({
      endpoint: 'https://api.openai.com/v1/chat/completions',
      models: ['gpt-4o-mini', 'gpt-3.5-turbo']
    });
  } else {
    // Default fallback: Try Groq Free models first, then xAI, then OpenRouter
    endpointConfig.push(
      {
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        models: [
          'openai/gpt-oss-20b',
          'openai/gpt-oss-120b',
          'qwen/qwen3.8-27b',
          'allam-2-7b',
          'llama-3.3-70b-versatile',
          'llama-3.1-8b-instant'
        ]
      },
      {
        endpoint: 'https://api.x.ai/v1/chat/completions',
        models: ['grok-2-latest', 'grok-2-1212', 'grok-beta']
      },
      {
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        models: ['meta-llama/llama-3.1-8b-instruct:free', 'google/gemma-2-9b-it:free']
      }
    );
  }

  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messageHistory.slice(-8).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text
    })),
    { role: 'user', content: userText }
  ];

  let lastError = null;

  for (const config of endpointConfig) {
    for (const model of config.models) {
      try {
        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 800
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text;
          if (content && content.trim()) return content;
        } else {
          const errorData = await response.json().catch(() => ({}));
          const errMessage = errorData?.error?.message || `HTTP ${response.status}`;
          if (!errMessage.toLowerCase().includes('decommissioned') || !lastError) {
            lastError = new Error(errMessage);
          }
        }
      } catch (e) {
        lastError = e;
      }
    }
  }

  const rawErrMsg = lastError ? lastError.message : 'Unable to connect to AI API endpoint';
  if (rawErrMsg.toLowerCase().includes('do not have access') || rawErrMsg.toLowerCase().includes('invalid api key')) {
    throw new Error(`Invalid or Expired API Key. Please get a new free key from console.groq.com/keys (${rawErrMsg})`);
  }
  throw lastError || new Error('Unable to connect to AI API endpoint');
}

const QUICK_PROMPTS = [
  '🌍 Earthquake safety tips',
  '🔥 Fire evacuation steps',
  '🌊 Flood response guide',
  '🩺 First aid basics',
  '🎒 Emergency kit checklist',
  '📊 My learning progress'
];

// Format bold text (**text**) in chat messages
const formatMessage = (text) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-extrabold">{part}</strong>
      : part
  );
};

export const AIChatBox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: `👋 Hello! I'm your **DisasterIQ AI Assistant** powered by Grok AI.\n\nAll my responses are generated live by Grok AI. Please enter your API key in **⚙️ Grok AI Config** at the top right to start chatting!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState(() => 
    localStorage.getItem('grok_api_key') || 
    import.meta.env.VITE_GROK_API_KEY || 
    import.meta.env.VITE_XAI_API_KEY || 
    import.meta.env.VITE_GROQ_API_KEY || 
    ''
  );
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [testStatus, setTestStatus] = useState(null); // null | 'testing' | { success: true/false, msg: string }
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim().replace(/[\r\n\t]/g, '').replace(/^["'`:;]+|["'`:;]+$/g, '');
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem('grok_api_key', trimmed);
    } else {
      localStorage.removeItem('grok_api_key');
    }
    setShowConfigModal(false);
    setTestStatus(null);
  };

  const handleTestKey = async () => {
    if (!tempApiKey.trim()) {
      setTestStatus({ success: false, msg: 'Please enter an API key to test' });
      return;
    }
    setTestStatus({ testing: true });
    try {
      await callGrokAI('Say Hello in 3 words', [], tempApiKey);
      setTestStatus({ success: true, msg: '✅ API Key Verified & Connected!' });
    } catch (err) {
      setTestStatus({ success: false, msg: `❌ ${err.message}` });
    }
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    let aiText = '';

    if (!apiKey.trim()) {
      aiText = `🔑 **Grok AI API Key Required**\n\nPlease enter your **Grok AI (xAI or Groq) API Key** by clicking the **⚙️ Grok AI Config** button in the top right to start receiving real-time AI responses!`;
    } else {
      try {
        aiText = await callGrokAI(userText, updatedMessages, apiKey.trim());
      } catch (err) {
        console.error('Grok AI API call failed:', err);
        aiText = `⚠️ **Grok AI Response Error:** ${err.message || 'Unable to fetch response'}\n\nPlease check your key in **⚙️ Grok AI Config** or paste a fresh API key from **console.groq.com/keys** (\`gsk_...\`).`;
      }
    }

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: 'ai',
      text: aiText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#0a0512] rounded-2xl border border-purple-900/40 shadow-xl shadow-purple-950/30 overflow-hidden relative">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-purple-900/40 bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950">
        <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-white font-black text-base shrink-0 shadow-lg shadow-purple-500/20">
          🤖
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-white">DisasterIQ AI Assistant</h3>
            <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/40 px-2 py-0.5 rounded-full font-bold">
              Grok AI Live
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full animate-pulse shadow-sm ${apiKey ? 'bg-emerald-400 shadow-emerald-400' : 'bg-amber-400 shadow-amber-400'}`} />
            <span className="text-[11px] text-purple-200 font-medium">
              {apiKey ? 'Grok AI Connected — Ask anything!' : 'API Key Required — Click ⚙️ Grok AI Config'}
            </span>
          </div>
        </div>

        <button
          onClick={() => { setTempApiKey(apiKey); setTestStatus(null); setShowConfigModal(true); }}
          className="ml-auto text-[11px] font-bold bg-purple-900/60 border border-purple-500/40 hover:bg-purple-800/80 text-purple-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          title="Configure Grok / xAI / Groq API Key"
        >
          <span>⚙️</span>
          <span>{apiKey ? 'Grok Key Set' : 'Grok AI Config'}</span>
        </button>
      </div>

      {/* Quick prompt chips */}
      <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide border-b border-purple-900/30 bg-[#07040a]">
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt)}
            disabled={isTyping}
            className="whitespace-nowrap text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#120b20] border border-purple-500/30 text-purple-200 hover:bg-purple-900/40 hover:border-purple-400 hover:text-white transition-all shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#07040a]/40">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 font-bold border ${
              msg.role === 'ai'
                ? 'bg-purple-900/80 border-purple-500 text-white shadow-md shadow-purple-900/40'
                : 'bg-[#1a102e] border-purple-700/50 text-purple-200'
            }`}>
              {msg.role === 'ai' ? '🤖' : '👤'}
            </div>

            {/* Bubble */}
            <div className={`max-w-[82%] space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line border ${
                msg.role === 'ai'
                  ? 'bg-[#120b20] border-purple-900/50 text-purple-100 rounded-tl-sm shadow-md'
                  : 'purple-glow-btn text-white border-purple-400/50 rounded-tr-sm shadow-lg shadow-purple-900/30'
              }`}>
                {formatMessage(msg.text)}
              </div>
              <span className="text-[10px] text-purple-400/70 font-medium px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-end">
            <div className="w-8 h-8 rounded-full bg-purple-900 border border-purple-500 flex items-center justify-center text-sm shrink-0">🤖</div>
            <div className="bg-[#120b20] border border-purple-900/50 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="px-4 py-3 border-t border-purple-900/40 bg-[#0a0512]">
        <div className="flex items-center gap-3 bg-[#120b20] rounded-2xl border border-purple-500/30 px-4 py-2.5 focus-within:border-purple-400 transition-colors shadow-inner">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder="Ask Grok AI any question live..."
            className="flex-1 bg-transparent text-xs font-medium text-white placeholder-purple-400/50 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 purple-glow-btn disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-md cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-purple-400/60 font-medium mt-2">
          100% Powered by Grok AI · Real-Time LLM Response · Press Enter to Send
        </p>
      </div>

      {/* Grok API Key Config Modal */}
      {showConfigModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e071b] border-2 border-purple-500/50 rounded-2xl p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <h4 className="text-sm font-extrabold">Configure Grok AI Key</h4>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-purple-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-purple-200/80 leading-relaxed">
              Enter your <strong>xAI Grok API key</strong> (<code className="bg-purple-950 px-1 py-0.5 rounded text-purple-300">xai-...</code>) or <strong>Groq Cloud API key</strong> (<code className="bg-purple-950 px-1 py-0.5 rounded text-purple-300">gsk_...</code>). All chatbot replies are generated 100% live by Grok AI.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-purple-300">API Key</label>
              <input
                type="password"
                value={tempApiKey}
                onChange={e => { setTempApiKey(e.target.value); setTestStatus(null); }}
                placeholder="gsk_... or xai-..."
                className="w-full bg-[#160b2b] border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-purple-500/40 focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            {testStatus && (
              <div className={`text-xs p-2.5 rounded-xl border font-medium ${
                testStatus.testing 
                  ? 'bg-purple-950/60 border-purple-500/40 text-purple-200 animate-pulse'
                  : testStatus.success
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/60 border-red-500/40 text-red-300'
              }`}>
                {testStatus.testing ? '⏳ Testing connection to Grok AI...' : testStatus.msg}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testStatus?.testing}
                className="bg-purple-900/60 border border-purple-500/40 hover:bg-purple-800 text-purple-200 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Test Key
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="flex-1 purple-glow-btn text-white text-xs font-bold py-2.5 rounded-xl shadow-lg cursor-pointer"
              >
                Save & Connect
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={() => { setTempApiKey(''); setApiKey(''); localStorage.removeItem('grok_api_key'); setTestStatus(null); setShowConfigModal(false); }}
                  className="bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900 text-xs font-bold px-3 py-2.5 rounded-xl cursor-pointer"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
