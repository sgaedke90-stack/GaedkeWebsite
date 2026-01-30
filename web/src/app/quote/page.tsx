"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Paperclip, Bot, User, Loader2, FileVideo, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import emailjs from '@emailjs/browser';

type Message = {
  role: 'bot' | 'user';
  content: string;
  type?: 'text' | 'image' | 'file' | 'video';
  fileUrl?: string;
  fileName?: string;
};

export default function ChatQuotePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm the Gaedke Construction AI assistant. To start, what is your first and last name?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const generateLeadSummary = () => {
    const clientName = messages[1]?.role === 'user' ? messages[1].content : "Unknown Client";
    const phoneMatch = messages.map(m => m.content).join(' ').match(/(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4})/);
    const clientPhone = phoneMatch ? phoneMatch[0] : "Not detected";
    
    // Scans for the intended start date keyword
    const dateKeywords = ["immediately", "month", "week", "year", "asap", "spring", "summer", "fall", "winter"];
    const timeline = messages.find(m => m.role === 'user' && dateKeywords.some(k => m.content.toLowerCase().includes(k)))?.content || "TBD";

    return `
========================================
🚀 NEW LEAD: PROJECT BRIEF
========================================
👤 NAME:       ${clientName}
📱 PHONE:      ${clientPhone}
📅 START DATE: ${timeline}
📂 FILES:      ${messages.filter(m => m.type === 'image').length} Photos, ${messages.filter(m => m.type === 'video').length} Videos
----------------------------------------
FULL CHAT TRANSCRIPT BELOW:
----------------------------------------
    `;
  };

  const sendToOwner = async () => {
    const summary = generateLeadSummary();
    const transcript = messages.map(m => {
       if (m.type === 'image') return `[📸 PHOTO UPLOADED]`;
       if (m.type === 'video') return `[🎥 VIDEO UPLOADED]`;
       if (m.type === 'file') return `[📄 FILE UPLOADED: ${m.fileName}]`;
       return `${m.role.toUpperCase()}: ${m.content}`;
    }).join('\n\n');
    
    // Combine Summary + Transcript
    const fullEmailBody = summary + transcript;

    const templateParams = {
        from_name: messages[1]?.content || "New Lead",
        message: fullEmailBody,
    };

    try {
        await emailjs.send(
            "service_y0yrfpq",       // Your Service ID
            "template_52dvwec",      // <--- YOUR NEW TEMPLATE ID IS HERE!
            templateParams,
            "1zDp7GlNHepyKQ7xf"      // Your Public Key
        );
        console.log("Email Sent Successfully!");
    } catch (error) {
        console.error("Email Failed:", error);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input } as Message];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      setIsTyping(false);
      
      if (data.message) {
        setMessages(prev => [...prev, { role: 'bot', content: data.message }]);
        
        // If the bot gives a price, we assume it's time to email you the lead
        if (data.message.includes('$')) {
             sendToOwner();
        }
      }

    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', content: "I'm having trouble connecting. Please text Sean directly at (763) 318-0605." }]);
    }
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0]; 
    const fileUrl = URL.createObjectURL(file);
    
    let newMessage: Message = { role: 'user', content: `Uploaded: ${file.name}`, fileUrl, fileName: file.name };

    if (fileType === 'image') {
        newMessage.type = 'image';
        newMessage.content = "Uploaded a Photo";
    } else if (fileType === 'video') {
        newMessage.type = 'video';
        newMessage.content = "Uploaded a Video Walkthrough";
    } else {
        newMessage.type = 'file';
        newMessage.content = `Uploaded Document: ${file.name}`;
    }

    setMessages(prev => [...prev, newMessage]);
    
    setIsTyping(true);
    setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'bot', content: "Got it! That helps me visualize the project. When are you hoping to start work?" }]);
    }, 2000);
  };

  return (
    <main className="fixed inset-0 bg-zinc-950 flex flex-col">
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between shrink-0">
        <Link href="/" className="text-zinc-400 hover:text-white flex items-center text-sm">
          <ArrowLeft size={16} className="mr-2" /> Exit Chat
        </Link>
        <div className="flex flex-col items-center">
             <span className="text-white font-serif font-bold">Gaedke AI Assistant</span>
             <span className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online</span>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0"><Bot size={18} className="text-black" /></div>}
            
            <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-zinc-800 text-white rounded-tr-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'}`}>
              {msg.content}
              {msg.type === 'image' && msg.fileUrl && <img src={msg.fileUrl} alt="Upload" className="mt-2 rounded-lg max-h-48 object-cover border border-zinc-700" />}
              {msg.type === 'video' && msg.fileUrl && (
                  <div className="mt-2 bg-black/50 p-2 rounded border border-zinc-700">
                      <div className="flex items-center gap-2 text-amber-500 mb-2 font-bold text-xs"><FileVideo size={16}/> Video Attached</div>
                      <video src={msg.fileUrl} controls className="max-h-48 rounded w-full" />
                  </div>
              )}
              {msg.type === 'file' && <div className="mt-2 flex items-center gap-3 bg-black/20 p-3 rounded border border-zinc-700"><FileText className="text-amber-500" /><span className="text-sm underline">{msg.fileName}</span></div>}
            </div>

            {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0"><User size={18} className="text-zinc-400" /></div>}
          </div>
        ))}
        {isTyping && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center"><Bot size={18} className="text-black" /></div><div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none"><Loader2 className="animate-spin text-zinc-500" size={16} /></div></div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-zinc-900 border-t border-zinc-800 p-4 pb-6">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-2">
          <label className="p-3 text-zinc-400 hover:text-amber-500 cursor-pointer transition-colors bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center group" title="Upload Photos, Videos, or Files">
            <Paperclip size={20} className="group-hover:scale-110 transition-transform"/>
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*,.pdf,.doc,.docx" />
          </label>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-full px-6 py-3 focus:outline-none focus:border-amber-500 transition-colors" />
          <button type="submit" className="p-3 bg-amber-500 text-black rounded-full hover:bg-amber-400 transition-colors font-bold disabled:opacity-50"><Send size={20} /></button>
        </form>
      </div>
    </main>
  );
}