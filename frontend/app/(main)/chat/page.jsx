"use client";

// Notice the change on the line below!
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    onError: (err) => {
      console.error("Disha API Error:", err);
    }
  });

  // Auto-scroll to the bottom when a new message arrives
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-4xl min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Chat with Disha
        </h1>
        <p className="text-slate-400">
          Your personalized AI career coach. Ask for resume reviews, interview tips, or career guidance.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-slate-950/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col h-[60vh] shadow-xl">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Bot className="w-12 h-12 text-purple-500/50" />
              <p>Hi! I'm Disha. How can I help your career today?</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar for AI */}
                {m.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] md:max-w-[75%] text-sm md:text-base ${
                    m.role === "user"
                      ? "bg-purple-600 text-white rounded-tr-sm"
                      : "bg-slate-800/80 text-slate-200 border border-white/5 rounded-tl-sm"
                  }`}
                >
                  {m.content}
                </div>

                {/* Avatar for User */}
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-white/5 text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Stop the page from refreshing
            console.log("1. Form submitted! Input is:", input);
            try {
              handleSubmit(e); // Send to AI SDK
              console.log("2. handleSubmit fired successfully");
            } catch (err) {
              console.error("3. Crash in handleSubmit:", err);
            }
          }}
          className="relative flex items-center mt-auto"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-4 pr-14 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input?.trim()}
            size="icon"
            className="absolute right-2 bg-purple-600 hover:bg-purple-700 h-8 w-8 rounded-lg transition-all"
            onClick={(e) => {
              // Fallback just in case the button click isn't triggering the form
              if (input?.trim()) {
                console.log("Button clicked directly!");
              }
            }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

      </div>
    </div>
  );
}