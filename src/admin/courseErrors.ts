import { supabase } from "../supabaseClient";

type SupabaseError = {
  code?: string;
  message: string;
};

export async function requireSignedInUser(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return `Could not verify your Supabase sign-in: ${error.message}`;
  if (!data.user) return "Your Supabase session has expired. Sign in again, then retry.";
  return null;
}

export function getCourseErrorMessage(
  error: SupabaseError,
  tableName = "public.courses or public.course_categories",
): string {
  if (error.code === "23505") {
    return "A course category with this name or slug already exists. Use a unique category name and slug.";
  }

  if (
    error.code === "23503" ||
    error.message.includes("courses_category_fkey")
  ) {
    return "This category is assigned to one or more courses. Reassign or delete those courses before deleting the category.";
  }

  if (
    error.code === "42501" ||
    error.message.includes("row-level security policy")
  ) {
    return `Supabase rejected the write to ${tableName} under row-level security. This form verified your signed-in user. In the SQL Editor for the project configured by VITE_SUPABASE_URL, inspect pg_policies for ${tableName}; confirm a PERMISSIVE authenticated INSERT/UPDATE policy allows this row and that no RESTRICTIVE policy blocks it. Course creation sends created_by as your signed-in user ID.`;
  }

  if (error.code === "PGRST205" || error.message.includes("schema cache")) {
    const missingTable = error.message.includes("course_categories")
      ? "public.course_categories"
      : "public.courses";
    return `Supabase cannot find ${missingTable} in its schema cache. Run the latest supabase/migrations/20261002000000_create_courses.sql in the SQL Editor for the project configured by VITE_SUPABASE_URL. Verify both tables with select to_regclass('public.courses'), to_regclass('public.course_categories'); then restart Vite and reload the page.`;
  }

  return error.message;
}
