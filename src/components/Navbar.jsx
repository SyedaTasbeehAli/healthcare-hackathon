import { Bell, Menu, Search, ShieldPlus } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500 md:flex">
            <Search size={16} />
            <span>Search documents, medicines, reports...</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <div className="flex items-center gap-3 rounded-full bg-brand-mint px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal text-white">
              <ShieldPlus size={17} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">Patient</p>
              <p className="text-xs text-slate-500">Protected account</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
