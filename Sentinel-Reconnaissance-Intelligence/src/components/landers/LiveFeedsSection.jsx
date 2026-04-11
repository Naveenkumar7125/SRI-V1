// // // import React, { useState } from "react";
// // // import "./LiveFeedsSection.css";

// // // const cameras = [
// // //   { id: 1, name: "Gate 1 – Main Entrance", location: "North Perimeter", status: "LIVE" },
// // //   { id: 2, name: "Gate 2 – Staff Entry", location: "East Wing", status: "LIVE" },
// // //   { id: 3, name: "Parking Bay – Zone A", location: "Underground Level 1", status: "LIVE" },
// // //   { id: 4, name: "Lobby – Main Hall", location: "Central Block", status: "LIVE" },
// // //   { id: 5, name: "Corridor – Block C", location: "Third Floor", status: "NO FEED" },
// // //   { id: 6, name: "Stairwell – South Exit", location: "South Wing", status: "LIVE" },
// // //   { id: 7, name: "Parking Bay – Zone B", location: "Underground Level 2", status: "LIVE" },
// // //   { id: 8, name: "Cafeteria – Seating Area", location: "West Block", status: "LIVE" },
// // //   { id: 9, name: "Perimeter – Blind Spot Cam", location: "Rear Fence Line", status: "LIVE" },
// // //   { id: 10, name: "Rooftop – Observation Deck", location: "Tower Block Roof", status: "LIVE" },
// // // ];

// // // const LiveFeedsSection = () => {
// // //   const [activeCamera, setActiveCamera] = useState(null);

// // //   return (
// // //     <>
// // //       {/* Pure camera wall */}
// // //       <div className="live-feeds-wrapper">
// // //         <div className="camera-grid">
// // //           {cameras.map((cam) => {
// // //             const offline = cam.status !== "LIVE";
// // //             const camId = cam.id.toString().padStart(2, "0");

// // //             return (
// // //               <div
// // //                 key={cam.id}
// // //                 className={`camera-card ${offline ? "camera-card-offline" : ""}`}
// // //                 onClick={() => setActiveCamera(cam)}
// // //               >
// // //                 <div className="camera-video">
// // //                   {/* Top-left: CAM ID */}
// // //                   <div className="overlay-chip overlay-camid">CAM {camId}</div>

// // //                   {/* Top-right: status */}
// // //                   <div
// // //                     className={`overlay-chip overlay-status ${
// // //                       offline ? "overlay-status-offline" : "overlay-status-live"
// // //                     }`}
// // //                   >
// // //                     <span className="overlay-dot" />
// // //                     {offline ? "NO FEED" : "LIVE"}
// // //                   </div>

// // //                   {/* Center: label */}
// // //                   <span className="camera-video-center">
// // //                     {offline ? "NO FEED" : "LIVE FEED"}
// // //                   </span>

// // //                   {/* Bottom: name + location */}
// // //                   <div className="overlay-bottom">
// // //                     <div className="overlay-text-block">
// // //                       <span className="overlay-name" title={cam.name}>
// // //                         {cam.name}
// // //                       </span>
// // //                       <span className="overlay-location" title={cam.location}>
// // //                         {cam.location}
// // //                       </span>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       </div>

// // //       {/* Modal for zoom view */}
// // //       {activeCamera && (
// // //         <div className="camera-modal-overlay" onClick={() => setActiveCamera(null)}>
// // //           <div
// // //             className="camera-modal-content"
// // //             onClick={(e) => e.stopPropagation()}
// // //           >
// // //             <div className="camera-modal-header">
// // //               <div className="camera-modal-title">
// // //                 <h3>{activeCamera.name}</h3>
// // //                 <span>
// // //                   CAM {activeCamera.id.toString().padStart(2, "0")} ·{" "}
// // //                   {activeCamera.location}
// // //                 </span>
// // //               </div>
// // //               <button
// // //                 className="camera-modal-close"
// // //                 onClick={() => setActiveCamera(null)}
// // //               >
// // //                 ×
// // //               </button>
// // //             </div>

// // //             <div className="camera-modal-video">
// // //               <span>
// // //                 {activeCamera.status === "LIVE"
// // //                   ? "EXPANDED LIVE VIEW"
// // //                   : "NO FEED AVAILABLE"}
// // //               </span>
// // //             </div>

// // //             <div className="camera-modal-footer">
// // //               <span>Status: {activeCamera.status.toUpperCase()}</span>
// // //               <span>Click outside or × to close</span>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // };

// // // export default LiveFeedsSection;














// LiveFeedsSection.jsx
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./LiveFeedsSection.css";

// import sampleVideo1 from "./videos/sample1.mp4";
// import sampleVideo2 from "./videos/sample2.mp4";
// import sampleVideo3 from "./videos/kishore.mp4";

// import cam05Img from "./cam05.jpg";
// import cam06Img from "./cam06.jpg";
// import cam07Img from "./cam07.jpg";


// const API_BASE = "http://localhost:5005"; // adjust if your backend runs elsewhere

// const initialCameras = [
//   { id: 1, name: "Gate 1 – Main Entrance", location: "North Perimeter", status: "LIVE" },
//   { id: 2, name: "Gate 2 – Staff Entry", location: "East Wing", status: "LIVE" },
//   { id: 3, name: "Parking Bay – Zone A", location: "Underground Level 1", status: "LIVE" },
//   { id: 4, name: "Command Center – Ops Hall", location: "Main Block · Level 2", status: "LIVE" },
//   { id: 5, name: "Surveillance Tower – Roof Cam", location: "HQ Rooftop Watch", status: "LIVE" },
//   { id: 6, name: "Perimeter Fence – South Sector", location: "South Perimeter · Zone C", status: "LIVE" },
//   { id: 7, name: "Internal Corridor – Block B", location: "Admin Wing · Level 1", status: "LIVE" },
// ];

// const LiveFeedsSection = () => {
//   const [cameras, setCameras] = useState(initialCameras);
//   const [activeCamera, setActiveCamera] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [loadingAdd, setLoadingAdd] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [newCamera, setNewCamera] = useState({
//     ip: "",
//     user: "",
//     port: "554",
//     password: "",
//     channel: "101",
//     name: "",
//     location: "",
//   });

//   // store MediaStreams for cams (3 and 5)
//   const [streams, setStreams] = useState({}); // e.g. {3: MediaStream, 5: MediaStream}
//   const videoRefs = useRef({}); // refs to video DOM elements keyed by cam id

//   // Attach media streams to video elements when streams update
//   useEffect(() => {
//     Object.entries(streams).forEach(([camId, stream]) => {
//       const el = videoRefs.current[camId];
//       if (el && el.srcObject !== stream) {
//         el.srcObject = stream;
//         const playPromise = el.play();
//         if (playPromise && typeof playPromise.then === "function") {
//           playPromise.catch(() => {
//             /* autoplay blocked — user gesture required for audio in some browsers */
//           });
//         }
//       }
//     });
//   }, [streams]);

//   // Robust loop setup for sample videos: ensures loop property + ended handler
//   useEffect(() => {
//     const sampleIds = [1, 2, 4]; // cams showing local mp4s
//     const handlers = [];

//     sampleIds.forEach((id) => {
//       const el = videoRefs.current[id];
//       if (!el) return;

//       el.muted = true;
//       el.playsInline = true;
//       el.preload = "auto";
//       el.loop = true;

//       const onEnded = () => {
//         try {
//           if (el.duration && !isNaN(el.duration)) el.currentTime = 0;
//           const p = el.play();
//           if (p && typeof p.catch === "function") p.catch(() => {});
//         } catch (err) {}
//       };

//       el.addEventListener("ended", onEnded);
//       handlers.push({ el, onEnded });

//       const p = el.play();
//       if (p && typeof p.catch === "function") {
//         p.catch(() => {});
//       }
//     });

//     return () => {
//       handlers.forEach(({ el, onEnded }) => {
//         try {
//           el.removeEventListener("ended", onEnded);
//         } catch (err) {}
//       });
//     };
//   });

//   // setup webcam streams: default camera -> cam 3; if >1 camera, second camera -> cam 5
//   useEffect(() => {
//     let mounted = true;
//     let createdStreams = {}; // local reference for cleanup

//     const setup = async () => {
//       if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
//         setErrorMsg("Browser does not support mediaDevices API.");
//         return;
//       }

//       try {
//         const devices = await navigator.mediaDevices.enumerateDevices();
//         const videoInputs = devices.filter((d) => d.kind === "videoinput");

//         // default camera for cam 3
//         try {
//           const s3 = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//           if (!mounted) {
//             s3.getTracks().forEach((t) => t.stop());
//           } else {
//             createdStreams[3] = s3;
//           }
//         } catch (err) {
//           console.warn("Unable to get default camera for cam3:", err);
//         }

