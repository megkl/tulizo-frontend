import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Mic, Send, Volume2, Settings, User } from "lucide-react";

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#FFFFFF",
    borderRadius: "32px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "85vh",
  },
  header: {
    padding: "24px",
    background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    color: "#FFFFFF",
    textAlign: "center",
  },
  chatWindow: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backgroundColor: "#F9FAFB",
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
    padding: "14px 18px",
    borderRadius: "20px 20px 20px 4px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
    maxWidth: "85%",
    lineHeight: "1.5",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#5CC9A3",
    color: "#FFFFFF",
    padding: "14px 18px",
    borderRadius: "20px 20px 4px 20px",
    maxWidth: "85%",
    lineHeight: "1.5",
  },
  inputArea: {
    padding: "20px",
    backgroundColor: "#FFFFFF",
    borderTop: "1px solid #F3F4F6",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  inputPill: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: "24px",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
  },
  textField: {
    border: "none",
    background: "transparent",
    outline: "none",
    width: "100%",
    padding: "8px",
    fontSize: "15px",
  },
  micButton: (isListening) => ({
    backgroundColor: isListening ? "#FDA4AF" : "#5CC9A3",
    border: "none",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: isListening ? "0 0 15px rgba(253, 164, 175, 0.5)" : "0 4px 12px rgba(92, 201, 163, 0.3)",
    color: "white",
  }),
};

function VoiceAssistant({ userId }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", text: "Hello! I'm Tulizo. How can I help you today?" }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("default");

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const scrollRef = useRef(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      handleSubmit(transcript);
    };
    recognition.start();
  };

  const handleSubmit = async (textInput) => {
    const userMsg = textInput || message;
    if (!userMsg.trim()) return;

    // Add user message to UI
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/chat`, {
        user_id: userId,
        message: userMsg,
        voice_id: selectedVoice,
      });

      const aiText = res.data.text || "I'm not sure how to respond to that.";
      setChatHistory(prev => [...prev, { role: "ai", text: aiText }]);

      if (res.data.audio) {
        const audioUrl = `data:audio/mpeg;base64,${res.data.audio}`;
        const audioObj = new Audio(audioUrl);
        audioObj.play();
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { role: "ai", text: "Connection lost. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h3 style={{ margin: 0, fontSize: "18px", letterSpacing: "0.5px" }}>TULIZO AI</h3>
        <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.8 }}>Virtual Wellness Assistant</p>
      </header>

      <div style={styles.chatWindow} ref={scrollRef}>
        {chatHistory.map((chat, i) => (
          <div key={i} style={chat.role === "ai" ? styles.aiBubble : styles.userBubble}>
            {chat.text}
          </div>
        ))}
        {isLoading && (
          <div style={{ ...styles.aiBubble, fontStyle: "italic", opacity: 0.7 }}>
            Tulizo is thinking...
          </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <button 
          onClick={startListening} 
          style={styles.micButton(isListening)}
        >
          <Mic size={20} strokeWidth={2.5} />
        </button>

        <form 
          style={styles.inputPill} 
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
          <input
            style={styles.textField}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" style={{ border: "none", background: "none", cursor: "pointer", color: "#94A3B8" }}>
            <Send size={18} />
          </button>
        </form>
      </div>

      <div style={{ padding: "10px 24px", backgroundColor: "#F9FAFB", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748B" }}>
        <span>Voice: {selectedVoice}</span>
        <Volume2 size={14} />
      </div>
    </div>
  );
}

export default VoiceAssistant;