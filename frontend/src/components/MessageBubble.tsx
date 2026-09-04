'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, User } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming }) => {
  const isUser = message.role === 'user';
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Simple and robust parser for markdown code fences and basic elements
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    let codeBlockCount = 0;

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        codeBlockCount++;
        const blockIndex = codeBlockCount;
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0]?.trim() || 'code';
        const codeText = lines.slice(1).join('\n') || lines[0];

        return (
          <div key={index} style={{ margin: '12px 0', position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#131826',
                border: '1px solid rgba(255,255,255,0.08)',
                borderBottom: 'none',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                color: '#94a3b8',
                fontFamily: 'var(--font-code)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={13} />
                <span>{language}</span>
              </div>
              <button
                id={`copy-btn-${blockIndex}`}
                onClick={() => copyToClipboard(codeText, blockIndex)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copiedIndex === blockIndex ? '#34d399' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                }}
              >
                {copiedIndex === blockIndex ? <Check size={13} /> : <Copy size={13} />}
                {copiedIndex === blockIndex ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                background: '#0a0d17',
              }}
            >
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Format basic paragraphs and inline code
      const paragraphs = part.split('\n\n');
      return (
        <div key={index}>
          {paragraphs.map((para, pIdx) => {
            if (!para.trim()) return null;
            // Parse inline code
            const inlineParts = para.split(/(`[^`]+`)/g);
            return (
              <p key={pIdx} style={{ marginBottom: pIdx < paragraphs.length - 1 ? '10px' : 0 }}>
                {inlineParts.map((sub, sIdx) => {
                  if (sub.startsWith('`') && sub.endsWith('`')) {
                    return <code key={sIdx}>{sub.slice(1, -1)}</code>;
                  }
                  // Parse bold text
                  const boldParts = sub.split(/(\*\*[^*]+\*\*)/g);
                  return boldParts.map((bPart, bIdx) => {
                    if (bPart.startsWith('**') && bPart.endsWith('**')) {
                      return <strong key={bIdx}>{bPart.slice(2, -2)}</strong>;
                    }
                    return bPart;
                  });
                })}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`message-row ${isUser ? 'user' : 'assistant'}`}
    >
      {!isUser && (
        <div className="avatar-badge qwerty" title="QWERTY">
          Q
        </div>
      )}

      <div className={`bubble ${isUser ? 'user' : 'assistant'}`}>
        {renderFormattedContent(message.content)}
        {isStreaming && (
          <span className="typing-indicator">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </span>
        )}
      </div>

      {isUser && (
        <div className="avatar-badge user" title="You">
          <User size={18} />
        </div>
      )}
    </div>
  );
};
