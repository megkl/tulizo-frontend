import React, { useState } from "react";
import { CheckCircle, Clock, Trash2, Plus, MessageSquare, CheckSquare, BarChart2, Settings } from "lucide-react";

const taskStyles = {
  grid: { padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  inputContainer: { display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: '15px', padding: '8px 15px', marginBottom: '20px' },
  tag: { padding: '10px 15px', borderRadius: '10px', color: '#FFF', fontSize: '12px', fontWeight: '500' },
  taskItem: { backgroundColor: '#FFF', borderRadius: '18px', padding: '16px', marginBottom: '12px', border: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tab: { padding: '8px 16px', cursor: 'pointer', color: '#94A3B8', borderBottom: '2px solid transparent' },
  activeTab: { color: '#1E293B', borderBottom: '2px solid #1E293B' }
};

function Tasks() {
  const [activeTab, setActiveTab] = useState("Active");

  return (
    <div style={{ display: 'flex', backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
      {/* Reusable Sidebar */}
      <nav style={{ width: '80px', backgroundColor: '#334155', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '30px' }}>
        <MessageSquare color="#94A3B8" />
        <CheckSquare color="#FFF" style={{ backgroundColor: '#60A5FA', padding: '12px', borderRadius: '12px' }} />
        <BarChart2 color="#94A3B8" />
        <Settings color="#94A3B8" />
      </nav>

      <div style={{ flex: 1 }}>
        <header style={{ height: '60px', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', padding: '0 30px', borderBottom: '1px solid #E5E7EB' }}>
          <CheckCircle color="#5CC9A3" style={{ marginRight: '10px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Tasks</h2>
        </header>

        <div style={taskStyles.grid}>
          {/* Quick Add Section */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '24px', padding: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Quick Add Task</h3>
            <div style={taskStyles.inputContainer}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#CCC', marginRight: '10px' }}></div>
              <input placeholder="Add or search..." style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none' }} />
              <button style={{ backgroundColor: '#60A5FA', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: '#FFF' }}><Plus size={18} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ ...taskStyles.tag, backgroundColor: '#FDA4AF' }}>Finish report</div>
              <div style={{ ...taskStyles.tag, backgroundColor: '#5CC9A3' }}>Team meeting</div>
              <div style={{ ...taskStyles.tag, backgroundColor: '#5CC9A3' }}>Exercise</div>
              <div style={{ ...taskStyles.tag, backgroundColor: '#FDA4AF' }}>Buy groceries</div>
            </div>
          </div>

          {/* My Tasks Section */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '24px', padding: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>My Tasks</h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #F3F4F6' }}>
              {["Active", "Scheduled", "Completed"].map(tab => (
                <div key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? { ...taskStyles.tab, ...taskStyles.activeTab } : taskStyles.tab}>
                  {tab}
                </div>
              ))}
            </div>

            {[1, 2, 3].map((_, i) => (
              <div key={i} style={taskStyles.taskItem}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                    <CheckCircle size={16} color="#5CC9A3" /> Finish project proposal
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Today, 3 PM
                  </div>
                </div>
                <Trash2 size={16} color="#94A3B8" style={{ cursor: 'pointer' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;