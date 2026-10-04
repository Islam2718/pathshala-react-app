import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getCourseErrorMessage } from "./courseErrors";

type CourseStatus = "Published" | "Draft" | "Archived";
type CourseCategory = { name: string; isActive: boolean };

type CourseValues = {
  title: string;
  category: string;
  classLevel: string;
  board: string;
  description: string;
  subjects: string;
  lessons: string;
  tests: string;
  status: CourseStatus;
};

const emptyCourse: CourseValues = {
  title: "",
  category: "",
  classLevel: "",
  board: "",
  description: "",
  subjects: "",
  lessons: "0",
  tests: "0",
  status: "Draft",
};

const fieldClassName =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brandTeal";

function CourseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [values, setValues] = useState<CourseValues>(emptyCourse);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(isEditing);
  const [courseLoaded, setCourseLoaded] = useState(!isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadCategories = async () => {
      const { data, error: categoryError } = await supabase
        .from("course_categories")
        .select("name, is_active")
        .order("name");
      if (!active) return;
      if (categoryError) {
        setError(getCourseErrorMessage(categoryError));
      } else {
        setCategories(data.map((category) => ({
          name: category.name,
          isActive: category.is_active,
        })));
      }
      setCategoriesLoading(false);
    };
    void loadCategories();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    let active = true;
    const loadCourse = async () => {
      setLoading(true);
      setError("");
      const { data, error: loadError } = await supabase
        .from("courses")
        .select("title, category, class_level, board, description, subjects, lessons, tests, status")
        .eq("id", id)
        .single();

      if (!active) return;
      if (loadError) {
        setError(getCourseErrorMessage(loadError));
      } else {
        setValues({
          title: data.title,
          category: data.category,
          classLevel: data.class_level,
          board: data.board,
          description: data.description ?? "",
          subjects: (data.subjects ?? []).join(", "),
          lessons: String(data.lessons),
          tests: String(data.tests),
          status: data.status,
        });
        setCourseLoaded(true);
      }
      setLoading(false);
    };

    void loadCourse();
    return () => {
      active = false;
    };
  }, [id]);

  const updateField = <K extends keyof CourseValues>(
    field: K,
    value: CourseValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    const { data: authData, error: authLookupError } = await supabase.auth.getUser();
    if (authLookupError || !authData.user) {
      setError(
        authLookupError
          ? `Could not verify your Supabase sign-in: ${authLookupError.message}`
          : "Your Supabase session has expired. Sign in again, then retry.",
      );
      setSaving(false);
      return;
    }

    const course = {
      title: values.title.trim(),
      category: values.category.trim(),
      class_level: values.classLevel.trim(),
      board: values.board.trim(),
      description: values.description.trim(),
      subjects: values.subjects
        .split(/[,\n]/)
        .map((subject) => subject.trim())
        .filter(Boolean),
      lessons: Number(values.lessons),
      tests: Number(values.tests),
      status: values.status,
      is_published: values.status === "Published",
      updated_at: new Date().toISOString().slice(0, 10),
    };

    const result = id
      ? await supabase.from("courses").update(course).eq("id", id).select("id").single()
      : await supabase.from("courses").insert({
          ...course,
          created_by: authData.user.id,
          students: 0,
        }).select("id").single();

    if (result.error) {
      setError(getCourseErrorMessage(result.error, "public.courses"));
      setSaving(false);
      return;
    }

    navigate("/admin/courses");
  };

  if (loading) {
    return <p className="py-12 text-center font-semibold text-slate-500">Loading course...</p>;
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brandDark">
            {isEditing ? "Edit Course" : "Add New Course"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Course information is saved directly to Supabase.
          </p>
        </div>
        <Link
          to="/admin/courses"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
        >
          Back to courses
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-8">
        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700 md:col-span-2">
            Course title
            <input
              className={fieldClassName}
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              required
              maxLength={160}
              placeholder="e.g. Class 1-2 Full Syllabus"
            />
          </label>

          <label className="text-sm font-bold text-slate-700">
            Category
            <select
              className={fieldClassName}
              value={values.category}
              onChange={(event) => updateField("category", event.target.value)}
              required
              disabled={categoriesLoading || categories.length === 0}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}{category.isActive ? "" : " (Inactive)"}
                </option>
              ))}
            </select>
            {categories.length === 0 && !categoriesLoading && (
              <span className="mt-1 block font-normal text-amber-700">
                Add a category before creating a course.{" "}
                <Link to="/admin/course-categories" className="font-bold underline">
                  Manage categories
                </Link>
              </span>
            )}
          </label>

          <label className="text-sm font-bold text-slate-700">
            Class level
            <input
              className={fieldClassName}
              value={values.classLevel}
              onChange={(event) => updateField("classLevel", event.target.value)}
              required
              maxLength={80}
              placeholder="e.g. Class 1-2"
            />
          </label>

          <label className="text-sm font-bold text-slate-700">
            Board / syllabus
            <input
              className={fieldClassName}
              value={values.board}
              onChange={(event) => updateField("board", event.target.value)}
              required
              maxLength={120}
              placeholder="e.g. NCTB"
            />
          </label>

          <label className="text-sm font-bold text-slate-700 md:col-span-2">
            Description
            <textarea
              className={fieldClassName}
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={4}
              placeholder="Describe what students will learn in this course"
            />
          </label>

          <label className="text-sm font-bold text-slate-700 md:col-span-2">
            Subjects
            <textarea
              className={fieldClassName}
              value={values.subjects}
              onChange={(event) => updateField("subjects", event.target.value)}
              rows={2}
              placeholder="e.g. Mathematics, Science, English"
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">
              Separate subjects with commas or new lines.
            </span>
          </label>

          <label className="text-sm font-bold text-slate-700">
            Status
            <select
              className={fieldClassName}
              value={values.status}
              onChange={(event) => updateField("status", event.target.value as CourseStatus)}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </label>

          <label className="text-sm font-bold text-slate-700">
            Number of lessons
            <input
              className={fieldClassName}
              type="number"
              min="0"
              step="1"
              value={values.lessons}
              onChange={(event) => updateField("lessons", event.target.value)}
              required
            />
          </label>

          <label className="text-sm font-bold text-slate-700">
            Number of tests
            <input
              className={fieldClassName}
              type="number"
              min="0"
              step="1"
              value={values.tests}
              onChange={(event) => updateField("tests", event.target.value)}
              required
            />
          </label>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <Link
            to="/admin/courses"
            className="rounded-xl px-5 py-3 text-center text-sm font-bold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !courseLoaded || categoriesLoading || categories.length === 0}
            className="rounded-xl bg-brandTeal px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create course"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CourseForm;
