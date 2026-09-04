'use client';

import React from 'react';

interface StatusOrbProps {
  status: 'idle' | 'thinking' | 'streaming' | 'error';
  size?: number;
}

export const StatusOrb: React.FC<StatusOrbProps> = ({ status, size = 32 }) => {
  const getGlowColor = () => {
    switch (status) {
      case 'thinking':
      case 'streaming':
        return 'rgba(6, 182, 212, 0.7)';
      case 'error':
        return 'rgba(244, 63, 94, 0.7)';
      case 'idle':
      default:
        return 'rgba(139, 92, 246, 0.5)';
    }
  };

  const getGradient = () => {
    switch (status) {
      case 'thinking':
      case 'streaming':
        return 'radial-gradient(circle at 35% 35%, #67e8f9 0%, #06b6d4 50%, #2563eb 100%)';
      case 'error':
        return 'radial-gradient(circle at 35% 35%, #fda4af 0%, #f43f5e 50%, #9f1239 100%)';
      case 'idle':
      default:
        return 'radial-gradient(circle at 35% 35%, #c084fc 0%, #8b5cf6 50%, #4338ca 100%)';
    }
  };

  return (
    <div
      id="qwerty-status-orb"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: getGradient(),
        boxShadow: `0 0 16px ${getGlowColor()}, inset 0 0 8px rgba(255,255,255,0.4)`,
        transition: 'all 0.4s ease',
        animation: status === 'streaming' || status === 'thinking' ? 'pulse-glow 1.2s infinite alternate' : 'pulse-glow 3s infinite alternate',
      }}
      title={`QWERTY Status: ${status}`}
    />
  );
};
