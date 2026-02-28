// import React, { useState } from "react";
// import "./Evidences.css";

// // Live monitoring data
// const liveEvidences = [
//   {
//     id: 1,
//     fileName: "cam_entrance_north_live",
//     uploadedAt: "Stream • Platform 3, Central Station",
//     duration: "12:45:30",
//     events: 3,
//     location: "Platform 3, Central Station",
//     status: "Active Stream",
//   },
//   {
//     id: 2,
//     fileName: "cam_mall_entrance_live",
//     uploadedAt: "Stream • Mall Entrance - North Gate",
//     duration: "08:22:15",
//     events: 1,
//     location: "Mall Entrance - North Gate",
//     status: "Active Stream",
//   },
//   {
//     id: 3,
//     fileName: "cam_parking_b_live",
//     uploadedAt: "Stream • Parking Zone B",
//     duration: "15:10:45",
//     events: 0,
//     location: "Parking Zone B",
//     status: "Active Stream",
//   },
// ];

// // Uploaded evidence data
// const uploadEvidences = [
//   {
//     id: 1,
//     fileName: "20241208_075812.mp4",
//     uploadedAt: "Dec 08, 2024 • 01:28 PM",
//     duration: "00:01:30",
//     events: 4,
//     location: "Platform 3, Central Station",
//     status: "Reviewed",
//   },
//   {
//     id: 2,
//     fileName: "20241207_221530.mp4",
//     uploadedAt: "Dec 07, 2024 • 10:15 PM",
//     duration: "00:02:10",
//     events: 2,
//     location: "Mall Entrance - North Gate",
//     status: "Pending Review",
//   },
//   {
//     id: 3,
//     fileName: "20241206_181244.mp4",
//     uploadedAt: "Dec 06, 2024 • 06:12 PM",
//     duration: "00:00:58",
//     events: 1,
//     location: "Parking Zone B",
//     status: "Archived",
//   },
// ];

// const Evidences = () => {
//   const [activeTab, setActiveTab] = useState("live");

//   const currentEvidences =
//     activeTab === "live" ? liveEvidences : uploadEvidences;

//   const subtitleText =
//     activeTab === "live"
//       ? "Monitor incoming camera streams and capture key incidents in real time."
//       : "Review processed surveillance footage and AI-generated incident summaries.";

//   return (
//     <div className="evidences-page">
//       {/* Sticky header (like settings page) */}
//       <div className="evidences-header-shell">
//         <header className="evidences-header-main">
//           <div>
//             <h1 className="ev-title">Evidence Center</h1>
//             <p className="ev-subtitle">{subtitleText}</p>
//           </div>
//         </header>

//         <nav className="ev-tabs-row">
//           <button
//             type="button"
//             className={`ev-tab ${activeTab === "live" ? "is-active" : ""}`}
//             onClick={() => setActiveTab("live")}
//           >
//             Live Streams
//           </button>
//           <button
//             type="button"
//             className={`ev-tab ${
//               activeTab === "upload" ? "is-active" : ""
//             }`}
//             onClick={() => setActiveTab("upload")}
//           >
//             Uploaded Footage
//           </button>
//         </nav>
//       </div>

//       {/* Filters row */}
//       <div className="evidences-filters">
//         <div className="search-box">
//           <span className="search-icon" aria-hidden="true">
//             <span className="search-icon-circle" />
//             <span className="search-icon-handle" />
//           </span>
//           <input
//             type="text"
//             placeholder={
//               activeTab === "live"
//                 ? "Search by camera name, location, or stream status"
//                 : "Search by file name, location, or review status"
//             }
//           />
//         </div>
//         <div className="chip-group">
//           <button className="chip chip-active" type="button">
//             All
//           </button>
//           <button className="chip" type="button">
//             With Events
//           </button>
//           <button className="chip" type="button">
//             No Events
//           </button>
//           <button className="chip" type="button">
//             Recent
//           </button>
//         </div>
//       </div>

//       {/* Cards grid */}
//       <div className="evidences-grid">
//         {currentEvidences.map((item) => (
//           <article key={item.id} className="evidence-card">
//             {/* Top row */}
//             <div className="evidence-card-header">
//               <div className="file-info">
//                 <div className="file-icon">
//                   <span
//                     className={`icon ${
//                       activeTab === "live" ? "icon-camera" : "icon-file"
//                     }`}
//                     aria-hidden="true"
//                   />
//                 </div>
//                 <div>
//                   <h3 className="file-name">{item.fileName}</h3>
//                   <p className="file-meta">{item.uploadedAt}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Middle stats */}
//             <div className="evidence-card-body">
//               <div className="stat">
//                 <span className="stat-label">
//                   {activeTab === "live"
//                     ? "Current incidents"
//                     : "Events detected"}
//                 </span>
//                 <span className="stat-value">{item.events}</span>
//               </div>
//               <div className="stat">
//                 <span className="stat-label">
//                   {activeTab === "live" ? "Stream duration" : "Video duration"}
//                 </span>
//                 <span className="stat-value">{item.duration}</span>
//               </div>
//               <div className="stat stat-wide">
//                 <span className="stat-label">Location</span>
//                 <span className="stat-value stat-location">
//                   {item.location}
//                 </span>
//               </div>
//             </div>

//             {/* Summary strip */}
//             <div className="evidence-summary">
//               <span className="summary-label">Summary</span>
//               <p className="summary-text">
//                 {activeTab === "live"
//                   ? "This camera stream is actively monitored. Detected incidents are logged for further analysis and reporting."
//                   : "This recording has been processed by the system. Detected incidents, snapshots, and timelines are available in the detailed report."}
//               </p>
//             </div>

//             {/* Footer */}
//             <div className="evidence-card-footer">
//               <span
//                 className={`status-pill status-${item.status
//                   .split(" ")[0]
//                   .toLowerCase()}`}
//               >
//                 {item.status}
//               </span>
//               <div className="card-actions">
//                 <button className="link-button" type="button">
//                   {activeTab === "live" ? "Open Stream" : "View Report"}
//                 </button>
//                 <button className="btn-primary-small" type="button">
//                   {activeTab === "live" ? "Open Analysis" : "Download PDF"}
//                 </button>
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Evidences;

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import './Evidences.css';

// // Create socket connection
// const socket = io('http://localhost:5000', {
//   transports: ['websocket', 'polling'],
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000
// });

// function Evidences() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [connectionStatus, setConnectionStatus] = useState('Connecting...');
//   const [activeTab, setActiveTab] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [totalEvents, setTotalEvents] = useState(0);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [playingVideo, setPlayingVideo] = useState(null);
  
//   const eventsRef = useRef();
//   eventsRef.current = events;

//   // Fetch initial events from database
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         console.log('Fetching events from database...');
//         const response = await fetch('http://localhost:5000/api/events', {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log('Fetched events:', data);
        
//         // Assuming data is an array of events from database with data property
//         let eventsData = [];
//         if (data.data && Array.isArray(data.data)) {
//           eventsData = data.data;
//         } else if (Array.isArray(data)) {
//           eventsData = data;
//         }
        
//         const sortedEvents = eventsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
//         setEvents(sortedEvents);
//         setTotalEvents(sortedEvents.length);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//         // Fallback to mock data for demo
//         const mockEvents = getMockEvents();
//         setEvents(mockEvents);
//         setTotalEvents(mockEvents.length);
//         setLoading(false);
//       }
//     };

//     fetchEvents();
    
//     // Refresh data every 30 seconds
//     const refreshInterval = setInterval(fetchEvents, 30000);
    
//     return () => clearInterval(refreshInterval);
//   }, []);

//   // Set up socket connection for real-time updates
//   useEffect(() => {
//     console.log('Setting up socket connection...');
    
//     socket.on('connect', () => {
//       console.log('✅ Connected to socket server');
//       setConnectionStatus('Connected');
//     });

//     socket.on('disconnect', (reason) => {
//       console.log('❌ Disconnected from socket server:', reason);
//       setConnectionStatus('Disconnected');
//     });

//     socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       setConnectionStatus('Connection Error');
//     });

