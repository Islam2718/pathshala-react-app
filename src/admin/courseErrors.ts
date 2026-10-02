type SupabaseError = {
  code?: string;
  message: string;
};

export function getCourseErrorMessage(error: SupabaseError): string {
  if (
    error.code === "42501" ||
    error.message.includes("row-level security policy")
  ) {
    return "Supabase rejected this course change because of row-level security. Confirm you are signed in, then verify the authenticated INSERT/UPDATE/DELETE policies on public.courses in Supabase.";
  }

  if (
    error.code === "PGRST205" ||
    (error.message.includes("public.courses") && error.message.includes("schema cache"))
  ) {
    return "Supabase cannot find public.courses. Run supabase/migrations/20261002000000_create_courses.sql in the SQL Editor for the project configured by VITE_SUPABASE_URL, then reload the page.";
  }

  return error.message;
}
