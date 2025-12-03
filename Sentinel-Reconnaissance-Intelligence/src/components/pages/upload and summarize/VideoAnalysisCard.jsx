// import React from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { FileVideo, Clock, Download } from "lucide-react";
// import useLiveAnalysis from "./useLiveAnalysis";
// import "./videoAnalysisCard.css";

// export default function VideoAnalysisCard({ result, detectedFrames }) {
//   // 🔥 LIVE DATA FROM SOCKET
//   const { liveVideoInfo, liveFrames } = useLiveAnalysis();

//   // Filter frames for this specific video
//   const framesForVideo = (detectedFrames || []).filter(
//     (frame) => frame.videoName === result.fileName
//   );

//   // PDF Download
//   const handleDownloadPDF = () => {
//     const pdfContent = `
// NSG AI Video Analysis Report
// Generated: ${new Date().toLocaleString()}

// FILE: ${result.fileName}
// Duration: ${result.duration}
// Threat Level: ${result.threatLevel.toUpperCase()}
// Confidence: ${result.confidence}%

// TIMELINE:
// ${result.timeline.map((item) => `${item.time} - ${item.event}`).join("\n")}

// SUMMARY:
// ${result.summary}

// CONCLUSION:
// ${getConclusionText(result)}
// `;

//     const blob = new Blob([pdfContent], { type: "application/pdf" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `analysis-${result.fileName}-${Date.now()}.pdf`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const threatScore =
//     result.threatLevel === "high"
//       ? 90
//       : result.threatLevel === "medium"
//       ? 65
//       : 22;

//   const validFrames =
//     result.keyFrames && Array.isArray(result.keyFrames)
//       ? result.keyFrames
//       : [];

//   return (
//     <Card className="analysis-result-card">

//       {/* ----------------------------------------------------- */}
//       {/* 🔵 LIVE ANALYSIS BANNER */}
//       {/* ----------------------------------------------------- */}
//       {liveVideoInfo && (
//         <div className="live-banner">
//           <h3>🔵 Live Analysis Running...</h3>
//           <p><b>Video:</b>Video Name</p>
//           <p><b>Duration:</b> 20:09</p>
//         </div>
//       )}

//       {/* ----------------------------------------------------- */}
//       {/* 🔵 REAL-TIME FRAME GRID */}
//       {/* ----------------------------------------------------- */}
//       {liveFrames.length > 0 && (
//         <div className="live-frame-section">
//           <h4>Real-Time Detected Frames ({liveFrames.length})</h4>

//           <div className="live-frame-grid">
//             {liveFrames.map((frame, i) => (
//               <div className="live-frame-card" key={i}>
//                 <img src={frame.imageUrl} className="live-frame-thumb" alt="live" />
//                 <p className="live-frame-meta">
//                   <b>{frame.timestamp}</b> – {frame.shortSummary}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ----------------------------------------------------- */}
//       {/* HEADER */}
//       {/* ----------------------------------------------------- */}
//       <div className="analysis-result-header">
//         <div className="analysis-result-left">
//           <FileVideo className="icon-sm tactical-colour" />
//           <div>
//             <h3 className="analysis-result-title">{result.fileName}</h3>
//             <p className="analysis-result-subtitle">Automated Tactical Intelligence Summary</p>
//           </div>
//         </div>

//         <div className="analysis-result-meta">
//           <div
//             className={
//               result.threatLevel === "high"
//                 ? "pill pill-danger"
//                 : result.threatLevel === "medium"
//                 ? "pill pill-warning"
//                 : "pill pill-success"
//             }
//           >
//             {result.threatLevel.toUpperCase()} THREAT
//           </div>

//           <span className="analysis-confidence">Confidence: {result.confidence}%</span>

//           <Button size="sm" className="primary-btn report-btn" onClick={handleDownloadPDF}>
//             <Download className="icon-sm icon-left" />
//             Download PDF
//           </Button>
//         </div>
//       </div>

//       {/* ----------------------------------------------------- */}
//       {/* 2-COLUMN GRID LAYOUT */}
//       {/* ----------------------------------------------------- */}
//       <div className="analysis-result-body">

