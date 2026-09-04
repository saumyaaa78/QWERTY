'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StatusOrb } from '../components/StatusOrb';
import { MessageBubble, ChatMessage } from '../components/MessageBubble';
import { SettingsModal } from '../components/SettingsModal';
import {
  Send,
  Sparkles,
  Settings as SettingsIcon,
  RotateCcw,
  Bot,
  Terminal,
  Volume2,
  FolderPlus,
} from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'thinking' | 'streaming' | 'error'>('idle');
  const [sessionId, setSessionId] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState('gemini/gemini-3.5-flash');
  const [apiKey, setApiKey] = useState('');
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize session ID and local preferences on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('qwerty_session_id');
    if (savedSession) {
      setSessionId(savedSession);
    } else {
      const newId = 'session_' + Math.random().toString(36).substring(2, 9);
      setSessionId(newId);
      localStorage.setItem('qwerty_session_id', newId);
    }

    const savedModel = localStorage.getItem('qwerty_model');
    if (savedModel) setSelectedModel(savedModel);

    const savedKey = localStorage.getItem('qwerty_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    localStorage.setItem('qwerty_model', model);
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('qwerty_api_key', key);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  const handleNewChat = () => {
    const newId = 'session_' + Math.random().toString(36).substring(2, 9);
    setSessionId(newId);
    localStorage.setItem('qwerty_session_id', newId);
    setMessages([]);
    setStatus('idle');
  };

  const sendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || status === 'streaming' || status === 'thinking') return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setStatus('thinking');

    const assistantMsgId = 'qwerty_' + Date.now();
    let accumulatedText = '';

    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          session_id: sessionId,
          model: selectedModel,
          api_key: apiKey || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) throw new Error('Failed to get response stream reader');

      setStatus('streaming');

      // Initialize empty assistant bubble
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
        },
      ]);

      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            try {
              const data = JSON.parse(trimmed.slice(5).trim());
              if (data.event === 'token' && data.text) {
                accumulatedText += data.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
              } else if (data.event === 'error') {
                accumulatedText += `\n\n⚠️ ${data.message}`;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
                setStatus('error');
              }
            } catch {
              // Ignore partial parse errors
            }
          }
        }
      }

      setStatus('idle');
    } catch (err: any) {
      console.error('Chat error:', err);
      setStatus('error');
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: `⚠️ Connection Error: Unable to communicate with QWERTY backend at ${backendUrl}.\n\n*Please ensure the FastAPI server is running (` + '`python run.py`' + `) and your API key is configured in the Settings panel.*`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const starterPrompts = [
    {
      title: 'Introduce Yourself',
      desc: 'Who are you, and what is your architecture?',
      icon: <Sparkles size={16} color="#a855f7" />,
    },
    {
      title: 'Hermes Agent Design',
      desc: 'How does your AIAgent loop work under the hood?',
      icon: <Terminal size={16} color="#06b6d4" />,
    },
    {
      title: 'Milestone 2 Voice Preview',
      desc: 'How will speech-to-text and interruption barge-in work?',
      icon: <Volume2 size={16} color="#ec4899" />,
    },
    {
      title: 'Milestone 3 Tools Preview',
      desc: 'What file and folder operations will you support?',
      icon: <FolderPlus size={16} color="#10b981" />,
    },
  ];

  return (
    <main className="app-container">
      {/* Top Navbar */}
      <header className="top-nav">
        <div className="brand-section">
          <StatusOrb status={status} size={30} />
          <div>
            <h1 className="brand-title">QWERTY</h1>
          </div>
          <span className="brand-badge">Milestone 1 MVP</span>
        </div>

        <div className="nav-controls">
          <button
            id="new-chat-btn"
            className="nav-btn"
            onClick={handleNewChat}
            title="Start New Conversation"
          >
            <RotateCcw size={15} />
            <span>New Chat</span>
          </button>

          <button
            id="open-settings-btn"
            className="nav-btn"
            onClick={() => setIsSettingsOpen(true)}
            title="Configure Models & API Keys"
          >
            <SettingsIcon size={15} />
            <span>Config</span>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <section className="chat-window">
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="welcome-hero">
              <div className="hero-orb" />
              <h2 className="hero-title">Meet QWERTY</h2>
              <p className="hero-subtitle">
                Your autonomous, voice-capable AI software engineer companion.
                Modeled after the Hermes Agent architecture with tiered context,
                modular tools, and multi-provider LLM intelligence.
              </p>

              <div className="suggestion-grid">
                {starterPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    id={`starter-prompt-${idx}`}
                    className="suggestion-chip"
                    onClick={() => sendMessage(p.desc)}
                  >
                    {p.icon}
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {p.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isStreaming={
                  status === 'streaming' &&
                  msg.id === messages[messages.length - 1].id
                }
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="input-section">
          <div className="input-wrapper">
            <Bot size={20} color="#8b5cf6" />
            <textarea
              id="chat-message-input"
              ref={textareaRef}
              className="chat-input"
              placeholder="Ask QWERTY anything... (Shift+Enter for newline)"
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              id="send-message-btn"
              className="action-btn send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || status === 'streaming' || status === 'thinking'}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>

          <div className="input-footer">
            <span>Model: {selectedModel}</span>
            <span>
              {status === 'thinking' && 'QWERTY is thinking...'}
              {status === 'streaming' && 'QWERTY is responding...'}
              {status === 'idle' && 'Ready for prompt'}
              {status === 'error' && 'Encountered error'}
            </span>
          </div>
        </div>
      </section>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        backendUrl={backendUrl}
        onBackendUrlChange={setBackendUrl}
      />
    </main>
  );
}
