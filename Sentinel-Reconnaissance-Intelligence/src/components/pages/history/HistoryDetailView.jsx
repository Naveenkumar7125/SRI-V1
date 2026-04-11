import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowLeft } from "lucide-react";
import axios from "axios";
import "../upload and summarize/UploadSummarize.css"; // inherit layout grid

export default function HistoryDetailView() {
  const { folderId } = useParams();
  const navigate = useNavigate();

  const [folderData, setFolderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chat states
  const [chatMessages, setChatMessages] = useState([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Archived Analysis found. You can ask me questions about events, people, objects, or patterns detected in this historical video.",
      timestamp: new Date(),
    },
  ]);
  const [query, setQuery] = useState("");
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/history/${folderId}`);
        setFolderData(res.data.folder);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch folder history:", err);
        setLoading(false);
      }
    };
    fetchRecord();
  }, [folderId]);

  // -----------------------------
  // Chat Query Handler
  // -----------------------------
  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsProcessingQuery(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage.content, folderId }),
      });

      const data = await res.json();

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.answer,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
    }
    setIsProcessingQuery(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  if (loading) return <div style={{ padding: 40, color: '#1e293b' }}>Loading Archive Data...</div>;
  if (!folderData) return <div style={{ padding: 40, color: '#1e293b' }}>Record not found.</div>;

  const video = folderData.videos?.[0];
  const frames = video?.detectedFrames || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
      {/* Top Header */}
      <div style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate('/history')} style={{ marginRight: 20, background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={18} style={{ marginRight: 5 }}/> Back to Archive
        </button>
        <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.4rem' }}>{folderData.name}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
        
        {/* LEFT SIDE — AI CHAT */}
        <div style={{ flex: '0 0 400px', height: '100%', display: 'flex', flexDirection: 'column', background: 'white', borderRight: '1px solid #e2e8f0' }}>
          <div className="chat-header" style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 className="dashboard-title"><Sparkles className="icon-sm tactical-colour" /> Archive Assistant</h3>
          </div>

            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto' }}>
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.type === "user" ? "user" : "assistant"}`}
                >
                  <div className="msg-avatar">
                    {message.type === "user" ? "U" : <Sparkles size={16} />}
                  </div>
                  <div className="msg-text">
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}

              {isProcessingQuery && (
                <div className="chat-message assistant">
                  <div className="msg-avatar"><Sparkles size={16} /></div>
                  <div className="msg-text">
                    <div className="loading-spinner" style={{borderColor: "rgba(0,0,0,0.1)", borderTopColor: "#3b82f6"}}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input" style={{display: 'flex', gap: '10px'}}>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about events, suspicious segments, or time ranges..."
                disabled={isProcessingQuery}
                style={{flex: 1}}
              />
              <Button
                onClick={handleSendQuery}
                disabled={!query.trim() || isProcessingQuery}
                className="btn primary"
              >
                <Sparkles className="icon-sm" /> Send
              </Button>
            </div>
        </div>
        {/* RIGHT SIDE — HISTORICAL FRAMES */}
        <div style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '30px 40px' }}>
          
          <div className="live-frames-container" style={{ marginTop: 0 }}>
            <h3 style={{marginTop: 0, marginBottom: '24px', color: '#1e293b', fontSize: '1.5rem'}}>
              Historical Detected Frames ({frames.length})
            </h3>
            
            {frames.length > 0 ? (
              <div className="live-frame-grid" style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '16px'
              }}>
                {frames.map((frame, i) => (
                  <div className="live-frame-card" key={i} style={{
                    background: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}>
                    <img src={frame.imageUrl} className="live-frame-thumb" alt="live" style={{
                      width: '100%', 
                      height: '180px', 
                      objectFit: 'cover'
                    }}/>
                    <div style={{ padding: '12px' }}>
                      <p className="frame-summary" style={{
                        color: '#475569', 
                        fontSize: '0.9rem', 
                        marginBottom: '8px', 
                        lineHeight: 1.4
                      }}>
                        {frame.shortSummary}
                      </p>
                      <p style={{
                        color: '#3b82f6', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold', 
                        margin: 0
                      }}>
                        {frame.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{color: '#64748b'}}>No frames found in this historical record.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
