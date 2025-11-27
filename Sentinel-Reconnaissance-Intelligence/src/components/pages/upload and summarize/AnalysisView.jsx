// AnalysisView.jsx
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  FileVideo,
  Clock,
  Download,
  Play,
  Pause,
} from "lucide-react";

export default function AnalysisView({
  uploadedFiles,
  analysisResults,
  detectedFrames,
}) {
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
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);

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

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const aiResponse = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content:
        "Based on the processed footage, I can highlight key intervals, suspicious behavior clusters, or specific threat levels you ask about.",
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, aiResponse]);
    setIsProcessingQuery(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  const handleDownloadPDF = () => {
    const pdfContent = `
NSG AI Video Analysis Report
Generated: ${new Date().toLocaleString()}
Total Files Analyzed: ${uploadedFiles.length}

${analysisResults
  .map(
    (result) => `
FILE: ${result.fileName}
Duration: ${result.duration}
Threat Level: ${result.threatLevel.toUpperCase()}
Confidence: ${result.confidence}%

TIMELINE:
${result.timeline.map((item) => `  ${item.time} - ${item.event}`).join("\n")}

SUMMARY:
${result.summary}

${"=".repeat(50)}
`
  )
  .join("")}

DETECTED FRAMES:
${detectedFrames
  .map(
    (frame) => `
Video: ${frame.videoName}
Timestamp: ${frame.timestamp}
Duration: ${frame.duration}
Description: ${frame.description}
`
  )
  .join("")}
    `;

    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `video-analysis-report-${new Date().getTime()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analysis-layout">
      {/* Left: Chat */}
      <div className="analysis-left">
        <Card className="analysis-chat-card">
          <div className="analysis-chat-header">
            <Sparkles className="icon-sm tactical-colour" />
            <h3 className="analysis-chat-title">Analysis Assistant</h3>
          </div>

          <div className="analysis-chat-body">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={
                  message.type === "user"
                    ? "chat-row chat-row-right"
                    : "chat-row chat-row-left"
                }
              >
                <div
                  className={
                    message.type === "user"
                      ? "chat-bubble chat-bubble-user"
                      : "chat-bubble chat-bubble-assistant"
                  }
                >
                  <p className="chat-text">{message.content}</p>
                  <p className="chat-time">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isProcessingQuery && (
              <div className="chat-row chat-row-left">
                <div className="chat-bubble chat-bubble-assistant">
                  <div className="typing-dots">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="analysis-chat-footer">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about events, suspicious segments, or time ranges..."
              className="analysis-input"
              disabled={isProcessingQuery}
            />
            <Button
              onClick={handleSendQuery}
              disabled={!query.trim() || isProcessingQuery}
              className="primary-btn-icon"
            >
              <Sparkles className="icon-sm" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Right: Analysis results */}
      <div className="analysis-right">
        {analysisResults.map((result, index) => (
          <Card key={index} className="analysis-result-card">
            <div className="analysis-result-header">
              <div className="analysis-result-left">
                <FileVideo className="icon-sm tactical-colour" />
                <h3 className="analysis-result-title">{result.fileName}</h3>
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
                <div className="analysis-confidence">
                  Confidence: {result.confidence}%
                </div>
              </div>
            </div>

            <div className="analysis-result-body">
              <div className="analysis-column">
                <div className="analysis-section">
                  <h4 className="section-title">Event Timeline</h4>
                  <div className="timeline-list">
                    {result.timeline.map((item, idx) => (
                      <div key={idx} className="timeline-row">
                        <span className="timeline-time">{item.time}</span>
                        <span className="timeline-event">{item.event}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="analysis-section">
                  <h4 className="section-title">Video Duration</h4>
                  <div className="duration-row">
                    <Clock className="icon-xs tactical-colour" />
                    <span className="duration-text">{result.duration}</span>
                  </div>
                </div>
              </div>

              <div className="analysis-column">
                <h4 className="section-title">Key Moment Snapshots</h4>
                <div className="snapshot-grid">
                  {result.keyFrames.map((frame, i) => (
                    <div key={i} className="snapshot-tile">
                      <span className="snapshot-label">Frame {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="summary-panel">
              <h4 className="section-title">Summary Report</h4>
              <p className="summary-text">{result.summary}</p>
            </div>
          </Card>
        ))}

        {/* Detected frames section */}
        {detectedFrames.length > 0 && (
          <Card className="analysis-detected-card">
            <div className="detected-header">
              <div className="detected-title-wrap">
                <Sparkles className="icon-sm tactical-colour" />
                <h3 className="detected-title">Detected Frames & Clips</h3>
              </div>
              <Button onClick={handleDownloadPDF} className="primary-btn">
                <Download className="icon-sm icon-left" />
                <span>Download Full Report</span>
              </Button>
            </div>

            <div className="detected-grid">
              {detectedFrames.map((frame, index) => (
                <Card key={index} className="detected-card">
                  <div className="detected-preview">
                    <div className="detected-preview-label">Video Preview</div>
                    <Button
                      size="sm"
                      className="preview-play-btn"
                      onClick={() =>
                        setCurrentPlayingVideo(
                          currentPlayingVideo === frame.videoName
                            ? null
                            : frame.videoName
                        )
                      }
                    >
                      {currentPlayingVideo === frame.videoName ? (
                        <Pause className="icon-xs" />
                      ) : (
                        <Play className="icon-xs" />
                      )}
                    </Button>
                  </div>

                  <div className="detected-info">
                    <div className="detected-title-row">
                      <h4 className="detected-video-name">{frame.videoName}</h4>
                      <span className="detected-duration-pill">
                        {frame.duration}
                      </span>
                    </div>

                    <div className="detected-time-row">
                      <Clock className="icon-xs muted-colour" />
                      <span className="detected-time">{frame.timestamp}</span>
                    </div>

                    <p className="detected-description">{frame.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
