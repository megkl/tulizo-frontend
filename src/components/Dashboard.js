import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  MessageSquare,
  CheckSquare,
  BarChart2,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  Send,
  X,
  Minimize2,
  Mic,
  Volume2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceSettings from "./VoiceSettings";
// --- Theme & Styles ---
const COLORS = {
  primary: "#5CC9A3",
  secondary: "#60A5FA",
  dark: "#1E293B",
  textMuted: "#94A3B8",
  bgLight: "#b3b8c4ff",
  white: "#FFFFFF",
  accent: "#FDA4AF", // Used for active mic
};

const commonStyles = {
  card: {
    backgroundColor: COLORS.white,
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },
  tag: {
    padding: "10px 15px",
    borderRadius: "10px",
    color: COLORS.white,
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  iconBtn: {
    border: "none",
    background: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

// --- Sub-Components ---

const Sidebar = ({ currentView, setView }) => (
  <nav
    style={{
      width: "80px",
      backgroundColor: COLORS.dark,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px 0",
      gap: "30px",
    }}
  >
    <BarChart2
      style={{
        color: currentView === "analytics" ? COLORS.white : COLORS.textMuted,
        cursor: "pointer",
        padding: "12px",
        borderRadius: "12px",
        backgroundColor:
          currentView === "analytics" ? COLORS.secondary : "transparent",
      }}
      onClick={() => setView("analytics")}
    />
    <CheckSquare
      style={{
        color: currentView === "tasks" ? COLORS.white : COLORS.textMuted,
        cursor: "pointer",
        padding: "12px",
        borderRadius: "12px",
        backgroundColor:
          currentView === "tasks" ? COLORS.secondary : "transparent",
      }}
      onClick={() => setView("tasks")}
    />
    <Settings
      style={{
        color: currentView === "settings" ? COLORS.white : COLORS.textMuted,
        cursor: "pointer",
        padding: "12px",
        borderRadius: "12px",
        backgroundColor:
          currentView === "settings" ? COLORS.secondary : "transparent",
      }}
      onClick={() => setView("settings")}
    />
  </nav>
);

const ChatWidget = ({
  isOpen,
  setIsOpen,
  history,
  message,
  setMessage,
  onSend,
  isListening,
  startListening,
  isLoading,
}) => {
  const scrollRef = useRef(null);
  const [selectedVoice, setSelectedVoice] = useState("default");

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, isLoading]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      {isOpen && (
        <div
          style={{
            width: "380px",
            height: "520px",
            backgroundColor: COLORS.white,
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            marginBottom: "15px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.dark,
              color: "white",
              padding: "15px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: COLORS.primary,
                }}
              ></div>
              <span style={{ fontWeight: 600 }}>Tulizo AI</span>
            </div>
            <Minimize2
              size={18}
              cursor="pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              backgroundColor: "#F9FAFB",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {history.map((c, i) => (
              <div
                key={i}
                style={{
                  alignSelf: c.role === "ai" ? "flex-start" : "flex-end",
                  backgroundColor:
                    c.role === "ai" ? COLORS.white : COLORS.primary,
                  color: c.role === "ai" ? COLORS.dark : COLORS.white,
                  padding: "10px 14px",
                  borderRadius:
                    c.role === "ai"
                      ? "18px 18px 18px 4px"
                      : "18px 18px 4px 18px",
                  maxWidth: "80%",
                  fontSize: "14px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
              >
                {c.text}
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  fontSize: "12px",
                  color: COLORS.textMuted,
                  fontStyle: "italic",
                  marginLeft: "5px",
                }}
              >
                Tulizo is thinking...
              </div>
            )}
          </div>

          <div style={{ padding: "15px", borderTop: "1px solid #EEE" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={startListening}
                style={{
                  ...commonStyles.iconBtn,
                  backgroundColor: isListening ? COLORS.accent : COLORS.primary,
                  color: "white",
                  padding: "10px",
                  borderRadius: "50%",
                  transition: "0.3s",
                  boxShadow: isListening ? `0 0 15px ${COLORS.accent}` : "none",
                }}
              >
                <Mic size={20} />
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSend();
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  background: COLORS.bgLight,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  alignItems: "center",
                }}
              >
                <input
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    padding: "8px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                  placeholder={
                    isListening ? "Listening..." : "Ask me anything..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  style={{ ...commonStyles.iconBtn, color: COLORS.primary }}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
            <div
              style={{
                padding: "10px 24px",
                backgroundColor: "#F9FAFB",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#64748B",
              }}
            >
              <span>Voice: {selectedVoice}</span>
              <Volume2 size={14} />
            </div>
          </div>
        </div>
      )}
      <button
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: COLORS.primary,
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(92,201,163,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

// --- Main Dashboard Component ---

function Dashboard({ userId }) {
  const [view, setView] = useState("analytics");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskTab, setTaskTab] = useState("Active");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", text: "Hello! Tulizo Here! How can I help you today?" },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [trendData, setTrendData] = useState([]);
  useEffect(() => {
    fetchTasks();
    const fetchTrends = async () => {
      const res = await axios.get(`${BACKEND_URL}/analytics/trends`, {
        params: { user_id: userId },
      });
      if (res.data.data) setTrendData(res.data.data);
    };
    fetchTrends();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/tasks`, {
        params: { user_id: userId },
      });
      setTasks(res.data.tasks || []);
    } catch (e) {
      console.error("Fetch tasks error:", e);
    }
  };

  const handleAddTask = async (predefinedText) => {
    const text = predefinedText || newTask;
    if (!text.trim()) return;
    try {
      await axios.post(`${BACKEND_URL}/tasks`, {
        user_id: userId,
        task_text: text,
        status: "pending",
      });
      setNewTask("");
      fetchTasks();
    } catch (e) {
      console.error("Add task error:", e);
    }
  };

  const toggleTask = async (task) => {
    try {
      const isCompleting = task.status === "pending";
      const res = await axios.post(`${BACKEND_URL}/tasks/update`, {
        user_id: userId,
        task_id: task.id,
        status: isCompleting ? "completed" : "pending",
      });

      // Check if this was the last pending task
      const remainingTasks = tasks.filter(
        (t) => t.status === "pending" && t.id !== task.id
      );

      if (isCompleting && remainingTasks.length === 0) {
        // Trigger Victory SFX
        const victoryRes = await axios.post(`${BACKEND_URL}/chat`, {
          user_id: userId,
          message: "[SYSTEM_EVENT: ALL_TASKS_DONE]",
        });
        if (victoryRes.data.sfx) playBase64Audio(victoryRes.data.sfx);
        if (victoryRes.data.audio) playBase64Audio(victoryRes.data.audio);
      } else if (isCompleting) {
        // Standard completion chime
        playBase64Audio(res.data.sfx);
      }

      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${BACKEND_URL}/tasks/${taskId}`, {
        data: { user_id: userId },
      });
      fetchTasks();
    } catch (e) {
      console.error("Delete task error:", e);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after one sentence
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      // You could play a tiny "beep" here to signal listening
    };

    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSendChat(transcript); // Automatically sends once you stop talking
    };

    recognition.start();
  };
  const startListeningForTask = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");

    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setNewTask(transcript); // Show it in the input field

      // 1. Add the task to DB
      await handleAddTask(transcript);

      // 2. Trigger Voice Response Confirmation
      try {
        const confirmationText = `Got it. I've added ${transcript} to your list.`;
        const res = await axios.post(`${BACKEND_URL}/chat`, {
          user_id: userId,
          message: `I just added a task: ${transcript}. Give me a 1-sentence supportive confirmation.`,
        });

        // Play Tulizo's voice response
        if (res.data.audio) {
          playBase64Audio(res.data.audio);
        }

        // Update chat history so the user sees the confirmation there too
        setChatHistory((prev) => [
          ...prev,
          { role: "user", text: `(Voice Task) ${transcript}` },
          { role: "ai", text: res.data.text },
        ]);
      } catch (e) {
        console.error("Voice confirmation failed", e);
      }
    };

    recognition.start();
  };

  const playBase64Audio = (base64String) => {
    if (!base64String) return;
    const audio = new Audio(`data:audio/mpeg;base64,${base64String}`);
    audio.play();
  };

  const handleSendChat = async (voiceText) => {
    const text = voiceText || chatMsg;
    if (!text.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", text }]);
    setChatMsg("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/chat`, {
        user_id: userId,
        message: text,
      });

      const { audio, sfx, action, text: aiResponse } = res.data;

      // 1. Sensory Feedback
      // Play Victory Chime or Shredder SFX first
      if (sfx) playBase64Audio(sfx);

      // Tulizo's voice response
      if (audio) playBase64Audio(audio);

      setChatHistory((prev) => [...prev, { role: "ai", text: aiResponse }]);

      // 2. Action Orchestration
      if (action === "VICTORY") {
        // The backend has already confirmed all tasks are done.
        // We refresh tasks to ensure the UI shows the "All Clear" state.
        fetchTasks();
      } else if (action === "DELETE_COMPLETED") {
        const completedTasks = tasks.filter((t) => t.status === "completed");
        await Promise.all(
          completedTasks.map((task) =>
            axios.delete(`${BACKEND_URL}/tasks/${task.id}`, {
              data: { user_id: userId },
            })
          )
        );
        fetchTasks();
      } else if (action === "ADD_TASK") {
        const taskName = text.replace(/add|task|remind me to/gi, "").trim();
        if (taskName) {
          await handleAddTask(taskName);
          fetchTasks();
        }
      }
    } catch (e) {
      console.error("Voice/Chat Action Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMood = async (mood) => {
  setIsLoading(true);
  try {
    const res = await axios.post(`${BACKEND_URL}/chat`, {
      user_id: userId,
      message: `[MOOD_UPDATE]: I am feeling ${mood} today.`,
    });

    const { audio, sfx, text } = res.data;

    // 1. Play SFX/Ambience first to set the scene
    if (sfx) {
      const ambientPlayer = new Audio(`data:audio/mpeg;base64,${sfx}`);
      ambientPlayer.volume = 0.2; // Keep it low for immersion
      ambientPlayer.play();
    }

    if (audio) {
      // Small delay so the voice starts just after the ambience begins
      setTimeout(() => playBase64Audio(audio), 400); 
    }

    // 3. Update Chat State
    if (text) {
      setChatHistory((prev) => [...prev, { role: "ai", text }]);
      setIsChatOpen(true);
    }

    const updatedTrends = await axios.get(`${BACKEND_URL}/analytics/trends`, {
      params: { user_id: userId },
    });
    
    if (updatedTrends.data.status === "success") {
      setTrendData(updatedTrends.data.data);
    }

  } catch (e) {
    console.error("Mood update failed:", e);
  } finally {
    setIsLoading(false);
  }
};

  const filteredTasks = tasks.filter((t) => {
    if (taskTab === "Active") return t.status === "pending";
    if (taskTab === "Completed") return t.status === "completed";
    return true;
  });

  const [selectedMood, setSelectedMood] = useState("GOOD");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: COLORS.bgLight,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Sidebar currentView={view} setView={setView} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            height: "70px",
            backgroundColor: COLORS.white,
            display: "flex",
            alignItems: "center",
            padding: "0 40px",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <h1
            style={{ fontSize: "18px", fontWeight: "700", color: COLORS.dark }}
          >
            {view.toUpperCase()}
          </h1>
        </header>

        <div
          style={{
            padding: "40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
          }}
        >
          {view === "analytics" && (
            <div
              style={{
                gridColumn: "span 2",
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr",
                gap: "30px",
              }}
            >
              {/* --- Daily Reflection Card (Inspired by Screenshot) --- */}
              <div style={{ ...commonStyles.card, textAlign: "center" }}>
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    marginBottom: "5px",
                  }}
                >
                  Daily Reflection
                </h1>
                <p style={{ color: COLORS.textMuted, marginBottom: "30px" }}>
                  What is your mood today?
                </p>

                <div
                  style={{
                    position: "relative",
                    height: "320px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* The Mood Wheel */}
                  <div
                    style={{
                      width: "280px",
                      height: "280px",
                      borderRadius: "50%",
                      border: `10px solid #E2E8F0`,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        color: COLORS.primary,
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      Mood
                    </div>
                    <motion.div
                      key={selectedMood}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        color: COLORS.primary,
                      }}
                    >
                      {selectedMood}
                    </motion.div>

                    {/* Mood Nodes (Simplified positioning) */}
                    {["MEH", "GOOD", "COOL", "MAD"].map((m, i) => (
                      <motion.div
                        key={m}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => setSelectedMood(m)}
                        style={{
                          position: "absolute",
                          padding: "10px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          backgroundColor:
                            selectedMood === m ? COLORS.primary : COLORS.white,
                          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                          top: i === 1 ? -20 : i === 3 ? "auto" : "40%",
                          bottom: i === 3 ? -20 : "auto",
                          left: i === 0 ? -20 : "auto",
                          right: i === 2 ? -20 : "auto",
                        }}
                      >
                        {i === 1
                          ? "😊"
                          : i === 0
                          ? "😶"
                          : i === 2
                          ? "😎"
                          : "😡"}{" "}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSaveMood(selectedMood)}
                  style={{
                    marginTop: "30px",
                    width: "100%",
                    padding: "15px",
                    borderRadius: "20px",
                    border: "none",
                    background: "linear-gradient(90deg, #5CC9A3, #60A5FA)",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Save Mood & Reflect
                </button>
              </div>

              {/* --- Stats Column --- */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px",
                }}
              >
                <div style={commonStyles.card}>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "20px",
                    }}
                  >
                    Task Efficiency
                  </h2>
                  <div style={{ textAlign: "center" }}>
                    <h1
                      style={{
                        fontSize: "64px",
                        color: COLORS.primary,
                        margin: 0,
                      }}
                    >
                      {tasks.length > 0
                        ? Math.round(
                            (tasks.filter((t) => t.status === "completed")
                              .length /
                              tasks.length) *
                              100
                          )
                        : 0}
                      %
                    </h1>
                    <p style={{ color: "#64748B" }}>Completion Rate</p>
                  </div>
                </div>
                {/* Task Streak Counter Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    ...commonStyles.card,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                      Task Streak
                    </h2>
                    <div
                      style={{
                        backgroundColor: "#FFF7ED",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        color: "#EA580C",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Consistency is Key
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "20px 0",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      {/* Flame Icon with Pulse Animation */}
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ color: "#FB923C" }}
                      >
                        <div
                          style={{
                            fontSize: "64px",
                            filter:
                              "drop-shadow(0 0 10px rgba(251, 146, 60, 0.4))",
                          }}
                        >
                          🔥
                        </div>
                      </motion.div>
                    </div>

                    <h1
                      style={{
                        fontSize: "48px",
                        fontWeight: "800",
                        margin: "10px 0 0 0",
                        color: COLORS.dark,
                      }}
                    >
                      7{" "}
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: "400",
                          color: COLORS.textMuted,
                        }}
                      >
                        Days
                      </span>
                    </h1>
                    <p style={{ color: COLORS.textMuted, fontSize: "14px" }}>
                      You’ve hit victory 7 days in a row!
                    </p>
                  </div>

                  {/* Mini Progress Bar for the Week */}
                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "20px" }}
                  >
                    {[1, 1, 1, 1, 1, 1, 0].map((done, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: "6px",
                          borderRadius: "3px",
                          backgroundColor: done ? COLORS.primary : "#E2E8F0",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              <div style={{ ...commonStyles.card, gridColumn: "span 2" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  Mood vs. Task Completion{" "}
                  <span style={{ fontSize: "14px", color: COLORS.textMuted }}>
                    (Insights)
                  </span>
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    {" "}
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "15px" }} />
                    <Line
                      name="Mood"
                      type="monotone"
                      dataKey="mood"
                      stroke={COLORS.accent}
                      strokeWidth={3}
                    />
                    <Line
                      name="Tasks %"
                      type="monotone"
                      dataKey="tasks"
                      stroke={COLORS.primary}
                      strokeWidth={3}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p
                  style={{
                    marginTop: "15px",
                    fontSize: "13px",
                    color: COLORS.textMuted,
                  }}
                >
                  💡 Tulizo Insight: Your productivity peaks when your mood
                  is great!.
                </p>
              </div>

            </div>
          )}

          {view === "tasks" && (
            <>
              <div style={commonStyles.card}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  Quick Add Task
                </h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "15px",
                    padding: "8px 15px",
                    marginBottom: "25px",
                    border: isListening
                      ? `2px solid ${COLORS.primary}`
                      : "1px solid #E5E7EB",
                    transition: "0.3s border-color",
                  }}
                >
                  <input
                    style={{
                      border: "none",
                      background: "transparent",
                      flex: 1,
                      outline: "none",
                      fontSize: "15px",
                    }}
                    placeholder={
                      isListening
                        ? "Listening to your task..."
                        : "Add a new task..."
                    }
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                  />

                  <button
                    onClick={startListeningForTask}
                    style={{
                      ...commonStyles.iconBtn,
                      color: isListening ? COLORS.accent : COLORS.textMuted,
                      marginRight: "10px",
                    }}
                  >
                    <Mic
                      size={20}
                      className={isListening ? "animate-pulse" : ""}
                    />
                  </button>

                  <button
                    onClick={() => handleAddTask()}
                    style={{
                      backgroundColor: COLORS.secondary,
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {["High Priority", "Daily Routine", "Work", "Personal"].map(
                    (tag, idx) => (
                      <div
                        key={tag}
                        onClick={() => handleAddTask(tag)}
                        style={{
                          ...commonStyles.tag,
                          backgroundColor:
                            idx % 2 === 0 ? "#FDA4AF" : COLORS.primary,
                        }}
                      >
                        {tag}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div style={commonStyles.card}>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "20px",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  {["Active", "Completed"].map((tab) => (
                    <div
                      key={tab}
                      onClick={() => setTaskTab(tab)}
                      style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        color: taskTab === tab ? COLORS.dark : COLORS.textMuted,
                        borderBottom:
                          taskTab === tab ? `2px solid ${COLORS.dark}` : "none",
                        fontWeight: 500,
                        transition: "0.3s",
                      }}
                    >
                      {tab}
                    </div>
                  ))}
                </div>

                <div style={{ position: "relative" }}>
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{
                            opacity: 0,
                            rotate: [0, -2, 2, -2, 0], // The "Shredder" shake
                            y: 80, // Sliding down into the shredder
                            scale: 0.9,
                            transition: { duration: 0.4 },
                          }}
                          style={{
                            backgroundColor: COLORS.white,
                            borderRadius: "18px",
                            padding: "16px",
                            marginBottom: "12px",
                            border: "1px solid #F3F4F6",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            onClick={() => toggleTask(task)}
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <CheckCircle
                              size={20}
                              color={
                                task.status === "completed"
                                  ? COLORS.primary
                                  : "#CBD5E1"
                              }
                            />
                            <span
                              style={{
                                textDecoration:
                                  task.status === "completed"
                                    ? "line-through"
                                    : "none",
                                color:
                                  task.status === "completed"
                                    ? COLORS.textMuted
                                    : COLORS.dark,
                              }}
                            >
                              {task.task_text}
                            </span>
                          </div>
                          <Trash2
                            size={18}
                            color="#CBD5E1"
                            cursor="pointer"
                            onClick={() => deleteTask(task.id)}
                          />
                        </motion.div>
                      ))
                    ) : (
                      /* Victory / Empty State */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        <CheckCircle
                          size={48}
                          color={COLORS.primary}
                          style={{ marginBottom: "16px", opacity: 0.5 }}
                        />
                        <h3 style={{ color: COLORS.dark, marginBottom: "8px" }}>
                          All caught up!
                        </h3>
                        <p
                          style={{ color: COLORS.textMuted, fontSize: "14px" }}
                        >
                          {taskTab === "Active"
                            ? "You've finished everything for now. Enjoy the peace!"
                            : "No completed tasks yet."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}

          {view === "settings" && (
            <div style={{ gridColumn: "span 2" }}>
              <VoiceSettings userId={userId} />
            </div>
          )}
        </div>

        <ChatWidget
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
          history={chatHistory}
          message={chatMsg}
          setMessage={setChatMsg}
          onSend={handleSendChat}
          isListening={isListening}
          startListening={startListening}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default Dashboard;
