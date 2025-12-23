/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


function Dashboard({ userId }) {
  const [conversations, setConversations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [voice, setVoice] = useState("");
  const [moodData, setMoodData] = useState([]);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Fetch initial data
 useEffect(() => { fetchConversations(); fetchTasks(); fetchVoice(); }, [userId, BACKEND_URL]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/history`, { params: { user_id: userId } });
      setConversations(res.data.conversations || []);
    } catch (e) {
      console.error("Failed to fetch conversations:", e);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/tasks`, { params: { user_id: userId } });
      setTasks(res.data.tasks || []);
    } catch (e) {
      console.error("Failed to fetch tasks:", e);
    }
  };

  const fetchVoice = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/voice`, { params: { user_id: userId } });
      setVoice(res.data.voice || "default");
    } catch (e) {
      console.error("Failed to fetch voice:", e);
    }
  };

  const fetchMoodData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/mood`, { params: { user_id: userId } });
      // Expecting [{timestamp: "...", mood_score: number}]
      const formatted = res.data.moods.map((item) => ({
        date: new Date(item.timestamp).toLocaleDateString(),
        mood: item.mood_score,
      }));
      setMoodData(formatted);
    } catch (e) {
      console.error("Failed to fetch mood data:", e);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(`${BACKEND_URL}/tasks`, { user_id: userId, task_text: newTask });
      setNewTask("");
      fetchTasks();
    } catch (e) {
      console.error("Failed to add task:", e);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      await axios.post(`${BACKEND_URL}/tasks/update`, {
        user_id: userId,
        task_id: task.id,
        status: task.status === "pending" ? "completed" : "pending",
      });
      fetchTasks();
    } catch (e) {
      console.error("Failed to update task:", e);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
      <h1>📊 Tulizo Dashboard</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>🗣️ Voice Preference</h2>
        <p>Selected Voice: <strong>{voice}</strong></p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>✅ Tasks</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <button
            onClick={handleAddTask}
            style={{ padding: "8px 16px", backgroundColor: "#5CC9A3", color: "white", border: "none", borderRadius: "6px" }}
          >
            Add
          </button>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: "6px" }}>
              <input
                type="checkbox"
                checked={task.status === "completed"}
                onChange={() => toggleTaskStatus(task)}
                style={{ marginRight: "8px" }}
              />
              {task.task_text} ({task.status})
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>💬 Recent Conversations</h2>
        {conversations.length === 0 && <p>No conversations yet.</p>}
        {conversations.map((conv, index) => (
          <div
            key={index}
            style={{
              background: "#f8f8f8",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          >
            <p><strong>You:</strong> {conv.user_message}</p>
            <p><strong>Tulizo:</strong> {conv.ai_response}</p>
            {conv.mood && <p><em>Mood:</em> {conv.mood}</p>}
            <p style={{ fontSize: "0.8rem", color: "#666" }}>{new Date(conv.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>📈 Mood / Productivity Trends</h2>
        {moodData.length === 0 ? (
          <p>No mood data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mood" stroke="#5CC9A3" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
