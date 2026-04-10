import React, { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../services/messageAPI';
import { getAuth } from 'firebase/auth';

const ReelChat = ({ projectId, reelNumber, clientData = {} }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const firebaseUID = localStorage.getItem('firebaseUID');
  const userEmail = localStorage.getItem('userEmail');
  const storedUserName = localStorage.getItem('userName');
  
  // Get the actual authenticated user's name
  const getClientName = () => {
    // Priority: Firebase current user > localStorage > email prefix > 'Client'
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    // First try Firebase current user's display name
    if (currentUser?.displayName && currentUser.displayName.trim()) {
      return currentUser.displayName;
    }
    
    // Then try localStorage
    if (storedUserName && storedUserName.trim()) {
      return storedUserName;
    }
    
    // Then try clientData
    if (clientData?.name && clientData.name.trim()) {
      return clientData.name;
    }
    
    // Fallback to email prefix
    if (userEmail && userEmail.trim()) {
      return userEmail.split('@')[0];
    }
    
    return 'Client';
  };
  
  const clientName = getClientName();
  
  const auth = getAuth();


  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 10 seconds (instead of 3)
    const interval = setInterval(() => {
      fetchMessages();
    }, 10000);
    return () => clearInterval(interval);
  }, [projectId, reelNumber]);



  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getMessages(projectId, reelNumber);
      setMessages(response.data.messages || []);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    setIsSending(true);

    try {
      const messageData = {
        content: inputValue.trim(),
        senderType: 'client',
        senderUID: firebaseUID,
        senderName: clientName,
        senderAvatar: clientData?.avatar,
      };
      
      const response = await messageAPI.sendMessage(projectId, reelNumber, messageData);

      if (response.data.success) {
        setInputValue('');
        setMessages([...messages, response.data.message]);
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-screen bg-black rounded-lg border border-white/10 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[#131313] border-b border-white/10 px-6 py-4">
        <h3 className="text-white font-semibold">Discussion</h3>
        <p className="text-[#888] text-xs mt-1">Chat with admin about this reel</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center text-[#888] text-sm py-8">
            Loading messages...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-400 text-sm py-4 px-4 bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && messages.length === 0 && !error && (
          <div className="text-center text-[#888] text-sm py-12">
            <p>No messages yet</p>
            <p className="mt-2 text-xs">Start a discussion about this reel</p>
          </div>
        )}

        {/* Messages */}
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 border-t border-white/10" />
              <span className="text-xs text-[#666] px-2">{date}</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {msgs.map((message) => {
                const isClient = message.senderType === 'client';
                const isOwnMessage = message.senderUID === firebaseUID;

                return (
                  <div
                    key={message._id}
                    className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar with fallback */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-[#333] text-white overflow-hidden relative">
                      {message.senderAvatar && message.senderAvatar.trim() ? (
                        <img
                          src={message.senderAvatar}
                          alt={message.senderName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                          }}
                        />
                      ) : null}
                      {/* Fallback: Always show initials */}
                      <span className="absolute w-full h-full flex items-center justify-center">
                        {message.senderName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col gap-1 max-w-xs ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      {/* Sender Name (only for admin messages) */}
                      {!isOwnMessage && (
                        <p className="text-xs text-[#888] px-3">
                          {message.senderName}
                        </p>
                      )}

                      {/* Message Bubble */}
                      <div
                        className="rounded-lg px-4 py-2 break-words"
                        style={{
                          backgroundColor: isOwnMessage ? '#1a3a52' : '#2a2a2a',
                          color: '#f5f5f5',
                        }}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.isEdited && (
                          <p className="text-xs text-[#888] mt-1 italic">(edited)</p>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className="text-xs text-[#666] px-3">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-white/10 bg-[#131313] p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSending}
            className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#666] focus:outline-none focus:border-white/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSending || !inputValue.trim()}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: isSending || !inputValue.trim() ? '#555' : '#ffffff',
              color: isSending || !inputValue.trim() ? '#999' : '#000000',
            }}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReelChat;
