import React, { useState } from 'react';
import { Key, X, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { theme } = useTheme();
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-300"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: theme.colors.border }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: theme.colors.primary }}>
              <Key size={20} color="#ffffff" />
            </div>
            <h2 className="text-xl font-semibold">Setup Gemini API</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
            style={{ backgroundColor: theme.colors.background }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="apiKey" className="block text-sm font-medium mb-3">
              Enter your Gemini API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                focusRingColor: theme.colors.primary
              }}
              placeholder="Enter your API key here..."
              required
            />
          </div>

          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: theme.colors.background }}>
            <p className="text-sm mb-3" style={{ color: theme.colors.textSecondary }}>
              Don't have an API key? Get one from Google AI Studio:
            </p>
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:underline transition-colors"
              style={{ color: theme.colors.primary }}
            >
              <ExternalLink size={14} />
              Get Free API Key
            </a>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border font-medium transition-all duration-200 hover:bg-opacity-80"
              style={{
                borderColor: theme.colors.border,
                color: theme.colors.text
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-opacity-90 hover:scale-105"
              style={{
                backgroundColor: theme.colors.primary,
                color: '#ffffff'
              }}
            >
              Save API Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};