import { useState } from "react";
import { Link } from "react-router-dom";

interface Course {
  id: number;
  title: string;
  category: string;
  classLevel: string;
  board: string;
  lessons: number;
  tests: number;
  students: number;
  status: "Published" | "Draft" | "Archived";
  updatedAt: string;
}

const Courses = () => {
  // Demo Data (পরে Supabase থেকে আসবে)
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Pre School Foundation Course",
      category: "Pre School",
      classLevel: "Play Group",
      board: "NCTB",
      lessons: 48,
      tests: 12,
      students: 4200,
      status: "Published",
      updatedAt: "2024-06-15",
    },
    {
      id: 2,
      title: "Class 1-2 Full Syllabus",
      category: "Primary",
      classLevel: "Class 1-2",
      board: "NCTB",
      lessons: 96,
      tests: 24,
      students: 3800,
      status: "Published",
      updatedAt: "2024-06-14",
    },
    {
      id: 3,
      title: "Class 3-5 Math & Science Special",
      category: "Primary",
      classLevel: "Class 3-5",
      board: "NCTB",
      lessons: 72,
      tests: 18,
      students: 2200,
      status: "Published",
      updatedAt: "2024-06-13",
    },
    {
      id: 4,
      title: "Class 6-8 Full Academic Course",
      category: "Secondary",
      classLevel: "Class 6-8",
      board: "NCTB",
      lessons: 180,
      tests: 45,
      students: 9800,
      status: "Published",
      updatedAt: "2024-06-12",
    },
    {
      id: 5,
      title: "SSC Preparation Full Syllabus",
      category: "Secondary",
      classLevel: "Class 9-10",
      board: "NCTB / All Boards",
      lessons: 240,
      tests: 60,
      students: 14500,
      status: "Published",
      updatedAt: "2024-06-11",
    },
    {
      id: 6,
      title: "HSC Science Group Complete",
      category: "Higher Secondary",
      classLevel: "Class 11-12",
      board: "NCTB / All Boards",
      lessons: 320,
      tests: 80,
      students: 11200,
      status: "Draft",
      updatedAt: "2024-06-10",
    },
    {
      id: 7,
      title: "BCS Preliminary Preparation",
      category: "Job Preparation",
      classLevel: "Graduate",
      board: "BPSC Syllabus",
      lessons: 400,
      tests: 120,
      students: 22000,
      status: "Published",
      updatedAt: "2024-06-09",
    },
    {
      id: 8,
      title: "Bank Job Preparation",
      category: "Job Preparation",
      classLevel: "Graduate",
      board: "Bank Recruitment",
      lessons: 320,
      tests: 100,
      students: 18600,
      status: "Archived",
      updatedAt: "2024-06-08",
    },
  ]);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  // Filtered Courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || course.status === filterStatus;
    const matchesCategory = filterCategory === "all" || course.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Unique Categories
  const categories = ["all", ...Array.from(new Set(courses.map((c) => c.category)))];

  // Select All / Individual
  const toggleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map((c) => c.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete Handler
  const handleDelete = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setSelectedCourses((prev) => prev.filter((i) => i !== id));
    setShowDeleteModal(null);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    setCourses((prev) => prev.filter((c) => !selectedCourses.includes(c.id)));
    setSelectedCourses([]);
  };

  // Status Badge Color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-50 text-green-600 border border-green-100";
      case "Draft":
        return "bg-yellow-50 text-yellow-600 border border-yellow-100";
      case "Archived":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">

      {/* ============ PAGE HEADER ============ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-1xl font-black text-brandDark">Courses &mdash; <small>Settings</small></h1>
          {/* <p className="text-sm text-slate-500 font-medium mt-1">
            Manage all courses, lessons, and tests from here.
          </p> */}
        </div>
        <Link
          to="/admin/courses/add"
          className="inline-flex items-center gap-2 bg-brandTeal hover:bg-teal-700 text-white font-bold px-5 py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Course
        </Link>
      </div>

      {/* ============ STATS CARDS ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Courses", value: courses.length, color: "from-teal-500 to-teal-600", icon: "📚" },
          { label: "Published", value: courses.filter((c) => c.status === "Published").length, color: "from-green-500 to-green-600", icon: "✅" },
          { label: "Drafts", value: courses.filter((c) => c.status === "Draft").length, color: "from-yellow-500 to-yellow-600", icon: "📝" },
          { label: "Total Students", value: "86.5k", color: "from-blue-500 to-blue-600", icon: "👨‍🎓" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-brandDark mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ FILTERS & SEARCH ============ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">

          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              placeholder="Search courses by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium w-full"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-brandDark outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-brandDark outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Reset */}
          {(searchTerm || filterStatus !== "all" || filterCategory !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterCategory("all");
              }}
              className="text-sm font-bold text-red-500 hover:text-red-700 px-3 py-2.5 whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedCourses.length > 0 && (
          <div className="mt-4 flex items-center justify-between bg-brandTeal/5 border border-brandTeal/20 rounded-xl px-4 py-3">
            <p className="text-sm font-bold text-brandTeal">
              {selectedCourses.length} course(s) selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCourses([])}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 px-3 py-1.5"
              >
                Clear
              </button>
              <button
                onClick={handleBulkDelete}
                className="text-xs font-bold bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============ COURSES TABLE ============ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 md:px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-brandTeal cursor-pointer"
                  />
                </th>
                <th className="text-left px-4 md:px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="text-left px-4 md:px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 md:px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Lessons / Tests
                </th>
                <th className="text-left px-4 md:px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider hidden xl:table-cell">
                  Students
                </th>
                <th className="text-left px-4 md:px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 md:px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition group">
                  {/* Checkbox */}
                  <td className="px-4 md:px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => toggleSelect(course.id)}
                      className="w-4 h-4 rounded accent-brandTeal cursor-pointer"
                    />
                  </td>

                  {/* Course Title */}
                  <td className="px-4 md:px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-brandDark group-hover:text-brandTeal transition">
                        {course.title}
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5 md:hidden">
                        {course.category} • {course.classLevel}
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5 hidden md:block">
                        {course.board} • {course.classLevel}
                      </p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                      {course.category}
                    </span>
                  </td>

                  {/* Lessons / Tests */}
                  <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-bold text-brandDark">
                        📖 {course.lessons}
                      </span>
                      <span className="font-bold text-brandDark">
                        📝 {course.tests}
                      </span>
                    </div>
                  </td>

                  {/* Students */}
                  <td className="px-4 md:px-6 py-4 hidden xl:table-cell">
                    <span className="text-sm font-bold text-brandDark">
                      {course.students.toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full ${getStatusBadge(course.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        course.status === "Published" ? "bg-green-500" :
                        course.status === "Draft" ? "bg-yellow-500" : "bg-slate-400"
                      }`}></span>
                      {course.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      <button
                        className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                        title="View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>

                      {/* Edit */}
                      <Link
                        to={`/admin/courses/edit/${course.id}`}
                        className="p-2 rounded-lg text-slate-500 hover:bg-yellow-50 hover:text-yellow-600 transition"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => setShowDeleteModal(course.id)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p className="text-slate-500 font-bold">No courses found</p>
            <p className="text-slate-400 text-sm font-medium mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredCourses.length > 0 && (
          <div className="px-4 md:px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="font-bold text-brandDark">1-{filteredCourses.length}</span> of{" "}
              <span className="font-bold text-brandDark">{filteredCourses.length}</span> courses
            </p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="w-10 h-10 text-sm font-bold bg-brandTeal text-white rounded-lg">1</button>
              <button className="px-4 py-2 text-sm font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============ DELETE CONFIRMATION MODAL ============ */}
      {showDeleteModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 className="text-xl font-black text-brandDark text-center mb-2">Delete Course?</h3>
            <p className="text-sm text-slate-500 text-center font-medium mb-6">
              This action cannot be undone. Are you sure you want to delete this course?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;