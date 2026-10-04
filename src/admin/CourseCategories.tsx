import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getCourseErrorMessage, requireSignedInUser } from "./courseErrors";

type Category = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
};

function createSlug(value: string): string {
  const slug = value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug) return slug;

  const hash = Array.from(value).reduce(
    (result, character) => (result * 31 + character.codePointAt(0)!) >>> 0,
    0,
  );
  return `category-${hash.toString(36)}`;
}

const fieldClassName =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brandTeal";

export default function CourseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [editingName, setEditingName] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCategories = async () => {
    const { data, error: loadError } = await supabase
      .from("course_categories")
      .select("name, slug, description, is_active")
      .order("name");

    if (loadError) {
      setError(getCourseErrorMessage(loadError));
    } else {
      setCategories(
        data.map((category) => ({
          name: category.name,
          slug: category.slug,
          description: category.description,
          isActive: category.is_active,
        })),
      );
      setError("");
    }
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error: loadError } = await supabase
        .from("course_categories")
        .select("name, slug, description, is_active")
        .order("name");
      if (!active) return;
      if (loadError) {
        setError(getCourseErrorMessage(loadError));
      } else {
        setCategories(
          data.map((category) => ({
            name: category.name,
            slug: category.slug,
            description: category.description,
            isActive: category.is_active,
          })),
        );
      }
      setLoading(false);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setIsActive(true);
    setEditingName(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    const authError = await requireSignedInUser();
    if (authError) {
      setError(authError);
      setSaving(false);
      return;
    }
    const category = {
      name: name.trim(),
      slug: createSlug(slug || name),
      description: description.trim(),
      is_active: isActive,
    };
    const result = editingName
      ? await supabase
          .from("course_categories")
          .update(category)
          .eq("name", editingName)
      : await supabase.from("course_categories").insert(category);

    if (result.error) {
      setError(getCourseErrorMessage(result.error));
      setSaving(false);
      return;
    }
    setNotice(editingName ? "Category updated." : "Category created.");
    resetForm();
    await loadCategories();
    setSaving(false);
  };

  const beginEdit = (category: Category) => {
    setEditingName(category.name);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description);
    setIsActive(category.isActive);
    setError("");
    setNotice("");
  };

  const handleDelete = async (categoryName: string) => {
    if (!window.confirm(`Delete the "${categoryName}" category?`)) return;
    setError("");
    setNotice("");
    const authError = await requireSignedInUser();
    if (authError) {
      setError(authError);
      return;
    }
    const { error: deleteError } = await supabase
      .from("course_categories")
      .delete()
      .eq("name", categoryName);
    if (deleteError) {
      setError(getCourseErrorMessage(deleteError));
      return;
    }
    setCategories((current) => current.filter((category) => category.name !== categoryName));
    if (editingName === categoryName) resetForm();
    setNotice("Category deleted.");
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brandDark">Course Categories</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the categories used by course forms and public course filters.
          </p>
        </div>
        <Link
          to="/admin/courses"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
        >
          Back to courses
        </Link>
      </header>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {notice}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
        <h2 className="text-lg font-black text-brandDark">
          {editingName ? `Edit: ${editingName}` : "Add a category"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">
            Category name
            <input
              className={fieldClassName}
              value={name}
              onChange={(event) => {
                const nextName = event.target.value;
                setName(nextName);
                setSlug(createSlug(nextName));
              }}
              maxLength={80}
              required
              placeholder="e.g. Primary"
            />
          </label>
          <label className="text-sm font-bold text-slate-700">
            URL slug
            <input
              className={fieldClassName}
              value={slug}
              onChange={(event) => setSlug(createSlug(event.target.value))}
              maxLength={100}
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              placeholder="e.g. primary"
            />
          </label>
          <label className="text-sm font-bold text-slate-700">
            Description (optional)
            <input
              className={fieldClassName}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={240}
              placeholder="Short description for this category"
            />
          </label>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4 accent-brandTeal"
          />
          Active (show on public course pages)
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brandTeal px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : editingName ? "Save category" : "Add category"}
          </button>
          {editingName && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-12 text-center font-semibold text-slate-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="px-6 py-12 text-center font-semibold text-slate-500">
            No categories yet. Add one above to create courses.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {categories.map((category) => (
              <div key={category.name} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-7">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-brandDark">{category.name}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${category.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {category.description && (
                    <p className="mt-1 text-sm text-slate-500">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => beginEdit(category)}
                    className="rounded-lg px-3 py-2 text-sm font-bold text-brandTeal hover:bg-teal-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(category.name)}
                    className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
