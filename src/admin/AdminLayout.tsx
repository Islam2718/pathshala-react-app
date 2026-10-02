import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { useAuth } from "../hooks/useAuth";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center font-semibold text-slate-600">
        Checking your sign-in status...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-brandDark">Sign in required</h1>
          <p className="mt-3 text-sm text-slate-600">
            Sign in with your Supabase account before managing courses and other admin data.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-brandTeal px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
          >
            Go to login
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 min-w-0">
        <AdminTopbar setSidebarOpen={setSidebarOpen} />
        <div className="p-4 md:p-8">
          <Outlet context={{ session }} />
        </div>
      </main>
    </div>
  );
}