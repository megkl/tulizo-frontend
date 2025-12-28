import React, { useState, useEffect } from "react";
import axios from "axios";
import { Volume2, Check, Play, Save } from 'lucide-react';

const VoiceSettings = ({ userId }) => {
  const [voices, setVoices] = useState([]);
  const [currentVoiceId, setCurrentVoiceId] = useState("");
  const [playingId, setPlayingId] = useState(null);
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

  useEffect(() => {
    // Fetch available voices
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/settings/voices`).then(res => setVoices(res.data.voices));
    // Fetch current preference
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/settings/preference/${userId}`).then(res => {
      if (res.data.preference) setCurrentVoiceId(res.data.preference.voice_id);
    });
  }, [userId]);

  const handleSelect = async (voice) => {
    // If clicking the same voice, we "unselect" by reverting to default
    const isUnselecting = currentVoiceId === voice.voice_id;
    const targetVoiceId = isUnselecting ? "DEFAULT_ENV_ID" : voice.voice_id; // Backend handles default mapping
    const targetName = isUnselecting ? "Default" : voice.name;

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/settings/save`, {
        user_id: userId,
        voice_id: targetVoiceId,
        voice_name: targetName
      });
      setCurrentVoiceId(targetVoiceId);
      alert(`Voice set to ${targetName}`);
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const playPreview = (url, id) => {
    if (!url) return;
    if (playingId) playingId.pause();
    const audio = new Audio(url);
    setPlayingId(audio);
    audio.play();
    audio.onended = () => setPlayingId(null);
  };

  return (
    <div style={commonStyles.card}>
      <h2 style={{ marginBottom: '20px' }}>Voice Persona</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {voices.map(v => (
          <div key={v.voice_id} style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '15px',
            borderRadius: '15px',
            background: currentVoiceId === v.voice_id ? '#F0FDF4' : '#F8FAFC',
            border: currentVoiceId === v.voice_id ? `2px solid ${COLORS.primary}` : '2px solid transparent'
          }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{v.name}</div>
              <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{v.category}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {v.preview_url && (
                <button onClick={() => playPreview(v.preview_url, v.voice_id)} style={smallBtnStyle}>
                  {playingId && playingId.src === v.preview_url ? "⏸" : "▶"}
                </button>
              )}
              <button 
                onClick={() => handleSelect(v)}
                style={{
                  ...smallBtnStyle,
                  backgroundColor: currentVoiceId === v.voice_id ? COLORS.primary : '#E2E8F0',
                  color: currentVoiceId === v.voice_id ? 'white' : 'black'
                }}
              >
                {currentVoiceId === v.voice_id ? "Selected" : "Select"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const smallBtnStyle = {
  border: 'none',
  padding: '8px 12px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600'
};

export default VoiceSettings;