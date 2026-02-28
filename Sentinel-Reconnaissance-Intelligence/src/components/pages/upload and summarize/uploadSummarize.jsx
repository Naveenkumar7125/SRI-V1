// // UploadSummarize.jsx
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import UploadArea from "./UploadArea";
// import AnalysisView from "./AnalysisView";
// import "./uploadSummarize.css";

// export default function UploadSummarize() {
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [analysisResults, setAnalysisResults] = useState([]);
//   const [detectedFrames, setDetectedFrames] = useState([]);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [showAnalysis, setShowAnalysis] = useState(false);

//   return (
//     <div className="upload-page">
//       {/* Header */}
//       <header className="upload-header">
//         <div className="upload-header-left">
//           <h1 className="upload-title">NSG Video Intelligence</h1>
//           <p className="upload-subtitle">
//             Upload surveillance footage for AI-powered detection, threat
//             assessment, and tactical summarization.
//           </p>
//         </div>

//         {showAnalysis && (
//           <Button
//             variant="outline"
//             className="back-button"
//             onClick={() => setShowAnalysis(false)}
//           >
//             <ArrowLeft className="icon-sm" />
//             <span>Back to Upload</span>
//           </Button>
//         )}
//       </header>

//       {/* Body */}
//       <div className="upload-body">
//         {!showAnalysis ? (
//           <UploadArea
//             uploadedFiles={uploadedFiles}
//             setUploadedFiles={setUploadedFiles}
//             isAnalyzing={isAnalyzing}
//             setIsAnalyzing={setIsAnalyzing}
//             setAnalysisResults={setAnalysisResults}
//             setDetectedFrames={setDetectedFrames}
//             setShowAnalysis={setShowAnalysis}
//           />
//         ) : (
//           <AnalysisView
//             uploadedFiles={uploadedFiles}
//             analysisResults={analysisResults}
//             detectedFrames={detectedFrames}
//           />
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useRef, useState, useEffect, useCallback } from "react";
import "./UploadSummarize.css";
import io from 'socket.io-client';

// WebSocket connection
let socket = null;

