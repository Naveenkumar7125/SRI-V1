// // UploadArea.jsx
// import React, { useRef, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Upload,
//   FileVideo,
//   Sparkles,
//   FolderOpen,
//   Trash2,
//   X,
//   Send,
// } from "lucide-react";

// export default function UploadArea({
//   uploadedFiles,
//   setUploadedFiles,
//   isAnalyzing,
//   setIsAnalyzing,
//   setAnalysisResults,
//   setDetectedFrames,
//   setShowAnalysis,
// }) {
//   const fileInputRef = useRef(null);
//   const folderInputRef = useRef(null);
//   const [userQuery, setUserQuery] = useState("");

//   const handleFileUpload = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   const handleFolderUpload = () => {
//     if (folderInputRef.current) folderInputRef.current.click();
//   };

//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files || []);
//     if (files.length > 0) {
//       const videoFiles = files.map((file) => ({
//         name: file.name,
//         path: URL.createObjectURL(file),
//         size: file.size,
//         type: file.type,
//       }));
//       setUploadedFiles((prev) => [...prev, ...videoFiles]);
//     }
//     event.target.value = "";
//   };

//   const handleFolderChange = (event) => {
//     const files = Array.from(event.target.files || []);
//     if (files.length > 0) {
//       const videoFiles = files
//         .filter((file) => file.type.startsWith("video/"))
//         .map((file) => ({
//           name: file.name,
//           path: URL.createObjectURL(file),
//           size: file.size,
//           type: file.type,
//         }));
//       setUploadedFiles((prev) => [...prev, ...videoFiles]);
//     }
//     event.target.value = "";
//   };

//   const deleteFile = (index) => {
//     setUploadedFiles((prev) => {
//       const newFiles = [...prev];
//       URL.revokeObjectURL(newFiles[index].path);
//       newFiles.splice(index, 1);
//       return newFiles;
//     });
//   };

//   const clearAllFiles = () => {
//     uploadedFiles.forEach((file) => URL.revokeObjectURL(file.path));
//     setUploadedFiles([]);
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   // Mock analysis (replace with real API)
//   const analyzeFolder = async () => {
//     if (!uploadedFiles.length) return;

