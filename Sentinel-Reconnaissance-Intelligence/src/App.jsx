// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/dashboard";
import Teams from "./components/pages/teams/Teams";
import Sidebar from "./components/sidebars/sidebar";
import UploadSummarize from "./components/pages/upload and summarize/uploadSummarize";
import CaseManagement from "./components/pages/cases/CaseManagement";
import Evidences from "./components/pages/Evidences/Evidences";
import Settings from "./components/pages/settings/Settings";
import "./App.css";

// Wrapper layout
function Layout() {
  return (
    <div className="app">
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Main content only */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadSummarize />} />
          {/* Case management page with Register New Case modal inside */}
          <Route path="/cases" element={<CaseManagement />} />
          <Route path="/live" element={<Evidences />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
