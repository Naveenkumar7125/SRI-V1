import React, { useState } from "react";
import "./LiveFeedsSection.css";

const cameras = [
  { id: 1, name: "Gate 1 – Main Entrance", location: "North Perimeter", status: "LIVE" },
  { id: 2, name: "Gate 2 – Staff Entry", location: "East Wing", status: "LIVE" },
  { id: 3, name: "Parking Bay – Zone A", location: "Underground Level 1", status: "LIVE" },
  { id: 4, name: "Lobby – Main Hall", location: "Central Block", status: "LIVE" },
  { id: 5, name: "Corridor – Block C", location: "Third Floor", status: "NO FEED" },
  { id: 6, name: "Stairwell – South Exit", location: "South Wing", status: "LIVE" },
  { id: 7, name: "Parking Bay – Zone B", location: "Underground Level 2", status: "LIVE" },
  { id: 8, name: "Cafeteria – Seating Area", location: "West Block", status: "LIVE" },
  { id: 9, name: "Perimeter – Blind Spot Cam", location: "Rear Fence Line", status: "LIVE" },
  { id: 10, name: "Rooftop – Observation Deck", location: "Tower Block Roof", status: "LIVE" },
];

const LiveFeedsSection = () => {
  const [activeCamera, setActiveCamera] = useState(null);

  return (
    <>
      {/* Pure camera wall */}
      <div className="live-feeds-wrapper">
        <div className="camera-grid">
          {cameras.map((cam) => {
            const offline = cam.status !== "LIVE";
            const camId = cam.id.toString().padStart(2, "0");

            return (
              <div
                key={cam.id}
                className={`camera-card ${offline ? "camera-card-offline" : ""}`}
                onClick={() => setActiveCamera(cam)}
              >
                <div className="camera-video">
                  {/* Top-left: CAM ID */}
                  <div className="overlay-chip overlay-camid">CAM {camId}</div>

                  {/* Top-right: status */}
                  <div
                    className={`overlay-chip overlay-status ${
                      offline ? "overlay-status-offline" : "overlay-status-live"
                    }`}
                  >
                    <span className="overlay-dot" />
                    {offline ? "NO FEED" : "LIVE"}
                  </div>

                  {/* Center: label */}
                  <span className="camera-video-center">
                    {offline ? "NO FEED" : "LIVE FEED"}
                  </span>

                  {/* Bottom: name + location */}
                  <div className="overlay-bottom">
                    <div className="overlay-text-block">
                      <span className="overlay-name" title={cam.name}>
                        {cam.name}
                      </span>
                      <span className="overlay-location" title={cam.location}>
                        {cam.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for zoom view */}
      {activeCamera && (
        <div className="camera-modal-overlay" onClick={() => setActiveCamera(null)}>
          <div
            className="camera-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="camera-modal-header">
              <div className="camera-modal-title">
                <h3>{activeCamera.name}</h3>
                <span>
                  CAM {activeCamera.id.toString().padStart(2, "0")} ·{" "}
                  {activeCamera.location}
                </span>
              </div>
              <button
                className="camera-modal-close"
                onClick={() => setActiveCamera(null)}
              >
                ×
              </button>
            </div>

            <div className="camera-modal-video">
              <span>
                {activeCamera.status === "LIVE"
                  ? "EXPANDED LIVE VIEW"
                  : "NO FEED AVAILABLE"}
              </span>
            </div>

            <div className="camera-modal-footer">
              <span>Status: {activeCamera.status.toUpperCase()}</span>
              <span>Click outside or × to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveFeedsSection;