//     setIsAnalyzing(true);
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     const mockResults = uploadedFiles.map((file, index) => ({
//       fileName: file.name,
//       summary:
//         index % 2 === 0
//           ? "Suspicious movement detected in a monitored corridor. Recommended detailed review by operations team."
//           : "Normal crowd movement with no major anomalies flagged by the model.",
//       timeline: [
//         { time: "00:00:12", event: "Subject enters frame" },
//         {
//           time: "00:01:34",
//           event:
//             index % 2 === 0
//               ? "Loitering detected near restricted zone"
//               : "Routine movement across field of view",
//         },
//         {
//           time: "00:02:45",
//           event:
//             index % 2 === 0
//               ? "Object handling flagged as unusual"
//               : "Subject exits frame",
//         },
//       ],
//       threatLevel: index % 2 === 0 ? "high" : "low",
//       confidence: 82 + index * 3,
//       keyFrames: Array(4)
//         .fill(null)
//         .map((_, i) => `frame-${index}-${i}.jpg`),
//       duration: `00:0${index + 1}:45`,
//     }));

//     const mockFrames = [
//       {
//         videoName: uploadedFiles[0]?.name || "video1.mp4",
//         timestamp: "00:01:15",
//         duration: "5s",
//         description: "Suspicious movement detected near entry gate.",
//         thumbnail: "frame-1.jpg",
//       },
//       {
//         videoName: uploadedFiles[1]?.name || "video2.mp4",
//         timestamp: "00:02:30",
//         duration: "3s",
//         description: "Individuals congregating close to a restricted door.",
//         thumbnail: "frame-2.jpg",
//       },
//     ];

//     setAnalysisResults(mockResults);
//     setDetectedFrames(mockFrames);
//     setIsAnalyzing(false);
//     setShowAnalysis(true);
//   };

//   const handleUserQuerySubmit = () => {
//     if (!userQuery.trim()) return;
//     // You can later wire this to influence analysis parameters
//     setUserQuery("");
//   };

//   return (
//     <div className="upload-center">
//       <Card className="upload-card">
//         <div className="upload-card-inner">
//           {/* Main upload box */}
//           <div className="upload-drop-box">
//             <div className="upload-drop-header">
//               <div className="upload-icon-circle">
//                 <Upload className="upload-main-icon" />
//               </div>
//               <div className="upload-text-block">
//                 <h3 className="upload-main-heading">
//                   Drop NSG surveillance files or folders here
//                 </h3>
//                 <p className="upload-main-text">
//                   Supports MP4, AVI, MOV and other common video streams.
//                 </p>
//               </div>
//             </div>

//             <div className="upload-query-block">
//               <label className="upload-query-label">
//                 What should the AI focus on in this footage?
//               </label>
//               <div className="upload-query-row">
//                 <Input
//                   value={userQuery}
//                   onChange={(e) => setUserQuery(e.target.value)}
//                   placeholder="Eg: loitering near Gate 2, unattended baggage, perimeter breach, crowd surge..."
//                   className="upload-query-input"
//                 />
//                 <Button
//                   onClick={handleUserQuerySubmit}
//                   disabled={!userQuery.trim()}
//                   className="primary-btn-icon"
//                 >
//                   <Send className="icon-sm" />
//                 </Button>
//               </div>
//             </div>

//             <div className="upload-actions upload-actions-top">
//               <Button className="primary-btn" onClick={handleFileUpload}>
//                 <FileVideo className="icon-sm icon-left" />
//                 <span>Upload File</span>
//               </Button>

//               <Button className="primary-btn" onClick={handleFolderUpload}>
//                 <FolderOpen className="icon-sm icon-left" />
//                 <span>Upload Folder</span>
//               </Button>

//               {uploadedFiles.length > 0 && (
//                 <Button
//                   onClick={analyzeFolder}
//                   disabled={isAnalyzing}
//                   className="danger-btn"
//                 >
//                   <Sparkles className="icon-sm icon-left" />
//                   <span>
//                     {isAnalyzing ? "Analyzing Footage..." : "Run AI Analysis"}
//                   </span>
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* File list */}
//           {uploadedFiles.length > 0 && (
//             <div className="upload-status">
//               <div className="upload-status-header">
//                 <div className="upload-status-left">
//                   <FolderOpen className="icon-sm tactical-colour" />
//                   <p className="upload-status-text">
//                     {uploadedFiles.length} video file(s) selected
//                   </p>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={clearAllFiles}
//                   className="icon-circle danger-icon"
//                 >
//                   <Trash2 className="icon-xs" />
//                 </Button>
//               </div>

//               <div className="upload-status-list">
//                 {uploadedFiles.map((file, index) => (
//                   <div key={index} className="upload-file-row">
//                     <div className="upload-file-left">
//                       <FileVideo className="icon-xs muted-colour" />
//                       <span className="upload-file-name">{file.name}</span>
//                     </div>
//                     <div className="upload-file-right">
//                       <span className="upload-file-size">
//                         {formatFileSize(file.size)}
//                       </span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => deleteFile(index)}
//                         className="icon-circle subtle-delete"
//                       >
//                         <X className="icon-xs" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Hidden inputs */}
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             accept=".mp4,.avi,.mov,.mkv,.wmv,.flv,.webm"
//             multiple
//             className="hidden-input"
//           />
//           <input
//             type="file"
//             ref={folderInputRef}
//             onChange={handleFolderChange}
//             accept=".mp4,.avi,.mov,.mkv,.wmv,.flv,.webm"
//             multiple
//             webkitdirectory="true"
//             className="hidden-input"
//           />
//         </div>
//       </Card>
//     </div>
//   );
// }



// UploadArea.jsx
// import React, { useRef, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Upload,
//   FileVideo,
//   Sparkles,
//   FolderOpen,
//   Trash2,
//   X,
//   Send,
// } from "lucide-react";
// import axios from "axios";

// export default function UploadArea({
//   uploadedFiles,
//   setUploadedFiles,
//   isAnalyzing,
//   setIsAnalyzing,
//   setAnalysisResults,
//   setDetectedFrames,
//   setShowAnalysis,
// }) {
//   const fileInputRef = useRef(null);
//   const folderInputRef = useRef(null);
//   const [userQuery, setUserQuery] = useState("");




//   const uploadToBackend = async () => {
//   if (!uploadedFiles.length) {
//     console.warn("No files to upload");
//     return;
//   }

//   const form = new FormData();

//   // If the upload set contains folderName (folder upload), use that
//   const first = uploadedFiles[0];
//   const folderName = first.folderName || "";

//   uploadedFiles.forEach((fileObj) => {
//     // If you want to preserve relative paths, append them too
//     form.append("files", fileObj.file);
//   });

//   if (folderName) form.append("folderName", folderName);

//   try {
//     const res = await fetch("http://localhost:5000/api/upload", {
//       method: "POST",
//       body: form,
//     });

//     const data = await res.json();
//     console.log("UPLOAD RESPONSE:", data);
//     if (!data.success) {
//       alert("Upload failed: " + JSON.stringify(data));
//     } else {
//       alert(`Saved to ${data.storedAt}\nFiles: ${data.filesSaved.join(", ")}`);
//     }
//   } catch (err) {
//     console.error("Upload error", err);
//     alert("Upload failed, check console");
//   }
// };



//   const folderId = "67b6b7e1d21f1fc80fb7cf92"; // TEMP — replace with dynamic folderId if needed

//   const handleFileUpload = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   const handleFolderUpload = () => {
//     if (folderInputRef.current) folderInputRef.current.click();
//   };

  

//   const handleFolderChange = (event) => {
//     const files = Array.from(event.target.files || []);

//     const videoFiles = files
//       .filter((file) => file.type.startsWith("video/"))
//       .map((file) => ({
//         name: file.name,
//         size: file.size,
//         type: file.type,
//         previewURL: URL.createObjectURL(file),
//         realFile: file,
//       }));

//     setUploadedFiles((prev) => [...prev, ...videoFiles]);
//     event.target.value = "";
//   };

//   const deleteFile = (index) => {
//     setUploadedFiles((prev) => {
//       const newFiles = [...prev];
//       URL.revokeObjectURL(newFiles[index].previewURL);
//       newFiles.splice(index, 1);
//       return newFiles;
//     });
//   };

//   const clearAllFiles = () => {
//     uploadedFiles.forEach((file) => URL.revokeObjectURL(file.previewURL));
//     setUploadedFiles([]);
//   };

//   const formatFileSize = (bytes) => {
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     let i = Math.floor(Math.log(bytes) / Math.log(1024));
//     return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
//   };

//   // ⭐ Upload each video one-by-one to your backend
//   // Run AI Analysis (upload all files)
//   const analyzeFolder = async () => {
//   if (!uploadedFiles.length) return;

//   setIsAnalyzing(true);

//   for (const file of uploadedFiles) {
//     await uploadToBackend(file);
//   }

//   setIsAnalyzing(false);

//   // ⭐ Automatically move to analysis view page
//   setShowAnalysis(true);
// };







//   return (
//     <div className="upload-center">
//       <Card className="upload-card">
//         <div className="upload-card-inner">

//           {/* Main upload box */}
//           <div className="upload-drop-box">

//             <div className="upload-drop-header">
//               <div className="upload-icon-circle">
//                 <Upload className="upload-main-icon" />
//               </div>

//               <div className="upload-text-block">
//                 <h3 className="upload-main-heading">
//                   Drop NSG surveillance files or folders here
//                 </h3>
//                 <p className="upload-main-text">
//                   Supports MP4, AVI, MOV and other common video streams.
//                 </p>
//               </div>
//             </div>

//             <div className="upload-actions upload-actions-top">
//               <Button className="primary-btn" onClick={handleFileUpload}>
//                 <FileVideo className="icon-sm icon-left" />
//                 Upload File
//               </Button>

//               <Button className="primary-btn" onClick={handleFolderUpload}>
//                 <FolderOpen className="icon-sm icon-left" />
//                 Upload Folder
//               </Button>

//               {uploadedFiles.length > 0 && (
//                 <Button
//                   onClick={analyzeFolder}
//                   disabled={isAnalyzing}
//                   className="danger-btn"
//                 >
//                   <Sparkles className="icon-sm icon-left" />
//                   {isAnalyzing ? "Uploading..." : "Run AI Analysis"}
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* File list */}
//           {uploadedFiles.length > 0 && (
//             <div className="upload-status">
//               <div className="upload-status-header">
//                 <div className="upload-status-left">
//                   <FolderOpen className="icon-sm tactical-colour" />
//                   <p className="upload-status-text">
//                     {uploadedFiles.length} videos selected
//                   </p>
//                 </div>

//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={clearAllFiles}
//                   className="icon-circle danger-icon"
//                 >
//                   <Trash2 className="icon-xs" />
//                 </Button>
//               </div>

//               <div className="upload-status-list">
//                 {uploadedFiles.map((file, index) => (
//                   <div key={index} className="upload-file-row">
//                     <div className="upload-file-left">
//                       <FileVideo className="icon-xs muted-colour" />
//                       <span className="upload-file-name">{file.name}</span>
//                     </div>

//                     <div className="upload-file-right">
//                       <span className="upload-file-size">
//                         {formatFileSize(file.size)}
//                       </span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => deleteFile(index)}
//                         className="icon-circle subtle-delete"
//                       >
//                         <X className="icon-xs" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Hidden file inputs */}
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             accept="video/*"
//             multiple
//             className="hidden-input"
//           />

//           <input
//             type="file"
//             ref={folderInputRef}
//             onChange={handleFolderChange}
//             accept="video/*"
//             multiple
//             webkitdirectory="true"
//             className="hidden-input"
//           />
//         </div>
//       </Card>
//     </div>
//   );
// }




import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileVideo,
  Sparkles,
  FolderOpen,
  Trash2,
  X,
  Send,
} from "lucide-react";

