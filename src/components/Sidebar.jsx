import {
  Brain,
  Clock3,
  FileSearch,
  Files,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Pill,
  ShieldPlus,
  Stethoscope,
  UploadCloud,
  UsersRound,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Sidebar navigation links are stored in an array so we do not repeat JSX.
// To add a new page later, add one object here and one Route in App.jsx.
const links = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Upload", path: "/upload", icon: UploadCloud },
  { label: "AI Summary", path: "/summary", icon: Brain },
  { label: "Timeline", path: "/timeline", icon: Clock3 },
  { label: "Search", path: "/search", icon: FileSearch },
  { label: "Medicines", path: "/medicines", icon: Pill },
  { label: "Family Medical History", path: "/profile", icon: UsersRound },
  { label: "Medical Profile", path: "/medical-profile", icon: HeartPulse },
  { label: "Book Appointment", path: "/book-appointment", icon: Stethoscope },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
            <NavLink to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue text-white">
                <ShieldPlus size={22} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950">MediVault AI</p>
                <p className="text-xs text-slate-500">Smart records organizer</p>
              </div>
            </NavLink>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {links.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-brand-blue"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="m-4 rounded-lg border border-teal-100 bg-teal-50 p-4">
            <Files className="mb-2 text-brand-teal" size={22} />
            <p className="text-sm font-semibold text-slate-900">Records stay organized</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Dummy data is used now, with components prepared for future APIs.
            </p>
          </div>

          <NavLink
            to="/"
            className="mx-4 mb-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            <LogOut size={18} />
            Log out
          </NavLink>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation overlay"
        />
      )}
    </>
  );
}
