// UploadSummarize.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UploadArea from "./UploadArea";
import AnalysisView from "./AnalysisView";
import "./uploadSummarize.css";

export default function UploadSummarize() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [detectedFrames, setDetectedFrames] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <div className="upload-page">
      {/* Header */}
      <header className="upload-header">
        <div className="upload-header-left">
          <h1 className="upload-title">NSG Video Intelligence</h1>
          <p className="upload-subtitle">
            Upload surveillance footage for AI-powered detection, threat
            assessment, and tactical summarization.
          </p>
        </div>

        {showAnalysis && (
          <Button
            variant="outline"
            className="back-button"
            onClick={() => setShowAnalysis(false)}
          >
            <ArrowLeft className="icon-sm" />
            <span>Back to Upload</span>
          </Button>
        )}
      </header>

      {/* Body */}
      <div className="upload-body">
        {!showAnalysis ? (
          <UploadArea
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
            setAnalysisResults={setAnalysisResults}
            setDetectedFrames={setDetectedFrames}
            setShowAnalysis={setShowAnalysis}
          />
        ) : (
          <AnalysisView
            uploadedFiles={uploadedFiles}
            analysisResults={analysisResults}
            detectedFrames={detectedFrames}
          />
        )}
      </div>
    </div>
  );
}
