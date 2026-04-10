import React, { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../services/messageAPI';

const AdminReelChat = ({ projectId, reelNumber, adminName = 'Sumukh' }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Get the actual authenticated admin's name
  const getAdminName = () => {
    // Priority: localStorage name > prop default
    const storedName = localStorage.getItem('userName');
    if (storedName && storedName.trim()) {
      return storedName;
    }
    return adminName;
  };
  
  const currentAdminName = getAdminName();

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
        senderType: 'admin',
        senderUID: 'admin-' + Date.now(), // Simple admin identifier
        senderName: currentAdminName,
        senderAvatar: 'https://via.placeholder.com/40?text=A',
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
    <div className="flex flex-col h-full rounded-lg border transition-all" style={{ borderColor: '#404040', backgroundColor: '#1a1a1a' }}>
      {/* Chat Header */}
      <div className="border-b p-4" style={{ borderColor: '#404040' }}>
        <h4 className="font-medium text-white text-sm">Reel Chat</h4>
        <p className="text-xs text-gray-500 mt-1">Messages with client about this reel</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center text-gray-600 text-xs py-8">
            Loading messages...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-400 text-xs py-4 px-4 bg-red-900/20 rounded">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && messages.length === 0 && !error && (
          <div className="text-center text-gray-600 text-xs py-12">
            <p>No messages yet</p>
            <p className="mt-2">Start a conversation with the client about this reel</p>
          </div>
        )}

        {/* Messages */}
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 border-t" style={{ borderColor: '#333' }} />
              <span className="text-xs text-gray-700 px-2">{date}</span>
              <div className="flex-1 border-t" style={{ borderColor: '#333' }} />
            </div>

            {/* Messages for this date */}
            <div className="space-y-2">
              {msgs.map((message) => {
                const isAdmin = message.senderType === 'admin';

                return (
                  <div
                    key={message._id}
                    className={`flex gap-2 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: isAdmin ? '#1a1a1a' : '#2d3d5f' }}>
                      {message.senderName.charAt(0).toUpperCase()}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col gap-0.5 max-w-xs ${isAdmin ? 'items-end' : 'items-start'}`}>
                      {/* Sender Name */}
                      <p className="text-xs text-gray-600 px-2">
                        {message.senderName}
                      </p>

                      {/* Message Bubble */}
                      <div
                        className="rounded px-3 py-1.5 break-words text-sm"
                        style={{
                          backgroundColor: isAdmin ? '#0a0a0a' : '#2a2a3a',
                          color: '#e0e0e0',
                        }}
                      >
                        <p className="text-xs leading-relaxed">{message.content}</p>
                        {message.isEdited && (
                          <p className="text-xs text-gray-700 mt-0.5 italic">(edited)</p>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className="text-xs text-gray-700 px-2">
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
      <div className="border-t p-3" style={{ borderColor: '#404040' }}>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Reply to client..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSending}
            className="flex-1 rounded px-3 py-2 text-xs focus:outline-none disabled:opacity-50"
            style={{
              backgroundColor: '#0a0a0a',
              borderColor: '#333',
              border: '1px solid #333',
              color: '#e0e0e0',
            }}
          />
          <button
            type="submit"
            disabled={isSending || !inputValue.trim()}
            className="px-4 py-2 rounded font-semibold text-xs transition-all disabled:opacity-50 hover:opacity-90 active:scale-95"
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

export default AdminReelChat;
