import React, { useState, useEffect } from "react";
import axios from "axios";
import { Volume2, Check, Play, Save } from 'lucide-react';

const VoiceSettings = ({ userId }) => {
  const [voices, setVoices] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch curated voices and current user preference
        const [listRes, prefRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/settings/voices`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/settings/preference/${userId}`)
        ]);
        setVoices(listRes.data.voices);
        setSelectedId(prefRes.data.preference?.voice_id);
      } catch (e) {
        console.error("Failed to load voice settings", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [userId]);

  const handleSave = async (voice) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/settings/save`, {
        user_id: userId,
        voice_id: voice.voice_id,
        voice_name: voice.name
      });
      setSelectedId(voice.voice_id);
      alert(`Tulizo will now speak with ${voice.name}'s voice!`);
    } catch (e) {
      alert("Failed to save preference.");
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading voices...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>Voice Persona</h2>
      <p style={{ color: '#64748B', marginBottom: '30px' }}>Choose a voice that helps you feel calm and focused.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {voices.map((v) => (
          <div key={v.voice_id} style={{
            padding: '20px',
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            border: selectedId === v.voice_id ? '2px solid #5CC9A3' : '1px solid #E2E8F0',
            position: 'relative'
          }}>
            <h3 style={{ fontWeight: '600', marginBottom: '5px' }}>{v.name}</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '15px' }}>{v.description}</p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => new Audio(v.preview_url).play()}
                style={{ ...btnStyle, backgroundColor: '#F1F5F9', color: '#1E293B' }}
              >
                <Play size={14} /> Preview
              </button>
              <button 
                onClick={() => handleSave(v)}
                style={{ ...btnStyle, backgroundColor: selectedId === v.voice_id ? '#5CC9A3' : '#1E293B', color: 'white' }}
              >
                {selectedId === v.voice_id ? <Check size={14} /> : <Save size={14} />} 
                {selectedId === v.voice_id ? " Selected" : " Use This"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const btnStyle = {
  border: 'none',
  padding: '8px 12px',
  borderRadius: '10px',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontWeight: '600'
};

export default VoiceSettings;