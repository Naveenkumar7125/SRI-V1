// RegisterCaseModal.jsx
import React, { useState } from "react";
import "./RegisterCaseModal.css";

const RegisterCaseModal = ({ onClose }) => {
  const [caseType, setCaseType] = useState("Face Recognition");
  const [priorityTier, setPriorityTier] = useState("Routine");
  const [threatLevel, setThreatLevel] = useState("Moderate");
  const [engagementPhase, setEngagementPhase] = useState("Live Incident");
  const [attachments, setAttachments] = useState([]);

  const handleAdditionalDocs = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // wire to API here
    console.log("NSG case submitted");
    onClose();
  };

  const isFaceCase = caseType === "Face Recognition";
  const isOtherCase = caseType === "Other";

  return (
    <div className="modal-backdrop">
      <div className="modal-shell">
        <header className="modal-header">
          <div>
            <h2>Register New NSG Case</h2>
            <p>
              Log a new incident detected through NSG video-analytics grid and
              route it to the appropriate task force and control room.
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <form className="modal-body" onSubmit={handleSubmit}>
          {/* CASE METADATA */}
          <section className="section-block">
            <h3 className="section-title">Case Overview</h3>

            <div className="field-row">
              <div className="field">
                <label>
                  Case Title<span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Eg: Watchlist face match at Arrival Lobby"
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>
                  Detailed Description<span className="required">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarise what was observed on the feed, threat indication, and any immediate actions taken."
                  required
                />
              </div>
            </div>

            <div className="field-row three-col">
              <div className="field">
                <label>
                  NSG Hub / Unit<span className="required">*</span>
                </label>
                <select defaultValue="">
                  <option value="" disabled>
                    Select NSG Hub / Detachment
                  </option>
                  <option>Manesar Garrison</option>
                  <option>Mumbai Hub</option>
                  <option>Chennai Hub</option>
                  <option>Kolkata Hub</option>
                  <option>Other NSG Detachment</option>
                </select>
              </div>

              <div className="field">
                <label>
                  Lead Task Force<span className="required">*</span>
                </label>
                <select defaultValue="">
                  <option value="" disabled>
                    Select task force
                  </option>
                  <option>Strike Team Alpha</option>
                  <option>Airport Platoon Bravo</option>
                  <option>Route Protection Charlie</option>
                  <option>Surveillance Delta</option>
                </select>
              </div>

              <div className="field">
                <label>Operation Category</label>
                <select defaultValue="Counter-Terror">
                  <option>Counter-Terror</option>
                  <option>VIP Security</option>
                  <option>Critical Infrastructure</option>
                  <option>Airport Security</option>
                  <option>Urban Counter-Insurgency</option>
                </select>
              </div>
            </div>

            <div className="field-row three-col">
              <div className="field">
                <label>
                  Case Type<span className="required">*</span>
                </label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                >
                  <option>Face Recognition</option>
                  <option>Intrusion Detection</option>
                  <option>Object Detection</option>
                  <option>Vehicle Analytics</option>
                  <option>Other</option>
                </select>
                <p className="field-caption">
                  Select how the incident was first flagged in the NSG
                  surveillance grid.
                </p>
              </div>

              <div className="field">
                <label>Threat Level</label>
                <select
                  value={threatLevel}
                  onChange={(e) => setThreatLevel(e.target.value)}
                >
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div className="field">
                <label>Priority Tier</label>
                <select
                  value={priorityTier}
                  onChange={(e) => setPriorityTier(e.target.value)}
                >
                  <option>Routine</option>
                  <option>Fast Track</option>
                  <option>Immediate Response</option>
                </select>
              </div>
            </div>
          </section>

          {/* LOCATION & TIMELINE */}
          <section className="section-block">
            <h3 className="section-title">Location & Timeline</h3>

            <div className="field-row three-col">
              <div className="field">
                <label>
                  Incident Location<span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Zone, gate, terminal, or building identifier"
                  required
                />
              </div>

              <div className="field">
                <label>Zone Classification</label>
                <select defaultValue="Red">
                  <option>Red</option>
                  <option>Amber</option>
                  <option>Green</option>
                </select>
              </div>

              <div className="field">
                <label>
                  Incident Time<span className="required">*</span>
                </label>
                <input type="datetime-local" required />
              </div>
            </div>

            <div className="field-row three-col">
              <div className="field">
                <label>First Detection (System)</label>
                <input type="datetime-local" />
              </div>

              <div className="field">
                <label>First Response (Ground Team)</label>
                <input type="datetime-local" />
              </div>

              <div className="field">
                <label>Expected Closure Window</label>
                <select defaultValue="Within 24 hours">
                  <option>Within 6 hours</option>
                  <option>Within 24 hours</option>
                  <option>Within 72 hours</option>
                  <option>Long-term tracking</option>
                </select>
              </div>
            </div>
          </section>

          {/* COMMAND & COMMUNICATION */}
          <section className="section-block">
            <h3 className="section-title">Command & Communication</h3>

            <div className="field-row three-col">
              <div className="field">
                <label>Ground Commander (Rank & Name)</label>
                <input
                  type="text"
                  placeholder="Eg: Comdt. Sharma / Insp. Rajan"
                />
              </div>

              <div className="field">
                <label>Control Room Contact</label>
                <input
                  type="text"
                  placeholder="Eg: Ops Room Desk, secure line"
                />
              </div>

              <div className="field">
                <label>Engagement Phase</label>
                <select
                  value={engagementPhase}
                  onChange={(e) => setEngagementPhase(e.target.value)}
                >
                  <option>Pre-incident Intel</option>
                  <option>Live Incident</option>
                  <option>Post-incident Review</option>
                </select>
              </div>
            </div>

            <div className="field-row two-col">
              <div className="field">
                <label>Escalation Level</label>
                <select defaultValue="Local Command">
                  <option>Local Command</option>
                  <option>State Coordination</option>
                  <option>MHA / Central Stakeholder</option>
                </select>
              </div>

              <div className="field">
                <label>Linked Operation / Task ID</label>
                <input
                  type="text"
                  placeholder="Eg: OP-URBAN-GRID-07"
                />
              </div>
            </div>
          </section>

          {/* VIDEO ANALYTICS DETAILS (CONDITIONAL) */}
          {caseType && (
            <section className="section-block">
              <h3 className="section-title">Video Analytics Context</h3>

              <div className="field-row three-col">
                <div className="field">
                  <label>Source Camera / Sensor</label>
                  <input
                    type="text"
                    placeholder="Eg: CCTV-09, PTZ-02, Drone-Cam-01"
                  />
                </div>

                <div className="field">
                  <label>System Alert ID</label>
                  <input
                    type="text"
                    placeholder="ID generated by analytics engine"
                  />
                </div>

                <div className="field">
                  <label>Clip Duration (seconds)</label>
                  <input type="number" min="0" placeholder="Eg: 45" />
                </div>
              </div>

              <div className="field-row two-col">
                <div className="field">
                  <label>Video Segment Time Range</label>
                  <input
                    type="text"
                    placeholder="Eg: 18:22:10 hrs to 18:22:55 hrs IST"
                  />
                </div>

                <div className="field">
                  <label>Primary Video Clip</label>
                  <input type="file" accept="video/*" />
                  <p className="field-caption">
                    Upload the primary clip or extracted segment tagged with
                    this case.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* FACE RECOGNITION EXTRA */}
          {isFaceCase && (
            <section className="section-block highlighted">
              <h3 className="section-title">Face Recognition Details</h3>

              <div className="field-row three-col">
                <div className="field">
                  <label>Watchlist Name / Alias</label>
                  <input
                    type="text"
                    placeholder="If mapped to NSG / central watchlist"
                  />
                </div>
                <div className="field">
                  <label>Match Confidence (%)</label>
                  <input type="number" min="0" max="100" placeholder="Eg: 92" />
                </div>
                <div className="field">
                  <label>Watchlist Category</label>
                  <select defaultValue="Category A – High Risk">
                    <option>Category A – High Risk</option>
                    <option>Category B – Under Watch</option>
                    <option>Category C – Historical Record</option>
                  </select>
                </div>
              </div>

              <div className="field-row two-col">
                <div className="field">
                  <label>Camera Angle / Zone</label>
                  <input
                    type="text"
                    placeholder="Eg: Arrival Lobby – South PTZ"
                  />
                </div>
                <div className="field">
                  <label>Upload Face Snapshot</label>
                  <input type="file" accept="image/*" />
                  <p className="field-caption">
                    Upload cropped facial frame generated by the FR engine.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* OTHER CASE DETAILS */}
          {isOtherCase && (
            <section className="section-block highlighted">
              <h3 className="section-title">Other Incident Details</h3>
              <div className="field-row">
                <div className="field">
                  <label>Nature of Incident</label>
                  <input
                    type="text"
                    placeholder="Eg: Manual tip-off, cyber alert, intelligence input"
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Operational Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Capture how the incident was received, agencies involved, and expected NSG role."
                  />
                </div>
              </div>
            </section>
          )}

          {/* EVIDENCE & ROE */}
          <section className="section-block">
            <h3 className="section-title">Evidence & ROE Notes</h3>

            <div className="field-row two-col">
              <div className="field">
                <label>Upload Additional Documents</label>
                <input
                  type="file"
                  multiple
                  onChange={handleAdditionalDocs}
                  accept=".pdf,.jpg,.jpeg,.png,.mp4,.avi,.doc,.docx"
                />
                <p className="field-caption">
                  Attach SIT reports, snapshots, intel notes or additional
                  clips. Multiple files allowed.
                </p>
              </div>

              <div className="field">
                <label>Evidence Summary</label>
                <textarea
                  rows={3}
                  placeholder="Describe what each attachment contains and how it supports the case."
                />
              </div>
            </div>

            <div className="field-row two-col">
              <div className="field">
                <label>Rules of Engagement (ROE) Notes</label>
                <textarea
                  rows={2}
                  placeholder="Key ROE points, do-not-engage conditions, containment limits, etc."
                />
              </div>

              <div className="field">
                <label>Immediate Directives Issued</label>
                <textarea
                  rows={2}
                  placeholder="Broadcasts to ground teams, lockdown instructions, perimeter changes, etc."
                />
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="attachments-list">
                <p className="attachments-title">
                  {attachments.length} file(s) selected
                </p>
                <ul>
                  {attachments.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* FOOTER */}
          <footer className="modal-footer">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save NSG Case
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default RegisterCaseModal;
