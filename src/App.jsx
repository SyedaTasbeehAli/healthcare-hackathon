import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UploadDocuments from "./pages/UploadDocuments.jsx";
import Timeline from "./pages/Timeline.jsx";
import SearchRecords from "./pages/SearchRecords.jsx";
import Profile from "./pages/Profile.jsx";
import DoctorShare from "./pages/DoctorShare.jsx";
import AISummary from "./pages/AISummary.jsx";
import MedicineTracker from "./pages/MedicineTracker.jsx";

// This component is the main logged-in layout.
// It keeps the sidebar, top navbar, and page area in one reusable shell.
function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="page-shell flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadDocuments />} />
            <Route path="/summary" element={<AISummary />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/search" element={<SearchRecords />} />
            <Route path="/medicines" element={<MedicineTracker />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/doctor-share" element={<DoctorShare />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  // The login page has its own full-screen design.
  // All other pages use AppLayout, which includes Sidebar + Navbar.
  return isLoginPage ? <Login /> : <AppLayout />;
}
