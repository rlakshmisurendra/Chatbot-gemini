import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { theme } = useTheme();
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatContent = (content: string) => {
    // Enhanced code block detection with better formatting
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index);
        parts.push({
          type: 'text',
          content: textContent.replace(inlineCodeRegex, '<code class="inline-code">$1</code>')
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'c',
        content: match[2].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const textContent = content.slice(lastIndex);
      parts.push({
        type: 'text',
        content: textContent.replace(inlineCodeRegex, '<code class="inline-code">$1</code>')
      });
    }

    return parts.length > 0 ? parts : [{ 
      type: 'text', 
      content: content.replace(inlineCodeRegex, '<code class="inline-code">$1</code>')
    }];
  };

  const parts = formatContent(message.content);

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ 
            backgroundColor: theme.colors.primary,
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
          }}
        >
          <Bot size={18} color="#ffffff" />
        </div>
      )}
      
      <div className={`max-w-[75%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-2xl px-6 py-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
            isUser 
              ? 'rounded-br-md' 
              : 'rounded-bl-md'
          }`}
          style={{
            backgroundColor: isUser ? theme.colors.primary : theme.colors.surface,
            color: isUser ? '#ffffff' : theme.colors.text,
            border: `1px solid ${theme.colors.border}`,
            background: isUser 
              ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
              : theme.colors.surface
          }}
        >
          {parts.map((part, index) => {
            if (part.type === 'text') {
              return (
                <div 
                  key={index} 
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: part.content }}
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}
                />
              );
            } else {
              return (
                <div key={index} className="my-4">
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        color: isUser ? '#ffffff' : theme.colors.textSecondary
                      }}
                    >
                      {part.language?.toUpperCase() || 'CODE'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(part.content)}
                      className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                      style={{
                        backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        color: isUser ? '#ffffff' : theme.colors.text
                      }}
                      title="Copy code"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <pre 
                    className="text-sm rounded-xl p-4 overflow-x-auto font-mono leading-relaxed"
                    style={{ 
                      backgroundColor: theme.isDark ? '#000000' : '#f8f9fa',
                      color: theme.isDark ? '#e5e7eb' : '#374151',
                      border: `1px solid ${theme.colors.border}`
                    }}
                  >
                    <code>{part.content}</code>
                  </pre>
                </div>
              );
            }
          })}
        </div>
        
        <div 
          className="text-xs mt-2 px-2"
          style={{ color: theme.colors.textSecondary }}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {isUser && (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ 
            backgroundColor: theme.colors.secondary,
            background: `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.primary})`
          }}
        >
          <User size={18} color="#ffffff" />
        </div>
      )}
    </div>
  );
};