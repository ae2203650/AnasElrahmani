"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    const atTop = el.scrollTop === 0;
    const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

    const scrollingUp = event.deltaY < 0;
    const scrollingDown = event.deltaY > 0;

    if ((scrollingUp && !atTop) || (scrollingDown && !atBottom)) {
      event.stopPropagation();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    "What are Anas's main skills?",
    "Tell me about his projects",
    "What's his education?",
  ];

  return (
    <section className="chat-sec" id="chat">
      <div className="chat-sec-inner">
        <div className="chat-sec-header">
          <div className="chat-sec-label">AI Assistant</div>
          <div className="chat-sec-title">
            <span className="chat-sec-title-line">Ask me</span>
            <span className="chat-sec-title-line"><em>anything.</em></span>
          </div>
          <p className="chat-sec-desc">
            This assistant knows my work, skills, and background. Ask about a project, my experience, or what I'm looking for next.
          </p>
        </div>

        <div className="chat-box">
          {/* Messages area */}
          <div className="chat-box-messages" ref={scrollRef} onWheel={handleChatWheel}>
            {messages.length === 0 && (
              <div className="chat-empty">
                <div className="chat-empty-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="chat-empty-text">Start a conversation, ask me about Anas&apos;s work, skills, or background.</p>
                <div className="chat-suggestions">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      className="chat-suggestion"
                      onClick={() => {
                        setInput(s);
                        setTimeout(() => {
                          setInput(s);
                          const fakeEvent = { key: "Enter", shiftKey: false, preventDefault: () => {} } as React.KeyboardEvent;
                          // Trigger send directly
                          const userMsg: Message = { role: "user", content: s };
                          setMessages([userMsg]);
                          setLoading(true);
                          fetch("/api/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              messages: [{ role: "user", content: s }],
                            }),
                          })
                            .then((r) => r.json())
                            .then((data) => {
                              setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
                            })
                            .catch(() => {
                              setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
                            })
                            .finally(() => setLoading(false));
                          setInput("");
                        }, 50);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-msg ${msg.role === "user" ? "chat-msg--user" : "chat-msg--bot"}`}
              >
                {msg.role === "assistant" && (
                  <div className="chat-avatar">
                    <span>AE</span>
                  </div>
                )}
                <div className="chat-bubble">{msg.content}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg chat-msg--bot">
                <div className="chat-avatar"><span>AE</span></div>
                <div className="chat-bubble chat-typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="chat-box-input">
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ cursor: "text" }}
            />
            <button
              className="chat-send"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              style={{ cursor: loading || !input.trim() ? "default" : "pointer" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
