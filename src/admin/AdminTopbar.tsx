import { Link } from "react-router-dom";
type AdminTopbarProps = {
  setSidebarOpen: (value: boolean) => void;
};

export default function AdminTopbar({ setSidebarOpen }: AdminTopbarProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-brandDark hover:bg-slate-100 lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-xl font-black text-brandDark md:text-2xl">Admin Dashboard</h1>
          {/* <p className="hidden text-xs text-slate-500 md:block">Welcome back</p> */}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/home" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
          Back to Site
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brandTeal font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}
