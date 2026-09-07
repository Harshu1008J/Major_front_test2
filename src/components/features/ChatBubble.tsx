import React from 'react';
import { Bot, User } from 'lucide-react';
import { AIMessage } from '../../data/mockAIResponses';

interface ChatBubbleProps {
  message: AIMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  // Basic formatting helper for markdown bold and bullet points
  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Check for bullet
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
      const cleanLine = isBullet ? line.trim().replace(/^[-•]\s*/, '') : line;

      // Handle bold
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={idx} style={{ marginLeft: '16px', marginBottom: '4px' }}>
            {formattedParts}
          </li>
        );
      }

      return (
        <p key={idx} style={{ marginBottom: line === '' ? '8px' : '4px', minHeight: line === '' ? '8px' : undefined }}>
          {formattedParts}
        </p>
      );
    });
  };

  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(message.timestamp);

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        flexDirection: isAssistant ? 'row' : 'row-reverse',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isAssistant ? 'var(--color-navy)' : 'var(--color-teal)',
          color: '#ffffff',
          flexShrink: 0,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {isAssistant ? <Bot size={18} /> : <User size={18} />}
      </div>

      {/* Bubble Container */}
      <div
        style={{
          maxWidth: '82%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isAssistant ? 'flex-start' : 'flex-end',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-lg)',
            borderTopLeftRadius: isAssistant ? '4px' : 'var(--radius-lg)',
            borderTopRightRadius: !isAssistant ? '4px' : 'var(--radius-lg)',
            background: isAssistant ? '#FFFFFF' : 'var(--color-navy-light)',
            color: isAssistant ? 'var(--color-text-primary)' : '#FFFFFF',
            border: isAssistant ? '1px solid var(--color-border)' : '1px solid var(--color-navy-border)',
            boxShadow: 'var(--shadow-sm)',
            fontSize: '14px',
            lineHeight: 1.6,
          }}
        >
          {formatText(message.content)}
        </div>

        <span
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            marginTop: '4px',
            padding: '0 4px',
          }}
        >
          {timeStr}
        </span>
      </div>
    </div>
  );
};
