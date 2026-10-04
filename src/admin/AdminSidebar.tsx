import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { label: "Users", path: "/admin/users", icon: "👥" },
  { label: "Courses", path: "/admin/courses", icon: "📚" },
  { label: "Course Categories", path: "/admin/course-categories", icon: "🏷️" },
  { label: "Organizations", path: "/admin/organizations", icon: "🏢" },
];

type AdminSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
};

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-brandDark text-white transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-700/70 px-6">
          <Link to="/" className="text-2xl font-black tracking-tight">
            <span className="text-white">pico</span>
            <span className="text-brandTeal">learn</span>
          </Link>
          <button
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`) ||
              (item.path === "/admin/dashboard" && location.pathname === "/admin");

            return (
              <Link
                key={item.path}
                to={item.path}
                className={[
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-brandTeal text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                ].join(" ")}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
