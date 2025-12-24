import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

export default function Chatbot() {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Welcome to Shoolini University's Feedback Assistant. I'm here to help you with the feedback form. What can I assist you with today?" }
  ]);
  const [input, setInput] = useState("");

  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const messageToSend = input.trim();
    if (!messageToSend) return;

    const userMessage = { sender: "user", text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const sessionId = localStorage.getItem('chatSessionId') || Date.now().toString();
      localStorage.setItem('chatSessionId', sessionId); // Persist session across refreshes

      const res = await axios.post(`${API_BASE}/api/chat`, { message: messageToSend, sessionId });
      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = { sender: "bot", text: "Sorry, I couldn't process your message. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="chatbot-container">
      {!open && (
        <button className="chatbot-toggle" onClick={() => setOpen(true)}>
          💬
        </button>
      )}
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>AI Assistant</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
