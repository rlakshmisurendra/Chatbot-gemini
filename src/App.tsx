import React, { useState, useEffect } from 'react';
import { Settings, Code } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { ChatInterface } from './components/ChatInterface';
import { ApiKeyModal } from './components/ApiKeyModal';
import { useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { theme } = useTheme();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyModal(true);
    }
  }, []);

  const handleApiKeySubmit = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('gemini-api-key', newApiKey);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header 
        className="flex items-center justify-between p-6 border-b backdrop-blur-sm"
        style={{ 
          borderColor: theme.colors.border,
          backgroundColor: `${theme.colors.surface}95`
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
            }}
          >
            <Code size={24} color="#ffffff" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              C4U
            </h1>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              Your AI-powered C programming Assistant
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`
            }}
            title="API Settings"
          >
            <Settings size={20} />
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Chat Interface */}
      <div className="flex-1 overflow-hidden">
        {apiKey ? (
          <ChatInterface apiKey={apiKey} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🔑</div>
              <h2 className="text-2xl font-bold mb-2">API Key Required</h2>
              <p className="text-lg mb-6" style={{ color: theme.colors.textSecondary }}>
                Please set up your Gemini API key to start chatting
              </p>
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#ffffff'
                }}
              >
                Setup API Key
              </button>
            </div>
          </div>
        )}
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSubmit={handleApiKeySubmit}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;