//     socket.on('reconnect_attempt', (attemptNumber) => {
//       console.log(`Reconnection attempt ${attemptNumber}`);
//       setConnectionStatus(`Reconnecting... (${attemptNumber})`);
//     });

//     socket.on('reconnect', () => {
//       console.log('✅ Reconnected to socket server');
//       setConnectionStatus('Connected');
//     });

//     // Listen for new events from database
//     socket.on('new-event', (newEvent) => {
//       console.log('📦 New event received from socket:', newEvent);
//       handleNewEvent(newEvent);
//     });

//     // Listen for new frame events
//     socket.on('new-frame', (newFrame) => {
//       console.log('🎥 New frame received from socket:', newFrame);
//       handleNewEvent(newFrame);
//     });

//     // Listen for batch updates
//     socket.on('events-update', (updatedEvents) => {
//       console.log('🔄 Events update received:', updatedEvents);
//       if (Array.isArray(updatedEvents)) {
//         const sortedEvents = updatedEvents.sort((a, b) => 
//           new Date(b.timestamp) - new Date(a.timestamp)
//         );
//         setEvents(sortedEvents);
//         setTotalEvents(sortedEvents.length);
//       }
//     });

//     return () => {
//       console.log('Cleaning up socket listeners...');
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.off('connect_error');
//       socket.off('reconnect_attempt');
//       socket.off('reconnect');
//       socket.off('new-event');
//       socket.off('new-frame');
//       socket.off('events-update');
//     };
//   }, []);

//   // Handle new event from socket
//   const handleNewEvent = (newEvent) => {
//     if (!newEvent || !newEvent.timestamp) {
//       console.error('Invalid event received:', newEvent);
//       return;
//     }

//     console.log('Processing new event:', newEvent);
    
//     // Add new event at the beginning of the array
//     setEvents(prevEvents => {
//       // Check if event already exists to avoid duplicates
//       const exists = prevEvents.some(event => 
//         event.id === newEvent.id || 
//         (event.timestamp === newEvent.timestamp && event.camera_id === newEvent.camera_id)
//       );
      
//       if (exists) {
//         console.log('Event already exists, skipping...');
//         return prevEvents;
//       }
      
//       const updatedEvents = [newEvent, ...prevEvents];
//       console.log('Updated events count:', updatedEvents.length);
//       return updatedEvents;
//     });
    
//     // Increment unread count
//     setUnreadCount(prev => prev + 1);
    
//     // Update total events count
//     setTotalEvents(prev => prev + 1);
    
//     // Show notification
//     showNotification(newEvent);
//   };

//   // Show notification for new event
//   const showNotification = (event) => {
//     // Create notification element
//     const notification = document.createElement('div');
//     notification.className = 'evidences-socket-notification';
    
//     const eventType = event.event_type || 'Event';
//     const cameraId = event.camera_id || 'Unknown Camera';
    
//     notification.innerHTML = `
//       <strong>${eventType.replace('_', ' ')}</strong><br/>
//       Camera: ${cameraId} • ${new Date(event.timestamp).toLocaleTimeString()}
//     `;
    
//     document.body.appendChild(notification);
    
//     // Remove notification after 5 seconds
//     setTimeout(() => {
//       notification.style.opacity = '0';
//       notification.style.transform = 'translateX(100%)';
//       setTimeout(() => {
//         if (notification.parentNode) {
//           notification.parentNode.removeChild(notification);
//         }
//       }, 300);
//     }, 5000);
//   };

//   // Format timestamp for display
//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'Unknown time';
    
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) return 'Invalid date';
      
//       const now = new Date();
//       const diffMs = now - date;
//       const diffMins = Math.floor(diffMs / 60000);
//       const diffHours = Math.floor(diffMs / 3600000);
//       const diffDays = Math.floor(diffMs / 86400000);
      
//       if (diffMins < 1) return 'Just now';
//       if (diffMins < 60) return `${diffMins}m ago`;
//       if (diffHours < 24) return `${diffHours}h ago`;
//       if (diffDays < 7) return `${diffDays}d ago`;
      
//       return date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid date';
//     }
//   };

//   // Generate summary based on event type
//   const generateSummary = (event) => {
//     if (!event.event_type) return 'Event detected by surveillance system';
    
//     switch(event.event_type) {
//       case 'FACE_MATCH':
//         const confidence = event.confidence || event.data?.confidence || 'High';
//         return `Face match detected with ${confidence} confidence`;
//       case 'INTRUSION':
//         return 'Security intrusion detected in restricted area';
//       case 'ANOMALY':
//         return 'Anomalous behavior detected';
//       case 'VIOLENCE':
//         return 'Violent activity detected';
//       default:
//         return `${event.event_type.replace('_', ' ')} event detected`;
//     }
//   };

//   // Get event type class
//   const getEventTypeClass = (eventType) => {
//     if (!eventType) return '';
    
//     switch(eventType.toLowerCase()) {
//       case 'face_match':
//         return 'evidences-event-type-face-match';
//       case 'intrusion':
//         return 'evidences-event-type-object-detected';
//       case 'anomaly':
//         return 'evidences-event-type-unknown-face';
//       case 'violence':
//         return 'evidences-event-type-motion-detected';
//       default:
//         return 'evidences-event-type-motion-detected';
//     }
//   };

//   // Filter events based on active tab and search
//   const getFilteredEvents = () => {
//     let filtered = [...events];
    
//     // Filter by tab
//     if (activeTab !== 'all') {
//       filtered = filtered.filter(event => {
//         const eventType = event.event_type?.toLowerCase() || '';
//         switch(activeTab) {
//           case 'face':
//             return eventType.includes('face');
//           case 'motion':
//             return eventType.includes('anomaly') || eventType.includes('violence');
//           case 'objects':
//             return eventType.includes('intrusion');
//           default:
//             return true;
//         }
//       });
//     }
    
