import { ArrowRight, Lock, Mail, ShieldPlus } from "lucide-react";
import { Link } from "react-router-dom";

// This is a frontend-only login screen.
// The Login button simply navigates to /dashboard for the hackathon demo.
export default function Login() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue text-white shadow-lg shadow-blue-200">
                <ShieldPlus size={26} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-950">MediVault AI</h1>
                <p className="text-sm text-slate-500">Smart Health Records Organizer</p>
              </div>
            </div>

            <div className="mt-10 content-card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Sign in to organize records, view summaries, and prepare health history for visits.
              </p>

              <form className="mt-7 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-blue-100">
                    <Mail size={18} className="text-slate-400" />
                    <input
                      type="email"
                      placeholder="patient@email.com"
                      className="w-full border-0 bg-transparent text-sm outline-none"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Password</span>
                  <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-blue-100">
                    <Lock size={18} className="text-slate-400" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full border-0 bg-transparent text-sm outline-none"
                    />
                  </span>
                </label>

                <Link
                  to="/dashboard"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-4 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                >
                  Login
                  <ArrowRight size={18} />
                </Link>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                New to MediVault?{" "}
                <button type="button" className="font-semibold text-brand-blue">
                  Register account
                </button>
              </p>
            </div>
          </div>
        </section>

        <section className="hidden bg-white px-10 py-10 lg:block">
          <div className="flex h-full flex-col justify-between rounded-lg bg-gradient-to-br from-blue-600 via-teal-600 to-emerald-500 p-10 text-white">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                Healthcare SaaS
              </p>
              <h2 className="mt-5 max-w-xl text-5xl font-bold leading-tight">
                Your medical history, organized for every visit.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-blue-50">
                MediVault AI helps patients store reports, understand document context, and share
                clean summaries with doctors.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Secure records", "AI summaries", "Family profiles"].map((item) => (
                <div key={item} className="rounded-lg bg-white/15 p-4 backdrop-blur">
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
