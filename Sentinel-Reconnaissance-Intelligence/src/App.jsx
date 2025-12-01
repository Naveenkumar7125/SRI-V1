// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/dashboard";
import Teams from "./components/pages/teams/Teams";
import Sidebar from "./components/sidebars/sidebar";
import UploadSummarize from "./components/pages/upload and summarize/uploadSummarize";
import CaseManagement from "./components/pages/cases/CaseManagement";
import Evidences from "./components/pages/Evidences/Evidences";
import Settings from "./components/pages/settings/Settings";
import "./App.css";

// Wrapper layout
function Layout() {
  return (
    <div className="app">
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Main content only */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadSummarize />} />
          {/* Case management page with Register New Case modal inside */}
          <Route path="/cases" element={<CaseManagement />} />
          <Route path="/live" element={<Evidences />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;



// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// export default function App() {
//   const [videoData, setVideoData] = useState(null);

//   useEffect(() => {
//     socket.on("videoAnalysisComplete", (data) => {
//       console.log("🔥 Received Final Data:", data);
//       setVideoData(data);
//     });
//   }, []);

//   if (!videoData) {
//     return (
//       <div style={{ padding: 20 }}>
//         <h2>Waiting for video analysis...</h2>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>📹 Video Analysis Result</h1>

//       <h2>Video Name: {videoData.videoName}</h2>
//       <h3>Total Duration: {videoData.totalDuration}</h3>

//       <h3>📝 Final Summary</h3>
//       <p style={{ background: "#eee", padding: 10, borderRadius: 5 }}>
//         {videoData.finalSummary}
//       </p>

//       <h3>🖼 Extracted Frames</h3>

//       {videoData.frames.length === 0 ? (
//         <p>No frames received.</p>
//       ) : (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
//           {videoData.frames.map((frame, index) => (
//             <div
//               key={index}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: 8,
//                 padding: 10,
//                 width: 250,
//               }}
//             >
//               <img
//                 src={frame.imageUrl}
//                 alt="frame"
//                 style={{
//                   width: "100%",
//                   borderRadius: 5,
//                   marginBottom: 10,
//                 }}
//               />
//               <p><strong>Timestamp:</strong> {frame.timestamp}</p>
//               <p><strong>Duration:</strong> {frame.duration}</p>
//               <p><strong>Summary:</strong> {frame.shortSummary}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