//     // Filter by search query
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(event => 
//         (event.event_type?.toLowerCase().includes(query)) ||
//         (event.camera_id?.toLowerCase().includes(query)) ||
//         (generateSummary(event).toLowerCase().includes(query)) ||
//         (event.timestamp?.toLowerCase().includes(query))
//       );
//     }
    
//     // Filter by time filter
//     if (activeFilter !== 'all') {
//       const now = new Date();
//       filtered = filtered.filter(event => {
//         if (!event.timestamp) return false;
        
//         const eventDate = new Date(event.timestamp);
//         if (isNaN(eventDate.getTime())) return false;
        
//         const diffMs = now - eventDate;
//         const diffDays = Math.floor(diffMs / 86400000);
        
//         switch(activeFilter) {
//           case 'today':
//             return diffDays === 0;
//           case 'week':
//             return diffDays < 7;
//           case 'critical':
//             return event.event_type === 'INTRUSION' || 
//                    event.event_type === 'VIOLENCE' ||
//                    (event.confidence && parseFloat(event.confidence) < 80);
//           default:
//             return true;
//         }
//       });
//     }
    
//     return filtered;
//   };

//   // Mark all as read
//   const markAllAsRead = () => {
//     setUnreadCount(0);
//   };

//   // Clear all events (for testing)
//   const clearEvents = () => {
//     if (window.confirm('Are you sure you want to clear all events?')) {
//       setEvents([]);
//       setTotalEvents(0);
//       setUnreadCount(0);
//     }
//   };

//   // Handle video play/pause
//   const handleVideoPlay = (videoId) => {
//     setPlayingVideo(videoId);
//   };

//   const handleVideoPause = () => {
//     setPlayingVideo(null);
//   };

//   // Get mock events for fallback with video URLs
//   const getMockEvents = () => {
//     return [
//       {
//         id: '1',
//         event_type: 'FACE_MATCH',
//         camera_id: 'CAM_01',
//         timestamp: new Date(Date.now() - 300000).toISOString(),
//         confidence: '98.7%',
//         data: {
//           video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//           person_id: 'EMP_001'
//         }
//       },
//       {
//         id: '2',
//         event_type: 'INTRUSION',
//         camera_id: 'CAM_03',
//         timestamp: new Date(Date.now() - 900000).toISOString(),
//         data: {
//           video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
//         }
//       },
//       {
//         id: '3',
//         event_type: 'ANOMALY',
//         camera_id: 'CAM_02',
//         timestamp: new Date(Date.now() - 1800000).toISOString(),
//         data: {
//           video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
//         }
//       },
//       {
//         id: '4',
//         event_type: 'VIOLENCE',
//         camera_id: 'CAM_04',
//         timestamp: new Date(Date.now() - 2400000).toISOString(),
//         data: {
//           video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
//         }
//       }
//     ];
//   };

//   // Get filtered events
//   const filteredEvents = getFilteredEvents();

//   return (
//     <div className="evidences-container">
//       {/* Sticky header shell */}
//       <div className="evidences-header-shell">
//         <div className="evidences-header-main">
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div>
//               <h1 className="ev-title">Evidence Dashboard</h1>
//               <p className="ev-subtitle">Real-time surveillance evidence with live updates</p>
//             </div>
//             <div className="evidences-header-stats">
//               <div className="evidences-stat-item">
//                 <div className="evidences-stat-item-value">{totalEvents}</div>
//                 <div className="evidences-stat-item-label">Total Events</div>
//               </div>
//               <div className="evidences-stat-item">
//                 <div className="evidences-stat-item-value">{filteredEvents.length}</div>
//                 <div className="evidences-stat-item-label">Filtered</div>
//               </div>
//               {unreadCount > 0 && (
//                 <div className="evidences-stat-item" style={{ background: '#fef3c7' }}>
//                   <div className="evidences-stat-item-value" style={{ color: '#92400e' }}>
//                     {unreadCount} new
//                   </div>
//                   <div className="evidences-stat-item-label" style={{ color: '#92400e' }}>
//                     <button 
//                       onClick={markAllAsRead}
//                       style={{ 
//                         background: 'none', 
//                         border: 'none', 
//                         color: '#92400e', 
//                         cursor: 'pointer',
//                         textDecoration: 'underline',
//                         fontSize: '0.75rem'
//                       }}
//                     >
//                       Mark read
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="ev-tabs-row">
//           <button 
//             className={`ev-tab ${activeTab === 'all' ? 'is-active' : ''}`}
//             onClick={() => setActiveTab('all')}
//           >
//             All Events
//           </button>
//           <button 
//             className={`ev-tab ${activeTab === 'face' ? 'is-active' : ''}`}
//             onClick={() => setActiveTab('face')}
//           >
//             Face Recognition
//           </button>
//           <button 
//             className={`ev-tab ${activeTab === 'motion' ? 'is-active' : ''}`}
//             onClick={() => setActiveTab('motion')}
//           >
//             Anomaly Detection
//           </button>
//           <button 
//             className={`ev-tab ${activeTab === 'objects' ? 'is-active' : ''}`}
//             onClick={() => setActiveTab('objects')}
//           >
//             Intrusion
//           </button>
//         </div>
//       </div>

//       {/* Filters row */}
//       <div className="evidences-filters">
//         <div className="evidences-search-box">
//           <div className="evidences-search-icon">
//             <div className="evidences-search-icon-circle"></div>
//             <div className="evidences-search-icon-handle"></div>
//           </div>
//           <input 
//             type="text" 
//             placeholder="Search by camera, event type, or timestamp..." 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <div className="evidences-chip-group">
//           <button 
//             className={`evidences-chip ${activeFilter === 'all' ? 'evidences-chip-active' : ''}`}
//             onClick={() => setActiveFilter('all')}
//           >
//             All
//           </button>
//           <button 
//             className={`evidences-chip ${activeFilter === 'today' ? 'evidences-chip-active' : ''}`}
//             onClick={() => setActiveFilter('today')}
//           >
//             Today
//           </button>
//           <button 
//             className={`evidences-chip ${activeFilter === 'week' ? 'evidences-chip-active' : ''}`}
//             onClick={() => setActiveFilter('week')}
//           >
//             This Week
//           </button>
//           <button 
//             className={`evidences-chip ${activeFilter === 'critical' ? 'evidences-chip-active' : ''}`}
//             onClick={() => setActiveFilter('critical')}
//           >
//             Critical
//           </button>
//         </div>

//         <div className={`evidences-connection-status ${connectionStatus.toLowerCase().replace(/ /g, '-')}`}>
//           <span className="evidences-status-dot"></span>
//           {connectionStatus}
//         </div>
//       </div>

//       {/* Connection status bar */}
//       {connectionStatus !== 'Connected' && (
//         <div style={{
//           background: '#fef3c7',
//           border: '1px solid #fbbf24',
//           borderRadius: '8px',
//           padding: '8px 12px',
//           marginBottom: '16px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <span style={{ color: '#92400e' }}>⚠️ {connectionStatus}</span>
//             <span style={{ fontSize: '0.8rem', color: '#92400e' }}>
//               {connectionStatus.includes('Reconnecting') ? 'Attempting to reconnect...' : 'Real-time updates paused'}
//             </span>
//           </div>
//           <button 
//             onClick={() => socket.connect()}
//             style={{
//               background: '#2563eb',
//               color: 'white',
//               border: 'none',
//               padding: '4px 12px',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '0.8rem'
//             }}
//           >
//             Reconnect
//           </button>
//         </div>
//       )}

//       {/* Main content */}
//       {loading ? (
//         <div className="evidences-loading">
//           <div className="evidences-loading-spinner"></div>
//           <p>Loading events from database...</p>
//           <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '8px' }}>
//             Connecting to socket server for real-time updates...
//           </p>
//         </div>
//       ) : filteredEvents.length === 0 ? (
//         <div className="evidences-no-events">
//           <h3>No events found</h3>
//           <p>{searchQuery || activeTab !== 'all' || activeFilter !== 'all' 
//             ? 'Try changing your filters or search query'
//             : 'Waiting for new events...'}
//           </p>
//           {events.length === 0 && connectionStatus === 'Connected' && (
//             <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '8px' }}>
//               Socket connected. Events will appear here when detected.
//             </p>
//           )}
//         </div>
//       ) : (
//         <>
//           <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
//               Showing {filteredEvents.length} of {totalEvents} events
//               {unreadCount > 0 && (
//                 <span style={{ marginLeft: '12px', color: '#2563eb', fontWeight: '500' }}>
//                   • {unreadCount} new event{unreadCount !== 1 ? 's' : ''}
//                 </span>
//               )}
//             </div>
//             <div className="evidences-chip-group">
//               <span className="evidences-chip" style={{ cursor: 'default', background: '#f8fafc' }}>
//                 Latest first
//               </span>
//             </div>
//           </div>
          
//           <div className="evidences-grid">
//             {filteredEvents.map((event, index) => (
//               <div className="evidences-card" key={event.id || index}>
//                 <div className="evidences-card-header">
//                   <div className="evidences-file-info">
//                     <div className="evidences-file-icon">
//                       <div className="icon-camera"></div>
//                     </div>
//                     <div>
//                       <div className="evidences-file-name">
//                         {event.event_type ? event.event_type.replace(/_/g, ' ') : 'Unknown Event'}
//                       </div>
//                       <div className="evidences-file-meta">
//                         Camera: {event.camera_id || 'Unknown'} • {formatTimestamp(event.timestamp)}
//                       </div>
//                     </div>
//                   </div>
//                   <span className={`evidences-event-type ${getEventTypeClass(event.event_type)}`}>
//                     {event.event_type ? event.event_type.replace(/_/g, ' ') : 'Event'}
//                   </span>
//                 </div>
                
//                 <div className="evidences-video-container">
//                   <video 
//                     src={event.data?.video || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'}
//                     className="evidences-event-video"
//                     controls
//                     preload="metadata"
//                     playsInline
//                     onPlay={() => handleVideoPlay(event.id || index)}
//                     onPause={handleVideoPause}
//                     poster={event.data?.thumbnail || 'https://via.placeholder.com/320x180/4f46e5/ffffff?text=Video+Preview'}
//                   >
//                     Your browser does not support the video tag.
//                   </video>
//                   <div className="evidences-video-overlay">
//                     <span className="evidences-video-duration">
//                       <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ marginRight: '4px' }}>
//                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
//                       </svg>
//                       Play Video
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="evidences-card-body">
//                   <div className="evidences-stat">
//                     <span className="evidences-stat-label">Timestamp</span>
//                     <span className="evidences-stat-value">
//                       {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Unknown'}
//                     </span>
//                   </div>
                  
//                   <div className="evidences-stat">
//                     <span className="evidences-stat-label">Camera ID</span>
//                     <span className="evidences-stat-value evidences-stat-location">
//                       {event.camera_id || 'N/A'}
//                     </span>
//                   </div>
                  
//                   {event.confidence && (
//                     <div className="evidences-stat">
//                       <span className="evidences-stat-label">Confidence</span>
//                       <span className="evidences-stat-value" style={{ 
//                         color: parseFloat(event.confidence) > 90 ? '#166534' : 
//                                parseFloat(event.confidence) > 80 ? '#854d0e' : '#991b1b'
//                       }}>
//                         {event.confidence}
//                       </span>
//                     </div>
//                   )}
                  
//                   <div className="evidences-stat evidences-stat-wide">
//                     <span className="evidences-stat-label">Location</span>
//                     <span className="evidences-stat-value">
//                       {event.location || event.data?.location || 'Camera ' + (event.camera_id || 'Unknown')}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="evidences-summary-strip">
//                   <div className="evidences-summary-label">Event Summary</div>
//                   <div className="evidences-summary-text">{generateSummary(event)}</div>
//                 </div>
                
//                 <div className="evidences-card-footer">
//                   <div className="evidences-event-id">
//                     {event.id ? `ID: ${event.id.substring(0, 8)}...` : `#${index + 1}`}
//                     {index === 0 && events[0]?.timestamp === event.timestamp && (
//                       <span style={{ 
//                         marginLeft: '8px', 
//                         fontSize: '0.7rem',
//                         color: '#2563eb',
//                         fontWeight: '600'
//                       }}>
//                         NEW
//                       </span>
//                     )}
//                   </div>
//                   <div className="evidences-realtime-indicator">
//                     <span className="evidences-live-dot"></span>
//                     {index < 3 ? 'Live Now' : 'Recorded'}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Evidences; 


// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import './Evidences.css';

// // Create socket connection
// const socket = io('http://localhost:5000', {
//   transports: ['websocket', 'polling'],
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000
// });

// function Evidences() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [connectionStatus, setConnectionStatus] = useState('Connecting...');
//   const [activeTab, setActiveTab] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [totalEvents, setTotalEvents] = useState(0);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [playingVideo, setPlayingVideo] = useState(null);
  
//   const eventsRef = useRef();
//   eventsRef.current = events;

//   // Fetch initial events from database
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         console.log('Fetching events from database...');
//         const response = await fetch('http://localhost:5000/api/events', {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log('Fetched events:', data);
        
//         // Assuming data is an array of events from database
//         let eventsData = [];
//         if (data.data && Array.isArray(data.data)) {
//           eventsData = data.data;
//         } else if (Array.isArray(data)) {
//           eventsData = data;
//         }
        
//         // Process events to handle different data structures
//         const processedEvents = eventsData.map(event => {
//           return {
//             ...event,
//             // Normalize the data structure
//             data: event.data || {},
//             confidence: event.confidence || event.data?.confidence || null,
//             description: event.description || event.data?.description || null,
//             location: event.location || event.data?.location || null,
//             video: event.data?.video || event.video || null,
//             image: event.data?.image || event.image || null,
//             persons: event.data?.persons || event.persons || []
//           };
//         });
        
//         const sortedEvents = processedEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
//         setEvents(sortedEvents);
//         setTotalEvents(sortedEvents.length);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//         // Fallback to mock data for demo
//         const mockEvents = getMockEvents();
//         setEvents(mockEvents);
//         setTotalEvents(mockEvents.length);
//         setLoading(false);
//       }
//     };

//     fetchEvents();
    
//     // Refresh data every 30 seconds
//     const refreshInterval = setInterval(fetchEvents, 30000);
    
//     return () => clearInterval(refreshInterval);
//   }, []);

//   // Set up socket connection for real-time updates
//   useEffect(() => {
//     console.log('Setting up socket connection...');
    
//     socket.on('connect', () => {
//       console.log('✅ Connected to socket server');
//       setConnectionStatus('Connected');
//     });

//     socket.on('disconnect', (reason) => {
//       console.log('❌ Disconnected from socket server:', reason);
//       setConnectionStatus('Disconnected');
//     });

//     socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       setConnectionStatus('Connection Error');
//     });

//     socket.on('reconnect_attempt', (attemptNumber) => {
//       console.log(`Reconnection attempt ${attemptNumber}`);
//       setConnectionStatus(`Reconnecting... (${attemptNumber})`);
//     });

//     socket.on('reconnect', () => {
//       console.log('✅ Reconnected to socket server');
//       setConnectionStatus('Connected');
//     });

//     // Listen for new events from database
//     socket.on('new-event', (newEvent) => {
//       console.log('📦 New event received from socket:', newEvent);
//       handleNewEvent(newEvent);
//     });

//     // Listen for new frame events
//     socket.on('new-frame', (newFrame) => {
//       console.log('🎥 New frame received from socket:', newFrame);
//       handleNewEvent(newFrame);
//     });

//     // Listen for batch updates
//     socket.on('events-update', (updatedEvents) => {
//       console.log('🔄 Events update received:', updatedEvents);
//       if (Array.isArray(updatedEvents)) {
//         // Process events to normalize structure
//         const processedEvents = updatedEvents.map(event => ({
//           ...event,
//           data: event.data || {},
//           confidence: event.confidence || event.data?.confidence || null,
//           description: event.description || event.data?.description || null,
//           location: event.location || event.data?.location || null,
//           video: event.data?.video || event.video || null,
//           image: event.data?.image || event.image || null,
//           persons: event.data?.persons || event.persons || []
//         }));
        
//         const sortedEvents = processedEvents.sort((a, b) => 
//           new Date(b.timestamp) - new Date(a.timestamp)
//         );
//         setEvents(sortedEvents);
//         setTotalEvents(sortedEvents.length);
//       }
//     });

//     return () => {
//       console.log('Cleaning up socket listeners...');
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.off('connect_error');
//       socket.off('reconnect_attempt');
//       socket.off('reconnect');
//       socket.off('new-event');
//       socket.off('new-frame');
//       socket.off('events-update');
//     };
//   }, []);

//   // Handle new event from socket
//   const handleNewEvent = (newEvent) => {
//     if (!newEvent || !newEvent.timestamp) {
//       console.error('Invalid event received:', newEvent);
//       return;
//     }

//     console.log('Processing new event:', newEvent);
    
//     // Process the new event to normalize structure
//     const processedEvent = {
//       ...newEvent,
//       data: newEvent.data || {},
//       confidence: newEvent.confidence || newEvent.data?.confidence || null,
//       description: newEvent.description || newEvent.data?.description || null,
//       location: newEvent.location || newEvent.data?.location || null,
//       video: newEvent.data?.video || newEvent.video || null,
//       image: newEvent.data?.image || newEvent.image || null,
//       persons: newEvent.data?.persons || newEvent.persons || []
//     };
    
//     // Add new event at the beginning of the array
//     setEvents(prevEvents => {
//       // Check if event already exists to avoid duplicates
//       const exists = prevEvents.some(event => 
//         event.id === processedEvent.id || 
//         (event.timestamp === processedEvent.timestamp && event.camera_id === processedEvent.camera_id)
//       );
      
//       if (exists) {
//         console.log('Event already exists, skipping...');
//         return prevEvents;
//       }
      
//       const updatedEvents = [processedEvent, ...prevEvents];
//       console.log('Updated events count:', updatedEvents.length);
//       return updatedEvents;
//     });
    
//     // Increment unread count
//     setUnreadCount(prev => prev + 1);
    
//     // Update total events count
//     setTotalEvents(prev => prev + 1);
    
//     // Show notification
//     showNotification(processedEvent);
//   };

//   // Show notification for new event
//   const showNotification = (event) => {
//     // Create notification element
//     const notification = document.createElement('div');
//     notification.className = 'evidences-socket-notification';
    
//     const eventType = event.event_type || 'Event';
//     const cameraId = event.camera_id || 'Unknown Camera';
    
//     notification.innerHTML = `
//       <strong>${eventType.replace('_', ' ')}</strong><br/>
//       Camera: ${cameraId} • ${new Date(event.timestamp).toLocaleTimeString()}
//     `;
    
//     document.body.appendChild(notification);
    
//     // Remove notification after 5 seconds
//     setTimeout(() => {
//       notification.style.opacity = '0';
//       notification.style.transform = 'translateX(100%)';
//       setTimeout(() => {
//         if (notification.parentNode) {
//           notification.parentNode.removeChild(notification);
//         }
//       }, 300);
//     }, 5000);
//   };

//   // Format timestamp for display
//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'Unknown time';
    
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) return 'Invalid date';
      
