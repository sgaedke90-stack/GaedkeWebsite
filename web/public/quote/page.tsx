"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Camera, Bot, User, Loader2, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type Message = {
  role: 'bot' | 'user';
  content: string;
  type?: 'text' | 'image' | 'quote';
  imageSrc?: string;
};

export default function ChatQuotePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm the Gaedke Construction AI assistant. I can help generate a preliminary cost range for your project. To start, what is your first and last name?" }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0); // 0=Name, 1=Project, 2=Details, 3=Photos, 4=Finished
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate AI "Thinking"
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. AI Logic Flow
    let botResponse = "";
    let nextStep = step + 1;

    if (step === 0) {
      botResponse = `Thanks, ${userText.split(' ')[0]}. What kind of project are you looking to do? (e.g., Kitchen, Deck, Basement, New Build)`;
    } else if (step === 1) {
      botResponse = "Got it. Could you describe the details? (Approximate size, materials you like, or specific problems you're trying to solve?)";
    } else if (step === 2) {
      botResponse = "Understood. To give you the most accurate range, do you have any photos of the current space? (You can click the Camera icon to upload, or just type 'No' to skip).";
    } else if (step === 3) {
      nextStep = 4; // End flow
      // Calculate "Fake" Quote based on keywords
      const projectType = messages[2].content.toLowerCase();
      let range = "$15,000 - $30,000";
      if (projectType.includes('kitchen')) range = "$35,000 - $65,000";
      if (projectType.includes('deck')) range = "$18,000 - $32,000";
      if (projectType.includes('basement')) range = "$40,000 - $75,000";
      if (projectType.includes('bath')) range = "$20,000 - $40,000";

      // Final Quote Card Message
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `Lead Folder #GD-${Math.floor(Math.random() * 1000) + 2000} Created.`,
        type: 'quote',
      }]);
      return; 
    }

    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    setStep(nextStep);
  };

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      // Show image in chat
      const imageUrl = URL.createObjectURL(file);
      setMessages(prev => [...prev, { role: 'user', content: "Uploaded a photo", type: 'image', imageSrc: imageUrl }]);
      setIsTyping(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', content: "I see the space. This helps a lot with the estimation. Anything else you want to add before I run the numbers?" }]);
      setStep(3); // Skip to pre-finish
    }
  };

  return (
    <main className="fixed inset-0 bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between shrink-0">
        <Link href="/" className="text-zinc-400 hover:text-white flex items-center text-sm">
          <ArrowLeft size={16} className="mr-2" /> Exit Chat
        </Link>
        <span className="text-white font-serif font-bold">Gaedke AI Assistant</span>
        <div className="w-8"></div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {/* Avatar */}
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                <Bot size={18} className="text-black" />
              </div>
            )}

            {/* Bubble */}
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-zinc-800 text-white rounded-tr-none' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
            }`}>
              
              {/* Text Content */}
              {msg.content}

              {/* Image Content */}
              {msg.type === 'image' && msg.imageSrc && (
                <img src={msg.imageSrc} alt="Upload" className="mt-2 rounded-lg max-h-48 object-cover border border-zinc-700" />
              )}

              {/* Quote Card Content */}
              {msg.type === 'quote' && (
                <div className="mt-4 bg-black/40 rounded-xl p-4 border border-zinc-700">
                  <div className="flex items-center gap-2 text-green-500 mb-2">
                    <CheckCircle2 size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Analysis Complete</span>
                  </div>
                  <div className="text-sm text-zinc-400 mb-3">
                    Based on historical data for this project type, here is the preliminary range:
                  </div>
                  <div className="text-2xl font-bold text-white mb-4 border-b border-zinc-800 pb-4">
                    $25,000 - $45,000 <span className="text-xs text-zinc-500 font-normal block mt-1">*Subject to onsite review</span>
                  </div>
                  <div className="bg-amber-500/10 p-3 rounded border border-amber-500/20 flex gap-3">
                    <FileText className="text-amber-500 shrink-0" size={20} />
                    <div className="text-xs text-amber-500">
                      <strong>Folder Created for Sean:</strong> <br/>
                      Your photos and details have been saved. Sean will review this specific folder and text you within 24 hours to narrow down this price.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                <User size={18} className="text-zinc-400" />
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <Bot size={18} className="text-black" />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none">
                <Loader2 className="animate-spin text-zinc-500" size={16} />
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-2">
          
          <label className="p-3 text-zinc-400 hover:text-amber-500 cursor-pointer transition-colors">
            <Camera size={24} />
            <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
          </label>

          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-full px-6 py-3 focus:outline-none focus:border-amber-500 transition-colors"
          />
          
          <button type="submit" className="p-3 bg-amber-500 text-black rounded-full hover:bg-amber-400 transition-colors font-bold disabled:opacity-50">
            <Send size={20} />
          </button>
        </form>
      </div>
    </main>
  );
}