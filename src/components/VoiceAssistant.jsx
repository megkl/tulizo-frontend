import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function VoiceAssistant({ userId }) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [audio, setAudio] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Fetch user's preferred voice on load
  useEffect(() => {
    const fetchVoice = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/voice`, { params: { user_id: userId } });
        setSelectedVoice(res.data.voice || "default");
      } catch (e) {
        console.error("Failed to fetch voice:", e);
      }
    };
    fetchVoice();

    // Example voice options
    setVoices(["default", "calm", "friendly", "energetic"]);
  }, [userId]);

  const handleVoiceChange = async (voice) => {
    setSelectedVoice(voice);
    try {
      await axios.post(`${BACKEND_URL}/voice`, { user_id: userId, voice_id: voice });
    } catch (e) {
      console.error("Failed to update voice:", e);
    }
  };

  // Initialize Speech Recognition
  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return null;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    return recognition;
  };

  const startListening = () => {
    const recognition = initRecognition();
    if (!recognition) return;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      handleSubmit(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
  };

  const handleSubmit = async (textInput) => {
    const userMessage = textInput || message;
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setResponse("Tulizo is thinking...");
    setAudio(null);

    try {
      const res = await axios.post(`${BACKEND_URL}/chat`, {
        user_id: userId,
        message: userMessage,
        voice_id: selectedVoice,
      });
      setResponse(res.data.text || "Tulizo has no response.");

      if (res.data.audio) {
        const byteCharacters = atob(res.data.audio);
        const byteNumbers = new Array(byteCharacters.length)
          .fill()
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        setAudio(url);

        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.volume = 0;
            audioRef.current.play().catch(err => console.error("Autoplay blocked:", err));
            let vol = 0;
            const fadeInterval = setInterval(() => {
              vol += 0.05;
              if (audioRef.current) audioRef.current.volume = Math.min(vol, 1);
              if (vol >= 1) clearInterval(fadeInterval);
            }, 50);
          }
        }, 100);
      }
    } catch (error) {
      console.error("Backend error:", error);
      setResponse("Sorry, Tulizo is currently unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center", padding: "2rem" }}>
      <h1>🎙️ Tulizo AI</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Select Voice: </label>
        <select
          value={selectedVoice || "default"}
          onChange={(e) => handleVoiceChange(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: "6px" }}
        >
          {voices.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <button
        onClick={startListening}
        style={{
          backgroundColor: isListening ? "#FF6B6B" : "#5CC9A3",
          color: "white",
          padding: "12px 20px",
          border: "none",
          borderRadius: "25px",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        {isListening ? "Listening..." : "🎤 Speak to Tulizo"}
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Or type your message..."
          style={{ width: "80%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            padding: "10px 16px",
            backgroundColor: "#5CC9A3",
            border: "none",
            borderRadius: "8px",
            color: "white",
          }}
        >
          Send
        </button>
      </form>

      {isLoading && <p style={{ color: "#888", marginTop: "1rem" }}>💭 Tulizo is thinking...</p>}

      {response && !isLoading && (
        <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
          <h3>💬 Tulizo says:</h3>
          <p style={{ background: "#f8f8f8", padding: "12px", borderRadius: "8px" }}>{response}</p>
        </div>
      )}

      {audio && (
        <div style={{ marginTop: "1rem" }}>
          <audio ref={audioRef} src={audio} controls />
        </div>
      )}
    </div>
  );
}

export default VoiceAssistant;
