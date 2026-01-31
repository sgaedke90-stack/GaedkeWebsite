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

    try {
      // Send via server-side endpoint (ensures email goes to Sgaedke90@gmail.com + logs to file)
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary,
          transcript: fullEmailBody,
          model: 'web-chat',
          source: 'smart-quote',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send lead');
      }

      console.log('✅ Lead sent to Sgaedke90@gmail.com via server');

      // Fire-and-forget analytics logging (non-blocking)
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead_submitted_success',
          data: {
            name: leadData.name,
            phone: leadData.phone,
            hasAttachments: leadData.attachments.length > 0,
            attachmentCount: leadData.attachments.length,
          },
        }),
      }).catch(() => {
        // Silently ignore analytics failures
      });
    } catch (error) {
      console.error('❌ Lead send failed:', error);
      // Fallback to EmailJS if server fails
      try {
        await emailjs.send(
          'service_y0yrfpq',
          'template_mwq9enc',
          {
            from_name: leadData.name || 'New Lead',
            message: fullEmailBody,
          },
          '1zDp7GlNHepyKQ7xf'
        );
        console.log('✅ Fallback: Lead sent via EmailJS');

        // Log fallback success to analytics
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead_submitted_fallback',
            data: {
              name: leadData.name,
              phone: leadData.phone,
              method: 'emailjs',
            },
          }),
        }).catch(() => {
          // Silently ignore analytics failures
        });
      } catch (emailError) {
        console.error('❌ Both email methods failed:', emailError);

        // Log failure to analytics
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead_submitted_failed',
            data: {
              name: leadData.name,
              phone: leadData.phone,
              error: String(emailError),
            },
          }),
        }).catch(() => {
          // Silently ignore analytics failures
        });
      }
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
      {/* Header with navigation */}
      <header className="header-brushed-metal px-4 md:px-6 py-4 md:py-5">
        <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">
          {/* Back button */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </Link>

          {/* Title - centered, flex-grow for spacing */}
          <div className="flex-1 text-center">
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wider text-yellow-500">GAEDKE CONSTRUCTION</h1>
            <p className="mt-0.5 text-xs md:text-sm font-medium text-gray-400">Smart Quote AI</p>
          </div>

          {/* Email quote button */}
          <a
            href="mailto:Sgaedke90@gmail.com?subject=Quote%20Request%20from%20Website"
            className="btn-gold flex items-center gap-2 whitespace-nowrap px-3 md:px-4 py-2 text-xs md:text-sm font-bold rounded"
          >
            <span className="hidden sm:inline">Email Quote</span>
            <span className="sm:hidden">Email</span>
          </a>
        </div>
      </header>

      {/* Chat body with logo watermark */}
      <div className="relative flex-1 overflow-y-auto p-4 md:p-6">
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
        <div className="relative z-10 space-y-3 md:space-y-4 max-w-4xl mx-auto">
          {messages.map((msg, idx) => {
            const isBotMessage = msg.role === 'bot';
            return (
              <div
                key={`${idx}-${msg.role}`}
                className={`flex gap-2 md:gap-4 ${isBotMessage ? 'justify-start' : 'justify-end'}`}
              >
                {isBotMessage && (
                  <div className="flex shrink-0 items-center justify-center rounded-full bg-yellow-500 h-8 md:h-10 w-8 md:w-10 shadow-lg">
                    <Bot size={16} className="md:w-5 md:h-5 text-black" />
                  </div>
                )}

                <div
                  className={`max-w-xs md:max-w-lg rounded-2xl px-4 md:px-5 py-2 md:py-3 shadow-lg text-xs md:text-sm ${
                    isBotMessage
                      ? 'bg-yellow-500/10 border border-yellow-500/30 text-white rounded-tl-none'
                      : 'bg-yellow-500 text-black font-medium rounded-tr-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  {msg.type === 'image' && msg.fileUrl && (
                    <img
                      src={msg.fileUrl}
                      alt="User uploaded image"
                      className="mt-3 max-h-48 rounded-lg border border-stone-600 object-cover"
                    />
                  )}
                  {msg.type === 'file' && (
                    <div className="mt-3 flex items-center gap-2 rounded border border-yellow-500/30 bg-yellow-500/5 p-2">
                      <FileText size={16} className="text-yellow-500" />
                      <span className="truncate text-xs underline">{msg.fileName}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex gap-2 md:gap-4">
              <div className="flex items-center justify-center rounded-full bg-yellow-500 h-8 md:h-10 w-8 md:w-10 shadow-lg">
                <Bot size={16} className="md:w-5 md:h-5 text-black" />
              </div>
              <div className="rounded-2xl rounded-tl-none border-2 border-yellow-500/30 bg-yellow-500/10 px-4 md:px-5 py-2 md:py-3 shadow-lg">
                <Loader2 size={16} className="md:w-4 md:h-4 animate-spin text-yellow-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area with gold divider */}
      <div className="border-t-2 border-yellow-500/20 bg-gradient-to-r from-black via-yellow-500/5 to-black px-4 md:px-6 py-4 md:py-5 shadow-lg">
        <form onSubmit={handleSend} className="mx-auto flex max-w-4xl items-center gap-2 md:gap-3">
          {/* Camera button */}
          <button
            type="button"
            onClick={() => {}}
            className="group relative shrink-0 rounded-full border-2 border-yellow-500 bg-black p-2 md:p-3 text-yellow-500 transition-all hover:bg-yellow-500 hover:text-black shadow-md"
            title="Capture photo"
          >
            <label className="cursor-pointer">
              <Camera size={18} className="md:w-5 md:h-5" />
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
            className="group relative shrink-0 rounded-full border-2 border-yellow-500 bg-black p-2 md:p-3 text-yellow-500 transition-all hover:bg-yellow-500 hover:text-black shadow-md"
            title="Upload image"
          >
            <label className="cursor-pointer">
              <ImageIcon size={18} className="md:w-5 md:h-5" />
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
            className="group relative shrink-0 rounded-full border-2 border-yellow-500 bg-black p-2 md:p-3 text-yellow-500 transition-all hover:bg-yellow-500 hover:text-black shadow-md"
            title="Upload document"
          >
            <label className="cursor-pointer">
              <FolderOpen size={18} className="md:w-5 md:h-5" />
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
            className="flex-1 rounded-full border-2 border-yellow-500/20 bg-black/50 px-4 md:px-5 py-2 md:py-3 text-xs md:text-sm text-white placeholder-gray-500 transition-colors focus:border-yellow-500 focus:outline-none shadow-md min-w-0"
            aria-label="Chat message input"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="btn-gold flex shrink-0 h-10 md:h-12 w-10 md:w-12 items-center justify-center rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            aria-label="Send message"
          >
            <Send size={18} className="md:w-5 md:h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}