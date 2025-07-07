import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Bot } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { GeminiService } from '../services/geminiService';

interface ChatInterfaceProps {
  apiKey: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiService = new GeminiService(apiKey);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `# Welcome to your C Programming Assistant! 🚀

I'm here to help you master C programming. Here's what I can do for you:

**💡 Answer Questions**
- Explain C syntax, concepts, and best practices
- Help with debugging and error resolution
- Clarify complex programming concepts

**📝 Code Assistance**
- Review and improve your C code
- Provide step-by-step explanations
- Suggest optimizations and best practices

**🎯 Learning Support**
- Guide you through C programming fundamentals
- Explain advanced topics like pointers and memory management
- Help with algorithms and data structures

**Examples of what you can ask:**
- "Explain pointers in C with examples"
- "How do I implement a linked list?"
- "Help me debug this code: [paste your code]"
- "What's the difference between malloc and calloc?"

Feel free to ask me anything about C programming!`,
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error while processing your request. Please check your API key and try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Explain pointers in C",
    "How do arrays work?",
    "Show me a simple C program",
    "What are functions in C?"
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12" style={{ color: theme.colors.textSecondary }}>
            <div className="text-2xl mb-4">🤖</div>
            <div className="text-xl mb-2">Ready to help with C programming!</div>
            <div className="text-sm">
              Ask me anything about C syntax, debugging, or programming concepts.
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex items-center gap-3 px-6">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: theme.colors.primary,
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
              }}
            >
              <Bot size={18} color="#ffffff" />
            </div>
            <div 
              className="flex items-center gap-2 px-4 py-3 rounded-2xl"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <Loader2 size={16} className="animate-spin" style={{ color: theme.colors.primary }} />
              <span style={{ color: theme.colors.textSecondary }}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-6 border-t" style={{ borderColor: theme.colors.border }}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about C programming..."
              className="w-full px-6 py-4 rounded-2xl border outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-base"
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                focusRingColor: theme.colors.primary
              }}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Sparkles size={16} style={{ color: theme.colors.textSecondary }} />
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-4 rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#ffffff',
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
            }}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};