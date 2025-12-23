import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  MessageSquare, CheckSquare, BarChart2, Settings, Plus, 
  Trash2, CheckCircle, Send, X, Minimize2, Mic, Volume2 
} from 'lucide-react';

import VoiceSettings from "./VoiceSettings";
// --- Theme & Styles ---
const COLORS = {
  primary: '#5CC9A3',
  secondary: '#60A5FA',
  dark: '#1E293B',
  textMuted: '#94A3B8',
  bgLight: '#b3b8c4ff',
  white: '#FFFFFF',
  accent: '#FDA4AF' // Used for active mic
};

const commonStyles = {
  card: { backgroundColor: COLORS.white, borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
  tag: { padding: '10px 15px', borderRadius: '10px', color: COLORS.white, fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  iconBtn: { border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

// --- Sub-Components ---

const Sidebar = ({ currentView, setView }) => (
  <nav style={{ width: '80px', backgroundColor: COLORS.dark, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '30px' }}>
    <BarChart2 
      style={{ color: currentView === "analytics" ? COLORS.white : COLORS.textMuted, cursor: 'pointer', padding: '12px', borderRadius: '12px', backgroundColor: currentView === "analytics" ? COLORS.secondary : 'transparent' }} 
      onClick={() => setView("analytics")} 
    />
    <CheckSquare 
      style={{ color: currentView === "tasks" ? COLORS.white : COLORS.textMuted, cursor: 'pointer', padding: '12px', borderRadius: '12px', backgroundColor: currentView === "tasks" ? COLORS.secondary : 'transparent' }} 
      onClick={() => setView("tasks")} 
    />
    <Settings 
      style={{ color: currentView === "settings" ? COLORS.white : COLORS.textMuted, cursor: 'pointer', padding: '12px', borderRadius: '12px', backgroundColor: currentView === "settings" ? COLORS.secondary : 'transparent' }} 
   onClick={() => setView("settings")} 
   />
  </nav>
);

const ChatWidget = ({ isOpen, setIsOpen, history, message, setMessage, onSend, isListening, startListening, isLoading }) => {
  const scrollRef = useRef(null);
  const [selectedVoice, setSelectedVoice] = useState("default");

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, isLoading]);

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {isOpen && (
        <div style={{ width: '380px', height: '520px', backgroundColor: COLORS.white, borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', marginBottom: '15px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: COLORS.dark, color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.primary }}></div>
               <span style={{ fontWeight: 600 }}>Tulizo AI</span>
            </div>
            <Minimize2 size={18} cursor="pointer" onClick={() => setIsOpen(false)} />
          </div>
          
          <div ref={scrollRef} style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((c, i) => (
              <div key={i} style={{ 
                alignSelf: c.role === 'ai' ? 'flex-start' : 'flex-end',
                backgroundColor: c.role === 'ai' ? COLORS.white : COLORS.primary,
                color: c.role === 'ai' ? COLORS.dark : COLORS.white,
                padding: '10px 14px', borderRadius: c.role === 'ai' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                maxWidth: '80%', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}>{c.text}</div>
            ))}
            {isLoading && <div style={{ fontSize: '12px', color: COLORS.textMuted, fontStyle: 'italic', marginLeft: '5px' }}>Tulizo is thinking...</div>}
          </div>

          <div style={{ padding: '15px', borderTop: '1px solid #EEE' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                onClick={startListening}
                style={{ 
                  ...commonStyles.iconBtn, 
                  backgroundColor: isListening ? COLORS.accent : COLORS.primary,
                  color: 'white', padding: '10px', borderRadius: '50%',
                  transition: '0.3s', boxShadow: isListening ? `0 0 15px ${COLORS.accent}` : 'none'
                }}>
                <Mic size={20} />
              </button>
              
              <form onSubmit={(e) => { e.preventDefault(); onSend(); }} style={{ flex: 1, display: 'flex', background: COLORS.bgLight, borderRadius: '20px', padding: '5px 15px', alignItems: 'center' }}>
                <input 
                  style={{ flex: 1, border: 'none', background: 'transparent', padding: '8px', outline: 'none', fontSize: '14px' }} 
                  placeholder={isListening ? "Listening..." : "Ask me anything..."} 
                  value={message} onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" style={{ ...commonStyles.iconBtn, color: COLORS.primary }}><Send size={18} /></button>
                
              </form>
              
            </div>
            <div style={{ padding: "10px 24px", backgroundColor: "#F9FAFB", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748B" }}>
                        <span>Voice: {selectedVoice}</span>
                        <Volume2 size={14} />
                      </div>
          </div>
        </div>
      )}
      <button 
        style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: COLORS.primary, color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(92,201,163,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
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
  const [chatHistory, setChatHistory] = useState([{ role: "ai", text: "Hello! Tulizo Here! How can I help you today?" }]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => { fetchTasks(); }, [userId]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/tasks`, { params: { user_id: userId } });
      setTasks(res.data.tasks || []);
    } catch (e) { console.error("Fetch tasks error:", e); }
  };

  const handleAddTask = async (predefinedText) => {
    const text = predefinedText || newTask;
    if (!text.trim()) return;
    try {
      await axios.post(`${BACKEND_URL}/tasks`, { user_id: userId, task_text: text, status: 'pending' });
      setNewTask("");
      fetchTasks();
    } catch (e) { console.error("Add task error:", e); }
  };

  const toggleTask = async (task) => {
    try {
      await axios.post(`${BACKEND_URL}/tasks/update`, {
        user_id: userId, task_id: task.id,
        status: task.status === "pending" ? "completed" : "pending"
      });
      fetchTasks();
    } catch (e) { console.error("Update task error:", e); }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${BACKEND_URL}/tasks/${taskId}`, { data: { user_id: userId } });
      fetchTasks();
    } catch (e) { console.error("Delete task error:", e); }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSendChat(transcript);
    };
    recognition.start();
  };

  const handleSendChat = async (voiceText) => {
    const text = voiceText || chatMsg;
    if (!text.trim()) return;

    setChatHistory(prev => [...prev, { role: "user", text }]);
    setChatMsg("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/chat`, { user_id: userId, message: text });
      const aiResponse = res.data.text || "I'm here for you.";
      setChatHistory(prev => [...prev, { role: "ai", text: aiResponse }]);

      const lowerText = text.toLowerCase();
    console.log(lowerText)
    // 1. Logic for "Add Task" (e.g., "Remind me to drink water" or "Add task: Go for a run")
    if (lowerText.includes("add task") || lowerText.includes("remind me to")) {
      // Extract the task name from the prompt
      const taskContent = text.replace(/add task|remind me to/gi, "").trim();
      if (taskContent) {
        handleAddTask(taskContent);
      }
    }

    // 2. Logic for "Complete Task" (e.g., "Complete task: Drink water" or "Close task run")
    if (lowerText.includes("complete task") || lowerText.includes("close task") || lowerText.includes("finish task")) {
      const taskSearch = lowerText.replace(/complete task|close task|finish task|task/gi, "").trim();
      
      // Find the task in the current list that matches the name
      const targetTask = tasks.find(t => 
        t.task_text.toLowerCase().includes(taskSearch) && t.status === 'pending'
      );
      
      if (targetTask) {
        toggleTask(targetTask);
      }
    }
      if (res.data.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${res.data.audio}`);
        audio.play();
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { role: "ai", text: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (taskTab === "Active") return t.status === "pending";
    if (taskTab === "Completed") return t.status === "completed";
    return true; 
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.bgLight, fontFamily: "'Inter', sans-serif" }}>
      <Sidebar currentView={view} setView={setView} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '70px', backgroundColor: COLORS.white, display: 'flex', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid #E5E7EB' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.dark }}>{view.toUpperCase()}</h1>
        </header>

       <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
  {view === "analytics" && (
    <>
      <div style={commonStyles.card}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Mood Trends</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={[{d: 'M', m: 4}, {d: 'T', m: 7}, {d: 'W', m: 5}, {d: 'T', m: 8}, {d: 'F', m: 6}]}>
            <XAxis dataKey="d" axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="m" stroke={COLORS.primary} strokeWidth={4} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={commonStyles.card}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Task Efficiency</h2>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '64px', color: COLORS.primary, margin: 0 }}>
            {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
          </h1>
          <p style={{ color: '#64748B' }}>Completion Rate</p>
        </div>
      </div>
    </>
  )}

  {view === "tasks" && (
    <>
      <div style={commonStyles.card}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Quick Add Task</h2>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: '15px', padding: '12px 15px', marginBottom: '25px' }}>
          <input 
            style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', fontSize: '15px' }} 
            placeholder="Add a new task..." value={newTask} onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={() => handleAddTask()} style={{ backgroundColor: COLORS.secondary, border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: 'white', cursor: 'pointer' }}><Plus size={18} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {["High Priority", "Daily Routine", "Work", "Personal"].map((tag, idx) => (
            <div key={tag} onClick={() => handleAddTask(tag)} style={{ ...commonStyles.tag, backgroundColor: idx % 2 === 0 ? '#FDA4AF' : COLORS.primary }}>{tag}</div>
          ))}
        </div>
      </div>

      <div style={commonStyles.card}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #F3F4F6' }}>
          {["Active", "Completed"].map(tab => (
            <div key={tab} onClick={() => setTaskTab(tab)} style={{ padding: '8px 16px', cursor: 'pointer', color: taskTab === tab ? COLORS.dark : COLORS.textMuted, borderBottom: taskTab === tab ? `2px solid ${COLORS.dark}` : 'none', fontWeight: 500 }}>{tab}</div>
          ))}
        </div>
        <div>
          {filteredTasks.map(task => (
            <div key={task.id} style={{ backgroundColor: COLORS.white, borderRadius: '18px', padding: '16px', marginBottom: '12px', border: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div onClick={() => toggleTask(task)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color={task.status === 'completed' ? COLORS.primary : '#CBD5E1'} />
                <span style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? COLORS.textMuted : COLORS.dark }}>{task.task_text}</span>
              </div>
              <Trash2 size={18} color="#CBD5E1" cursor="pointer" onClick={() => deleteTask(task.id)} />
            </div>
          ))}
        </div>
      </div>
    </>
  )}

  {view === "settings" && (
    <div style={{ gridColumn: 'span 2' }}>
      <VoiceSettings userId={userId} />
    </div>
  )}
</div>

        <ChatWidget 
          isOpen={isChatOpen} setIsOpen={setIsChatOpen} 
          history={chatHistory} message={chatMsg} 
          setMessage={setChatMsg} onSend={handleSendChat}
          isListening={isListening} startListening={startListening}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default Dashboard;