//         {/* ================= LEFT COLUMN — TIMELINE ================= */}
//         <div className="analysis-column">
//           {/* TIMELINE SECTION */}
//           <div className="analysis-section">
//             <h4 className="section-title">Event Timeline</h4>
//             <div className="timeline-list">
//               {result.timeline.map((event, i) => (
//                 <div key={i} className="timeline-row">
//                   <span className="timeline-time">{event.time}</span>
//                   <span className="timeline-event">{event.event}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* DURATION SECTION */}
//           <div className="analysis-section">
//             <h4 className="section-title">Video Duration</h4>
//             <div className="duration-row">
//               <Clock className="icon-xs tactical-colour" />
//               <span className="duration-text">{result.duration}</span>
//             </div>
//           </div>
//         </div>

//         {/* ================= RIGHT COLUMN — IMAGES GRID ================= */}
//         <div className="analysis-column">
//           {/* SNAPSHOTS GRID */}
//           <div className="snapshot-card">
//             <div className="snapshot-card-header">
//               <h4 className="section-title">Key Moment Snapshots</h4>
//               <span className="snapshot-count">{validFrames.length} frames</span>
//             </div>

//             <div className="snapshot-frames-container">
//               {validFrames.length ? (
//                 validFrames.map((frame, i) => {
//                   const frameSrc = typeof frame === "string" ? frame : (frame.src || frame.url || frame.image);
//                   const frameTime = typeof frame === "object" ? (frame.time || frame.timestamp || result.duration) : result.duration;
                  
//                   return (
//                     <div className="snapshot-frame" key={i}>
//                       <div className="snapshot-frame-image-wrapper">
//                         {frameSrc ? (
//                           <img
//                             src={frameSrc}
//                             className="snapshot-frame-image"
//                             alt={`Key frame ${i + 1}`}
//                           />
//                         ) : (
//                           <div style={{ 
//                             display: 'flex', 
//                             alignItems: 'center', 
//                             justifyContent: 'center',
//                             height: '100%',
//                             color: '#6b7280',
//                             fontSize: '0.8rem'
//                           }}>
//                             No Image
//                           </div>
//                         )}
//                       </div>
//                       <div className="snapshot-frame-meta">
//                         <span className="snapshot-frame-label">Frame {i + 1}</span>
//                         <span className="snapshot-frame-time">{frameTime}</span>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="snapshot-empty">
//                   No snapshots available for this video.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ----------------------------------------------------- */}
//       {/* SUMMARY PANEL */}
//       {/* ----------------------------------------------------- */}
//       <div className="summary-panel">
//         <h4 className="section-title">Summary Report</h4>

//         <div className="summary-section">
//           <h5 className="summary-subtitle">Detailed Narrative</h5>
//           <p className="summary-text">{result.summary}</p>
//         </div>

//         <div className="summary-section summary-conclusion">
//           <h5 className="summary-subtitle">Conclusion</h5>
//           <p className="summary-text">{getConclusionText(result)}</p>
//         </div>
//       </div>

//     </Card>
//   );
// }

// function getConclusionText(result) {
//   if (result.threatLevel === "high")
//     return "High-risk activity detected. Immediate review recommended.";
//   if (result.threatLevel === "medium")
//     return "Moderate risk indicators present. Requires secondary confirmation.";
//   return "No significant anomalies detected. Footage appears normal.";
// }



import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileVideo, Clock, Download, AlertTriangle, Shield, MapPin, User } from "lucide-react";
import useLiveAnalysis from "./useLiveAnalysis";
import "./videoAnalysisCard.css";

