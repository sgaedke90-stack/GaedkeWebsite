"use client";

import { useState, useRef, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import Image from "next/image";
import { Send, ArrowLeft, Bot, Loader2, FileText, Image as ImageIcon, Camera, FolderOpen, Check, X } from "lucide-react";
import Link from "next/link";
import emailjs from '@emailjs/browser';

type MessageType = 'text' | 'image' | 'file' | 'video';

interface Message {
  readonly role: 'bot' | 'user';
  readonly content: string;
  readonly type?: MessageType;
  readonly fileUrl?: string;
  readonly fileName?: string;
  readonly isVerification?: boolean;
}

interface LeadData {
  readonly name: string;
  readonly phone: string;
  readonly address: string;
  readonly projectScope: string;
  readonly aiEstimate: string;
  readonly attachments: readonly Message[];
}

export default function ChatQuotePage(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm the Gaedke Construction AI assistant. Let's gather some information for your project quote. First, what is your full name?" }
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    phone: '',
    address: '',
    projectScope: '',
    aiEstimate: '',
    attachments: [],
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateLeadSummary = useCallback((): string => {
    const emailBody = `
QUOTE READY - NEW LEAD FROM WEBSITE

═══════════════════════════════════════════════════════════════════════════════

CLIENT INFO:
  Name:     ${leadData.name || 'Not provided'}
  Phone:    ${leadData.phone || 'Not provided'}
  Address:  ${leadData.address || 'Not provided'}

PROJECT SCOPE:
  ${leadData.projectScope || 'General consultation'}

AI ESTIMATE PROVIDED TO CLIENT:
  ${leadData.aiEstimate || 'No specific estimate mentioned'}

ATTACHMENTS:
  📸 Images: ${messages.filter((m) => m.type === 'image').length}
  📄 Files:  ${messages.filter((m) => m.type === 'file').length}

═══════════════════════════════════════════════════════════════════════════════

FULL CONVERSATION TRANSCRIPT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    return emailBody;
  }, [leadData, messages]);

  const sendToOwner = useCallback(async (): Promise<void> => {
    const summary = generateLeadSummary();
    const transcript = messages
      .filter((m) => m.role !== 'bot' || !m.isVerification)
      .map((m) => {
        if (m.type === 'image') return '[📸 PHOTO UPLOADED]';
        if (m.type === 'video') return '[🎥 VIDEO UPLOADED]';
        if (m.type === 'file') return `[📄 FILE: ${m.fileName}]`;
        return `${m.role === 'bot' ? 'ASSISTANT' : 'CLIENT'}: ${m.content}`;
      })
      .join('\n\n');

    const fullEmailBody = summary + transcript;

    const templateParams = {
      from_name: leadData.name || 'New Lead',
      message: fullEmailBody,
    };

    try {
      await emailjs.send(
        'service_y0yrfpq',
        'template_mwq9enc',
        templateParams,
        '1zDp7GlNHepyKQ7xf'
      );
      console.log('✅ Email sent successfully');
    } catch (error) {
      console.error('❌ Email send failed:', error);
    }
  }, [leadData, generateLeadSummary, messages]);

  const handleSend = useCallback(async (e?: FormEvent<HTMLFormElement>): Promise<void> => {
    e?.preventDefault();
    if (isTyping || !input.trim()) return;

    // Handle verification responses
    if (isVerifying) {
      if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('correct') || input.toLowerCase().includes('looks good')) {
        setMessages((prev) => [...prev, { role: 'user', content: input }]);
        setInput('');
        setIsVerifying(false);
        setIsTyping(true);

        // Send email silently
        await sendToOwner();

        // Show confirmation
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { role: 'bot', content: '✅ Perfect! I\'ve sent your project details to Sean. He\'ll review everything and reach out to you soon at the phone number you provided.' },
          ]);
        }, 500);
      } else {
        setMessages((prev) => [...prev, { role: 'user', content: input }]);
        setInput('');
        setMessages((prev) => [
          ...prev,
          { role: 'bot', content: 'What would you like me to correct or add?' },
        ]);
      }
      return;
    }

    const newMessage: Message = { role: 'user', content: input };
    const newMessages: Message[] = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Extract data based on conversation flow
    const updateData = (key: keyof LeadData, value: string) => {
      setLeadData((prev) => ({ ...prev, [key]: value }));
    };

    // Simple data extraction from user messages
    const messageCount = newMessages.filter((m) => m.role === 'user').length;
    if (messageCount === 1) {
      updateData('name', input);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: 'bot', content: 'Thanks! What\'s your phone number?' }]);
      }, 300);
      return;
    } else if (messageCount === 2) {
      const phoneRegex = /(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4})/;
      const phoneMatch = input.match(phoneRegex);
      if (phoneMatch) {
        updateData('phone', phoneMatch[0]);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, { role: 'bot', content: 'Perfect! What\'s the address of your project location?' }]);
        }, 300);
      } else {
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: 'bot', content: 'I need a valid phone number. Could you provide that again?' }]);
      }
      return;
    } else if (messageCount === 3) {
      updateData('address', input);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            content: 'Great! Now, can you briefly describe the project? (e.g., "Kitchen remodel", "Basement finish", "Deck construction")',
          },
        ]);
      }, 300);
      return;
    } else if (messageCount === 4) {
      updateData('projectScope', input);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: 'bot', content: 'Do you have any project plans, sketches, or photos of the area you\'d like to include? (You can upload them now or skip this step)' },
        ]);
      }, 300);
      return;
    } else if (messageCount === 5 && !input.toLowerCase().includes('skip') && !input.toLowerCase().includes('no')) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: 'bot', content: 'Use the buttons below to upload files, or just type "done" when you\'re finished.' }]);
      }, 300);
      return;
    } else if (messageCount >= 5 && (input.toLowerCase().includes('done') || input.toLowerCase().includes('skip'))) {
      setTimeout(() => {
        setIsTyping(false);
        // Show verification
        setIsVerifying(true);
        const verificationMsg = `
Here is what I have for your project. Does this all look correct, or is there anything else you'd like me to add for Sean?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PROJECT SUMMARY

Customer: ${leadData.name}
Phone: ${leadData.phone}
Location: ${leadData.address}
Project: ${leadData.projectScope}
Attachments: ${messages.filter((m) => m.type === 'image').length} photos, ${messages.filter((m) => m.type === 'file').length} files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reply "Yes" to confirm and send to Sean, or tell me what to change.
        `;
        setMessages((prev) => [
          ...prev,
          { role: 'bot', content: verificationMsg, isVerification: true },
        ]);
      }, 300);
      return;
    }

    // Default fallback for additional messages
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
      };

      setIsTyping(false);

      if (!response.ok || !data.message) {
        throw new Error(data.error || 'Unexpected server response');
      }

      setMessages((prev) => [...prev, { role: 'bot', content: data.message as string }]);
      updateData('aiEstimate', data.message as string);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Chat error:', errorMessage);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'That\'s a great question. Please text Sean directly at (763) 318-0605 so he can give you a specific answer.' },
      ]);
    }
  }, [isTyping, input, messages, isVerifying, leadData, sendToOwner]);
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
    <main className="fixed inset-0 flex flex-col bg-black">
      {/* Header with gold divider */}
      <header className="border-b-2 border-t-2 border-[#c8a24a] bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 px-6 py-6 text-center shadow-lg">
        <h1 className="text-2xl font-bold tracking-wider text-[#c8a24a]">GAEDKE CONSTRUCTION</h1>
        <p className="mt-1 text-sm font-medium text-[#c8a24a]">We Do It Better</p>
      </header>

      {/* Chat body with logo watermark */}
      <div className="relative flex-1 overflow-y-auto p-6">
        {/* Logo watermark background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/images/logo.jpg"
            alt="Gaedke Construction Logo"
            width={400}
            height={400}
            className="opacity-20 object-contain"
          />
        </div>

        {/* Chat messages */}
        <div className="relative z-10 space-y-4">
          {messages.map((msg, idx) => {
            const isBotMessage = msg.role === 'bot';
            return (
              <div
                key={`${idx}-${msg.role}`}
                className={`flex gap-4 ${isBotMessage ? 'justify-start' : 'justify-end'}`}
              >
                {isBotMessage && (
                  <div className="flex shrink-0 items-center justify-center rounded-full bg-[#c8a24a] h-10 w-10 shadow-lg">
                    <Bot size={20} className="text-black" />
                  </div>
                )}

                <div
                  className={`max-w-[65%] rounded-2xl px-5 py-3 shadow-lg ${
                    isBotMessage
                      ? 'bg-stone-800 text-stone-100 rounded-tl-none'
                      : 'bg-stone-700 text-white rounded-tr-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.type === 'image' && msg.fileUrl && (
                    <img
                      src={msg.fileUrl}
                      alt="User uploaded image"
                      className="mt-3 max-h-48 rounded-lg border border-stone-600 object-cover"
                    />
                  )}
                  {msg.type === 'file' && (
                    <div className="mt-3 flex items-center gap-2 rounded border border-stone-600 bg-black/30 p-2">
                      <FileText size={16} className="text-[#c8a24a]" />
                      <span className="truncate text-xs underline">{msg.fileName}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex gap-4">
              <div className="flex items-center justify-center rounded-full bg-[#c8a24a] h-10 w-10 shadow-lg">
                <Bot size={20} className="text-black" />
              </div>
              <div className="rounded-2xl rounded-tl-none border-2 border-stone-700 bg-stone-800 px-5 py-3 shadow-lg">
                <Loader2 size={18} className="animate-spin text-[#c8a24a]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area with gold divider */}
      <div className="border-t-2 border-[#c8a24a] bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 px-6 py-5 shadow-lg">
        <form onSubmit={handleSend} className="mx-auto flex max-w-2xl items-center gap-3">
          {/* Camera button */}
          <button
            type="button"
            onClick={() => {}}
            className="group relative rounded-full border-2 border-[#c8a24a] bg-stone-800 p-3 text-[#c8a24a] transition-all hover:bg-[#c8a24a] hover:text-black shadow-md"
          >
            <label className="cursor-pointer">
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
          </button>

          {/* Image button */}
          <button
            type="button"
            onClick={() => {}}
            className="group relative rounded-full border-2 border-[#c8a24a] bg-stone-800 p-3 text-[#c8a24a] transition-all hover:bg-[#c8a24a] hover:text-black shadow-md"
          >
            <label className="cursor-pointer">
              <ImageIcon size={20} />
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'image')}
                accept="image/*"
                aria-label="Upload image"
              />
            </label>
          </button>

          {/* File button */}
          <button
            type="button"
            onClick={() => {}}
            className="group relative rounded-full border-2 border-[#c8a24a] bg-stone-800 p-3 text-[#c8a24a] transition-all hover:bg-[#c8a24a] hover:text-black shadow-md"
          >
            <label className="cursor-pointer">
              <FolderOpen size={20} />
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'file')}
                accept=".pdf,.doc,.docx"
                aria-label="Upload document"
              />
            </label>
          </button>

          {/* Message input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            className="flex-1 rounded-full border-2 border-stone-600 bg-stone-900 px-5 py-3 text-sm text-white placeholder-stone-500 transition-colors focus:border-[#c8a24a] focus:outline-none shadow-md"
            aria-label="Chat message input"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c8a24a] font-bold text-black transition-all hover:bg-[#d4b55c] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </main>
  );
}