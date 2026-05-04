import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AIChatAssistant = () => {
  const { userData } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'ai', text: 'Hi! I am your AI Career Assistant. I am trained on proprietary placement data. How can I help you find a job or company today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Our "Custom Training Data" (Simulating RAG / Fine-tuning)
  const customKnowledgeBase = [
    { keywords: ['frontend', 'react', 'web'], response: "Based on our data, TechFlow Innovations is actively hiring Junior Frontend Engineers (Remote) for $70k-$90k. They prioritize React skills. CreativeWeb Agency is also looking for UI/UX Developers." },
    { keywords: ['data', 'ml', 'machine learning', 'ai', 'scientist'], response: "Our placement records show AI Core Labs in San Francisco is hiring ML Engineers ($120k-$150k). If you need an internship, DataSphere Analytics in NY pays $40/hr for Data Science Interns." },
    { keywords: ['backend', 'node', 'server', 'database'], response: "CloudNet Systems in Austin, TX is a great fit for backend. They are hiring Backend Developers for $85k-$110k and they value Node.js experience." },
    { keywords: ['salary', 'pay', 'money'], response: "Salaries in our network range from $40/hr for internships up to $150k for specialized roles like Machine Learning Engineers at AI Core Labs." },
    { keywords: ['remote', 'work from home'], response: "TechFlow Innovations and CreativeWeb Agency both offer fully remote positions in our network." },
    { keywords: ['skills', 'learn'], response: `Based on your profile as a ${userData?.targetRole || 'Developer'}, I recommend focusing on completing projects in the Project Showcase to build your portfolio. Our partner companies look heavily at project experience.` }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userText = message;
    
    // Add user message to UI
    setChatHistory(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI thinking and querying the custom database
    setTimeout(() => {
      const lowerText = userText.toLowerCase();
      let aiResponse = "I don't have specific data on that in my current training set. Could you ask about Frontend, Backend, Data Science, or remote opportunities?";
      
      // Basic Retrieval Logic (Simulating RAG)
      for (const entry of customKnowledgeBase) {
        if (entry.keywords.some(kw => lowerText.includes(kw))) {
          aiResponse = entry.response;
          break;
        }
      }

      setChatHistory(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="btn btn-primary"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
          zIndex: 999,
          padding: 0,
          display: isOpen ? 'none' : 'flex'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              width: '350px',
              height: '500px',
              background: 'var(--bg-secondary)',
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ background: 'var(--accent-primary)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>AI Career Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
                <X size={24} />
              </button>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {chatHistory.map((chat) => (
                <div key={chat.id} style={{ display: 'flex', flexDirection: chat.sender === 'user' ? 'row-reverse' : 'row', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: chat.sender === 'user' ? 'var(--accent-secondary)' : 'var(--accent-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', flexShrink: 0 }}>
                    {chat.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div style={{ 
                    background: chat.sender === 'user' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-primary)', 
                    padding: '12px 16px', 
                    borderRadius: '16px', 
                    borderBottomRightRadius: chat.sender === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: chat.sender === 'ai' ? '4px' : '16px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    maxWidth: '80%'
                  }}>
                    {chat.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                    <Bot size={16} />
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', gap: '4px' }}>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', background: 'var(--bg-primary)' }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about companies or roles..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
              />
              <button 
                type="submit" 
                disabled={!message.trim() || isTyping}
                style={{ width: '45px', height: '45px', borderRadius: '50%', background: message.trim() && !isTyping ? 'var(--accent-primary)' : 'var(--bg-secondary)', border: 'none', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: message.trim() && !isTyping ? 'pointer' : 'default', transition: '0.2s' }}
              >
                <Send size={18} color={message.trim() && !isTyping ? 'white' : 'var(--text-muted)'} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;
