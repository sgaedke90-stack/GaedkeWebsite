"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Bot, User, Loader2, FileVideo, FileText, Image as ImageIcon, Camera, FolderOpen } from "lucide-react";
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
    
    const fullEmailBody = summary + transcript;

    const templateParams = {
        from_name: messages[1]?.content || "New Lead",
        message: fullEmailBody,
    };

    try {
        await emailjs.send(
            "service_y0yrfpq",       
            "template_52dvwec",      
            templateParams,
            "1zDp7GlNHepyKQ7xf"      
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

  const handleFileUpload = async (e: any, specificType: 'camera' | 'image' | 'file') => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    let newMessage: Message = { role: 'user', content: `Uploaded: ${file.name}`, fileUrl, fileName: file.name };

    if (specificType === 'camera' || specificType === 'image') {
        newMessage.type = 'image';
        newMessage.content = specificType === 'camera' ? "Took a Photo" : "Uploaded Image";
    } else {
        newMessage.type = 'file';
        newMessage.content = `Uploaded Document: ${file.name}`;
    }

    setMessages(prev => [...prev, newMessage]);
    
    setIsTyping(true);
    setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'bot', content: "Received! That visual helps a lot. When are you hoping to start work?" }]);
    }, 2000);
  };

  return (
    <main className="fixed inset-0 bg-zinc-950 flex flex-col">
      {/* --- HEADER WITH CUSTOM BRAND LOGO --- */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between shrink-0">
        <Link href="/" className="text-zinc-400 hover:text-white flex items-center text-sm">
          <ArrowLeft size={16} className="mr-2" /> Exit
        </Link>
        
        {/* THE CODE-GENERATED LOGO (Black, Gold, Blue) */}
        <div className="flex items-center gap-3">
             {/* This box mimics your logo using CSS borders and colors */}
             <div className="w-10 h-10 bg-black border-2 border-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                <span className="text-amber-500 font-serif font-black text-xl">G</span>
             </div>
             
             <div className="flex flex-col">
                <span className="text-white font-bold leading-tight tracking-wide">GAEDKE</span>
                <span className="text-[10px] text-zinc-400 font-medium">CONSTRUCTION LLC</span>
             </div>
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
              {msg.type === 'file' && <div className="mt-2 flex items-center gap-3 bg-black/20 p-3 rounded border border-zinc-700"><FileText className="text-amber-500" /><span className="text-sm underline">{msg.fileName}</span></div>}
            </div>
          </div>
        ))}
        {isTyping && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center"><Bot size={18} className="text-black" /></div><div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none"><Loader2 className="animate-spin text-zinc-500" size={16} /></div></div>}
        <div ref={messagesEndRef} />
      </div>

      {/* --- NEW INPUT AREA WITH 3 ICONS --- */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-3 pb-6">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-2">
          
          {/* 1. CAMERA BUTTON (Blue accent to match logo) */}
          <label className="p-3 text-zinc-400 hover:text-blue-500 cursor-pointer bg-zinc-950 rounded-full border border-zinc-800 transition-colors">
            <Camera size={20} />
            {/* capture="environment" forces the rear camera on mobile */}
            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'camera')} accept="image/*" capture="environment" />
          </label>

          {/* 2. GALLERY BUTTON */}
          <label className="p-3 text-zinc-400 hover:text-amber-500 cursor-pointer bg-zinc-950 rounded-full border border-zinc-800 transition-colors">
            <ImageIcon size={20} />
            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} accept="image/*" />
          </label>

          {/* 3. FILE BUTTON */}
          <label className="p-3 text-zinc-400 hover:text-white cursor-pointer bg-zinc-950 rounded-full border border-zinc-800 transition-colors">
            <FolderOpen size={20} />
            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'file')} accept=".pdf,.doc,.docx" />
          </label>

          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type message..." className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors h-[50px]" />
          
          <button type="submit" className="h-[50px] w-[50px] bg-amber-500 text-black rounded-full hover:bg-amber-400 transition-colors flex items-center justify-center font-bold disabled:opacity-50 shrink-0"><Send size={20} /></button>
        </form>
      </div>
    </main>
  );
}