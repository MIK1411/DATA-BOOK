import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { Send, Loader2, Bot } from "lucide-react";
import { cn } from "../lib/utils";
import { useAppStore } from "../store";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function Chat() {
  const { language } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Welcome to the Digitalis Intelligence Node. I can assist you with demographic inquiries, structural analysis of the Census, or guide you through self-enumeration." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const updatedMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: updatedMessages, language })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      setMessages([...updatedMessages, { role: "model", content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages([...updatedMessages, { role: "model", content: "Error: Neural link disconnected. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 lg:p-12 animate-in fade-in duration-700 max-w-4xl mx-auto w-full">
      <div className="mb-6 lg:mb-10 text-center">
        <h2 className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#A68B5C] font-semibold mb-2 flex items-center justify-center space-x-2">
          <Bot size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Census Digitalis AI</span>
        </h2>
        <h1 className="font-serif text-2xl sm:text-3xl tracking-tight text-[#EBEBEB]">Neural Query Interface</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 sm:space-y-6 pb-6">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={cn(
              "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-500",
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#666666] mb-1.5 px-1">
              {msg.role === "user" ? "Administrator" : "Digitalis AI"}
            </span>
            <div 
              className={cn(
                "p-4 border text-sm leading-relaxed shadow-sm",
                msg.role === "user" 
                  ? "bg-[#0F0F0F] border-[#A68B5C]/50 text-[#F2F2F2]" 
                  : "bg-[#111111] border-[#262626] text-[#AAAAAA]"
              )}
            >
              <div className="markdown-body prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#0D0D0D] prose-pre:border prose-pre:border-[#262626]">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mr-auto flex flex-col items-start max-w-[85%] animate-in fade-in">
             <span className="text-[9px] uppercase tracking-[0.2em] text-[#666666] mb-1.5 px-1">Digitalis AI</span>
             <div className="p-4 bg-[#111111] border border-[#262626] flex items-center space-x-3">
               <Loader2 size={16} className="text-[#A68B5C] animate-spin" />
               <span className="text-xs text-[#888888] font-mono tracking-wide">Processing Query...</span>
             </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex space-x-3 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Transmit query..."
          className="flex-1 bg-[#141414] border border-[#262626] text-[#F2F2F2] px-6 py-4 text-sm focus:outline-none focus:border-[#A68B5C] transition-colors placeholder:text-[#444444]"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-8 bg-black border border-[#A68B5C] text-[#A68B5C] hover:bg-[#A68B5C] hover:text-black transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
