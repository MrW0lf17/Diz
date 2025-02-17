import React, { useState, useRef, useEffect } from 'react';
import { RiSendPlaneFill, RiDeleteBin6Line, RiAddLine, RiCloseLine } from 'react-icons/ri';
import { FaRobot } from 'react-icons/fa';
import { BsPersonCircle, BsKeyboard, BsChatLeftDots } from 'react-icons/bs';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { NeonButton, GlassCard, AILoadingSpinner } from '../components/FuturisticUI';
import { useToolAction } from '../hooks/useToolAction';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const WELCOME_MESSAGE = {
  content: "Hello! I'm DIZ bot, your friendly AI assistant. How can I help you today? 👋",
  isUser: false,
  timestamp: new Date(),
};

const STORAGE_KEY = 'diz_chat_histories';

const AIChat = () => {
  const handleToolAction = useToolAction('/ai-chat');
  
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((chat: any) => ({
          ...chat,
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          lastUpdated: new Date(chat.lastUpdated)
        }));
      } catch (error) {
        console.error('Failed to parse saved chats:', error);
        return [];
      }
    }
    return [];
  });

  const [currentChatId, setCurrentChatId] = useState<string>(() => {
    if (chatHistories.length > 0) {
      return chatHistories[0].id;
    }
    const newId = crypto.randomUUID();
    const newChat: ChatHistory = {
      id: newId,
      title: 'New Chat',
      messages: [WELCOME_MESSAGE],
      lastUpdated: new Date()
    };
    setChatHistories([newChat]);
    return newId;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentChat = chatHistories.find(chat => chat.id === currentChatId) || {
    id: currentChatId,
    title: 'New Chat',
    messages: [WELCOME_MESSAGE],
    lastUpdated: new Date()
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistories));
  }, [chatHistories]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat.messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleNewChat = () => {
    const newId = crypto.randomUUID();
    const newChat: ChatHistory = {
      id: newId,
      title: 'New Chat',
      messages: [WELCOME_MESSAGE],
      lastUpdated: new Date()
    };
    setChatHistories(prev => [newChat, ...prev]);
    setCurrentChatId(newId);
    setInputMessage('');
  };

  const handleDeleteChat = (id: string) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      setChatHistories(prev => prev.filter(chat => chat.id !== id));
      if (id === currentChatId) {
        const remaining = chatHistories.filter(chat => chat.id !== id);
        if (remaining.length > 0) {
          setCurrentChatId(remaining[0].id);
        } else {
          handleNewChat();
        }
      }
      toast.success('Chat deleted');
    }
  };

  const updateChatTitle = (messages: Message[]) => {
    if (messages.length <= 1) return 'New Chat';
    const firstUserMessage = messages.find(m => m.isUser);
    if (!firstUserMessage) return 'New Chat';
    return firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Check if user has enough coins before proceeding
    const canProceed = await handleToolAction();
    if (!canProceed) return;

    const userMessage = {
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...currentChat.messages, userMessage];
    setChatHistories(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? {
            ...chat,
            messages: updatedMessages,
            title: updateChatTitle(updatedMessages),
            lastUpdated: new Date()
          }
        : chat
    ));

    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const aiResponse: Message = {
        content: data.response,
        isUser: false,
        timestamp: new Date(data.timestamp),
      };

      const finalMessages = [...updatedMessages, aiResponse];
      setChatHistories(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? {
              ...chat,
              messages: finalMessages,
              lastUpdated: new Date()
            }
          : chat
      ));
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-4rem)] p-2 sm:p-4 lg:p-8"
    >
      <div className="max-w-7xl mx-auto flex gap-2 sm:gap-4 lg:gap-6 relative">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-4 right-4 z-40 lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-gradient-cyber text-white shadow-lg backdrop-blur-sm"
        >
          {isSidebarOpen ? <RiCloseLine size={24} /> : <BsChatLeftDots size={24} />}
        </button>

        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <>
              {/* Backdrop for mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="fixed lg:relative left-0 top-0 h-full w-[280px] sm:w-[320px] z-30 lg:z-0 lg:w-80 lg:h-[calc(100vh-8rem)]"
              >
                <GlassCard
                  variant="cyber"
                  className="h-full flex flex-col"
                >
                  {/* Sidebar Header */}
                  <div className="p-3 sm:p-4 border-b border-white/10">
                    <NeonButton
                      variant="primary"
                      onClick={handleNewChat}
                      className="w-full"
                      size="sm"
                    >
                      <RiAddLine className="text-xl mr-2" />
                      New Chat
                    </NeonButton>
                  </div>

                  {/* Chat List */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {chatHistories.map(chat => (
                      <motion.div
                        key={chat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button
                          onClick={() => {
                            setCurrentChatId(chat.id);
                            if (window.innerWidth < 1024) {
                              setIsSidebarOpen(false);
                            }
                          }}
                          className={`group w-full flex items-center gap-2 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                            chat.id === currentChatId
                              ? 'bg-gradient-cyber text-white'
                              : 'hover:bg-white/5 text-futuristic-silver/60'
                          }`}
                        >
                          <BsChatLeftDots className={`flex-shrink-0 ${
                            chat.id === currentChatId
                              ? 'text-white'
                              : 'text-neon-cyan group-hover:text-holographic-teal'
                          }`} />
                          <div className="flex-1 min-w-0 text-left">
                            <div className="truncate font-orbitron text-xs sm:text-sm">
                              {chat.title}
                            </div>
                            <div className="text-[10px] sm:text-xs opacity-60 font-inter">
                              {format(chat.lastUpdated, 'MMM d, h:mm a')}
                            </div>
                          </div>
                          {chat.id === currentChatId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChat(chat.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 transition-opacity"
                            >
                              <RiDeleteBin6Line />
                            </button>
                          )}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 min-w-0 relative"
        >
          <GlassCard
            variant="cyber"
            className="absolute inset-0 flex flex-col"
          >
            {/* Chat Header */}
            <div className="flex-shrink-0 p-3 sm:p-4 border-b border-white/10 flex items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/5 text-futuristic-silver/60 hover:text-neon-cyan transition-colors lg:hidden"
              >
                {isSidebarOpen ? <RiCloseLine size={20} /> : <BsChatLeftDots size={20} />}
              </button>
              <h2 className="font-orbitron text-base sm:text-lg text-futuristic-silver truncate">
                {currentChat.title}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 custom-scrollbar">
              {currentChat.messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-2 sm:gap-3 ${message.isUser ? 'justify-end' : ''}`}
                >
                  {!message.isUser && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-cyber flex items-center justify-center text-white">
                      <FaRobot className="text-xs sm:text-sm" />
                    </div>
                  )}
                  <div className={`max-w-[85%] sm:max-w-[80%] ${message.isUser ? 'order-1' : 'order-2'}`}>
                    <GlassCard
                      variant={message.isUser ? 'dark' : 'cyber'}
                      className={`p-2 sm:p-3 ${message.isUser ? 'bg-ai-magenta/10' : 'bg-neon-cyan/10'}`}
                    >
                      <p className="text-futuristic-silver whitespace-pre-wrap font-inter text-sm sm:text-base">
                        {message.content}
                      </p>
                      <div className="mt-1 text-[10px] sm:text-xs text-futuristic-silver/40 font-inter">
                        {format(message.timestamp, 'h:mm a')}
                      </div>
                    </GlassCard>
                  </div>
                  {message.isUser && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-cyber flex items-center justify-center text-white order-2">
                      <BsPersonCircle className="text-xs sm:text-sm" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-cyber flex items-center justify-center text-white">
                    <FaRobot className="text-xs sm:text-sm" />
                  </div>
                  <GlassCard variant="cyber" className="p-2 sm:p-3 bg-neon-cyan/10">
                    <AILoadingSpinner size="sm" variant="cyber" text="Thinking..." />
                  </GlassCard>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-2 sm:p-4 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-base-dark/40 text-futuristic-silver text-sm sm:text-base border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan placeholder-futuristic-silver/40 font-inter transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="hidden"
                />
                <NeonButton
                  variant="primary"
                  onClick={() => handleSendMessage(new Event('submit') as any)}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <AILoadingSpinner size="sm" variant="cyber" />
                  ) : (
                    <RiSendPlaneFill className="text-xl" />
                  )}
                </NeonButton>
              </form>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AIChat; 