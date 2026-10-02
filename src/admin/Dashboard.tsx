import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

const Dashboard = () => {
  const outletContext = useOutletContext<{ session: Session | null } | undefined>();
  const session = outletContext?.session ?? null;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stats Data
  const stats = [
    {
      label: "Total Students",
      value: "12,540",
      change: "+12.5%",
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      ),
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Total Teachers",
      value: "342",
      change: "+5.2%",
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      ),
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Active Courses",
      value: "86",
      change: "+8.1%",
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
      ),
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Total Revenue",
      value: "৳ 4.2L",
      change: "-2.3%",
      isPositive: false,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      ),
      color: "from-yellow-500 to-orange-500",
    },
  ];

  // Recent Students
  const recentStudents = [
    { id: 1, name: "Ayesha Siddiqua", email: "ayesha@example.com", class: "Class 10", status: "Active", avatar: "A", color: "bg-teal-500" },
    { id: 2, name: "Rahim Uddin", email: "rahim@example.com", class: "Class 8", status: "Active", avatar: "R", color: "bg-blue-500" },
    { id: 3, name: "Sara Khan", email: "sara@example.com", class: "Class 9", status: "Pending", avatar: "S", color: "bg-purple-500" },
    { id: 4, name: "Tanvir Ahmed", email: "tanvir@example.com", class: "Class 12", status: "Active", avatar: "T", color: "bg-orange-500" },
    { id: 5, name: "Nusrat Jahan", email: "nusrat@example.com", class: "Class 11", status: "Active", avatar: "N", color: "bg-pink-500" },
  ];

  // Menu Items
  const menuItems = [
    { label: "Dashboard", icon: "📊", href: "/admin", active: true },
    { label: "Students", icon: "👨‍🎓", href: "/admin/students" },
    { label: "Teachers", icon: "👨‍🏫", href: "/admin/teachers" },
    { label: "Schools", icon: "🏫", href: "/admin/schools" },
    { label: "Courses", icon: "📚", href: "/admin/courses" },
    { label: "Exams & Tests", icon: "📝", href: "/admin/exams" },
    { label: "Results", icon: "🏆", href: "/admin/results" },
    { label: "Payments", icon: "💳", href: "/admin/payments" },
    { label: "Reports", icon: "📈", href: "/admin/reports" },
    { label: "Settings", icon: "⚙️", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* ============== SIDEBAR ============== */}   

      {/* Overlay for Mobile */}
      {/* {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )} */}

      {/* ============== MAIN CONTENT ============== */}
      <main className="flex-1 min-w-0">

        {/* ============== DASHBOARD CONTENT ============== */}
        <div className="p-4 md:p-8 space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-md`}>
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-full ${
                    stat.isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-black text-brandDark">{stat.value}</p>
                <p className="text-sm text-slate-500 font-semibold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Chart + Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Enrollment Chart (Placeholder) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-brandDark">Enrollment Overview</h3>
                  <p className="text-xs text-slate-500 font-medium">Last 7 months</p>
                </div>
                <select className="text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none">
                  <option>Last 7 months</option>
                  <option>Last 12 months</option>
                  <option>This Year</option>
                </select>
              </div>

              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between gap-3 h-56">
                {[45, 62, 38, 78, 55, 90, 72].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-brandTeal to-teal-400 rounded-t-lg hover:from-teal-600 hover:to-teal-500 transition-all cursor-pointer"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs font-bold text-slate-500">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-brandDark mb-5">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { text: "New student enrolled in Class 10", time: "2 mins ago", color: "bg-teal-500" },
                  { text: "Teacher Kamrul created new exam", time: "15 mins ago", color: "bg-blue-500" },
                  { text: "School Dhaka Ideal joined", time: "1 hour ago", color: "bg-purple-500" },
                  { text: "Payment received ৳ 2,500", time: "3 hours ago", color: "bg-yellow-500" },
                  { text: "Class 12 SSC result published", time: "5 hours ago", color: "bg-pink-500" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.color} mt-2 flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700">{activity.text}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Students Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-brandDark">Recent Students</h3>
                <p className="text-xs text-slate-500 font-medium">Latest enrolled students</p>
              </div>
              <Link
                to="/admin/students"
                className="text-brandTeal font-bold text-sm hover:underline flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Class</th>
                    <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${student.color} flex items-center justify-center text-white font-bold`}>
                            {student.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brandDark">{student.name}</p>
                            <p className="text-xs text-slate-500 md:hidden">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-sm font-medium text-slate-600">{student.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-brandDark">{student.class}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          student.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-brandTeal hover:text-teal-700 text-sm font-bold">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;