export default function UploadArea({
  uploadedFiles,
  setUploadedFiles,
  isAnalyzing,
  setIsAnalyzing,
  setAnalysisResults,
  setDetectedFrames,
  setShowAnalysis,
}) {
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [userQuery, setUserQuery] = useState("");

  // ===============================
  // ⭐ Upload to Backend
  // ===============================
  const uploadToBackend = async () => {
    if (!uploadedFiles.length) {
      console.warn("No files to upload");
      return;
    }

    const form = new FormData();

    // Check if folder upload
    const folderName = uploadedFiles[0].folderName || "";

    uploadedFiles.forEach((fileObj) => {
      form.append("files", fileObj.file); // REAL FILE OBJECT
    });

    if (folderName) {
      form.append("folderName", folderName);
    }

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      console.log("UPLOAD RESPONSE:", data);

      if (!data.success) {
        alert("Upload failed!");
      } else {
        alert("Uploaded successfully!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  // ===============================
  // ⭐ Upload files & Run AI
  // ===============================
  const analyzeFolder = async () => {
    if (!uploadedFiles.length) return;

    setIsAnalyzing(true);
    await uploadToBackend();
    setIsAnalyzing(false);
    setShowAnalysis(true);
  };

  // ===============================
  // ⭐ File Input
  // ===============================
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    const videoFiles = files.map((file) => ({
      file, // REAL file object
      name: file.name,
      size: file.size,
      type: file.type,
      path: URL.createObjectURL(file),
    }));

    setUploadedFiles((prev) => [...prev, ...videoFiles]);
    event.target.value = "";
  };

  // ===============================
  // ⭐ Folder Input
  // ===============================
  const handleFolderChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    // Extract folder name from webkitRelativePath
    const firstPath = files[0].webkitRelativePath;
    const folderName = firstPath.split("/")[0];

    const videoFiles = files
      .filter((file) => file.type.startsWith("video/"))
      .map((file) => ({
        file, // REAL file
        name: file.name,
        size: file.size,
        type: file.type,
        path: URL.createObjectURL(file),
        folderName, // IMPORTANT
      }));

    setUploadedFiles(videoFiles);
    event.target.value = "";
  };

  // ===============================
  // ⭐ Delete / Clear
  // ===============================
  const deleteFile = (index) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].path);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const clearAllFiles = () => {
    uploadedFiles.forEach((file) => URL.revokeObjectURL(file.path));
    setUploadedFiles([]);
  };

  const formatFileSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    let i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  return (
    <div className="upload-center">
      <Card className="upload-card">
        <div className="upload-card-inner">
          <div className="upload-drop-box">
            <div className="upload-drop-header">
              <div className="upload-icon-circle">
                <Upload className="upload-main-icon" />
              </div>

              <div className="upload-text-block">
                <h3 className="upload-main-heading">
                  Drop NSG surveillance files or folders here
                </h3>
                <p className="upload-main-text">
                  Supports MP4, AVI, MOV and other common video streams.
                </p>
              </div>
            </div>

            <div className="upload-actions upload-actions-top">
              <Button className="primary-btn" onClick={() => fileInputRef.current.click()}>
                <FileVideo className="icon-sm icon-left" />
                Upload File
              </Button>

              <Button className="primary-btn" onClick={() => folderInputRef.current.click()}>
                <FolderOpen className="icon-sm icon-left" />
                Upload Folder
              </Button>

              {uploadedFiles.length > 0 && (
                <Button
                  onClick={analyzeFolder}
                  disabled={isAnalyzing}
                  className="danger-btn"
                >
                  <Sparkles className="icon-sm icon-left" />
                  {isAnalyzing ? "Uploading..." : "Run AI Analysis"}
                </Button>
              )}
            </div>
          </div>

          {/* FILE LIST */}
          {uploadedFiles.length > 0 && (
            <div className="upload-status">
              <div className="upload-status-header">
                <div className="upload-status-left">
                  <FolderOpen className="icon-sm tactical-colour" />
                  <p className="upload-status-text">
                    {uploadedFiles.length} videos selected
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFiles}
                  className="icon-circle danger-icon"
                >
                  <Trash2 className="icon-xs" />
                </Button>
              </div>

              <div className="upload-status-list">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="upload-file-row">
                    <div className="upload-file-left">
                      <FileVideo className="icon-xs muted-colour" />
                      <span className="upload-file-name">{file.name}</span>
                    </div>

                    <div className="upload-file-right">
                      <span className="upload-file-size">
                        {formatFileSize(file.size)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFile(index)}
                        className="icon-circle subtle-delete"
                      >
                        <X className="icon-xs" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            multiple
            className="hidden-input"
          />

          <input
            type="file"
            ref={folderInputRef}
            onChange={handleFolderChange}
            accept="video/*"
            multiple
            webkitdirectory="true"
            className="hidden-input"
          />
        </div>
      </Card>
    </div>
  );
}
