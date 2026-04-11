// // AnalysisView.jsx
// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Sparkles } from "lucide-react";
// import VideoAnalysisCard from "./VideoAnalysisCard";

// export default function AnalysisView({
//   uploadedFiles,
//   analysisResults,
//   detectedFrames,
// }) {
//   const [chatMessages, setChatMessages] = useState([
//     {
//       id: "welcome",
//       type: "assistant",
//       content:
//         "Analysis complete. You can ask about events, time ranges, individuals, or threat regions detected in the videos.",
//       timestamp: new Date(),
//     },
//   ]);
//   const [query, setQuery] = useState("");
//   const [isProcessingQuery, setIsProcessingQuery] = useState(false);

//   const handleSendQuery = async () => {
//     if (!query.trim()) return;

//     const userMessage = {
//       id: Date.now().toString(),
//       type: "user",
//       content: query,
//       timestamp: new Date(),
//     };

//     setChatMessages((prev) => [...prev, userMessage]);
//     setQuery("");
//     setIsProcessingQuery(true);

//     await new Promise((resolve) => setTimeout(resolve, 1200));

//     const aiResponse = {
//       id: (Date.now() + 1).toString(),
//       type: "assistant",
//       content:
//         "Based on the processed footage, I can highlight key intervals, suspicious behavior clusters, or specific threat levels you ask about.",
//       timestamp: new Date(),
//     };

//     setChatMessages((prev) => [...prev, aiResponse]);
//     setIsProcessingQuery(false);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendQuery();
//     }
//   };

//   return (
//     <div className="analysis-layout">
//       {/* Left: Chat */}
//       <div className="analysis-left">
//         <Card className="analysis-chat-card">
//           <div className="analysis-chat-header">
//             <Sparkles className="icon-sm tactical-colour" />
//             <h3 className="analysis-chat-title">Analysis Assistant</h3>
//           </div>

//           <div className="analysis-chat-body">
//             {chatMessages.map((message) => (
//               <div
//                 key={message.id}
//                 className={
//                   message.type === "user"
//                     ? "chat-row chat-row-right"
//                     : "chat-row chat-row-left"
//                 }
//               >
//                 <div
//                   className={
//                     message.type === "user"
//                       ? "chat-bubble chat-bubble-user"
//                       : "chat-bubble chat-bubble-assistant"
//                   }
//                 >
//                   <p className="chat-text">{message.content}</p>
//                   <p className="chat-time">
//                     {message.timestamp.toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {isProcessingQuery && (
//               <div className="chat-row chat-row-left">
//                 <div className="chat-bubble chat-bubble-assistant">
//                   <div className="typing-dots">
//                     <div className="dot" />
//                     <div className="dot" />
//                     <div className="dot" />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="analysis-chat-footer">
//             <Input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask about events, suspicious segments, or time ranges..."
//               className="analysis-input"
//               disabled={isProcessingQuery}
//             />
//             <Button
//               onClick={handleSendQuery}
//               disabled={!query.trim() || isProcessingQuery}
//               className="primary-btn-icon"
//             >
//               <Sparkles className="icon-sm" />
//             </Button>
//           </div>
//         </Card>
//       </div>

//       {/* Right: Per-video analysis cards */}
//       <div className="analysis-right">
//         {analysisResults.map((result, index) => (
//           <VideoAnalysisCard
//             key={index}
//             result={result}
//             detectedFrames={detectedFrames}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }





// AnalysisView.jsx
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

import VideoAnalysisCard from "./VideoAnalysisCard";
import useLiveAnalysis from "./useLiveAnalysis";   // ⭐ LIVE SOCKET HOOK

export default function AnalysisView({
  uploadedFiles,
  analysisResults,
  detectedFrames,
}) {
  // ⭐ REAL-TIME SOCKET DATA (always mounted)
  const { liveVideoInfo, liveFrames } = useLiveAnalysis();

  // Chat states
  const [chatMessages, setChatMessages] = useState([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Analysis complete. You can ask about events, time ranges, individuals, or threat regions detected in the videos.",
      timestamp: new Date(),
    },
  ]);
  const [query, setQuery] = useState("");
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);

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
    const activeFolderId = liveVideoInfo?.folderId || (analysisResults?.length > 0 ? analysisResults[0].folderId : null);

    const res = await fetch("http://localhost:5000/api/chat/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, folderId: activeFolderId }),
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
    console.log(err);
  }

  setIsProcessingQuery(false);
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  // ----------------------------------
  // MAIN UI
  // ----------------------------------
  return (
    <div className="analysis-layout">

      {/* LEFT SIDE — AI CHAT */}
      <div className="analysis-left">
        <div className="chat-panel">
          <div className="chat-header">
            <h3 className="dashboard-title"><Sparkles className="icon-sm tactical-colour" /> Analysis Assistant</h3>
          </div>

          <div className="chat-messages">
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
      </div>

      {/* RIGHT SIDE — LIVE + FINAL ANALYSIS */}
      <div className="analysis-right">

        {/* REAL-TIME LIVE STREAM SECTION */}
        {liveVideoInfo && (
          <Card className="live-stream-box">
            <h3>🔵 Live Analysis Running...</h3>
            <p><b>Video:</b> {liveVideoInfo.videoName}</p>
            <p><b>Duration:</b> {liveVideoInfo.videoDuration}</p>
          </Card>
        )}

        {liveFrames.length > 0 && (
          <div className="live-stream-frames">
            <h4>Real-Time Frames ({liveFrames.length})</h4>

            <div className="live-frame-grid">
              {liveFrames.map((frame, i) => (
                <div className="live-frame-card" key={i}>
                  <img src={frame.imageUrl} className="live-frame-thumb" alt="live" />
                  <p className="live-frame-meta">
                    <b>{frame.timestamp}</b> – {frame.shortSummary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINAL ANALYSIS CARDS */}
        {analysisResults.map((result, index) => (
          <VideoAnalysisCard
            key={index}
            result={result}
            detectedFrames={detectedFrames}
          />
        ))}
      </div>
    </div>
  );
}
