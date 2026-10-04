import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getCourseErrorMessage } from "../admin/courseErrors";

type Course = {
  id: string;
  title: string;
  category: string;
  classLevel: string;
  board: string;
  description: string;
  subjects: string[];
  lessons: number;
  tests: number;
};

type Props = {
  title: string;
  description: string;
  sectionClassName?: string;
};

export default function CourseCatalog({
  title,
  description,
  sectionClassName = "bg-indigo-50",
}: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadCatalog = async () => {
      const [categoryResult, courseResult] = await Promise.all([
        supabase
          .from("course_categories")
          .select("name")
          .eq("is_active", true)
          .order("name"),
        supabase
          .from("courses")
          .select("id, title, category, class_level, board, description, subjects, lessons, tests")
          .eq("status", "Published")
          .order("updated_at", { ascending: false }),
      ]);

      if (!active) return;
      const loadError = categoryResult.error ?? courseResult.error;
      if (loadError) {
        setError(getCourseErrorMessage(loadError));
      } else if (!categoryResult.data || !courseResult.data) {
        setError("Supabase returned no course catalog data. Please reload and try again.");
      } else {
        const activeCategories = categoryResult.data.map((category) => category.name);
        setCategories(activeCategories);
        setCourses(
          courseResult.data
            .filter((course) => activeCategories.includes(course.category))
            .map((course) => ({
              id: course.id,
              title: course.title,
              category: course.category,
              classLevel: course.class_level,
              board: course.board,
              description: course.description ?? "",
              subjects: course.subjects ?? [],
              lessons: course.lessons,
              tests: course.tests,
            })),
        );
      }
      setLoading(false);
    };

    void loadCatalog();
    return () => {
      active = false;
    };
  }, []);

  const visibleCourses =
    activeCategory === "all"
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  return (
    <section className={`py-20 ${sectionClassName}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <span className="mb-4 inline-flex rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-bold text-brandTeal">
            Academic Courses
          </span>
          <h2 className="mb-3 text-3xl font-black text-brandDark md:text-4xl">{title}</h2>
          <p className="mx-auto max-w-2xl font-medium text-slate-500">{description}</p>
        </header>

        {!error && categories.length > 0 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2" aria-label="Filter courses by category">
            {["all", ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
                  activeCategory === category
                    ? "border-brandTeal bg-brandTeal text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brandTeal hover:text-brandTeal"
                }`}
              >
                {category === "all" ? "All Courses" : category}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p role="alert" className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        {loading && (
          <p className="py-10 text-center font-semibold text-slate-500">Loading courses...</p>
        )}

        {!loading && !error && visibleCourses.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <p className="text-lg font-bold text-brandDark">No courses available yet</p>
            <p className="mt-2 text-sm text-slate-500">Published courses will appear here.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleCourses.map((course) => (
            <article
              key={course.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex min-h-32 flex-col justify-between bg-gradient-to-br from-brandTeal to-teal-800 p-5 text-white">
                <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  {course.category}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-100">
                    {course.board}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{course.classLevel}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-black leading-snug text-brandDark">{course.title}</h3>
                {course.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-slate-500">{course.description}</p>
                )}
                {course.subjects.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {course.subjects.slice(0, 4).map((subject) => (
                      <span
                        key={subject}
                        className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600"
                      >
                        {subject}
                      </span>
                    ))}
                    {course.subjects.length > 4 && (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        +{course.subjects.length - 4}
                      </span>
                    )}
                  </div>
                )}
                <div className="mt-auto flex justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                  <span>{course.lessons} lessons</span>
                  <span>{course.tests} tests</span>
                </div>
                <Link
                  to="/login"
                  className="mt-4 rounded-xl bg-brandTeal px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-teal-700"
                >
                  Sign in to access
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