//       const now = new Date();
//       const diffMs = now - date;
//       const diffMins = Math.floor(diffMs / 60000);
//       const diffHours = Math.floor(diffMs / 3600000);
//       const diffDays = Math.floor(diffMs / 86400000);
      
//       if (diffMins < 1) return 'Just now';
//       if (diffMins < 60) return `${diffMins}m ago`;
//       if (diffHours < 24) return `${diffHours}h ago`;
//       if (diffDays < 7) return `${diffDays}d ago`;
      
//       return date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid date';
//     }
//   };

//   // Generate summary based on event type
//   const generateSummary = (event) => {
//     if (!event.event_type) return 'Event detected by surveillance system';
    
//     switch(event.event_type) {
//       case 'VIDEO_RECORDED':
//         return 'Video recording captured by camera';
//       case 'FACE_MATCH':
//         const persons = event.persons || event.data?.persons || [];
//         if (persons.length > 0) {
//           const names = persons.map(p => p.name).join(', ');
//           return `Face match detected: ${names}`;
//         }
//         return 'Face match detected';
//       case 'INTRUSION':
//         return 'Security intrusion detected in restricted area';
//       case 'ANOMALY':
//         return 'Anomalous behavior detected';
//       case 'VIOLENCE':
//         return 'Violent activity detected';
//       default:
//         return `${event.event_type.replace('_', ' ')} event detected`;
//     }
//   };

