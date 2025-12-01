// // useLiveAnalysis.jsx
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// export default function useLiveAnalysis() {
//   const [liveVideoInfo, setLiveVideoInfo] = useState(null);
//   const [liveFrames, setLiveFrames] = useState([]);

//   useEffect(() => {
//     const socket = io("http://localhost:5000", {
//       transports: ["websocket"]
//     });

//     socket.on("connect", () => {
//       console.log("⚡ React Connected:", socket.id);
//     });

//     // 🔥🔥 ADD THIS HERE — to check if frontend is receiving event
//     socket.on("liveEvent", (data) => {
//       console.log("🔥🔥 FRONTEND RECEIVED:", data);

//       // If we get duration → treat as video info
//       if (data.videoDuration) {
//         setLiveVideoInfo({
//           videoName: data.videoName,
//           videoDuration: data.videoDuration
//         });
//       }

//       // If we get imageUrl → treat as a frame
//       if (data.imageUrl) {
//         setLiveFrames((prev) => [...prev, data]);
//       }
//     });

//     return () => socket.disconnect();
//   }, []);

//   return { liveVideoInfo, liveFrames };
// }



// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// export default function useLiveAnalysis() {
//   const [liveVideoInfo, setLiveVideoInfo] = useState(null);
//   const [liveFrames, setLiveFrames] = useState([]);

//   useEffect(() => {
//     console.log("🔌 Attempting WebSocket connection to backend...");

//     const socket = io("http://localhost:5000", {
//       transports: ["websocket"],
//       reconnectionAttempts: 10,
//       reconnectionDelay: 500,
//     });

//     socket.on("connect_error", (err) => {
//       console.error("❌ SOCKET CONNECTION ERROR:", err.message);
//     });

//     socket.on("connect", () => {
//       console.log("⚡ SOCKET CONNECTED:", socket.id);
//     });

//     socket.on("disconnect", () => {
//       console.warn("🔴 SOCKET DISCONNECTED");
//     });

//     socket.on("liveEvent", (data) => {
//       console.log("🔥🔥 FRONTEND RECEIVED:", data);

//       if (data.videoDuration) {
//         setLiveVideoInfo({
//           videoName: data.videoName,
//           videoDuration: data.videoDuration,
//         });
//       }

//       if (data.imageUrl) {
//         setLiveFrames((prev) => [...prev, data]);
//       }
//     });

//     return () => socket.close();
//   }, []);

//   return { liveVideoInfo, liveFrames };
// }



// useLiveAnalysis.jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useLiveAnalysis() {
  const [liveVideoInfo, setLiveVideoInfo] = useState(null);
  const [liveFrames, setLiveFrames] = useState([]);

  useEffect(() => {
    console.log("🔌 Attempting WebSocket connection to backend...");

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
    });

    // Debug logs
    socket.on("connect_error", (err) => {
      console.error("❌ SOCKET CONNECTION ERROR:", err.message);
    });

    socket.on("connect", () => {
      console.log("⚡ SOCKET CONNECTED:", socket.id);
    });

    socket.on("disconnect", () => {
      console.warn("🔴 SOCKET DISCONNECTED");
    });

    // ============================================================
    // RECEIVE LIVE EVENTS FROM BACKEND
    // ============================================================
    socket.on("liveEvent", (data) => {
      console.log("🔥🔥 FRONTEND RECEIVED LIVE EVENT:", data);

      // Case 1: Video info event
      if (data.videoDuration) {
        setLiveVideoInfo({
          videoName: data.videoName,
          videoDuration: data.videoDuration,
        });
      }

      // Case 2: Frame event
      if (data.imageUrl) {
        setLiveFrames((prev) => [...prev, data]);
      }
    });

    return () => socket.close();
  }, []);

  return { liveVideoInfo, liveFrames };
}
