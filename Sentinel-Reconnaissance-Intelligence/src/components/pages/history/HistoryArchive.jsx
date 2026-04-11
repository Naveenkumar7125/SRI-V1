import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HistoryArchive.css"; // Basic styles or inline

export default function HistoryArchive() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/history");
        setFolders(res.data.folders || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="history-archive-container">
      <header className="archive-header">
        <h1>Analysis Archive</h1>
        <p>Review previously processed surveillance footage and generated AI reports.</p>
      </header>

      {loading ? (
        <div className="loading-spinner">Loading archive...</div>
      ) : folders.length === 0 ? (
        <div className="empty-state">No historical analysis records found.</div>
      ) : (
        <div className="archive-grid">
          {folders.map((folder) => {
            const hasVideo = folder.videos && folder.videos.length > 0;
            const previewImage = hasVideo && folder.videos[0].detectedFrames?.length > 0
              ? folder.videos[0].detectedFrames[0].imageUrl
              : "https://via.placeholder.com/400x200?text=No+Preview";

            return (
              <div 
                key={folder._id} 
                className="archive-card"
                onClick={() => navigate(`/history/${folder._id}`)}
              >
                <div className="archive-cover">
                  <img src={previewImage} alt="Cover" />
                </div>
                <div className="archive-info">
                  <h3>{folder.name || "Unknown Session"}</h3>
                  <div className="archive-meta">
                    <span className="archive-date">
                      {new Date(folder.createdAt).toLocaleString()}
                    </span>
                    <span className="archive-count">
                      {hasVideo ? folder.videos[0].detectedFrames?.length || 0 : 0} Frames Found
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
