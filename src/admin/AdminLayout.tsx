import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { useAuth } from "../hooks/useAuth";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session } = useAuth();

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