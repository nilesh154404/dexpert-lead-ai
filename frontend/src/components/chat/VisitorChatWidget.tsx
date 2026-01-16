import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Minimize2, Calendar, User, Mail, Phone, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTenant } from "@/contexts/TenantContext";
import { motion, AnimatePresence } from "framer-motion";

type VisitorState = "anonymous" | "identifying" | "identified" | "booking" | "confirmed";
type IdentifyField = "name" | "email" | "phone";

interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  timestamp: Date;
  type?: "text" | "identity-capture" | "appointment-booking" | "confirmation";
}

interface VisitorInfo {
  name?: string;
  email?: string;
  phone?: string;
}

interface AppointmentSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

const mockSlots: AppointmentSlot[] = [
  { id: "1", date: "Tomorrow", time: "10:00 AM", available: true },
  { id: "2", date: "Tomorrow", time: "2:00 PM", available: true },
  { id: "3", date: "Wed, Jan 18", time: "11:00 AM", available: true },
  { id: "4", date: "Wed, Jan 18", time: "3:30 PM", available: true },
];

export function VisitorChatWidget() {
  const { tenant } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [visitorState, setVisitorState] = useState<VisitorState>("anonymous");
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo>({});
  const [identifyStep, setIdentifyStep] = useState<IdentifyField>("name");
  const [identifyValue, setIdentifyValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCount = useRef(0);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: tenant.welcomeMessage || "Hi! I'm your AI assistant. How can I help you today?",
          role: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [tenant.welcomeMessage, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (content: string, role: "user" | "ai", type?: Message["type"]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${messageCount.current++}`,
      content,
      role,
      timestamp: new Date(),
      type,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      // High intent detection - trigger identity capture
      const highIntentKeywords = ["pricing", "demo", "quote", "buy", "purchase", "contact", "speak to", "talk to", "schedule", "appointment", "meeting"];
      const isHighIntent = highIntentKeywords.some((kw) => userMessage.toLowerCase().includes(kw));
      
      if (isHighIntent && visitorState === "anonymous") {
        addMessage(
          "I'd love to help you with that! To provide you with the best assistance, may I get a few details from you?",
          "ai"
        );
        setTimeout(() => {
          setVisitorState("identifying");
          addMessage("", "ai", "identity-capture");
        }, 500);
      } else if (userMessage.toLowerCase().includes("book") || userMessage.toLowerCase().includes("appointment") || userMessage.toLowerCase().includes("schedule")) {
        if (visitorState === "identified") {
          addMessage("Great! Let me show you available appointment slots.", "ai");
          setTimeout(() => {
            setVisitorState("booking");
            addMessage("", "ai", "appointment-booking");
          }, 500);
        } else {
          addMessage(
            "I can help you book an appointment! First, let me get your contact details.",
            "ai"
          );
          setTimeout(() => {
            setVisitorState("identifying");
            addMessage("", "ai", "identity-capture");
          }, 500);
        }
      } else {
        const responses = [
          "I understand you're looking for more information. Let me analyze your needs and provide relevant insights.",
          "That's a great question! Based on what you're telling me, I'd recommend exploring our enterprise solutions.",
          "I can definitely help with that. Would you like me to connect you with a specialist?",
          "Thanks for sharing that. This helps me understand your needs better. Is there anything specific you'd like to know?",
        ];
        addMessage(responses[Math.floor(Math.random() * responses.length)], "ai");
      }
    }, 1000 + Math.random() * 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    addMessage(input, "user");
    const userMessage = input;
    setInput("");
    simulateAIResponse(userMessage);
  };

  const handleIdentitySubmit = () => {
    if (!identifyValue.trim()) return;
    
    if (identifyStep === "name") {
      setVisitorInfo((prev) => ({ ...prev, name: identifyValue }));
      setIdentifyValue("");
      setIdentifyStep("email");
    } else if (identifyStep === "email") {
      setVisitorInfo((prev) => ({ ...prev, email: identifyValue }));
      setIdentifyValue("");
      setIdentifyStep("phone");
    } else if (identifyStep === "phone") {
      const updatedInfo = { ...visitorInfo, phone: identifyValue };
      setVisitorInfo(updatedInfo);
      setIdentifyValue("");
      setVisitorState("identified");
      
      // Remove identity capture message and add confirmation
      setMessages((prev) => prev.filter((m) => m.type !== "identity-capture"));
      addMessage(
        `Thanks ${updatedInfo.name}! I've got your details. How can I help you today?`,
        "ai"
      );
    }
  };

  const handleBookAppointment = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
    setVisitorState("confirmed");
    
    // Remove booking UI and add confirmation
    setMessages((prev) => prev.filter((m) => m.type !== "appointment-booking"));
    addMessage("", "ai", "confirmation");
    addMessage(
      `Your appointment is confirmed for ${slot.date} at ${slot.time}. You'll receive a confirmation email at ${visitorInfo.email}.`,
      "ai"
    );
  };

  const renderIdentityCapture = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-ai/5 border border-ai/20 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-ai">
        <User className="h-4 w-4" />
        <span>Quick Details</span>
      </div>
      
      <div className="space-y-2">
        {/* Progress indicators */}
        <div className="flex gap-2">
          {["name", "email", "phone"].map((step, idx) => (
            <div
              key={step}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                identifyStep === step
                  ? "bg-ai"
                  : (step === "name" && visitorInfo.name) ||
                    (step === "email" && visitorInfo.email)
                  ? "bg-ai/50"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            {identifyStep === "name" && <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            {identifyStep === "email" && <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            {identifyStep === "phone" && <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            <Input
              value={identifyValue}
              onChange={(e) => setIdentifyValue(e.target.value)}
              placeholder={
                identifyStep === "name"
                  ? "Your name"
                  : identifyStep === "email"
                  ? "Your email"
                  : "Phone (optional)"
              }
              className="pl-10"
              type={identifyStep === "email" ? "email" : identifyStep === "phone" ? "tel" : "text"}
              onKeyDown={(e) => e.key === "Enter" && handleIdentitySubmit()}
            />
          </div>
          <Button variant="ai" size="icon" onClick={handleIdentitySubmit}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
        
        {identifyStep === "phone" && (
          <button
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              setVisitorState("identified");
              setMessages((prev) => prev.filter((m) => m.type !== "identity-capture"));
              addMessage(`Thanks ${visitorInfo.name}! How can I help you today?`, "ai");
            }}
          >
            Skip this step →
          </button>
        )}
      </div>
    </motion.div>
  );

  const renderAppointmentBooking = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-ai/5 border border-ai/20 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-ai">
        <Calendar className="h-4 w-4" />
        <span>Select a Time</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {mockSlots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => handleBookAppointment(slot)}
            className="p-3 rounded-lg border bg-card hover:bg-secondary hover:border-ai/30 transition-all text-left"
          >
            <p className="text-sm font-medium">{slot.date}</p>
            <p className="text-xs text-muted-foreground">{slot.time}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-success/10 border border-success/30 rounded-xl p-4 text-center space-y-2"
    >
      <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center mx-auto">
        <Check className="h-5 w-5 text-success" />
      </div>
      <p className="font-medium">Appointment Confirmed!</p>
      {selectedSlot && (
        <p className="text-sm text-muted-foreground">
          {selectedSlot.date} at {selectedSlot.time}
        </p>
      )}
    </motion.div>
  );

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg shadow-ai/20"
          variant="ai"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
        
        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive animate-pulse" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        "fixed bottom-6 right-6 w-96 rounded-2xl bg-card border shadow-xl overflow-hidden transition-all duration-300 z-50",
        isMinimized ? "h-14" : "h-[520px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-ai/5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-ai/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-ai" />
          </div>
          <div>
            <p className="text-sm font-medium">{tenant.chatbotName || "AI Assistant"}</p>
            <p className="text-xs text-muted-foreground">
              {visitorState === "identified" && visitorInfo.name
                ? `Chatting with ${visitorInfo.name}`
                : "Always here to help"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => setIsMinimized(!isMinimized)}>
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[calc(100%-56px)]"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === "identity-capture" ? (
                    renderIdentityCapture()
                  ) : message.type === "appointment-booking" ? (
                    renderAppointmentBooking()
                  ) : message.type === "confirmation" ? (
                    renderConfirmation()
                  ) : (
                    <div
                      className={cn(
                        "max-w-[80%] text-sm",
                        message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                      )}
                    >
                      {message.content}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="chat-bubble-ai flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={visitorState === "identifying"}
                />
                <Button variant="ai" size="icon" onClick={handleSend} disabled={visitorState === "identifying"}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
