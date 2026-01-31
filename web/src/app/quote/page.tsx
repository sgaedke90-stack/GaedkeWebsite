"use client";

import { useState, useRef, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import Image from "next/image";
import { Send, ArrowLeft, Bot, Loader2, FileText, Image as ImageIcon, Camera, FolderOpen } from "lucide-react";
import Link from "next/link";
import emailjs from '@emailjs/browser';

type MessageType = 'text' | 'image' | 'file' | 'video';

interface Message {
  readonly role: 'bot' | 'user';
  readonly content: string;
  readonly type?: MessageType;
  readonly fileUrl?: string;
  readonly fileName?: string;
}

export default function ChatQuotePage(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm the Gaedke Construction AI assistant. To start, what is your first and last name?" }
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateLeadSummary = useCallback((): string => {
    const clientName = messages[1]?.role === 'user' ? messages[1].content : 'Unknown Client';
    const phoneMatch = messages.map((m) => m.content).join(' ').match(/(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4})/);
    const clientPhone = phoneMatch ? phoneMatch[0] : 'Not detected';

    const dateKeywords: readonly string[] = ['immediately', 'month', 'week', 'year', 'asap', 'spring', 'summer', 'fall', 'winter'];
    const timeline = messages.find((m) => m.role === 'user' && dateKeywords.some((k) => m.content.toLowerCase().includes(k)))?.content || 'TBD';

    return `
========================================
🚀 NEW LEAD: PROJECT BRIEF
========================================
👤 NAME:       ${clientName}
📱 PHONE:      ${clientPhone}
📅 START DATE: ${timeline}
📂 FILES:      ${messages.filter((m) => m.type === 'image').length} Photos, ${messages.filter((m) => m.type === 'video').length} Videos
----------------------------------------
FULL CHAT TRANSCRIPT BELOW:
----------------------------------------
    `;
  }, [messages]);

  const sendToOwner = useCallback(async (): Promise<void> => {
    const summary = generateLeadSummary();
    const transcript = messages
      .map((m) => {
        if (m.type === 'image') return '[📸 PHOTO UPLOADED]';
        if (m.type === 'video') return '[🎥 VIDEO UPLOADED]';
        if (m.type === 'file') return `[📄 FILE UPLOADED: ${m.fileName}]`;
        return `${m.role.toUpperCase()}: ${m.content}`;
      })
      .join('\n\n');

    const fullEmailBody = summary + transcript;

    const templateParams = {
      from_name: messages[1]?.content || 'New Lead',
      message: fullEmailBody,
    };

    try {
      await emailjs.send(
        'service_y0yrfpq',
        'template_mwq9enc',
        templateParams,
        '1zDp7GlNHepyKQ7xf'
      );
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Email failed:', error);
    }
  }, [messages, generateLeadSummary]);

  const handleSend = useCallback(async (e?: FormEvent<HTMLFormElement>): Promise<void> => {
    e?.preventDefault();
    if (isTyping || !input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    const newMessages: Message[] = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
        quoteComplete?: boolean;
        leadSent?: boolean;
        leadError?: string;
      };

      setIsTyping(false);

      if (!response.ok || !data.message) {
        throw new Error(data.error || 'Unexpected server response');
      }

      setMessages((prev) => [...prev, { role: 'bot', content: data.message as string }]);

      if (data.quoteComplete) {
        if (data.leadSent) {
          setMessages((prev) => [...prev, { role: 'bot', content: '✅ Quote has been emailed to Sean.' }]);
        } else {
          console.warn('Server lead send failed:', data.leadError);
          await sendToOwner();
          setMessages((prev) => [...prev, { role: 'bot', content: "I'm sending your project details to Sean now." }]);
        }
      } else if (data.message.includes('$')) {
        await sendToOwner();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Chat error:', errorMessage);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: "That's a great question. Please text Sean directly at (763) 318-0605 so he can give you a specific answer." },
      ]);
    }
  }, [isTyping, input, messages, sendToOwner]);
  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, specificType: 'camera' | 'image' | 'file'): Promise<void> => {
      const file = e.target.files?.[0];
      if (!file) return;

      const fileUrl = URL.createObjectURL(file);
      const fileType: MessageType = specificType === 'camera' || specificType === 'image' ? 'image' : 'file';
      const fileContent = specificType === 'camera' ? 'Took a Photo' : specificType === 'image' ? 'Uploaded Image' : `Uploaded Document: ${file.name}`;

      const newMessage: Message = {
        role: 'user',
        content: fileContent,
        type: fileType,
        fileUrl,
        fileName: file.name,
      };

      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: 'bot', content: 'Received! That visual helps a lot. When are you hoping to start work?' }]);
      }, 2000);
    },
    []
  );

  return (
    <main className="fixed inset-0 flex flex-col bg-zinc-950">
      {/* Header */}
      <header className="flex items-center justify-between shrink-0 border-b border-zinc-800 bg-zinc-900 p-4">
        <Link href="/" className="flex items-center text-sm text-zinc-400 hover:text-white">
          <ArrowLeft size={16} className="mr-2" />
          Exit
        </Link>
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="Gaedke Construction"
            width={40}
            height={40}
            className="rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <span className="font-bold leading-tight tracking-wide text-white">GAEDKE</span>
            <span className="text-[10px] font-medium text-zinc-400">CONSTRUCTION LLC</span>
          </div>
        </div>
        <div className="w-8" />
      </header>

      {/* Chat messages */}
      <div className="space-y-6 overflow-y-auto flex-1 p-4">
        {messages.map((msg, idx) => {
          const isBotMessage = msg.role === 'bot';
          return (
            <div
              key={`${idx}-${msg.role}`}
              className={`flex gap-3 ${isBotMessage ? 'justify-start' : 'justify-end'}`}
            >
              {isBotMessage && (
                <div className="flex shrink-0 items-center justify-center rounded-full bg-amber-500 h-8 w-8">
                  <Bot size={18} className="text-black" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  isBotMessage
                    ? 'rounded-tl-none border border-zinc-800 bg-zinc-900 text-zinc-200'
                    : 'rounded-tr-none bg-zinc-800 text-white'
                }`}
              >
                <p>{msg.content}</p>
                {msg.type === 'image' && msg.fileUrl && (
                  <img
                    src={msg.fileUrl}
                    alt="User uploaded image"
                    className="mt-2 max-h-48 rounded-lg border border-zinc-700 object-cover"
                  />
                )}
                {msg.type === 'file' && (
                  <div className="mt-2 flex items-center gap-3 rounded border border-zinc-700 bg-black/20 p-3">
                    <FileText className="text-amber-500" />
                    <span className="text-sm underline">{msg.fileName}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex items-center justify-center rounded-full bg-amber-500 h-8 w-8">
              <Bot size={18} className="text-black" />
            </div>
            <div className="rounded-2xl rounded-tl-none border border-zinc-800 bg-zinc-900 p-4">
              <Loader2 size={16} className="animate-spin text-zinc-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-zinc-800 bg-zinc-900 p-3 pb-6">
        <form onSubmit={handleSend} className="mx-auto flex max-w-4xl items-end gap-2">
          {/* Camera button */}
          <label className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-950 p-3 text-zinc-400 transition-colors hover:text-blue-500">
            <Camera size={20} />
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'camera')}
              accept="image/*"
              capture="environment"
              aria-label="Capture photo"
            />
          </label>

          {/* Gallery button */}
          <label className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-950 p-3 text-zinc-400 transition-colors hover:text-amber-500">
            <ImageIcon size={20} />
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'image')}
              accept="image/*"
              aria-label="Upload image"
            />
          </label>

          {/* File button */}
          <label className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-950 p-3 text-zinc-400 transition-colors hover:text-white">
            <FolderOpen size={20} />
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'file')}
              accept=".pdf,.doc,.docx"
              aria-label="Upload document"
            />
          </label>

          {/* Message input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            className="h-[50px] flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white transition-colors focus:border-amber-500 focus:outline-none"
            aria-label="Chat message input"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-amber-500 font-bold text-black transition-colors hover:bg-amber-400 disabled:opacity-50"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </main>
  );
}