//         // second device (if present) → cam 5
//         if (videoInputs.length > 1) {
//           const secondDeviceId = videoInputs[1].deviceId;
//           try {
//             const s5 = await navigator.mediaDevices.getUserMedia({
//               video: { deviceId: { exact: secondDeviceId } },
//               audio: false,
//             });
//             if (mounted) createdStreams[5] = s5;
//             else s5.getTracks().forEach((t) => t.stop());
//           } catch (err) {
//             console.warn("Unable to get second camera for cam5:", err);
//           }
//         }

//         if (mounted) setStreams((prev) => ({ ...prev, ...createdStreams }));
//       } catch (err) {
//         console.error("Error enumerating devices:", err);
//         setErrorMsg("Could not enumerate media devices.");
//       }
//     };

//     setup();

//     const handleDeviceChange = () => {
//       // stop created streams and re-run setup
//       Object.values(createdStreams).forEach((st) => {
//         if (st && st.getTracks) st.getTracks().forEach((t) => t.stop());
//       });
//       setStreams({});
//       setup();
//     };

//     navigator.mediaDevices &&
//       navigator.mediaDevices.addEventListener &&
//       navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

//     return () => {
//       mounted = false;
//       Object.values(createdStreams).forEach((st) => {
//         if (st && st.getTracks) st.getTracks().forEach((t) => t.stop());
//       });
//       Object.values(streams).forEach((st) => {
//         if (st && st.getTracks) st.getTracks().forEach((t) => t.stop());
//       });
//       navigator.mediaDevices &&
//         navigator.mediaDevices.removeEventListener &&
//         navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---------- add-camera and form logic ----------
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewCamera({
//       ...newCamera,
//       [name]: value,
//     });
//     setErrorMsg("");
//   };

//   const handleAddCamera = async () => {
//     if (!newCamera.ip) {
//       setErrorMsg("Enter IP address or paste full RTSP URL in IP field.");
//       return;
//     }

//     setLoadingAdd(true);
//     setErrorMsg("");

//     try {
//       const newId = Math.max(...cameras.map((c) => c.id)) + 1;

//       let payload;
//       const ipLower = (newCamera.ip || "").trim();

//       if (ipLower.toLowerCase().startsWith("rtsp://")) {
//         payload = {
//           id: newId,
//           name: newCamera.name || `Camera ${newId}`,
//           location: newCamera.location || "New Location",
//           rtsp_url: newCamera.ip.trim(),
//         };
//       } else {
//         payload = {
//           id: newId,
//           name: newCamera.name || `Camera ${newId}`,
//           location: newCamera.location || "New Location",
//           connection: {
//             ip: newCamera.ip.trim(),
//             user: newCamera.user,
//             password: newCamera.password,
//             port: newCamera.port || "554",
//             channel: newCamera.channel || "101",
//           },
//         };
//       }

//       // POST to backend (which should spawn/return started: true)
//       const resp = await axios.post(`${API_BASE}/add_camera`, payload, {
//         timeout: 30000,
//       });

//       if (resp && resp.data && resp.data.started) {
//         const cameraToAdd = {
//           id: newId,
//           name: payload.name,
//           location: payload.location,
//           status: "LIVE",
//           connectionDetails: payload.connection || { rtsp_url: payload.rtsp_url },
//         };

//         // add camera to grid — now grid will immediately show its feed (image)
//         setCameras((prev) => [...prev, cameraToAdd]);

//         setNewCamera({
//           ip: "",
//           user: "",
//           port: "554",
//           password: "",
//           channel: "101",
//           name: "",
//           location: "",
//         });
//         setShowAddForm(false);
//       } else {
//         const serverMsg = (resp && resp.data && resp.data.error) || "Backend didn't confirm start.";
//         setErrorMsg(serverMsg);
//       }
//     } catch (err) {
//       console.error("Add camera error:", err);
//       if (err.code === "ECONNABORTED" || (err.message && err.message.includes("timeout"))) {
//         setErrorMsg("Request timed out. Backend may be slow or RTSP unreachable.");
//       } else if (err.message && err.message.toLowerCase().includes("network error")) {
//         setErrorMsg(`Network error: cannot reach backend at ${API_BASE}. Is server running?`);
//       } else if (err.response && err.response.data && err.response.data.error) {
//         setErrorMsg(`Backend error: ${err.response.data.error}`);
//       } else {
//         setErrorMsg("Failed to add camera. Check browser console and backend logs.");
//       }
//     } finally {
//       setLoadingAdd(false);
//     }
//   };

//   // ---------- UI ----------
//   return (
//     <>
//       <div className="camera-grid">
//         {cameras.map((cam) => {
//           const offline = cam.status !== "LIVE";
//           const camId = cam.id.toString().padStart(2, "0");

//           // choose video source for specific cams
//           const isSample1 = cam.id === 1;
//           const isSample2 = cam.id === 2;
//           const isSample3 = cam.id === 4;
//           const isCam3Live = cam.id === 3;
//           const isCam5Live = cam.id === 5;

//           return (
//             <div
//               key={cam.id}
//               className={`camera-card ${offline ? "camera-card-offline" : ""}`}
//               onClick={() => setActiveCamera(cam)}
//             >
//               <div className="camera-video">
//                 <div className="overlay-chip overlay-camid">CAM {camId}</div>

//                 <div
//                   className={`overlay-chip overlay-status ${
//                     offline ? "overlay-status-offline" : "overlay-status-live"
//                   }`}
//                 >
//                   <span className="overlay-dot" />
//                   {offline ? "NO FEED" : "LIVE"}
//                 </div>

//                 {/* Video / Live handling inside grid cards */}
//                 {isSample1 ? (
//                   <video
//                     ref={(el) => (videoRefs.current[cam.id] = el)}
//                     src={sampleVideo1}
//                     autoPlay
//                     loop
//                     muted
//                     playsInline
//                     preload="auto"
//                     className="camera-video-element"
//                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                   />
//                 ) : isSample2 ? (
//                   <video
//                     ref={(el) => (videoRefs.current[cam.id] = el)}
//                     src={sampleVideo2}
//                     autoPlay
//                     loop
//                     muted
//                     playsInline
//                     preload="auto"
//                     className="camera-video-element"
//                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                   />
//                 ) : isSample3 ? (
//                   <video
//                     ref={(el) => (videoRefs.current[cam.id] = el)}
//                     src={sampleVideo3}
//                     autoPlay
//                     loop
//                     muted
//                     playsInline
//                     preload="auto"
//                     className="camera-video-element"
//                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                   />
//                 ) : isCam3Live || isCam5Live ? (
//                   // webcam streams (attached via streams state in effect)
//                   <video
//                     ref={(el) => (videoRefs.current[cam.id] = el)}
//                     autoPlay
//                     playsInline
//                     muted
//                     className="camera-video-element"
//                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                   />
//                 ) : offline ? (
//                   <span className="camera-video-center">NO FEED</span>
//                 ) : (
//                   // For normal LIVE cameras (including newly added ones), show the backend stream image
//                   <img
//                     alt={`cam-${cam.id}`}
//                     src={`${API_BASE}/camera_stream/${cam.id}`}
//                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                     onError={(e) => {
//                       // fallback text if backend stream fails
//                       e.currentTarget.style.display = "none";
//                     }}
//                   />
//                 )}

//                 <div className="overlay-bottom">
//                   <div className="overlay-text-block">
//                     <span className="overlay-name" title={cam.name}>
//                       {cam.name}
//                     </span>
//                     <span className="overlay-location" title={cam.location}>
//                       {cam.location}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {/* Add camera card */}
//         <div className="camera-card add-camera-card" onClick={() => setShowAddForm(true)}>
//           <div className="camera-video">
//             <div className="overlay-chip overlay-camid">ADD NEW</div>
//             <span className="camera-video-center add-camera-plus">+</span>
//             <div className="overlay-bottom">
//               <div className="overlay-text-block">
//                 <span className="overlay-name add-camera-text">Add New Camera</span>
//                 <span className="overlay-location">Click to configure</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Active camera modal */}
//       {activeCamera && (
//         <div className="camera-modal-overlay" onClick={() => setActiveCamera(null)}>
//           <div className="camera-modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="camera-modal-header">
//               <div className="camera-modal-title">
//                 <h3>{activeCamera.name}</h3>
//                 <span>
//                   CAM {activeCamera.id.toString().padStart(2, "0")} · {activeCamera.location}
//                 </span>
//               </div>
//               <button className="camera-modal-close" onClick={() => setActiveCamera(null)}>
//                 ×
//               </button>
//             </div>

//             <div className="camera-modal-video">
//               {/* modal view: show same source but larger */}
//               {activeCamera.id === 1 ? (
//                 <video
//                   src={sampleVideo1}
//                   autoPlay
//                   loop
//                   muted
//                   playsInline
//                   preload="auto"
//                   style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
//                 />
//               ) : activeCamera.id === 2 ? (
//                 <video
//                   src={sampleVideo2}
//                   autoPlay
//                   loop
//                   muted
//                   playsInline
//                   preload="auto"
//                   style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
//                 />
//               ) : activeCamera.id === 4 ? (
//                 <video
//                   src={sampleVideo3}
//                   autoPlay
//                   loop
//                   muted
//                   playsInline
//                   preload="auto"
//                   style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
//                 />
//               ) : activeCamera.id === 3 ? (
//                 // cam3 live stream from streams[3]
//                 <video
//                   ref={(el) => {
//                     videoRefs.current[`modal-${activeCamera.id}`] = el;
//                     if (el && streams[3]) el.srcObject = streams[3];
//                   }}
//                   autoPlay
//                   playsInline
//                   muted
//                   style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
//                 />
//               ) : activeCamera.id === 5 ? (
//                 <video
//                   ref={(el) => {
//                     videoRefs.current[`modal-${activeCamera.id}`] = el;
//                     if (el && streams[5]) el.srcObject = streams[5];
//                   }}
//                   autoPlay
//                   playsInline
//                   muted
//                   style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
//                 />
//               ) : activeCamera.status === "LIVE" ? (
//                 <img
//                   style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
//                   alt={`cam-${activeCamera.id}`}
//                   src={`${API_BASE}/camera_stream/${activeCamera.id}`}
//                 />
//               ) : (
//                 <span>NO FEED AVAILABLE</span>
//               )}
//             </div>

//             <div className="camera-modal-footer">
//               <span>Status: {activeCamera.status.toUpperCase()}</span>
//               <span>Click outside or × to close</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Camera Form Modal */}
//       {showAddForm && (
//         <div className="camera-modal-overlay add-camera-modal-overlay" onClick={() => setShowAddForm(false)}>
//           <div className="camera-modal-content add-camera-modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="add-camera-modal-header">
//               <div className="add-camera-modal-title">
//                 <h3>Add New Camera</h3>
//                 <span>Enter camera connection details — OR paste full RTSP URL in the IP field</span>
//               </div>
//               <button className="add-camera-modal-close" onClick={() => setShowAddForm(false)}>
//                 ×
//               </button>
//             </div>

//             <div className="add-camera-form">
//               <div className="form-grid">
//                 <div className="form-field">
//                   <label>IP Address / RTSP URL *</label>
//                   <input
//                     type="text"
//                     name="ip"
//                     value={newCamera.ip}
//                     onChange={handleInputChange}
//                     placeholder="192.168.1.100  OR  rtsp://admin:password@192.168.0.100:554/Streaming/Channels/101"
//                     className="form-input"
//                     required
//                   />
//                 </div>

//                 <div className="form-field">
//                   <label>Username</label>
//                   <input
//                     type="text"
//                     name="user"
//                     value={newCamera.user}
//                     onChange={handleInputChange}
//                     placeholder="admin"
//                     className="form-input"
//                   />
//                 </div>

//                 <div className="form-field">
//                   <label>Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={newCamera.password}
//                     onChange={handleInputChange}
//                     placeholder="••••••••"
//                     className="form-input"
//                   />
//                 </div>

//                 <div className="form-row">
//                   <div className="form-field">
//                     <label>Port</label>
//                     <input
//                       type="text"
//                       name="port"
//                       value={newCamera.port}
//                       onChange={handleInputChange}
//                       placeholder="554"
//                       className="form-input"
//                     />
//                   </div>
//                   <div className="form-field">
//                     <label>Channel</label>
//                     <input
//                       type="text"
//                       name="channel"
//                       value={newCamera.channel}
//                       onChange={handleInputChange}
//                       placeholder="101"
//                       className="form-input"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-field">
//                   <label>Camera Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={newCamera.name}
//                     onChange={handleInputChange}
//                     placeholder="Camera Name (optional)"
//                     className="form-input"
//                   />
//                 </div>

//                 <div className="form-field">
//                   <label>Location</label>
//                   <input
//                     type="text"
//                     name="location"
//                     value={newCamera.location}
//                     onChange={handleInputChange}
//                     placeholder="Location (optional)"
//                     className="form-input"
//                   />
//                 </div>
//               </div>
//             </div>

//             {errorMsg && <div style={{ color: "crimson", padding: "8px 12px" }}>{errorMsg}</div>}

//             <div className="add-camera-form-footer">
//               <button onClick={() => setShowAddForm(false)} className="add-form-button add-form-button-cancel">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddCamera}
//                 disabled={!newCamera.ip || loadingAdd}
//                 className="add-form-button add-form-button-add"
//               >
//                 {loadingAdd ? "Starting..." : "Add Camera"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default LiveFeedsSection;






import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./LiveFeedsSection.css";

import sampleVideo1 from "./videos/sample1.mp4";
import sampleVideo2 from "./videos/sample2.mp4";
import sampleVideo3 from "./videos/kishore.mp4";

import cam03Img from "./videos/frt.png";  // Added camera 03 image import
import cam05Img from "./videos/weapon.png";
import cam06Img from "./videos/crowd.png";
import cam07Img from "./videos/violence.png";

const API_BASE = "http://localhost:5005"; // adjust if your backend runs elsewhere

const initialCameras = [
  { id: 1, name: "Gate 1 – Main Entrance", location: "North Perimeter", status: "LIVE" },
  { id: 2, name: "Gate 2 – Staff Entry", location: "East Wing", status: "LIVE" },
  { id: 3, name: "Parking Bay – Zone A", location: "Underground Level 1", status: "LIVE" },
  { id: 4, name: "Command Center – Ops Hall", location: "Main Block · Level 2", status: "LIVE" },
  { id: 5, name: "Surveillance Tower – Roof Cam", location: "HQ Rooftop Watch", status: "LIVE" },
  { id: 6, name: "Perimeter Fence – South Sector", location: "South Perimeter · Zone C", status: "LIVE" },
  { id: 7, name: "Internal Corridor – Block B", location: "Admin Wing · Level 1", status: "LIVE" },
];

const LiveFeedsSection = () => {
  const [cameras, setCameras] = useState(initialCameras);
  const [activeCamera, setActiveCamera] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [newCamera, setNewCamera] = useState({
    ip: "",
    user: "",
    port: "554",
    password: "",
    channel: "101",
    name: "",
    location: "",
  });

  // Remove webcam streams since we're using static images for all cams
  const videoRefs = useRef({}); // refs to video DOM elements keyed by cam id

  // Image sources for cameras 3, 5, 6, 7
  const staticCamImages = {
    3: cam03Img,  // Added camera 03
    5: cam05Img,
    6: cam06Img,
    7: cam07Img
  };



  // Robust loop setup for sample videos: ensures loop property + ended handler
  useEffect(() => {
    const sampleIds = [1, 2, 4]; // cams showing local mp4s
    const handlers = [];

    sampleIds.forEach((id) => {
      const el = videoRefs.current[id];
      if (!el) return;

      el.muted = true;
      el.playsInline = true;
      el.preload = "auto";
      el.loop = true;

      const onEnded = () => {
        try {
          if (el.duration && !isNaN(el.duration)) el.currentTime = 0;
          const p = el.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        } catch (_err) { /* empty */ }
      };

      el.addEventListener("ended", onEnded);
      handlers.push({ el, onEnded });

      const p = el.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    });

    return () => {
      handlers.forEach(({ el, onEnded }) => {
        try {
          el.removeEventListener("ended", onEnded);
        } catch (_err) { /* empty */ }
      });
    };
  });

  // Removed webcam stream setup useEffect since we're using static images

  // ---------- add-camera and form logic ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCamera({
      ...newCamera,
      [name]: value,
    });
    setErrorMsg("");
  };

  const handleAddCamera = async () => {
    if (!newCamera.ip) {
      setErrorMsg("Enter IP address or paste full RTSP URL in IP field.");
      return;
    }

    setLoadingAdd(true);
    setErrorMsg("");

    try {
      const newId = Math.max(...cameras.map((c) => c.id)) + 1;

      let payload;
      const ipLower = (newCamera.ip || "").trim();

      if (ipLower.toLowerCase().startsWith("rtsp://")) {
        payload = {
          id: newId,
          name: newCamera.name || `Camera ${newId}`,
          location: newCamera.location || "New Location",
          rtsp_url: newCamera.ip.trim(),
        };
      } else {
        payload = {
          id: newId,
          name: newCamera.name || `Camera ${newId}`,
          location: newCamera.location || "New Location",
          connection: {
            ip: newCamera.ip.trim(),
            user: newCamera.user,
            password: newCamera.password,
            port: newCamera.port || "554",
            channel: newCamera.channel || "101",
          },
        };
      }

      // POST to backend (which should spawn/return started: true)
      const resp = await axios.post(`${API_BASE}/add_camera`, payload, {
        timeout: 30000,
      });

      if (resp && resp.data && resp.data.started) {
        const cameraToAdd = {
          id: newId,
          name: payload.name,
          location: payload.location,
          status: "LIVE",
          connectionDetails: payload.connection || { rtsp_url: payload.rtsp_url },
        };

        // add camera to grid — now grid will immediately show its feed (image)
        setCameras((prev) => [...prev, cameraToAdd]);

        setNewCamera({
          ip: "",
          user: "",
          port: "554",
          password: "",
          channel: "101",
          name: "",
          location: "",
        });
        setShowAddForm(false);
      } else {
        const serverMsg = (resp && resp.data && resp.data.error) || "Backend didn't confirm start.";
        setErrorMsg(serverMsg);
      }
    } catch (err) {
      console.error("Add camera error:", err);
      if (err.code === "ECONNABORTED" || (err.message && err.message.includes("timeout"))) {
        setErrorMsg("Request timed out. Backend may be slow or RTSP unreachable.");
      } else if (err.message && err.message.toLowerCase().includes("network error")) {
        setErrorMsg(`Network error: cannot reach backend at ${API_BASE}. Is server running?`);
      } else if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(`Backend error: ${err.response.data.error}`);
      } else {
        setErrorMsg("Failed to add camera. Check browser console and backend logs.");
      }
    } finally {
      setLoadingAdd(false);
    }
  };

  // ---------- UI ----------
  return (
    <>
      <div className="camera-grid">
        {cameras.map((cam) => {
          const offline = cam.status !== "LIVE";
          const camId = cam.id.toString().padStart(2, "0");

          // choose video source for specific cams
          const isSample1 = cam.id === 1;
          const isSample2 = cam.id === 2;
          const isSample3 = cam.id === 4;
          const isStaticImageCam = [3, 5, 6, 7].includes(cam.id); // Added camera 3

          return (
            <div
              key={cam.id}
              className={`camera-card ${offline ? "camera-card-offline" : ""}`}
              onClick={() => setActiveCamera(cam)}
            >
              <div className="camera-video">
                <div className="overlay-chip overlay-camid">CAM {camId}</div>

                <div
                  className={`overlay-chip overlay-status ${
                    offline ? "overlay-status-offline" : "overlay-status-live"
                  }`}
                >
                  <span className="overlay-dot" />
                  {offline ? "NO FEED" : "LIVE"}
                </div>

                {/* Video / Live handling inside grid cards */}
                {isSample1 ? (
                  <video
                    ref={(el) => (videoRefs.current[cam.id] = el)}
                    src={sampleVideo1}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="camera-video-element"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : isSample2 ? (
                  <video
                    ref={(el) => (videoRefs.current[cam.id] = el)}
                    src={sampleVideo2}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="camera-video-element"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : isSample3 ? (
                  <video
                    ref={(el) => (videoRefs.current[cam.id] = el)}
                    src={sampleVideo3}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="camera-video-element"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : isStaticImageCam ? (
                  // Static images for cameras 3, 5, 6, 7
                  <img
                    src={staticCamImages[cam.id]}
                    alt={`Camera ${cam.id}`}
                    className="camera-video-element"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      console.error(`Failed to load image for camera ${cam.id}:`, e);
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement('span');
                        fallback.className = "camera-video-center";
                        fallback.textContent = "NO FEED";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : offline ? (
                  <span className="camera-video-center">NO FEED</span>
                ) : (
                  // For normal LIVE cameras (including newly added ones), show the backend stream image
                  <img
                    alt={`cam-${cam.id}`}
                    src={`${API_BASE}/camera_stream/${cam.id}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      // fallback text if backend stream fails
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

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

        {/* Add camera card */}
        <div className="camera-card add-camera-card" onClick={() => setShowAddForm(true)}>
          <div className="camera-video">
            <div className="overlay-chip overlay-camid">ADD NEW</div>
            <span className="camera-video-center add-camera-plus">+</span>
            <div className="overlay-bottom">
              <div className="overlay-text-block">
                <span className="overlay-name add-camera-text">Add New Camera</span>
                <span className="overlay-location">Click to configure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active camera modal */}
      {activeCamera && (
        <div className="camera-modal-overlay" onClick={() => setActiveCamera(null)}>
          <div className="camera-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="camera-modal-header">
              <div className="camera-modal-title">
                <h3>{activeCamera.name}</h3>
                <span>
                  CAM {activeCamera.id.toString().padStart(2, "0")} · {activeCamera.location}
                </span>
              </div>
              <button className="camera-modal-close" onClick={() => setActiveCamera(null)}>
                ×
              </button>
            </div>

            <div className="camera-modal-video">
              {/* modal view: show same source but larger */}
              {activeCamera.id === 1 ? (
                <video
                  src={sampleVideo1}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
                />
              ) : activeCamera.id === 2 ? (
                <video
                  src={sampleVideo2}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
                />
              ) : activeCamera.id === 4 ? (
                <video
                  src={sampleVideo3}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
                />
              ) : activeCamera.id === 3 || activeCamera.id === 5 || activeCamera.id === 6 || activeCamera.id === 7 ? (
                // Static images for cameras 3, 5, 6, 7 in modal
                <img
                  src={staticCamImages[activeCamera.id]}
                  alt={`Camera ${activeCamera.id}`}
                  style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
                  onError={(e) => {
                    console.error(`Failed to load modal image for camera ${activeCamera.id}:`, e);
                    // Create fallback
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.style = {
                        width: '100%',
                        height: '520px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#222',
                        color: '#aaa',
                        fontSize: '18px'
                      };
                      fallback.textContent = 'NO FEED AVAILABLE';
                      container.appendChild(fallback);
                    }
                  }}
                />
              ) : activeCamera.status === "LIVE" ? (
                <img
                  style={{ width: "100%", maxHeight: "520px", objectFit: "cover" }}
                  alt={`cam-${activeCamera.id}`}
                  src={`${API_BASE}/camera_stream/${activeCamera.id}`}
                />
              ) : (
                <div style={{ 
                  width: "100%", 
                  height: "520px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  backgroundColor: "#222",
                  color: "#aaa",
                  fontSize: "18px"
                }}>
                  NO FEED AVAILABLE
                </div>
              )}
            </div>

            <div className="camera-modal-footer">
              <span>Status: {activeCamera.status.toUpperCase()}</span>
              <span>Click outside or × to close</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Camera Form Modal */}
      {showAddForm && (
        <div className="camera-modal-overlay add-camera-modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="camera-modal-content add-camera-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="add-camera-modal-header">
              <div className="add-camera-modal-title">
                <h3>Add New Camera</h3>
                <span>Enter camera connection details — OR paste full RTSP URL in the IP field</span>
              </div>
              <button className="add-camera-modal-close" onClick={() => setShowAddForm(false)}>
                ×
              </button>
            </div>

            <div className="add-camera-form">
              <div className="form-grid">
                <div className="form-field">
                  <label>IP Address / RTSP URL *</label>
                  <input
                    type="text"
                    name="ip"
                    value={newCamera.ip}
                    onChange={handleInputChange}
                    placeholder="192.168.1.100  OR  rtsp://admin:password@192.168.0.100:554/Streaming/Channels/101"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Username</label>
                  <input
                    type="text"
                    name="user"
                    value={newCamera.user}
                    onChange={handleInputChange}
                    placeholder="admin"
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newCamera.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Port</label>
                    <input
                      type="text"
                      name="port"
                      value={newCamera.port}
                      onChange={handleInputChange}
                      placeholder="554"
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Channel</label>
                    <input
                      type="text"
                      name="channel"
                      value={newCamera.channel}
                      onChange={handleInputChange}
                      placeholder="101"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Camera Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCamera.name}
                    onChange={handleInputChange}
                    placeholder="Camera Name (optional)"
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newCamera.location}
                    onChange={handleInputChange}
                    placeholder="Location (optional)"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {errorMsg && <div style={{ color: "crimson", padding: "8px 12px" }}>{errorMsg}</div>}

            <div className="add-camera-form-footer">
              <button onClick={() => setShowAddForm(false)} className="add-form-button add-form-button-cancel">
                Cancel
              </button>
              <button
                onClick={handleAddCamera}
                disabled={!newCamera.ip || loadingAdd}
                className="add-form-button add-form-button-add"
              >
                {loadingAdd ? "Starting..." : "Add Camera"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveFeedsSection;