'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CircleCheck as CheckCircle, Eye, Clock } from 'lucide-react';
import { bargainResponses } from '@/lib/data';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'worker';
  time: string;
  status: 'sent' | 'delivered' | 'seen';
}

const statusIcons: Record<string, React.ReactNode> = {
  sent: <Clock className="h-3 w-3 text-muted-foreground" />,
  delivered: <CheckCircle className="h-3 w-3 text-muted-foreground" />,
  seen: <Eye className="h-3 w-3 text-blue-500" />,
};

export default function ChatBox({ workerName, workerPrice }: { workerName: string; workerPrice: number }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: `Hi! I'm ${workerName}. My rate is ₹${workerPrice} per service. We can negotiate if you'd like!`,
      sender: 'worker',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'seen',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getWorkerResponse = (userPrice: number): string => {
    const ratio = userPrice / workerPrice;
    let category: string;
    if (ratio < 0.7) category = 'low';
    else if (ratio < 0.9) category = 'medium';
    else category = 'high';

    const responses = bargainResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      time: getTime(),
      status: 'sent',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Update to delivered
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'delivered' } : m));
    }, 500);

    // Update to seen
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'seen' } : m));
    }, 1000);

    setTyping(true);

    const priceMatch = text.match(/₹(\d+)/);
    const offeredPrice = priceMatch ? parseInt(priceMatch[1]) : workerPrice * 0.8;

    setTimeout(() => {
      setTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: getWorkerResponse(offeredPrice),
        sender: 'worker',
        time: getTime(),
        status: 'seen',
      };
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 1500);
  };

  const handleAccept = () => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text: "I accept your price! Let's book it.",
      sender: 'user',
      time: getTime(),
      status: 'sent',
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'delivered' } : m));
    }, 500);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'seen' } : m));
    }, 1000);

    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const responses = bargainResponses.accept;
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'worker',
        time: getTime(),
        status: 'seen',
      };
      setMessages(prev => [...prev, response]);
    }, 800);
  };

  const handleReject = () => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text: "Sorry, I'll pass for now.",
      sender: 'user',
      time: getTime(),
      status: 'sent',
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'seen' } : m));
    }, 1000);

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const responses = bargainResponses.reject;
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'worker',
        time: getTime(),
        status: 'seen',
      };
      setMessages(prev => [...prev, response]);
    }, 800);
  };

  const quickOffers = [
    { label: `₹${Math.round(workerPrice * 0.65)}`, price: Math.round(workerPrice * 0.65) },
    { label: `₹${Math.round(workerPrice * 0.8)}`, price: Math.round(workerPrice * 0.8) },
    { label: 'Accept', action: 'accept' },
    { label: 'Reject', action: 'reject' },
  ];

  const emojis = ['👍', '🙏', '💰', '✅', '⏰', '😊'];
  const [showEmojis, setShowEmojis] = useState(false);

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
    setShowEmojis(false);
  };

  return (
    <div className="flex flex-col h-[500px] rounded-2xl bg-card border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
          {workerName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">{workerName}</p>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'gradient-primary text-white rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                }`}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  <p className={`text-[10px] ${msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {msg.time}
                  </p>
                  {msg.sender === 'user' && statusIcons[msg.status]}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick offers */}
      <div className="px-4 py-2 flex gap-2 border-t border-border/30 overflow-x-auto">
        {quickOffers.map((offer) => (
          <button
            key={offer.label}
            onClick={() => {
              if (offer.action === 'accept') handleAccept();
              else if (offer.action === 'reject') handleReject();
              else sendMessage(`I'll offer ${offer.label}`);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              offer.action === 'accept'
                ? 'gradient-primary text-white shadow-md shadow-amber-500/20'
                : offer.action === 'reject'
                ? 'bg-red-500/10 text-red-500'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            {offer.action === 'accept' ? '✓ Accept' : offer.action === 'reject' ? '✕ Reject' : offer.label}
          </button>
        ))}
      </div>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 border-t border-border/30 flex gap-2 overflow-x-auto"
          >
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg hover:bg-primary/10 transition-all"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/50 flex items-center gap-2">
        <button
          onClick={() => setShowEmojis(!showEmojis)}
          className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg transition-all ${
            showEmojis ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          😊
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) sendMessage(input.trim()); }}
          placeholder="Type a message..."
          className="flex-1 h-10 px-4 rounded-xl bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={() => { if (input.trim()) sendMessage(input.trim()); }}
          disabled={!input.trim()}
          className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-white disabled:opacity-50 transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
