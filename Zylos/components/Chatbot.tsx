import React, { useState, useRef, useEffect } from 'react';
import { getChatSession } from '../services/geminiService';
import { Message, MessageAuthor } from '../types';
import { ZylosLogo, SendIcon, CloseIcon } from './icons';

const initialBotMessage = `Hello! I am Zylos, the AI assistant for MUFASA Indian Fashion Brand. How can I help you today?`;

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-2">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
    </div>
);

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial', author: MessageAuthor.BOT, content: initialBotMessage }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatSession = useRef(getChatSession());

  useEffect(() => {
      if (!process.env.API_KEY) {
          setError("API key is not configured. Chatbot is disabled.");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading || !chatSession.current) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      author: MessageAuthor.USER,
      content: trimmedInput,
    };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMessageId, author: MessageAuthor.BOT, content: '' }]);

    try {
      const stream = await chatSession.current.sendMessageStream({ message: trimmedInput });
      let text = '';
      for await (const chunk of stream) {
        text += chunk.text;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId ? { ...msg, content: text } : msg
          )
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessageId ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`
        fixed bottom-24 right-4 sm:right-8
        w-[calc(100%-2rem)] max-w-lg h-[70vh] max-h-[600px]
        flex flex-col
        bg-gray-800/50 backdrop-blur-sm border border-gray-700
        rounded-2xl shadow-2xl shadow-black/50 overflow-hidden
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}>
        <header className="flex items-center gap-4 p-4 border-b border-gray-700 bg-gray-900/50">
          <ZylosLogo className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-white">Zylos AI</h1>
            <p className="text-sm text-green-400">Online</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.author === MessageAuthor.USER ? 'justify-end' : 'justify-start'}`}>
              {msg.author === MessageAuthor.BOT && <ZylosLogo className="w-8 h-8 flex-shrink-0 mt-1" />}
              <div className={`p-3 rounded-lg max-w-sm md:max-w-md lg:max-w-lg whitespace-pre-wrap ${msg.author === MessageAuthor.USER ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                {msg.content === '' && isLoading ? <LoadingIndicator /> : msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t border-gray-700 bg-gray-900/50">
          {error ? (
            <div className="text-center text-red-400 p-2 bg-red-900/50 rounded-md">{error}</div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about MUFASA or anything..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="bg-blue-600 rounded-full p-3 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </form>
          )}
        </footer>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <div className={`transition-all duration-300 ease-in-out absolute ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
            <ZylosLogo className="w-10 h-10" />
        </div>
        <div className={`transition-all duration-300 ease-in-out absolute ${isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}>
            <CloseIcon className="w-8 h-8" />
        </div>
      </button>
    </>
  );
};

export default Chatbot;
