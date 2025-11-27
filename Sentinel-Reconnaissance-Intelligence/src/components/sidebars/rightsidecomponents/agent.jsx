import { useState, useRef, useEffect } from 'react';
import './agent.css';

const Agent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m your AI Security Assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInput = () => {
    console.log("Voice input activated");
  };

  const handleTextQuery = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const getAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('operation') || lowerQuery.includes('schedule')) {
      return "Security operations: 2/4 completed. Everything is running smoothly.";
    }
    
    if (lowerQuery.includes('alert') || lowerQuery.includes('security')) {
      return "Security status: Normal. No active alerts. All systems are online.";
    }
    
    return "I've analyzed your security query. All systems are functioning normally. Is there anything specific about security operations you'd like to know?";
  };

  return (
    <div className="chat-section">
      <div className="chat-container">
        {/* Chat Header with Animated Bot */}
        <div className="chat-header">
          <div className="bot-info">
            <div className="bot-avatar-container">
              {/* Rotating gradient ring */}
              <div className="bot-avatar-ring"></div>
              
              {/* Ripple effects */}
              <div className="bot-avatar-ripple-1"></div>
              <div className="bot-avatar-ripple-2"></div>
              <div className="bot-avatar-ripple-3"></div>
              
              {/* Main avatar */}
              <div className="bot-avatar">
                <div className="bot-avatar-inner">
                  <img
                    src="/image.png"
                    alt="AI Security Agent"
                    className="bot-image"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement.innerHTML = `
                        <div class="bot-fallback">
                          AI
                        </div>
                      `;
                    }}
                  />
                </div>
                <div className="bot-status-indicator"></div>
              </div>
            </div>
            <div className="bot-details">
              <h3 className="bot-name">Security Agent</h3>
              <p className="bot-status">AI Assistant Online</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${message.isUser ? 'user-message' : 'bot-message'}`}
            >
              <div
                className={`message-bubble ${message.isUser ? 'user-bubble' : 'bot-bubble'}`}
              >
                {message.text}
                <div className={`message-time ${message.isUser ? 'user-time' : 'bot-time'}`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper bot-message">
              <div className="message-bubble bot-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="messages-end" />
        </div>

        {/* Input Area */}
        <div className="chat-input-section">
          <form onSubmit={handleTextQuery} className="chat-form">
            <div className="input-container">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask anything!!"
                className="chat-input"
                disabled={isLoading}
              />
              <div className="input-buttons">
                <button
                  type="button"
                  className="voice-btn"
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                >
                  <MicIcon />
                </button>
                <button
                  type="submit"
                  className="send-btn"
                  disabled={isLoading || !inputText.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
            <p className="input-hint">
              Ask about alerts, cameras, or security status
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// Icon Components for Agent
const MicIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const SendIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default Agent;