//   // Get event type class
//   const getEventTypeClass = (eventType) => {
//     if (!eventType) return '';
    
//     switch(eventType.toLowerCase()) {
//       case 'video_recorded':
//         return 'evidences-event-type-motion-detected';
//       case 'face_match':
//         return 'evidences-event-type-face-match';
//       case 'intrusion':
//         return 'evidences-event-type-object-detected';
//       case 'anomaly':
//         return 'evidences-event-type-unknown-face';
//       case 'violence':
//         return 'evidences-event-type-motion-detected';
//       default:
//         return 'evidences-event-type-motion-detected';
//     }
//   };

//   // Get media URL (video or image) for display
//   const getMediaUrl = (event) => {
//     // Priority: video > image
//     if (event.data?.video) return event.data.video;
//     if (event.video) return event.video;
//     if (event.data?.image) return event.data.image;
//     if (event.image) return event.image;
    
//     // Fallback based on event type
//     switch(event.event_type) {
//       case 'VIDEO_RECORDED':
//         return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
//       case 'FACE_MATCH':
//         return event.data?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
//       default:
//         return 'https://images.unsplash.com/photo-1562029880-56c94bfbb46d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
//     }
//   };

//   // Get media type
//   const getMediaType = (event) => {
//     const url = getMediaUrl(event);
//     if (url.includes('.mp4') || url.includes('.avi') || url.includes('.mov') || url.includes('.webm') || url.includes('video/upload')) {
//       return 'video';
//     }
//     return 'image';
//   };

//   // Get media poster/thumbnail
//   const getMediaPoster = (event) => {
//     if (event.data?.thumbnail) return event.data.thumbnail;
//     if (event.thumbnail) return event.thumbnail;
    
//     // Use a placeholder based on event type
//     switch(event.event_type) {
//       case 'VIDEO_RECORDED':
//         return 'https://via.placeholder.com/320x180/4f46e5/ffffff?text=Video+Recording';
//       case 'FACE_MATCH':
//         return 'https://via.placeholder.com/320x180/10b981/ffffff?text=Face+Match';
//       default:
//         return 'https://via.placeholder.com/320x180/6b7280/ffffff?text=Event';
//     }
//   };

//   // Filter events based on active tab and search
//   const getFilteredEvents = () => {
//     let filtered = [...events];
    
//     // Filter by tab
//     if (activeTab !== 'all') {
//       filtered = filtered.filter(event => {
//         const eventType = event.event_type?.toLowerCase() || '';
//         switch(activeTab) {
//           case 'face':
//             return eventType.includes('face');
//           case 'motion':
//             return eventType.includes('anomaly') || eventType.includes('violence') || eventType.includes('video_recorded');
//           case 'objects':
//             return eventType.includes('intrusion');
//           default:
//             return true;
//         }
//       });
//     }
    
