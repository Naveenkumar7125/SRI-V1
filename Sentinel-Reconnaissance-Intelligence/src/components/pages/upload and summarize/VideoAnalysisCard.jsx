import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileVideo, Clock, Download } from "lucide-react";
import useLiveAnalysis from "./useLiveAnalysis";
import "./videoAnalysisCard.css";

export default function VideoAnalysisCard({ result, detectedFrames }) {
  // 🔥 LIVE DATA FROM SOCKET
  const { liveVideoInfo, liveFrames } = useLiveAnalysis();

  // Filter frames for this specific video
  const framesForVideo = (detectedFrames || []).filter(
    (frame) => frame.videoName === result.fileName
  );

  // PDF Download
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

  const threatScore =
    result.threatLevel === "high"
      ? 90
      : result.threatLevel === "medium"
      ? 65
      : 22;

  const validFrames =
    result.keyFrames && Array.isArray(result.keyFrames)
      ? result.keyFrames
      : [];

  return (
    <Card className="analysis-result-card">

      {/* ----------------------------------------------------- */}
      {/* 🔵 LIVE ANALYSIS BANNER */}
      {/* ----------------------------------------------------- */}
      {liveVideoInfo && (
        <div className="live-banner">
          <h3>🔵 Live Analysis Running...</h3>
          <p><b>Video:</b>Video Name</p>
          <p><b>Duration:</b> 20:09</p>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* 🔵 REAL-TIME FRAME GRID */}
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
      {/* HEADER */}
      {/* ----------------------------------------------------- */}
      <div className="analysis-result-header">
        <div className="analysis-result-left">
          <FileVideo className="icon-sm tactical-colour" />
          <div>
            <h3 className="analysis-result-title">{result.fileName}</h3>
            <p className="analysis-result-subtitle">Automated Tactical Intelligence Summary</p>
          </div>
        </div>

        <div className="analysis-result-meta">
          <div
            className={
              result.threatLevel === "high"
                ? "pill pill-danger"
                : result.threatLevel === "medium"
                ? "pill pill-warning"
                : "pill pill-success"
            }
          >
            {result.threatLevel.toUpperCase()} THREAT
          </div>

          <span className="analysis-confidence">Confidence: {result.confidence}%</span>

          <Button size="sm" className="primary-btn report-btn" onClick={handleDownloadPDF}>
            <Download className="icon-sm icon-left" />
            Download PDF
          </Button>
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
            <h4 className="section-title">Event Timeline</h4>
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
            <h4 className="section-title">Video Duration</h4>
            <div className="duration-row">
              <Clock className="icon-xs tactical-colour" />
              <span className="duration-text">{result.duration}</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN — IMAGES GRID ================= */}
        <div className="analysis-column">
          {/* SNAPSHOTS GRID */}
          <div className="snapshot-card">
            <div className="snapshot-card-header">
              <h4 className="section-title">Key Moment Snapshots</h4>
              <span className="snapshot-count">{validFrames.length} frames</span>
            </div>

            <div className="snapshot-frames-container">
              {validFrames.length ? (
                validFrames.map((frame, i) => {
                  const frameSrc = typeof frame === "string" ? frame : (frame.src || frame.url || frame.image);
                  const frameTime = typeof frame === "object" ? (frame.time || frame.timestamp || result.duration) : result.duration;
                  
                  return (
                    <div className="snapshot-frame" key={i}>
                      <div className="snapshot-frame-image-wrapper">
                        {frameSrc ? (
                          <img
                            src={frameSrc}
                            className="snapshot-frame-image"
                            alt={`Key frame ${i + 1}`}
                          />
                        ) : (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: '100%',
                            color: '#6b7280',
                            fontSize: '0.8rem'
                          }}>
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="snapshot-frame-meta">
                        <span className="snapshot-frame-label">Frame {i + 1}</span>
                        <span className="snapshot-frame-time">{frameTime}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="snapshot-empty">
                  No snapshots available for this video.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* SUMMARY PANEL */}
      {/* ----------------------------------------------------- */}
      <div className="summary-panel">
        <h4 className="section-title">Summary Report</h4>

        <div className="summary-section">
          <h5 className="summary-subtitle">Detailed Narrative</h5>
          <p className="summary-text">{result.summary}</p>
        </div>

        <div className="summary-section summary-conclusion">
          <h5 className="summary-subtitle">Conclusion</h5>
          <p className="summary-text">{getConclusionText(result)}</p>
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