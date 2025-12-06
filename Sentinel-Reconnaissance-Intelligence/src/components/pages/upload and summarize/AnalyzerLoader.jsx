// AnalyzerLoader.jsx
import React from "react";
import "../styles/uploadSummarize.css";

export default function AnalyzerLoader({ progress = 0 }) {
  return (
    <div className="analyzer-overlay">
      <div className="analyzer-card">
        <div className="analyzer-spinner" />
        <h3>Running AI Analysis</h3>
        <p>Processing video frames. This may take a while for large uploads.</p>

        <div className="analyzer-progress">
          <div className="analyzer-progress-bar">
            <div className="analyzer-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="analyzer-progress-label">{progress}%</div>
        </div>
      </div>
    </div>
  );
}