export default function VideoAnalysisCard({ result, detectedFrames }) {
  // 🔥 LIVE DATA FROM SOCKET - Keeping your exact code
  const { liveVideoInfo, liveFrames } = useLiveAnalysis();

  // Filter frames for this specific video - Keeping your exact code
  const framesForVideo = (detectedFrames || []).filter(
    (frame) => frame.videoName === result.fileName
  );

  // PDF Download - Keeping your exact code
  const handleDownloadPDF = () => {
    const pdfContent = `
NSG AI Video Analysis Report
Generated: ${new Date().toLocaleString()}

FILE: ${result.fileName}
Duration: ${result.duration}
Threat Level: ${result.threatLevel.toUpperCase()}
Confidence: ${result.confidence}%

TIMELINE:
${result.timeline.map((item) => `${item.time} - ${item.event}`).join("\n")}

SUMMARY:
${result.summary}

CONCLUSION:
${getConclusionText(result)}
`;

    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-${result.fileName}-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keeping your exact frame validation logic
  const validFrames =
    result.keyFrames && Array.isArray(result.keyFrames)
      ? result.keyFrames
      : [];

  return (
    <Card className="analysis-result-card">

      {/* ----------------------------------------------------- */}
      {/* 🔵 LIVE ANALYSIS BANNER - Keeping your exact code */}
      {/* ----------------------------------------------------- */}
      {liveVideoInfo && (
        <div className="live-banner">
          <h3>🔵 Live Analysis Running...</h3>
          <p><b>Video:</b> {liveVideoInfo.videoName}</p>
          <p><b>Duration:</b> {liveVideoInfo.videoDuration}</p>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* 🔵 REAL-TIME FRAME GRID - Keeping your exact code */}
      {/* ----------------------------------------------------- */}
      {liveFrames.length > 0 && (
        <div className="live-frame-section">
          <h4>Real-Time Detected Frames ({liveFrames.length})</h4>
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

      {/* ----------------------------------------------------- */}
      {/* VIDEO FILE NAME HEADER */}
      {/* ----------------------------------------------------- */}
      <div className="video-header-section">
        <div className="video-header-left">
          <FileVideo className="icon-lg tactical-colour" />
          <div>
            <h2 className="video-title">{result.fileName}</h2>
            <p className="video-subtitle">High-resolution aerial drone surveillance footage</p>
          </div>
        </div>
        <div className="video-header-badge">
          <div className={`threat-badge ${result.threatLevel}`}>
            {result.threatLevel.toUpperCase()} THREAT LEVEL
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* 2-COLUMN GRID LAYOUT */}
      {/* ----------------------------------------------------- */}
      <div className="analysis-result-body">

        {/* ================= LEFT COLUMN — TIMELINE ================= */}
        <div className="analysis-column">
          {/* TIMELINE SECTION */}
          <div className="analysis-section">
            <div className="section-header">
              <Clock className="section-icon" />
              <h4 className="section-title">Event Timeline</h4>
            </div>
            <div className="timeline-list">
              {result.timeline.map((event, i) => (
                <div key={i} className="timeline-row">
                  <span className="timeline-time">{event.time}</span>
                  <span className="timeline-event">{event.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DURATION SECTION */}
          <div className="analysis-section">
            <div className="section-header">
              <Clock className="section-icon" />
              <h4 className="section-title">Video Metadata</h4>
            </div>
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="metadata-label">Duration</span>
                <span className="metadata-value">{result.duration}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Resolution</span>
                <span className="metadata-value">4K UHD</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Frame Rate</span>
                <span className="metadata-value">30 FPS</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Source</span>
                <span className="metadata-value">DJI Mavic 3</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN — IMAGES GRID ================= */}
        <div className="analysis-column">
          {/* SNAPSHOTS GRID */}
          <div className="snapshot-card">
            <div className="snapshot-card-header">
              <div className="section-header">
                <AlertTriangle className="section-icon" />
                <h4 className="section-title">Key Moment Snapshots</h4>
              </div>
              <span className="snapshot-count">{validFrames.length} frames detected</span>
            </div>

            <div className="snapshot-frames-container">
              {validFrames.length ? (
                validFrames.map((frame, i) => (
                  <div className="snapshot-frame" key={i}>
                    <div className="snapshot-frame-image-wrapper">
                      <img
                        src={typeof frame === "string" ? frame : frame.src}
                        className="snapshot-frame-image"
                        alt={`Frame ${i + 1}`}
                      />
                      <div className="frame-number">#{i + 1}</div>
                    </div>
                    <div className="snapshot-frame-meta">
                      <span className="snapshot-frame-label">Critical Moment</span>
                      <span className="snapshot-frame-time">{result.duration}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="snapshot-empty">
                  <div className="empty-icon">📷</div>
                  <p>No snapshots available for this video.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* DUMMY VISUALIZATION SECTION AT BOTTOM */}
      {/* ----------------------------------------------------- */}
      <div className="visualization-section">
        <h4 className="section-title">Threat Analysis Dashboard</h4>
        
        <div className="visualization-grid">
          {/* Confidence Meter */}
          <div className="visual-card">
            <div className="visual-header">
              <Shield className="visual-icon" />
              <h5>AI Confidence</h5>
            </div>
            <div className="confidence-meter">
              <div className="meter-bar">
                <div 
                  className="meter-fill" 
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
              <div className="meter-label">{result.confidence}% Accuracy</div>
            </div>
          </div>

          {/* Threat Indicators */}
          <div className="visual-card">
            <div className="visual-header">
              <AlertTriangle className="visual-icon danger" />
              <h5>Threat Indicators</h5>
            </div>
            <div className="indicators-grid">
              <div className="indicator-item">
                <span className="indicator-label">Loitering</span>
                <span className="indicator-value high">Detected</span>
              </div>
              <div className="indicator-item">
                <span className="indicator-label">Restricted Zone</span>
                <span className="indicator-value high">Violated</span>
              </div>
              <div className="indicator-item">
                <span className="indicator-label">Object Handling</span>
                <span className="indicator-value medium">Suspicious</span>
              </div>
              <div className="indicator-item">
                <span className="indicator-label">Movement Pattern</span>
                <span className="indicator-value low">Normal</span>
              </div>
            </div>
          </div>

          {/* Location Data */}
          <div className="visual-card">
            <div className="visual-header">
              <MapPin className="visual-icon" />
              <h5>Location Data</h5>
            </div>
            <div className="location-info">
              <div className="location-item">
                <span className="location-label">Coordinates</span>
                <span className="location-value">40.7128° N, 74.0060° W</span>
              </div>
              <div className="location-item">
                <span className="location-label">Facility</span>
                <span className="location-value">Industrial Zone A</span>
              </div>
              <div className="location-item">
                <span className="location-label">Perimeter</span>
                <span className="location-value">Zone 3 Restricted</span>
              </div>
            </div>
          </div>

          {/* Subject Info */}
          <div className="visual-card">
            <div className="visual-header">
              <User className="visual-icon" />
              <h5>Subject Analysis</h5>
            </div>
            <div className="subject-info">
              <div className="subject-item">
                <span className="subject-label">Gender</span>
                <span className="subject-value">Male</span>
              </div>
              <div className="subject-item">
                <span className="subject-label">Height</span>
                <span className="subject-value">5'10" ± 2"</span>
              </div>
              <div className="subject-item">
                <span className="subject-label">Clothing</span>
                <span className="subject-value">Dark Uniform</span>
              </div>
              <div className="subject-item">
                <span className="subject-label">Behavior</span>
                <span className="subject-value danger">Suspicious</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* SUMMARY PANEL WITH DUMMY DATA */}
      {/* ----------------------------------------------------- */}
      <div className="summary-panel">
        <div className="section-header">
          <FileVideo className="section-icon" />
          <h4 className="section-title">Detailed Analysis Report</h4>
        </div>

        <div className="summary-section">
          <h5 className="summary-subtitle">Tactical Summary</h5>
          <p className="summary-text">
            Aerial surveillance drone detected unauthorized individual within restricted industrial perimeter. 
            Subject exhibited suspicious loitering behavior near critical infrastructure for approximately 
            1 minute 45 seconds before approaching restricted zone. Video analysis indicates potential 
            reconnaissance activity with unusual object handling observed at 00:02:45 mark. Thermal imaging 
            confirms single subject, no visible weapons detected.
          </p>
        </div>

        <div className="summary-section">
          <h5 className="summary-subtitle">AI Detection Highlights</h5>
          <p className="summary-text">
            • Motion detection algorithms identified abnormal movement pattern at 00:01:34<br/>
            • Facial recognition unable to match subject with authorized personnel database<br/>
            • Geofencing alerts triggered when subject crossed virtual perimeter boundary<br/>
            • Behavioral analysis indicates 87% probability of pre-operational surveillance<br/>
            • Object classification: Unknown handheld device detected
          </p>
        </div>

        <div className="summary-section summary-conclusion">
          <h5 className="summary-subtitle">Security Recommendation</h5>
          <p className="summary-text">
            {getConclusionText(result)} Immediate dispatch of security personnel recommended 
            for visual confirmation. Recommend increasing patrol frequency in Sector 3A 
            and reviewing all access logs for past 24 hours. Consider elevating facility 
            threat level to yellow status pending further investigation.
          </p>
        </div>

        <div className="summary-actions">
          <Button size="sm" className="primary-btn report-btn" onClick={handleDownloadPDF}>
            <Download className="icon-sm icon-left" />
            Download Full Report (PDF)
          </Button>
          <Button size="sm" className="secondary-btn">
            <AlertTriangle className="icon-sm icon-left" />
            Escalate to Security
          </Button>
        </div>
      </div>

    </Card>
  );
}

function getConclusionText(result) {
  if (result.threatLevel === "high")
    return "High-risk activity detected. Immediate review recommended.";
  if (result.threatLevel === "medium")
    return "Moderate risk indicators present. Requires secondary confirmation.";
  return "No significant anomalies detected. Footage appears normal.";
}