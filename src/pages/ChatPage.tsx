import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Phone, Video, MoreVertical, Search, ArrowLeft, MessageCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  read: boolean;
}

interface Chat {
  id: string;
  name: string;
  nameBn: string;
  avatar: string;
  lastMessage: string;
  lastMessageBn: string;
  timestamp: Date;
  unreadCount: number;
  online: boolean;
  propertyTitle?: string;
  propertyTitleBn?: string;
  propertyId?: string;
}

const ChatPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get URL parameters for direct chat navigation
  const ownerIdFromUrl = searchParams.get('owner');
  const propertyIdFromUrl = searchParams.get('property');

  // Mock data
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Rahman Ahmed',
      nameBn: 'রহমান আহমেদ',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'The apartment is available for viewing tomorrow',
      lastMessageBn: 'অ্যাপার্টমেন্টটি আগামীকাল দেখার জন্য উপলব্ধ',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2,
      online: true,
      propertyTitle: 'Modern 3BHK Apartment in Gulshan',
      propertyTitleBn: 'গুলশানে আধুনিক ৩ বেডরুমের অ্যাপার্টমেন্ট',
      propertyId: '1'
    },
    {
      id: '2',
      name: 'Fatima Khatun',
      nameBn: 'ফাতিমা খাতুন',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Thank you for your interest',
      lastMessageBn: 'আপনার আগ্রহের জন্য ধন্যবাদ',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      online: false,
      propertyTitle: 'Cozy 2BHK in Dhanmondi',
      propertyTitleBn: 'ধানমন্ডিতে আরামদায়ক ২ বেডরুমের ফ্ল্যাট',
      propertyId: '2'
    },
    {
      id: '3',
      name: 'Karim Uddin',
      nameBn: 'করিম উদ্দিন',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'What time works best for you?',
      lastMessageBn: 'আপনার জন্য কোন সময়টা ভালো?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 1,
      online: true,
      propertyTitle: 'Sea View Apartment in Chittagong',
      propertyTitleBn: 'চট্টগ্রামে সমুদ্র দৃশ্য সহ অ্যাপার্টমেন্ট',
      propertyId: '3'
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        text: 'Hi, I\'m interested in your apartment listing',
        sender: 'user',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true
      },
      {
        id: '2',
        text: 'Hello! Thank you for your interest. The apartment is still available.',
        sender: 'other',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        read: true
      },
      {
        id: '3',
        text: 'Can I schedule a viewing?',
        sender: 'user',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        read: true
      },
      {
        id: '4',
        text: 'The apartment is available for viewing tomorrow',
        sender: 'other',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false
      }
    ]
  });

  // Auto-select chat if coming from property detail page
  useEffect(() => {
    if (ownerIdFromUrl && propertyIdFromUrl) {
      const targetChat = chats.find(chat => 
        chat.id === ownerIdFromUrl || chat.propertyId === propertyIdFromUrl
      );
      if (targetChat) {
        setSelectedChat(targetChat.id);
      } else {
        // Create a new chat if owner/property not found
        const newChat: Chat = {
          id: ownerIdFromUrl || 'new-chat',
          name: 'Property Owner',
          nameBn: 'সম্পত্তির মালিক',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face',
          lastMessage: 'Start a conversation',
          lastMessageBn: 'কথোপকথন শুরু করুন',
          timestamp: new Date(),
          unreadCount: 0,
          online: true,
          propertyTitle: 'Property Inquiry',
          propertyTitleBn: 'সম্পত্তি অনুসন্ধান',
          propertyId: propertyIdFromUrl || undefined
        };
        
        // Add to chats and select
        setSelectedChat(newChat.id);
      }
    }
  }, [ownerIdFromUrl, propertyIdFromUrl, chats]);

  const filteredChats = chats.filter(chat => {
    const name = language === 'bn' ? chat.nameBn : chat.name;
    const property = language === 'bn' ? chat.propertyTitleBn : chat.propertyTitle;
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (property && property.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const chatMessages = useMemo(() => (selectedChat ? messages[selectedChat] || [] : []), [selectedChat, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      read: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));

    setMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatTime(date);
    } else if (diffInHours < 48) {
      return t('yesterday', 'গতকাল', 'Yesterday');
    } else {
      return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US');
    }
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="pb-20 h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className={`
          w-full md:w-80 bg-white border-r border-amber-200 flex flex-col shadow-lg
          ${selectedChat ? 'hidden md:flex' : 'flex'}
        `}>
          {/* Header */}
          <div className="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <h1 className="text-2xl font-bold mb-4">
              {t('messages', 'বার্তা', 'Messages')}
            </h1>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
              <input
                type="text"
                placeholder={t('search-chats', 'চ্যাট খুঁজুন', 'Search chats')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`
                    w-full p-4 border-b border-amber-100 hover:bg-amber-50 transition-colors text-left
                    ${selectedChat === chat.id ? 'bg-amber-100 border-r-4 border-r-amber-500' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={language === 'bn' ? chat.nameBn : chat.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-200"
                      />
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-amber-900 truncate">
                          {language === 'bn' ? chat.nameBn : chat.name}
                        </h3>
                        <span className="text-xs text-amber-600">
                          {formatDate(chat.timestamp)}
                        </span>
                      </div>
                      
                      {chat.propertyTitle && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePropertyClick(chat.propertyId!);
                          }}
                          className="text-xs text-amber-600 mb-1 truncate hover:underline block text-left bg-amber-50 px-2 py-1 rounded"
                        >
                          {language === 'bn' ? chat.propertyTitleBn : chat.propertyTitle}
                        </button>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-amber-700 truncate">
                          {language === 'bn' ? chat.lastMessageBn : chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-amber-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-amber-600">
                <MessageCircle className="mx-auto h-12 w-12 mb-4" />
                <p>{t('no-chats-found', 'কোন চ্যাট পাওয়া যায়নি', 'No chats found')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`
          flex-1 flex flex-col bg-white
          ${selectedChat ? 'flex' : 'hidden md:flex'}
        `}>
          {selectedChat && selectedChatData ? (
            <>
              {/* Chat Header */}
              <div className="bg-white p-4 border-b border-amber-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} className="text-amber-600" />
                  </button>
                  
                  <div className="relative">
                    <img
                      src={selectedChatData.avatar}
                      alt={language === 'bn' ? selectedChatData.nameBn : selectedChatData.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-200"
                    />
                    {selectedChatData.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-amber-900">
                      {language === 'bn' ? selectedChatData.nameBn : selectedChatData.name}
                    </h2>
                    <p className="text-sm text-amber-600">
                      {selectedChatData.online 
                        ? t('online', 'অনলাইন', 'Online')
                        : t('offline', 'অফলাইন', 'Offline')
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-amber-100 rounded-lg transition-colors">
                    <Phone size={20} className="text-amber-600" />
                  </button>
                  <button className="p-2 hover:bg-amber-100 rounded-lg transition-colors">
                    <Video size={20} className="text-amber-600" />
                  </button>
                  <button className="p-2 hover:bg-amber-100 rounded-lg transition-colors">
                    <MoreVertical size={20} className="text-amber-600" />
                  </button>
                </div>
              </div>

              {/* Property Context (if available) */}
              {selectedChatData.propertyTitle && (
                <div className="bg-amber-50 border-b border-amber-200 p-3">
                  <button
                    onClick={() => handlePropertyClick(selectedChatData.propertyId!)}
                    className="text-sm text-amber-700 hover:text-amber-800 hover:underline bg-white px-3 py-2 rounded-lg border border-amber-200 hover:border-amber-300 transition-all duration-300"
                  >
                    {t('discussing-property', 'আলোচনা করছেন', 'Discussing')}: {' '}
                    {language === 'bn' ? selectedChatData.propertyTitleBn : selectedChatData.propertyTitle}
                  </button>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-amber-50/30 to-orange-50/30">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm
                        ${msg.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                          : 'bg-white text-amber-900 border border-amber-200'
                        }
                      `}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`
                        text-xs mt-2
                        ${msg.sender === 'user' ? 'text-amber-100' : 'text-amber-500'}
                      `}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-amber-200">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('type-message', 'একটি বার্তা লিখুন...', 'Type a message...')}
                    className="flex-1 px-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50/50"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className={`
                      p-3 rounded-xl transition-all duration-300 transform hover:scale-105
                      ${message.trim()
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg'
                        : 'bg-amber-100 text-amber-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-10 w-10 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">
                  {t('select-chat', 'একটি চ্যাট নির্বাচন করুন', 'Select a chat')}
                </h3>
                <p className="text-amber-600">
                  {t('start-conversation', 'কথোপকথন শুরু করতে একটি চ্যাট নির্বাচন করুন', 'Choose a chat to start conversation')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;