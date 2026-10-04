import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getCourseErrorMessage, requireSignedInUser } from "./courseErrors";

type Course = {
  id: string;
  title: string;
};

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  content: string | null;
  lesson_order: number;
  is_published: boolean;
};

type LessonForm = {
  title: string;
  description: string;
  videoUrl: string;
  content: string;
  lessonOrder: string;
  isPublished: boolean;
};

const emptyLesson: LessonForm = {
  title: "",
  description: "",
  videoUrl: "",
  content: "",
  lessonOrder: "1",
  isPublished: false,
};

const fieldClassName =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brandTeal";

function getLessonErrorMessage(error: { code?: string; message: string }): string {
  if (error.code === "PGRST205" || error.message.includes("schema cache")) {
    return "Supabase cannot find public.course_lessons. Apply the latest course lesson migrations, then reload this page.";
  }

  return getCourseErrorMessage(error);
}

export default function CourseLessons() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LessonForm>(emptyLesson);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState("");

  const loadCourseAndLessons = useCallback(async () => {
    if (!courseId) {
      setError("Course was not specified.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    const [courseResult, lessonsResult] = await Promise.all([
      supabase.from("courses").select("id, title").eq("id", courseId).maybeSingle(),
      supabase
        .from("course_lessons")
        .select("id, title, description, video_url, content, lesson_order, is_published")
        .eq("course_id", courseId)
        .order("lesson_order", { ascending: true }),
    ]);

    if (courseResult.error) {
      setError(getCourseErrorMessage(courseResult.error));
    } else if (!courseResult.data) {
      setError("Course not found or you do not have access to it.");
    } else {
      setCourse(courseResult.data);
    }

    if (lessonsResult.error) {
      setError(getLessonErrorMessage(lessonsResult.error));
    } else {
      setLessons(lessonsResult.data);
    }
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!courseId) {
        setError("Course was not specified.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      const [courseResult, lessonsResult] = await Promise.all([
        supabase.from("courses").select("id, title").eq("id", courseId).maybeSingle(),
        supabase
          .from("course_lessons")
          .select("id, title, description, video_url, content, lesson_order, is_published")
          .eq("course_id", courseId)
          .order("lesson_order", { ascending: true }),
      ]);

      if (!active) return;
      if (courseResult.error) {
        setError(getCourseErrorMessage(courseResult.error));
      } else if (!courseResult.data) {
        setError("Course not found or you do not have access to it.");
      } else {
        setCourse(courseResult.data);
      }

      if (lessonsResult.error) {
        setError(getLessonErrorMessage(lessonsResult.error));
      } else {
        setLessons(lessonsResult.data);
      }
      setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, [courseId]);

  const beginCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyLesson,
      lessonOrder: String(lessons.length + 1),
    });
    setFormOpen(true);
    setError("");
  };

  const beginEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setForm({
      title: lesson.title,
      description: lesson.description ?? "",
      videoUrl: lesson.video_url ?? "",
      content: lesson.content ?? "",
      lessonOrder: String(lesson.lesson_order),
      isPublished: lesson.is_published,
    });
    setFormOpen(true);
    setError("");
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!courseId) return;

    setSaving(true);
    setError("");
    const authError = await requireSignedInUser();
    if (authError) {
      setError(authError);
      setSaving(false);
      return;
    }

    const lesson = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      video_url: form.videoUrl.trim() || null,
      content: form.content.trim() || null,
      lesson_order: Number(form.lessonOrder),
      is_published: form.isPublished,
    };

    const result = editingId
      ? await supabase
          .from("course_lessons")
          .update(lesson)
          .eq("id", editingId)
          .eq("course_id", courseId)
      : await supabase
          .from("course_lessons")
          .insert({ ...lesson, course_id: courseId });

    if (result.error) {
      setError(getLessonErrorMessage(result.error));
      setSaving(false);
      return;
    }

    setFormOpen(false);
    setEditingId(null);
    setSaving(false);
    await loadCourseAndLessons();
  };

  const handleDelete = async (lesson: Lesson) => {
    if (!courseId || !window.confirm(`Delete "${lesson.title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(lesson.id);
    setError("");
    const authError = await requireSignedInUser();
    if (authError) {
      setError(authError);
      setDeletingId(null);
      return;
    }

    const { error: deleteError } = await supabase
      .from("course_lessons")
      .delete()
      .eq("id", lesson.id)
      .eq("course_id", courseId);

    if (deleteError) {
      setError(getLessonErrorMessage(deleteError));
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    await loadCourseAndLessons();
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/courses"
            className="text-sm font-bold text-brandTeal hover:underline"
          >
            ← Back to courses
          </Link>
          <h1 className="mt-2 text-2xl font-black text-brandDark">
            {course ? `Lessons: ${course.title}` : "Course lessons"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, order, and publish lessons for this course.
          </p>
        </div>
        <button
          type="button"
          onClick={beginCreate}
          disabled={!course || loading}
          className="rounded-xl bg-brandTeal px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add lesson
        </button>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={(event) => void handleSave(event)}
          className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7"
        >
          <h2 className="text-lg font-black text-brandDark">
            {editingId ? "Edit lesson" : "Add a lesson"}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Lesson title
              <input
                className={fieldClassName}
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                maxLength={200}
                required
              />
            </label>
            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Short description
              <textarea
                className={fieldClassName}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                rows={2}
              />
            </label>
            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Video URL
              <input
                className={fieldClassName}
                type="url"
                value={form.videoUrl}
                onChange={(event) => setForm((current) => ({ ...current, videoUrl: event.target.value }))}
                placeholder="https://..."
              />
            </label>
            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Lesson content
              <textarea
                className={fieldClassName}
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                rows={6}
                placeholder="Lesson notes or learning material"
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Lesson order
              <input
                className={fieldClassName}
                type="number"
                min="1"
                step="1"
                value={form.lessonOrder}
                onChange={(event) => setForm((current) => ({ ...current, lessonOrder: event.target.value }))}
                required
              />
            </label>
            <label className="flex items-center gap-3 self-end pb-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
                className="h-4 w-4 accent-brandTeal"
              />
              Published
            </label>
          </div>
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-xl px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brandTeal px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Save lesson" : "Create lesson"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-12 text-center font-semibold text-slate-500">Loading lessons...</p>
        ) : lessons.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-bold text-slate-700">No lessons in this course yet</p>
            <p className="mt-1 text-sm text-slate-500">Add the first lesson to start building the course.</p>
          </div>
        ) : (
          <ol className="divide-y divide-slate-100">
            {lessons.map((lesson) => (
              <li key={lesson.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-sm font-black text-brandTeal">
                    {lesson.lesson_order}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-bold text-brandDark">{lesson.title}</h2>
                    {lesson.description && (
                      <p className="mt-1 text-sm text-slate-500">{lesson.description}</p>
                    )}
                    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                      lesson.is_published
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {lesson.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    to={`/admin/courses/${courseId}/lessons/${lesson.id}/test`}
                    className="rounded-lg border border-brandTeal/20 bg-teal-50 px-3 py-2 text-sm font-bold text-brandTeal transition hover:bg-teal-100"
                  >
                    MCQ test
                  </Link>
                  <button
                    type="button"
                    onClick={() => beginEdit(lesson)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-brandTeal hover:text-brandTeal"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(lesson)}
                    disabled={deletingId === lesson.id}
                    className="rounded-lg border border-red-100 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {deletingId === lesson.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
