'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Key, Server, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  backendUrl: string;
  onBackendUrlChange: (url: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onModelChange,
  apiKey,
  onApiKeyChange,
  backendUrl,
  onBackendUrlChange,
}) => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkBackendHealth();
    }
  }, [isOpen, backendUrl]);

  const checkBackendHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch(`${backendUrl}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data);
      } else {
        setHealthStatus({ status: 'offline' });
      }
    } catch {
      setHealthStatus({ status: 'offline' });
    } finally {
      setLoadingHealth(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        id="settings-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="#a855f7" />
            <h2 className="modal-title">QWERTY Agent Configuration</h2>
          </div>
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="action-btn"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Backend Status Alert */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background:
                healthStatus?.status === 'online'
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(244, 63, 94, 0.1)',
              border: `1px solid ${
                healthStatus?.status === 'online'
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'rgba(244, 63, 94, 0.3)'
              }`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {healthStatus?.status === 'online' ? (
                <CheckCircle size={18} color="#10b981" />
              ) : (
                <AlertCircle size={18} color="#f43f5e" />
              )}
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                {loadingHealth
                  ? 'Connecting to backend...'
                  : healthStatus?.status === 'online'
                  ? `FastAPI Backend Online (${healthStatus.active_model})`
                  : 'Backend Disconnected (Run python run.py)'}
              </span>
            </div>
            <button
              onClick={checkBackendHealth}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Refresh
            </button>
          </div>

          {/* Model Selection */}
          <div className="field-group">
            <label className="field-label" htmlFor="model-select">
              Active LLM Model (LiteLLM Router)
            </label>
            <select
              id="model-select"
              className="field-select"
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
            >
              <option value="gemini/gemini-3.5-flash">
                Google Gemini 3.5 Flash (Recommended - Ultra Fast)
              </option>
              <option value="gpt-4o-mini">OpenAI GPT-4o Mini</option>
              <option value="gpt-4o">OpenAI GPT-4o</option>
              <option value="groq/llama-3.3-70b-versatile">
                Groq Llama 3.3 70B (High Speed)
              </option>
              <option value="claude-3-5-sonnet-20241022">
                Anthropic Claude 3.5 Sonnet
              </option>
            </select>
          </div>

          {/* Optional Direct API Key */}
          <div className="field-group">
            <label className="field-label" htmlFor="api-key-input">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} /> Custom API Key (Optional override)
              </span>
            </label>
            <input
              id="api-key-input"
              type="password"
              className="field-input"
              placeholder="Leave blank to use key from backend .env"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Keys provided here override your backend <code>.env</code> for this browser session.
            </span>
          </div>

          {/* Backend Host URL */}
          <div className="field-group">
            <label className="field-label" htmlFor="backend-url-input">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Server size={14} /> Backend API URL
              </span>
            </label>
            <input
              id="backend-url-input"
              type="text"
              className="field-input"
              value={backendUrl}
              onChange={(e) => onBackendUrlChange(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            id="save-settings-btn"
            className="nav-btn primary"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
