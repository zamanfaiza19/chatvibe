"use client";

import React, { useState, useEffect, useRef } from "react";
import { FormData, QuestionData } from "@/types";
import { isValidEmail } from "@/lib/utils";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, RotateCcw, AlertCircle, X } from "lucide-react";

interface ChatbotWidgetProps {
  form: FormData;
  isPreview?: boolean;
  showPreviewBadge?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  standalone?: boolean;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  questionIndex?: number;
  timestamp: Date;
}

export default function ChatbotWidget({
  form,
  isPreview = false,
  showPreviewBadge = false,
  showCloseButton = false,
  onClose,
  standalone = false,
}: ChatbotWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgCounterRef = useRef<number>(1);
  const answersRef = useRef<Record<string, string>>({});

  const questions = React.useMemo(() => form.questions || [], [form.questions]);
  const currentQuestion: QuestionData | undefined = questions[currentQuestionIndex];
  const themeColor = form.themeColor || "#4f46e5";

  // Auto-scroll chat to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when moving to a new question that requires text
  useEffect(() => {
    if (
      currentQuestion &&
      (currentQuestion.type === "text" || currentQuestion.type === "email") &&
      !isTyping
    ) {
      inputRef.current?.focus();
    }
  }, [currentQuestionIndex, isTyping, currentQuestion]);

  const handleAllQuestionsAnswered = async (finalAnswers?: Record<string, string>) => {
    setIsTyping(true);
    setCurrentQuestionIndex(-1);

    const answersToSubmit = finalAnswers || answersRef.current;

    try {
      setIsSubmitting(true);
      if (!isPreview) {
        await fetch(`/api/forms/${form.id}/submissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: answersToSubmit, isPreview }),
        });
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }

    setTimeout(() => {
      setIsTyping(false);
      setIsCompleted(true);

      const completionMsg: ChatMessage = {
        id: `completion-${msgCounterRef.current++}`,
        sender: "bot",
        text: form.completionMessage || "Thank you! 🎉 Your responses have been submitted successfully.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMsg]);

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Fallback gracefully if canvas is unavailable
      }
    }, 700);
  };

  const askQuestion = (index: number) => {
    if (index >= questions.length) {
      handleAllQuestionsAnswered();
      return;
    }

    const q = questions[index];
    setCurrentQuestionIndex(index);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const questionText = q.description ? `${q.title}\n${q.description}` : q.title;
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-q-${q.id || index}-${msgCounterRef.current++}`,
          sender: "bot",
          text: questionText,
          questionIndex: index,
          timestamp: new Date(),
        },
      ]);
    }, 600);
  };

  const resetChat = () => {
    answersRef.current = {};
    setAnswers({});
    setIsCompleted(false);
    setErrorMessage(null);
    setInputValue("");
    setCurrentQuestionIndex(-1);

    const welcomeMsg: ChatMessage = {
      id: `welcome-${msgCounterRef.current++}`,
      sender: "bot",
      text: form.welcomeMessage || "Hi there! 👋 Welcome to our interactive form.",
      timestamp: new Date(),
    };

    setMessages([welcomeMsg]);
    setIsTyping(true);

    const timer = setTimeout(() => {
      setIsTyping(false);
      if (questions.length > 0) {
        askQuestion(0);
      }
    }, 700);

    return () => clearTimeout(timer);
  };

  // Initialize conversation only on mount or when switching forms
  useEffect(() => {
    const cleanup = resetChat();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.id]);

  const handleUserAnswer = async (answerValue: string) => {
    if (!currentQuestion) return;

    setErrorMessage(null);
    const trimmed = answerValue.trim();

    // Validation
    if (currentQuestion.required && !trimmed) {
      setErrorMessage("This question is required. Please provide an answer.");
      return;
    }

    if (currentQuestion.type === "email" && trimmed) {
      if (!isValidEmail(trimmed)) {
        setErrorMessage("Please enter a valid email address (e.g. name@example.com).");
        return;
      }
    }

    // Record answer
    const questionId = currentQuestion.id || `q-${currentQuestionIndex}`;
    const newAnswers = { ...answers, [questionId]: trimmed };
    answersRef.current = newAnswers;
    setAnswers(newAnswers);

    // Add user bubble
    setMessages((prev) => [
      ...prev,
      {
        id: `user-ans-${msgCounterRef.current++}`,
        sender: "user",
        text: trimmed || "(Skipped)",
        timestamp: new Date(),
      },
    ]);

    setInputValue("");

    // Advance to next question or complete
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      askQuestion(nextIndex);
    } else {
      await handleAllQuestionsAnswered(newAnswers);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserAnswer(inputValue);
    }
  };

  const notifyClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.parent.postMessage({ type: "formchat:close" }, "*");
      window.parent.postMessage({ type: "FORMCRAFT_CLOSE" }, "*");
    }
  };

  const shouldShowClose = showCloseButton || Boolean(onClose);

  const progressPercent =
    questions.length > 0 && currentQuestionIndex >= 0
      ? Math.round((currentQuestionIndex / questions.length) * 100)
      : isCompleted
      ? 100
      : 0;

  return (
    <div
      className={`flex flex-col h-full bg-white shadow-xl ${
        standalone ? "min-h-screen sm:min-h-0 sm:max-h-[720px] sm:rounded-2xl border border-slate-200" : "rounded-none"
      }`}
    >
      {/* Top Header */}
      <div
        className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between text-white shrink-0 relative overflow-hidden"
        style={{ backgroundColor: themeColor }}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 z-10 min-w-0 flex-1 mr-2">
          <div className="size-9 sm:size-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg sm:text-xl shadow-inner border border-white/30 shrink-0">
            {form.botAvatar || "🥐"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-bold text-sm sm:text-base tracking-tight leading-tight truncate">
                {form.botName || "Formchat Assistant"}
              </h3>
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/80 truncate">{form.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 z-10 shrink-0">
          {showPreviewBadge && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-black/25 rounded-full text-white/95 border border-white/10 shrink-0">
              Preview
            </span>
          )}
          <button
            onClick={resetChat}
            title="Restart Conversation"
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {shouldShowClose && (
            <button
              onClick={notifyClose}
              title="Close Widget"
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1 shrink-0 overflow-hidden">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%`, backgroundColor: themeColor }}
        />
      </div>

      {/* Question Counter Indicator */}
      {currentQuestionIndex >= 0 && !isCompleted && (
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-1.5 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          {currentQuestion?.required ? (
            <span className="text-amber-600 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Required *
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">Optional</span>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm shrink-0 mb-0.5 shadow-sm">
                {form.botAvatar || "🤖"}
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "text-white rounded-br-xs shadow-md"
                  : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/70"
              }`}
              style={{
                backgroundColor: msg.sender === "user" ? themeColor : undefined,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex items-end gap-2.5 justify-start animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm shrink-0 mb-0.5">
              {form.botAvatar || "🤖"}
            </div>
            <div className="bg-slate-100 border border-slate-200/70 rounded-2xl rounded-bl-xs px-4 py-3 text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Controls Area */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0">
        {errorMessage && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isCompleted ? (
          <div className="text-center py-3 space-y-3 animate-fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Submission Confirmed!</p>
            <p className="text-xs text-slate-500">Your answers have been stored securely.</p>
            <button
              onClick={resetChat}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Fill Again / Restart
            </button>
          </div>
        ) : currentQuestion && !isTyping ? (
          <div>
            {/* Multiple Choice Question: Option Buttons */}
            {currentQuestion.type === "multiple_choice" && (
              <div className="space-y-2 animate-fade-in">
                <div className="grid grid-cols-1 gap-2">
                  {(currentQuestion.options || []).map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleUserAnswer(opt)}
                      className="w-full text-left px-4 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-800 text-sm font-medium transition-all flex items-center justify-between group active:scale-[0.99]"
                    >
                      <span>{opt}</span>
                      <span className="text-xs text-slate-400 group-hover:text-indigo-600 font-mono">
                        #{i + 1}
                      </span>
                    </button>
                  ))}
                </div>
                {!currentQuestion.required && (
                  <button
                    onClick={() => handleUserAnswer("")}
                    className="w-full text-center py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Skip optional question →
                  </button>
                )}
              </div>
            )}

            {/* Yes / No Question: Binary Pills */}
            {currentQuestion.type === "yes_no" && (
              <div className="flex gap-3 animate-fade-in">
                <button
                  onClick={() => handleUserAnswer("Yes")}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-emerald-500/20 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm font-bold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
                >
                  <span>👍 Yes</span>
                </button>
                <button
                  onClick={() => handleUserAnswer("No")}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-rose-500/20 bg-rose-50 hover:bg-rose-100 text-rose-800 text-sm font-bold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
                >
                  <span>👎 No</span>
                </button>
              </div>
            )}

            {/* Text & Email Questions: Input Box */}
            {(currentQuestion.type === "text" || currentQuestion.type === "email") && (
              <div className="space-y-2 animate-fade-in">
                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type={currentQuestion.type === "email" ? "email" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={currentQuestion.placeholder || (currentQuestion.type === "email" ? "name@example.com" : "Type your answer...")}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{ "--tw-ring-color": themeColor } as React.CSSProperties}
                  />
                  <button
                    onClick={() => handleUserAnswer(inputValue)}
                    disabled={isSubmitting || (currentQuestion.required && !inputValue.trim())}
                    className="absolute right-2 p-2 rounded-lg text-white disabled:opacity-40 disabled:hover:opacity-40 hover:brightness-110 active:scale-95 transition-all shadow-sm"
                    style={{ backgroundColor: themeColor }}
                    aria-label="Send response"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {!currentQuestion.required && !inputValue && (
                  <button
                    onClick={() => handleUserAnswer("")}
                    className="w-full text-center py-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Skip optional question →
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-2 text-center text-xs text-slate-400">
            {isSubmitting ? "Saving your response..." : "Powered by Formchat"}
          </div>
        )}
      </div>
    </div>
  );
}
