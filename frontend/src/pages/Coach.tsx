import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Preferences } from '../types';

interface CoachProps {
  preferences: Preferences;
}

const Coach = ({ preferences }: CoachProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI scheduling assistant. I can help you organize your tasks. Which one would you like to do first?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you want to ${input.toLowerCase()}. Let me help you with that. I'll update your schedule accordingly.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pb-24 h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 256 256">
              <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Z" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Coach</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {preferences.coachPersonality} mode
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-lg'
                }`}
              >
                <p className="text-base">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm pb-6 pt-4">
        <div className="max-w-md mx-auto px-4 flex items-center gap-3">
          <div className="flex h-14 flex-1 items-center rounded-full bg-gray-100 dark:bg-gray-800 px-5 shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Chat with your coach..."
              className="w-full bg-transparent text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
              <path d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.09,128,40.92,218.67A16,16,0,0,0,64,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,0-27.89ZM64,224,94.07,133.88,176,128,94.07,122.12,64,32l168,96Z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Coach;