const LiveFeedPanel = ({ liveFrames, analysisProgress }) => {
  return (
    <div className="live-feed-panel">
      <div className="live-feed-header">
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span>LIVE FEED</span>
        </div>
        <div className="progress-display">
          {analysisProgress && (
            <>
              <span className="progress-text">
                {analysisProgress.videoName} - {analysisProgress.progress}%
              </span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${analysisProgress.progress}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="live-frames-container">
        {liveFrames.length === 0 ? (
          <div className="no-frames">
            <div className="no-frames-icon">📹</div>
            <p>Waiting for live analysis...</p>
            <p className="video-subtitle">Frames will appear here in real-time</p>
          </div>
        ) : (
          liveFrames.map((frame, index) => (
            <div className="live-frame-card" key={index}>
              <div className="live-frame-image-container">
                <img 
                  src={frame.imageUrl} 
                  alt={frame.shortSummary}
                  className="live-frame-image"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/seed/${frame.timestamp}/300/200`;
                  }}
                />
                <div className="live-frame-overlay">
                  <span className="frame-timestamp">{frame.timestamp}</span>
                  {frame.detectedObjects && frame.detectedObjects.length > 0 && (
                    <span className="detected-badge">
                      {frame.detectedObjects.length} objects
                    </span>
                  )}
                </div>
              </div>
              <div className="live-frame-details">
                <div className="frame-summary">{frame.shortSummary}</div>
                <div className="frame-meta">
                  <span className="video-name">{frame.videoName}</span>
                  {frame.detectedObjects && (
                    <span className="objects-list">
                      {frame.detectedObjects.slice(0, 2).map(obj => obj.label || obj).join(', ')}
                      {frame.detectedObjects.length > 2 && '...'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const EventTimeline = ({ events }) => {
  return (
    <div className="event-timeline-panel">
      <div className="section-header">
        <div className="section-icon">🕒</div>
        <h4 className="section-title">Event Timeline</h4>
      </div>
      
      <div className="timeline-container">
        {events.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">📅</div>
            <p>No events detected yet</p>
          </div>
        ) : (
          <div className="timeline-list">
            {events.slice(-10).reverse().map((event, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-time">{event.timestamp}</div>
                <div className="timeline-content">
                  <div className="timeline-summary">{event.summary}</div>
                  {event.imageUrl && (
                    <img 
                      src={event.imageUrl} 
                      alt={event.summary}
                      className="timeline-thumbnail"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ChatPanel = ({ onQuery, isConnected }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "assistant",
      text: isConnected 
        ? "Analysis ready. Ask about detections, timelines or request highlights." 
        : "Connecting to analysis server...",
    },
  ]);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim() || !isConnected) return;
    
    const userMsg = { id: Date.now(), from: "user", text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setText("");

    // If custom query handler exists
    if (onQuery) {
      onQuery(text.trim());
    }

    // Simulate AI response
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "assistant",
          text: `Searching for "${userMsg.text}" across analyzed videos...`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="connection-status">
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <h4>Analysis Assistant</h4>
      </div>
      
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-message ${
              m.from === "assistant" ? "assistant" : "user"
            }`}
          >
            <div className="msg-avatar">
              {m.from === "assistant" ? "🤖" : "👤"}
            </div>
            <div className="msg-text">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isConnected ? "Ask about detections, timelines, or search..." : "Connecting to server..."}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isConnected) send();
          }}
          disabled={!isConnected}
        />
        <button 
          className="btn primary" 
          onClick={send}
          disabled={!isConnected || !text.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const AnalysisDashboard = ({ folderId, folderName, analysisData }) => {
  const [liveFrames, setLiveFrames] = useState([]);
  const [events, setEvents] = useState([]);
  const [analysisProgress, setAnalysisProgress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showLiveFeed, setShowLiveFeed] = useState(true);

  // Connect to WebSocket
  useEffect(() => {
    if (!folderId) return;

    // Connect to WebSocket server
    socket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      
      // Join the folder room
      socket.emit('join_folder', { folderId });
    });

    socket.on('connected', (data) => {
      console.log('Server connected:', data);
    });

    socket.on('joined_folder', (data) => {
      console.log('Joined folder:', data);
    });

    // Handle live frames
    socket.on('live_frame', (frameData) => {
      console.log('Received live frame:', frameData);
      setLiveFrames(prev => {
        const newFrames = [frameData, ...prev.slice(0, 9)]; // Keep last 10 frames
        return newFrames;
      });
      
      // Add to events timeline
      setEvents(prev => [...prev, {
        timestamp: frameData.timestamp,
        summary: frameData.shortSummary,
        imageUrl: frameData.imageUrl,
        type: 'frame'
      }]);
    });

    // Handle analysis progress
    socket.on('analysis_progress', (progressData) => {
      console.log('Analysis progress:', progressData);
      setAnalysisProgress(progressData);
    });

    socket.on('analysis_status', (statusData) => {
      console.log('Analysis status:', statusData);
    });

    socket.on('analysis_complete', (completeData) => {
      console.log('Analysis complete:', completeData);
      setAnalysisProgress({
        progress: 100,
        message: 'Analysis completed!',
        videoName: 'All videos'
      });
      
      // Show completion message
      alert(`Analysis completed! Found ${completeData.totalFrames} key frames.`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [folderId]);

  // Fetch existing frames when component mounts
  useEffect(() => {
    if (folderId) {
      fetch(`http://localhost:5000/api/get-events/${folderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.events) {
            setEvents(data.events.slice(-20)); // Last 20 events
          }
          if (data.keyFrames) {
            setLiveFrames(data.keyFrames.slice(-10).reverse()); // Last 10 frames
          }
        })
        .catch(err => console.error('Error fetching events:', err));
    }
  }, [folderId]);

  const handleQuery = (query) => {
    console.log('Processing query:', query);
    // Here you would typically send the query to your backend
    // and handle the response
  };

  return (
    <div className="analysis-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h2 className="dashboard-title">
            <span className="folder-icon">📁</span>
            {folderName || 'Analysis Dashboard'}
          </h2>
          <p className="dashboard-subtitle">
            {folderId ? `ID: ${folderId}` : 'No active analysis'}
            {analysisProgress && ` • Progress: ${analysisProgress.progress}%`}
          </p>
        </div>
        <div className="header-right">
          <div className="connection-badge" style={{
            backgroundColor: isConnected ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </div>
          <button 
            className="btn secondary"
            onClick={() => setShowLiveFeed(!showLiveFeed)}
          >
            {showLiveFeed ? 'Hide Live Feed' : 'Show Live Feed'}
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-left">
          {showLiveFeed && (
            <LiveFeedPanel 
              liveFrames={liveFrames}
              analysisProgress={analysisProgress}
            />
          )}
          
          <EventTimeline events={events} />
        </div>

        <div className="dashboard-right">
          <ChatPanel 
            onQuery={handleQuery}
            isConnected={isConnected}
          />
          
          <div className="stats-panel">
            <div className="section-header">
              <div className="section-icon">📊</div>
              <h4 className="section-title">Real-time Statistics</h4>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🖼️</div>
                <div className="stat-content">
                  <div className="stat-value">{liveFrames.length}</div>
                  <div className="stat-label">Live Frames</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <div className="stat-value">{events.length}</div>
                  <div className="stat-label">Total Events</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <div className="stat-value">
                    {analysisProgress ? `${analysisProgress.progress}%` : '0%'}
                  </div>
                  <div className="stat-label">Progress</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🔗</div>
                <div className="stat-content">
                  <div className="stat-value">{isConnected ? 'ON' : 'OFF'}</div>
                  <div className="stat-label">WebSocket</div>
                </div>
              </div>
            </div>
          </div>
          
          {analysisData && (
            <div className="upload-details-panel">
              <div className="section-header">
                <div className="section-icon">📋</div>
                <h4 className="section-title">Analysis Details</h4>
              </div>
              
              <div className="details-list">
                <div className="detail-item">
                  <span className="detail-label">Folder ID:</span>
                  <span className="detail-value">{analysisData.folderId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Videos:</span>
                  <span className="detail-value">{analysisData.videos?.length || 0}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value" style={{
                    color: analysisData.status === 'completed' ? '#10b981' : 
                           analysisData.status === 'analyzing' ? '#f59e0b' : '#6b7280'
                  }}>
                    {analysisData.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Started:</span>
                  <span className="detail-value">
                    {new Date(analysisData.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Upload Component
export default function UploadSummarize() {
  const [files, setFiles] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [requirements, setRequirements] = useState("");
  const [view, setView] = useState("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const onFileButton = () => fileInputRef.current?.click();
  const onFolderButton = () => folderInputRef.current?.click();

  const handleFilesSelected = (fileList) => {
    const arr = Array.from(fileList || []);
    if (!arr.length) return;

    let folderNameFromFiles = "";

    // When selecting a folder
    if (arr[0].webkitRelativePath) {
      folderNameFromFiles = arr[0].webkitRelativePath.split("/")[0];
      setFolderName(folderNameFromFiles);
    }

    const wrapped = arr
      .filter((f) => f.size > 0 && f.type.startsWith("video/"))
      .map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file: f,
        folderName: folderNameFromFiles,
      }));

    setFiles((prev) => [...prev, ...wrapped]);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadToBackend = async () => {
    if (!files.length) return;

    const form = new FormData();

    // Add all video files
    files.forEach((f) => {
      if (f.file instanceof File) {
        form.append("files", f.file);
      }
    });

    // Select folder name
    let finalFolderName = folderName.trim();

    // If user uploaded a single video (no folder)
    if (!finalFolderName) {
      const firstFileName = files[0].file.name.split(".")[0];
      const timestamp = Date.now();
      finalFolderName = `${firstFileName}_${timestamp}`;
    }

    form.append("folderName", finalFolderName);

    // Requirements field (optional)
    if (requirements.trim()) {
      form.append("requirements", requirements);
    }

    // Backend expects "createdBy"
    form.append("createdBy", "user");

    console.log("Uploading to /api/upload...");
    console.log("Folder:", finalFolderName);
    console.log("Files:", files.length);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("Upload successful:", data);

      if (!data.success) {
        throw new Error(data.error || "Upload failed without specific error");
      }

      return data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const onAnalyze = async () => {
    try {
      setIsUploading(true);
      
      // Upload files to /api/upload endpoint
      const uploadData = await uploadToBackend();
      
      console.log("Upload successful:", uploadData);
      
      if (uploadData.success) {
        setUploadResult(uploadData);
        
        // Fetch analysis data
        if (uploadData.folderId) {
          try {
            const statusRes = await fetch(`http://localhost:5000/api/analysis-status/${uploadData.folderId}`);
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              setAnalysisData(statusData);
            }
          } catch (err) {
            console.error('Error fetching analysis status:', err);
          }
        }
        
        setView("analyze");
      } else {
        throw new Error(uploadData.error || "Upload failed");
      }
      
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetToUpload = () => {
    setView("upload");
    setFiles([]);
    setFolderName("");
    setRequirements("");
    setUploadResult(null);
    setAnalysisData(null);
    
    // Disconnect WebSocket if connected
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 10) / 10 + " " + sizes[i];
  };

  return (
    <div className="uploadSummarize-root">
      {view === "upload" && (
        <div className="upload-area">
          <div className="upload-card large">
            <div className="upload-header">
              <h2 className="upload-title">Upload Video Files</h2>
              <p className="upload-sub">
                Upload video files for AI-powered analysis. Supports multiple formats.
              </p>
            </div>

            <div className="upload-actions-row">
              <button className="btn primary" onClick={onFileButton}>
                <span className="icon-left">📁</span>
                Upload Files
              </button>
              <button className="btn secondary" onClick={onFolderButton}>
                <span className="icon-left">📂</span>
                Upload Folder
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  handleFilesSelected(e.target.files);
                  e.target.value = null;
                }}
              />

              <input
                ref={folderInputRef}
                type="file"
                webkitdirectory="true"
                directory="true"
                style={{ display: "none" }}
                onChange={(e) => {
                  handleFilesSelected(e.target.files);
                  e.target.value = null;
                }}
              />
            </div>

            {/* Folder Name Input */}
            {files.length > 0 && (
              <div className="folder-name-block">
                <label className="req-label">
                  <span className="label-icon">🏷️</span>
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter a name for this analysis folder"
                  className="folder-name-input"
                />
                <small className="folder-name-hint">
                  Leave empty to auto-generate from file names
                </small>
              </div>
            )}

            <div className="file-list">
              <div className="file-list-header">
                <div className="header-left">
                  <strong>Uploaded Files</strong>
                  <span className="count">{files.length}</span>
                </div>
                {files.length > 0 && (
                  <button 
                    className="btn danger small"
                    onClick={() => setFiles([])}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {files.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📹</div>
                  <p>No files uploaded yet</p>
                  <p className="empty-sub">Upload video files to begin analysis</p>
                </div>
              ) : (
                <ul className="file-ul">
                  {files.map(({ id, file, folderName: fileFolder }) => (
                    <li key={id} className="file-row">
                      <div className="file-icon">🎬</div>
                      <div className="file-meta">
                        <div className="file-name">{file.name}</div>
                        <div className="file-sub">
                          {formatBytes(file.size)}
                          {fileFolder && <span> • From: {fileFolder}</span>}
                        </div>
                      </div>
                      <div className="file-actions">
                        <button
                          className="btn danger small"
                          onClick={() => removeFile(id)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {files.length > 0 && (
              <>
                <div className="requirements-block">
                  <label className="req-label">
                    <span className="label-icon">📝</span>
                    Analysis Requirements (Optional)
                  </label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Example: Focus on suspicious behavior, detect specific objects, highlight anomalies..."
                    rows={3}
                  />
                </div>

                <div className="upload-cta-row">
                  <button
                    className="btn primary large"
                    onClick={onAnalyze}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Uploading & Starting Analysis...
                      </>
                    ) : (
                      <>
                        <span className="icon-left">🚀</span>
                        Upload & Start Analysis
                      </>
                    )}
                  </button>
                  <button className="btn link" onClick={resetToUpload}>
                    Clear All
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {view === "analyze" && uploadResult && (
        <div className="analyze-area">
          <div className="analyze-header">
            <div className="header-left">
              <h2 className="analyze-title">
                <span className="title-icon">📊</span>
                Live Analysis Dashboard
              </h2>
              <p className="analyze-subtitle">
                Real-time video analysis in progress
              </p>
            </div>
            <div className="header-right">
              <button className="btn link back-btn" onClick={resetToUpload}>
                ← Back to upload
              </button>
              <button className="btn secondary">
                <span className="icon-left">📥</span>
                Export Results
              </button>
            </div>
          </div>

          <AnalysisDashboard 
            folderId={uploadResult.folderId}
            folderName={uploadResult.folderName}
            analysisData={analysisData}
          />

          <div className="upload-success-card">
            <div className="success-header">
              <div className="success-icon">✅</div>
              <h3>Upload Successful</h3>
            </div>
            
            <div className="success-details">
              <div className="details-grid">
                <div className="detail-card">
                  <div className="detail-icon">📁</div>
                  <div className="detail-content">
                    <div className="detail-label">Folder Name</div>
                    <div className="detail-value">{uploadResult.folderName}</div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">🎬</div>
                  <div className="detail-content">
                    <div className="detail-label">Videos Uploaded</div>
                    <div className="detail-value">{uploadResult.videos?.length || files.length}</div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">🆔</div>
                  <div className="detail-content">
                    <div className="detail-label">Folder ID</div>
                    <div className="detail-value code">{uploadResult.folderId}</div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">⏱️</div>
                  <div className="detail-content">
                    <div className="detail-label">Started At</div>
                    <div className="detail-value">
                      {new Date(uploadResult.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="instructions">
                <h4>What's happening:</h4>
                <ul>
                  <li>✅ Videos uploaded to server storage</li>
                  <li>✅ Python analysis script started</li>
                  <li>🔄 Processing frames with YOLO object detection</li>
                  <li>🔄 Uploading key frames to Cloudinary</li>
                  <li>🔄 Generating AI summaries with Gemini</li>
                  <li>🔄 Streaming results via WebSocket to this dashboard</li>
                  <li>⏳ Results will appear in the live feed above</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}