//     // Filter by search query
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(event => {
//         // Check event_type
//         if (event.event_type?.toLowerCase().includes(query)) return true;
        
//         // Check camera_id
//         if (event.camera_id?.toLowerCase().includes(query)) return true;
        
//         // Check summary
//         if (generateSummary(event).toLowerCase().includes(query)) return true;
        
//         // Check timestamp
//         if (event.timestamp?.toLowerCase().includes(query)) return true;
        
//         // Check persons names
//         const persons = event.persons || event.data?.persons || [];
//         if (persons.some(person => person.name?.toLowerCase().includes(query))) return true;
        
//         return false;
//       });
//     }
    
//     // Filter by time filter
//     if (activeFilter !== 'all') {
//       const now = new Date();
//       filtered = filtered.filter(event => {
//         if (!event.timestamp) return false;
        
//         const eventDate = new Date(event.timestamp);
//         if (isNaN(eventDate.getTime())) return false;
        
//         const diffMs = now - eventDate;
//         const diffDays = Math.floor(diffMs / 86400000);
        
//         switch(activeFilter) {
//           case 'today':
//             return diffDays === 0;
//           case 'week':
//             return diffDays < 7;
//           case 'critical':
//             return event.event_type === 'INTRUSION' || 
//                    event.event_type === 'VIOLENCE' ||
//                    (event.confidence && parseFloat(event.confidence) < 80);
//           default:
//             return true;
//         }
//       });
//     }
    
//     return filtered;
//   };

//   // Mark all as read
//   const markAllAsRead = () => {
//     setUnreadCount(0);
//   };

//   // Clear all events (for testing)
//   const clearEvents = () => {
//     if (window.confirm('Are you sure you want to clear all events?')) {
//       setEvents([]);
//       setTotalEvents(0);
//       setUnreadCount(0);
//     }
//   };

//   // Handle video play/pause
//   const handleVideoPlay = (videoId) => {
//     setPlayingVideo(videoId);
//   };

//   const handleVideoPause = () => {
//     setPlayingVideo(null);
//   };

//   // Get mock events for fallback with real structure
//   const getMockEvents = () => {
//     return [
//       {
//         _id: "698370a34ca5035516cd...",
//         camera_id: "CAM_01",
//         data: {
//           confidence: null,
//           description: null,
//           location: null,
//           video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
//         },
//         event_type: "VIDEO_RECORDED",
//         timestamp: "2026-02-04T16:15:31..."
//       },
//       {
//         _id: "698370924ca5035516cd...",
//         camera_id: "CAM_01",
//         data: {
//           confidence: null,
//           description: null,
//           image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//           location: null,
//           persons: [{ name: "Dhano" }]
//         },
//         event_type: "FACE_MATCH",
//         timestamp: "2026-02-04T16:15:14..."
//       }
//     ];
//   };

//   // Get filtered events
//   const filteredEvents = getFilteredEvents();

//   return (
//     <div className="evidences-container">
//       {/* Sticky header shell */}
//       <div className="evidences-header-shell">
//         <div className="evidences-header-main">
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div>
//               <h1 className="ev-title">Evidence Dashboard</h1>
//               <p className="ev-subtitle">Real-time surveillance evidence with live updates</p>
//             </div>
//             <div className="evidences-header-stats">
//               <div className="evidences-stat-item">
//                 <div className="evidences-stat-item-value">{totalEvents}</div>
//                 <div className="evidences-stat-item-label">Total Events</div>
//               </div>
//               <div className="evidences-stat-item">
//                 <div className="evidences-stat-item-value">{filteredEvents.length}</div>
//                 <div className="evidences-stat-item-label">Filtered</div>
//               </div>
//               {unreadCount > 0 && (
//                 <div className="evidences-stat-item" style={{ background: '#fef3c7' }}>
//                   <div className="evidences-stat-item-value" style={{ color: '#92400e' }}>
//                     {unreadCount} new
//                   </div>
//                   <div className="evidences-stat-item-label" style={{ color: '#92400e' }}>
//                     <button 
//                       onClick={markAllAsRead}
//                       style={{ 
//                         background: 'none', 
//                         border: 'none', 
//                         color: '#92400e', 
//                         cursor: 'pointer',
//                         textDecoration: 'underline',
//                         fontSize: '0.75rem'
//                       }}
//                     >
//                       Mark read
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="ev-tabs-row">
//           <button 
//             className={`ev-tab ${activeTab === 'all' ? 'is-active' : ''}`}
//             onClick={() => setActiveTab('all')}
//           >
//             All Events
//           </button>
//           <button 
//             className={`ev-tab ${activeTab === 'face' ? 'is-active' : ''}`}
//             onClick={() => setActiveTab('face')}
//           >
//             Face Recognition
//           </button>
//           <button 
//             className={`ev-tab ${activeTab === 'motion' ? 'is-active' : ''}`}
//             onClick={() => setActiveTab('motion')}
//           >
//             Anomaly Detection
//           </button>
//           <button 
//             className={`ev-tab ${activeTab === 'objects' ? 'is-active' : ''}`}
//             onClick={() => setActiveTab('objects')}
//           >
//             Intrusion
//           </button>
//         </div>
//       </div>

//       {/* Filters row */}
//       <div className="evidences-filters">
//         <div className="evidences-search-box">
//           <div className="evidences-search-icon">
//             <div className="evidences-search-icon-circle"></div>
//             <div className="evidences-search-icon-handle"></div>
//           </div>
//           <input 
//             type="text" 
//             placeholder="Search by camera, event type, person name, or timestamp..." 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <div className="evidences-chip-group">
//           <button 
//             className={`evidences-chip ${activeFilter === 'all' ? 'evidences-chip-active' : ''}`}
//             onClick={() => setActiveFilter('all')}
//           >
//             All
//           </button>
//           <button 
//             className={`evidences-chip ${activeFilter === 'today' ? 'evidences-chip-active' : ''}`}
//             onClick={() => setActiveFilter('today')}
//           >
//             Today
//           </button>
//           <button 
//             className={`evidences-chip ${activeFilter === 'week' ? 'evidences-chip-active' : ''}`}
//             onClick={() => setActiveFilter('week')}
//           >
//             This Week
//           </button>
//           <button 
//             className={`evidences-chip ${activeFilter === 'critical' ? 'evidences-chip-active' : ''}`}
//             onClick={() => setActiveFilter('critical')}
//           >
//             Critical
//           </button>
//         </div>

//         <div className={`evidences-connection-status ${connectionStatus.toLowerCase().replace(/ /g, '-')}`}>
//           <span className="evidences-status-dot"></span>
//           {connectionStatus}
//         </div>
//       </div>

//       {/* Connection status bar */}
//       {connectionStatus !== 'Connected' && (
//         <div style={{
//           background: '#fef3c7',
//           border: '1px solid #fbbf24',
//           borderRadius: '8px',
//           padding: '8px 12px',
//           marginBottom: '16px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <span style={{ color: '#92400e' }}>⚠️ {connectionStatus}</span>
//             <span style={{ fontSize: '0.8rem', color: '#92400e' }}>
//               {connectionStatus.includes('Reconnecting') ? 'Attempting to reconnect...' : 'Real-time updates paused'}
//             </span>
//           </div>
//           <button 
//             onClick={() => socket.connect()}
//             style={{
//               background: '#2563eb',
//               color: 'white',
//               border: 'none',
//               padding: '4px 12px',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '0.8rem'
//             }}
//           >
//             Reconnect
//           </button>
//         </div>
//       )}

//       {/* Main content */}
//       {loading ? (
//         <div className="evidences-loading">
//           <div className="evidences-loading-spinner"></div>
//           <p>Loading events from database...</p>
//           <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '8px' }}>
//             Connecting to socket server for real-time updates...
//           </p>
//         </div>
//       ) : filteredEvents.length === 0 ? (
//         <div className="evidences-no-events">
//           <h3>No events found</h3>
//           <p>{searchQuery || activeTab !== 'all' || activeFilter !== 'all' 
//             ? 'Try changing your filters or search query'
//             : 'Waiting for new events...'}
//           </p>
//           {events.length === 0 && connectionStatus === 'Connected' && (
//             <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '8px' }}>
//               Socket connected. Events will appear here when detected.
//             </p>
//           )}
//         </div>
//       ) : (
//         <>
//           <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
//               Showing {filteredEvents.length} of {totalEvents} events
//               {unreadCount > 0 && (
//                 <span style={{ marginLeft: '12px', color: '#2563eb', fontWeight: '500' }}>
//                   • {unreadCount} new event{unreadCount !== 1 ? 's' : ''}
//                 </span>
//               )}
//             </div>
//             <div className="evidences-chip-group">
//               <span className="evidences-chip" style={{ cursor: 'default', background: '#f8fafc' }}>
//                 Latest first
//               </span>
//             </div>
//           </div>
          
//           <div className="evidences-grid">
//             {filteredEvents.map((event, index) => {
//               const mediaType = getMediaType(event);
//               const mediaUrl = getMediaUrl(event);
//               const mediaPoster = getMediaPoster(event);
//               const persons = event.persons || event.data?.persons || [];
              
//               return (
//                 <div className="evidences-card" key={event._id || event.id || index}>
//                   <div className="evidences-card-header">
//                     <div className="evidences-file-info">
//                       <div className="evidences-file-icon">
//                         <div className={`icon-${mediaType === 'video' ? 'video' : 'image'}`}></div>
//                       </div>
//                       <div>
//                         <div className="evidences-file-name">
//                           {event.event_type ? event.event_type.replace(/_/g, ' ') : 'Unknown Event'}
//                         </div>
//                         <div className="evidences-file-meta">
//                           Camera: {event.camera_id || 'Unknown'} • {formatTimestamp(event.timestamp)}
//                         </div>
//                       </div>
//                     </div>
//                     <span className={`evidences-event-type ${getEventTypeClass(event.event_type)}`}>
//                       {event.event_type ? event.event_type.replace(/_/g, ' ') : 'Event'}
//                     </span>
//                   </div>
                  
//                   <div className="evidences-media-container">
//                     {mediaType === 'video' ? (
//                       <div className="evidences-video-container">
//                         <video 
//                           src={mediaUrl}
//                           className="evidences-event-video"
//                           controls
//                           preload="metadata"
//                           playsInline
//                           onPlay={() => handleVideoPlay(event._id || event.id || index)}
//                           onPause={handleVideoPause}
//                           poster={mediaPoster}
//                         >
//                           Your browser does not support the video tag.
//                         </video>
//                         {/* Removed the Play Video overlay */}
//                       </div>
//                     ) : (
//                       <div className="evidences-image-container">
//                         <img 
//                           src={mediaUrl} 
//                           alt={event.event_type || 'Event'} 
//                           className="evidences-event-image"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = mediaPoster;
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="evidences-card-body">
//                     <div className="evidences-stat">
//                       <span className="evidences-stat-label">Timestamp</span>
//                       <span className="evidences-stat-value">
//                         {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Unknown'}
//                       </span>
//                     </div>
                    
//                     <div className="evidences-stat">
//                       <span className="evidences-stat-label">Camera ID</span>
//                       <span className="evidences-stat-value evidences-stat-location">
//                         {event.camera_id || 'N/A'}
//                       </span>
//                     </div>
                    
//                     {event.confidence && event.confidence !== 'null' && (
//                       <div className="evidences-stat">
//                         <span className="evidences-stat-label">Confidence</span>
//                         <span className="evidences-stat-value" style={{ 
//                           color: parseFloat(event.confidence) > 90 ? '#166534' : 
//                                  parseFloat(event.confidence) > 80 ? '#854d0e' : '#991b1b'
//                         }}>
//                           {event.confidence}
//                         </span>
//                       </div>
//                     )}
                    
//                     {persons.length > 0 && (
//                       <div className="evidences-stat">
//                         <span className="evidences-stat-label">Person{persons.length > 1 ? 's' : ''}</span>
//                         <span className="evidences-stat-value">
//                           {persons.map(p => p.name).join(', ')}
//                         </span>
//                       </div>
//                     )}
                    
//                     <div className="evidences-stat evidences-stat-wide">
//                       <span className="evidences-stat-label">Location</span>
//                       <span className="evidences-stat-value">
//                         {event.location || event.data?.location || 'Camera ' + (event.camera_id || 'Unknown')}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="evidences-summary-strip">
//                     <div className="evidences-summary-label">Event Summary</div>
//                     <div className="evidences-summary-text">{generateSummary(event)}</div>
//                   </div>
                  
//                   <div className="evidences-card-footer">
//                     <div className="evidences-event-id">
//                       {event._id ? `ID: ${event._id.substring(0, 8)}...` : 
//                        event.id ? `ID: ${event.id.substring(0, 8)}...` : `#${index + 1}`}
//                       {index === 0 && events[0]?.timestamp === event.timestamp && (
//                         <span style={{ 
//                           marginLeft: '8px', 
//                           fontSize: '0.7rem',
//                           color: '#2563eb',
//                           fontWeight: '600'
//                         }}>
//                           NEW
//                         </span>
//                       )}
//                     </div>
//                     <div className="evidences-realtime-indicator">
//                       <span className="evidences-live-dot"></span>
//                       {index < 3 ? 'Live Now' : 'Recorded'}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Evidences;




//********************************************************************************************************* */

//944


import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Evidences.css';

// Create socket connection
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

function Evidences() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [totalEvents, setTotalEvents] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  
  // Fetch initial events from database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events from database...');
        const response = await fetch('http://localhost:5000/api/events', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched events data:', data);
        
        // Handle different response structures
        let eventsData = [];
        if (Array.isArray(data)) {
          eventsData = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          eventsData = data.data;
        } else if (data && Array.isArray(data.events)) {
          eventsData = data.events;
        }
        
        console.log('Processed events:', eventsData);
        
        // Sort events by timestamp (newest first)
        const sortedEvents = eventsData.sort((a, b) => {
          const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
          const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
          return dateB - dateA;
        });
        
        setEvents(sortedEvents);
        setTotalEvents(sortedEvents.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Use mock data as fallback
        const mockEvents = [
          {
            id: '1',
            event_type: 'VIDEO_RECORDED',
            camera_id: 'CAM_01',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            data: {
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
            }
          },
          {
            id: '2',
            event_type: 'FACE_MATCH',
            camera_id: 'CAM_01',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            data: {
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              persons: [{ name: 'Dhano' }]
            }
          }
        ];
        setEvents(mockEvents);
        setTotalEvents(mockEvents.length);
        setLoading(false);
      }
    };

    fetchEvents();
    
    // Refresh data every 30 seconds
    const refreshInterval = setInterval(fetchEvents, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Set up socket connection for real-time updates
  useEffect(() => {
    console.log('Setting up socket connection...');
    
    socket.on('connect', () => {
      console.log('✅ Connected to socket server');
      setConnectionStatus('Connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from socket server:', reason);
      setConnectionStatus('Disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionStatus('Connection Error');
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
      setConnectionStatus(`Reconnecting... (${attemptNumber})`);
    });

    socket.on('reconnect', () => {
      console.log('✅ Reconnected to socket server');
      setConnectionStatus('Connected');
    });

    // Listen for new events from database
    socket.on('new-event', (newEvent) => {
      console.log('📦 New event received from socket:', newEvent);
      handleNewEvent(newEvent);
    });

    // Listen for new frame events
    socket.on('new-frame', (newFrame) => {
      console.log('🎥 New frame received from socket:', newFrame);
      handleNewEvent(newFrame);
    });

    return () => {
      console.log('Cleaning up socket listeners...');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('reconnect_attempt');
      socket.off('reconnect');
      socket.off('new-event');
      socket.off('new-frame');
    };
  }, []);

  // Handle new event from socket
  const handleNewEvent = (newEvent) => {
    if (!newEvent) {
      console.error('Invalid event received');
      return;
    }

    console.log('Processing new event:', newEvent);
    
    // Add new event at the beginning of the array
    setEvents(prevEvents => {
      // Check if event already exists
      const exists = prevEvents.some(event => 
        (event.id && newEvent.id && event.id === newEvent.id) || 
        (event._id && newEvent._id && event._id === newEvent._id) ||
        (event.timestamp === newEvent.timestamp && event.camera_id === newEvent.camera_id)
      );
      
      if (exists) {
        console.log('Event already exists, skipping...');
        return prevEvents;
      }
      
      const updatedEvents = [newEvent, ...prevEvents];
      return updatedEvents;
    });
    
    // Increment unread count
    setUnreadCount(prev => prev + 1);
    // Update total events count
    setTotalEvents(prev => prev + 1);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  };

  // Check if event has image
  const hasImage = (event) => {
    return event.data?.image || event.image;
  };

  // Check if event has video
  const hasVideo = (event) => {
    return event.data?.video || event.video;
  };

  // Get media URL
  const getMediaUrl = (event) => {
    if (hasVideo(event)) {
      return event.data?.video || event.video;
    }
    if (hasImage(event)) {
      return event.data?.image || event.image;
    }
    return null;
  };

  // Get media type
  const getMediaType = (event) => {
    const url = getMediaUrl(event);
    if (!url) return null;
    
    // Check if URL is a video
    if (url.includes('.mp4') || url.includes('.avi') || url.includes('.mov') || 
        url.includes('.webm') || url.includes('video/upload')) {
      return 'video';
    }
    
    // Check if URL is an image
    if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || 
        url.includes('.gif') || url.includes('.webp') || url.includes('image/upload')) {
      return 'image';
    }
    
    // Default to video if unsure
    return 'video';
  };

  // Generate summary based on event type
  const generateSummary = (event) => {
    if (!event.event_type) return 'Event detected by surveillance system';
    
    switch(event.event_type) {
      case 'VIDEO_RECORDED':
        return 'Video recording captured';
      case 'FACE_MATCH':
        const persons = event.data?.persons || event.persons || [];
        if (persons.length > 0) {
          const names = persons.map(p => p.name).join(', ');
          return `Face match: ${names}`;
        }
        return 'Face match detected';
      case 'INTRUSION':
        return 'Security intrusion detected';
      case 'ANOMALY':
        return 'Anomalous behavior detected';
      case 'VIOLENCE':
        return 'Violent activity detected';
      default:
        return `${event.event_type.replace('_', ' ')} event detected`;
    }
  };

  // Get event type class
  const getEventTypeClass = (eventType) => {
    if (!eventType) return '';
    
    switch(eventType.toLowerCase()) {
      case 'video_recorded':
        return 'evidences-event-type-motion-detected';
      case 'face_match':
        return 'evidences-event-type-face-match';
      case 'intrusion':
        return 'evidences-event-type-object-detected';
      case 'anomaly':
        return 'evidences-event-type-unknown-face';
      case 'violence':
        return 'evidences-event-type-motion-detected';
      default:
        return 'evidences-event-type-motion-detected';
    }
  };

  // Filter events based on active tab and search
  const getFilteredEvents = () => {
    let filtered = [...events];
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(event => {
        const eventType = event.event_type?.toLowerCase() || '';
        switch(activeTab) {
          case 'face':
            return eventType.includes('face');
          case 'motion':
            return eventType.includes('anomaly') || eventType.includes('violence') || eventType.includes('video_recorded');
          case 'objects':
            return eventType.includes('intrusion');
          default:
            return true;
        }
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => {
        // Check event_type
        if (event.event_type?.toLowerCase().includes(query)) return true;
        
        // Check camera_id
        if (event.camera_id?.toLowerCase().includes(query)) return true;
        
        // Check summary
        if (generateSummary(event).toLowerCase().includes(query)) return true;
        
        // Check persons names
        const persons = event.data?.persons || event.persons || [];
        if (persons.some(person => person.name?.toLowerCase().includes(query))) return true;
        
        return false;
      });
    }
    
    // Filter by time filter
    if (activeFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(event => {
        if (!event.timestamp) return false;
        
        const eventDate = new Date(event.timestamp);
        if (isNaN(eventDate.getTime())) return false;
        
        const diffMs = now - eventDate;
        const diffDays = Math.floor(diffMs / 86400000);
        
        switch(activeFilter) {
          case 'today':
            return diffDays === 0;
          case 'week':
            return diffDays < 7;
          case 'critical':
            return event.event_type === 'INTRUSION' || 
                   event.event_type === 'VIOLENCE' ||
                   (event.confidence && parseFloat(event.confidence) < 80);
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  // Mark all as read
  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  // Get filtered events
  const filteredEvents = getFilteredEvents();

  return (
    <div className="evidences-container">
      {/* Sticky header shell */}
      <div className="evidences-header-shell">
        <div className="evidences-header-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="ev-title">Evidence Dashboard</h1>
              <p className="ev-subtitle">Real-time surveillance evidence with live updates</p>
            </div>
            <div className="evidences-header-stats">
              <div className="evidences-stat-item">
                <div className="evidences-stat-item-value">{totalEvents}</div>
                <div className="evidences-stat-item-label">Total Events</div>
              </div>
              <div className="evidences-stat-item">
                <div className="evidences-stat-item-value">{filteredEvents.length}</div>
                <div className="evidences-stat-item-label">Filtered</div>
              </div>
              {unreadCount > 0 && (
                <div className="evidences-stat-item" style={{ background: '#fef3c7' }}>
                  <div className="evidences-stat-item-value" style={{ color: '#92400e' }}>
                    {unreadCount} new
                  </div>
                  <div className="evidences-stat-item-label" style={{ color: '#92400e' }}>
                    <button 
                      onClick={markAllAsRead}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#92400e', 
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '0.75rem'
                      }}
                    >
                      Mark read
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="ev-tabs-row">
          <button 
            className={`ev-tab ${activeTab === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Events
          </button>
          <button 
            className={`ev-tab ${activeTab === 'face' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('face')}
          >
            Face Recognition
          </button>
          <button 
            className={`ev-tab ${activeTab === 'motion' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('motion')}
          >
            Anomaly Detection
          </button>
          <button 
            className={`ev-tab ${activeTab === 'objects' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('objects')}
          >
            Intrusion
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="evidences-filters">
        <div className="evidences-search-box">
          <div className="evidences-search-icon">
            <div className="evidences-search-icon-circle"></div>
            <div className="evidences-search-icon-handle"></div>
          </div>
          <input 
            type="text" 
            placeholder="Search by camera, event type, person name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="evidences-chip-group">
          <button 
            className={`evidences-chip ${activeFilter === 'all' ? 'evidences-chip-active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`evidences-chip ${activeFilter === 'today' ? 'evidences-chip-active' : ''}`}
            onClick={() => setActiveFilter('today')}
          >
            Today
          </button>
          <button 
            className={`evidences-chip ${activeFilter === 'week' ? 'evidences-chip-active' : ''}`}
            onClick={() => setActiveFilter('week')}
          >
            This Week
          </button>
          <button 
            className={`evidences-chip ${activeFilter === 'critical' ? 'evidences-chip-active' : ''}`}
            onClick={() => setActiveFilter('critical')}
          >
            Critical
          </button>
        </div>

        <div className={`evidences-connection-status ${connectionStatus.toLowerCase().replace(/ /g, '-')}`}>
          <span className="evidences-status-dot"></span>
          {connectionStatus}
        </div>
      </div>

      {/* Connection status bar */}
      {connectionStatus !== 'Connected' && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#92400e' }}>⚠️ {connectionStatus}</span>
            <span style={{ fontSize: '0.8rem', color: '#92400e' }}>
              {connectionStatus.includes('Reconnecting') ? 'Attempting to reconnect...' : 'Real-time updates paused'}
            </span>
          </div>
          <button 
            onClick={() => socket.connect()}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Main content */}
      {loading ? (
        <div className="evidences-loading">
          <div className="evidences-loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="evidences-no-events">
          <h3>No events found</h3>
          <p>
            {searchQuery || activeTab !== 'all' || activeFilter !== 'all' 
              ? 'Try changing your filters or search query'
              : 'Waiting for events...'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Showing {filteredEvents.length} of {totalEvents} events
              {unreadCount > 0 && (
                <span style={{ marginLeft: '12px', color: '#2563eb', fontWeight: '500' }}>
                  • {unreadCount} new event{unreadCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          
          <div className="evidences-grid">
            {filteredEvents.map((event, index) => {
              const mediaType = getMediaType(event);
              const mediaUrl = getMediaUrl(event);
              const persons = event.data?.persons || event.persons || [];
              
              return (
                <div className="evidences-card" key={event._id || event.id || index}>
                  <div className="evidences-card-header">
                    <div className="evidences-file-info">
                      <div className="evidences-file-icon">
                        <div className={`icon-${mediaType === 'video' ? 'video' : 'image'}`}></div>
                      </div>
                      <div>
                        <div className="evidences-file-name">
                          {event.event_type ? event.event_type.replace(/_/g, ' ') : 'Unknown Event'}
                        </div>
                        <div className="evidences-file-meta">
                          Camera: {event.camera_id || 'Unknown'} • {formatTimestamp(event.timestamp)}
                        </div>
                      </div>
                    </div>
                    <span className={`evidences-event-type ${getEventTypeClass(event.event_type)}`}>
                      {event.event_type ? event.event_type.replace(/_/g, ' ') : 'Event'}
                    </span>
                  </div>
                  
                  <div className="evidences-media-container">
                    {mediaType === 'video' ? (
                      <div className="evidences-video-container">
                        <video 
                          src={mediaUrl}
                          className="evidences-event-video"
                          controls
                          preload="metadata"
                          playsInline
                          poster="https://via.placeholder.com/320x180/4f46e5/ffffff?text=Video"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : mediaType === 'image' ? (
                      <div className="evidences-image-container">
                        <img 
                          src={mediaUrl} 
                          alt={event.event_type || 'Event'} 
                          className="evidences-event-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/320x180/10b981/ffffff?text=Image';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="evidences-no-media">
                        <div className="icon-no-media"></div>
                        <p>No media available</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="evidences-card-body">
                    <div className="evidences-stat">
                      <span className="evidences-stat-label">Time</span>
                      <span className="evidences-stat-value">
                        {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="evidences-stat">
                      <span className="evidences-stat-label">Camera</span>
                      <span className="evidences-stat-value">
                        {event.camera_id || 'N/A'}
                      </span>
                    </div>
                    
                    {persons.length > 0 && (
                      <div className="evidences-stat">
                        <span className="evidences-stat-label">Person{persons.length > 1 ? 's' : ''}</span>
                        <span className="evidences-stat-value">
                          {persons.map(p => p.name).join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {event.confidence && event.confidence !== 'null' && (
                      <div className="evidences-stat">
                        <span className="evidences-stat-label">Confidence</span>
                        <span className="evidences-stat-value">
                          {event.confidence}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="evidences-summary-strip">
                    <div className="evidences-summary-text">{generateSummary(event)}</div>
                  </div>
                  
                  <div className="evidences-card-footer">
                    <div className="evidences-event-id">
                      {event._id ? `ID: ${String(event._id).substring(0, 8)}...` : 
                       event.id ? `ID: ${String(event.id).substring(0, 8)}...` : `#${index + 1}`}
                      {index < 3 && (
                        <span style={{ 
                          marginLeft: '8px', 
                          fontSize: '0.7rem',
                          color: '#2563eb',
                          fontWeight: '600'
                        }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="evidences-realtime-indicator">
                      <span className="evidences-live-dot"></span>
                      {index < 3 ? 'Live Now' : 'Recorded'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Evidences;
