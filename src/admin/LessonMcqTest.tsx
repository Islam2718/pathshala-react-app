import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getCourseErrorMessage, requireSignedInUser } from "./courseErrors";

type Lesson = {
  id: string;
  title: string;
  is_published: boolean;
};

type Exam = {
  id: string;
  title: string;
  is_published: boolean;
};

type McqOption = {
  option_text: string;
  is_correct: boolean;
  option_order: number;
};

type Question = {
  id: string;
  question_text: string;
  marks: number;
  question_order: number;
  options: McqOption[];
};

type QuestionForm = {
  text: string;
  marks: string;
  options: Array<{ text: string; isCorrect: boolean }>;
};

const emptyQuestion: QuestionForm = {
  text: "",
  marks: "1",
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
};

const fieldClassName =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brandTeal";

function getTestErrorMessage(error: { code?: string; message: string }): string {
  if (error.code === "PGRST202" || error.message.includes("save_lesson_mcq_question")) {
    return "Supabase cannot find the lesson MCQ save function. Apply migration 20261004000011_create_lesson_mcq_tests.sql, then reload this page.";
  }
  if (error.code === "PGRST205" || error.message.includes("schema cache")) {
    return "Supabase cannot find the lesson test schema. Apply migration 20261004000011_create_lesson_mcq_tests.sql, then reload this page.";
  }
  return getCourseErrorMessage(error);
}

export default function LessonMcqTest() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState<QuestionForm>(emptyQuestion);
  const [testTitle, setTestTitle] = useState("");
  const [testPublished, setTestPublished] = useState(false);
  const [savingTest, setSavingTest] = useState(false);

  const loadTest = useCallback(async (isActive: () => boolean = () => true) => {
    if (!courseId || !lessonId) {
      setError("Course and lesson must be specified.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    const [lessonResult, examResult] = await Promise.all([
      supabase
        .from("course_lessons")
        .select("id, title, is_published")
        .eq("id", lessonId)
        .eq("course_id", courseId)
        .maybeSingle(),
      supabase
        .from("exams")
        .select("id, title, is_published")
        .eq("lesson_id", lessonId)
        .maybeSingle(),
    ]);

    if (!isActive()) return;
    if (lessonResult.error) {
      setError(getTestErrorMessage(lessonResult.error));
      setLoading(false);
      return;
    }
    if (!lessonResult.data) {
      setError("Lesson not found or you do not have permission to manage it.");
      setLoading(false);
      return;
    }

    setLesson(lessonResult.data);
    if (examResult.error) {
      setError(getTestErrorMessage(examResult.error));
      setLoading(false);
      return;
    }

    const currentExam = examResult.data;
    setExam(currentExam);
    if (!currentExam) {
      setQuestions([]);
      setTestTitle(`${lessonResult.data.title} MCQ Test`);
      setTestPublished(false);
      setLoading(false);
      return;
    }

    setTestTitle(currentExam.title);
    setTestPublished(currentExam.is_published);
    const { data: questionRows, error: questionError } = await supabase
      .from("questions")
      .select("id, question_text, marks, question_order")
      .eq("exam_id", currentExam.id)
      .order("question_order", { ascending: true });

    if (!isActive()) return;
    if (questionError) {
      setError(getTestErrorMessage(questionError));
      setLoading(false);
      return;
    }

    if (questionRows.length === 0) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    const questionIds = questionRows.map((question) => question.id);
    const { data: optionRows, error: optionError } = await supabase
      .from("question_options")
      .select("question_id, option_text, is_correct, option_order")
      .in("question_id", questionIds)
      .order("option_order", { ascending: true });

    if (!isActive()) return;
    if (optionError) {
      setError(getTestErrorMessage(optionError));
      setLoading(false);
      return;
    }

    setQuestions(questionRows.map((question) => ({
      ...question,
      options: optionRows
        .filter((option) => option.question_id === question.id)
        .map(({ option_text, is_correct, option_order }) => ({
          option_text,
          is_correct,
          option_order,
        })),
    })));
    setLoading(false);
  }, [courseId, lessonId]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await loadTest(() => active);
    };
    void load();
    return () => {
      active = false;
    };
  }, [loadTest]);

  const createTest = async () => {
    if (!courseId || !lessonId || !lesson) return;
    setSavingTest(true);
    setError("");
    const authError = await requireSignedInUser();
    if (authError) {
      setError(authError);
      setSavingTest(false);
      return;
    }
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setError(userError?.message ?? "Your Supabase session has expired. Sign in again.");
      setSavingTest(false);
      return;
    }

    const { data: createdExam, error: createError } = await supabase
      .from("exams")
      .insert({
        title: testTitle.trim() || `${lesson.title} MCQ Test`,
        course_id: courseId,
        lesson_id: lessonId,
        created_by: userData.user.id,
        is_published: false,
      })
      .select("id, title, is_published")
      .single();

    if (createError) {
      setError(getTestErrorMessage(createError));
      setSavingTest(false);
      return;
    }
    setExam(createdExam);
    setTestTitle(createdExam.title);
    setTestPublished(false);
    setSavingTest(false);
    await loadTest();
  };

  const saveTestSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!exam) return;
    if (testPublished && questions.length === 0) {
      setError("Add at least one question before publishing this test.");
      return;
    }
    setSavingTest(true);
    setError("");
    const authError = await requireSignedInUser();
    if (authError) {
      setError(authError);
      setSavingTest(false);
      return;
    }
    const { error: updateError } = await supabase
      .from("exams")
      .update({ title: testTitle.trim(), is_published: testPublished })
      .eq("id", exam.id);

    if (updateError) {
      setError(getTestErrorMessage(updateError));
      setSavingTest(false);
      return;
    }
    setSavingTest(false);
    await loadTest();
  };

  const openQuestionForm = (question?: Question) => {
    setEditingQuestionId(question?.id ?? null);
    setQuestionForm(question
      ? {
          text: question.question_text,
          marks: String(question.marks),
          options: question.options.map((option) => ({
            text: option.option_text,
            isCorrect: option.is_correct,
          })),
        }
      : {
          ...emptyQuestion,
          options: emptyQuestion.options.map((option) => ({ ...option })),
        });
    setFormOpen(true);
    setError("");
  };

  const handleSaveQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!exam || !lessonId) return;

    const normalizedOptions = questionForm.options
      .map((option) => ({ ...option, text: option.text.trim() }))
      .filter((option) => option.text.length > 0);
    if (normalizedOptions.length < 2) {
      setError("Each MCQ needs at least two non-empty answer options.");
      return;
    }
    if (normalizedOptions.filter((option) => option.isCorrect).length !== 1) {
      setError("Mark exactly one answer option as correct.");
      return;
    }

    setSaving(true);
    setError("");
    const authError = await requireSignedInUser();
    if (authError) {
      setError(authError);
      setSaving(false);
      return;
    }

    const { error: saveError } = await supabase.rpc("save_lesson_mcq_question", {
      p_lesson_id: lessonId,
      p_exam_id: exam.id,
      p_question_id: editingQuestionId,
      p_question_text: questionForm.text.trim(),
      p_marks: Number(questionForm.marks),
      p_options: normalizedOptions.map((option, index) => ({
        option_text: option.text,
        is_correct: option.isCorrect,
        option_order: index + 1,
      })),
    });

    if (saveError) {
      setError(getTestErrorMessage(saveError));
      setSaving(false);
      return;
    }
    setSaving(false);
    setFormOpen(false);
    setEditingQuestionId(null);
    await loadTest();
  };

  const deleteQuestion = async (question: Question) => {
    if (!window.confirm(`Delete this question: "${question.question_text}"?`)) return;
    setDeletingQuestionId(question.id);
    setError("");
    const authError = await requireSignedInUser();
    if (authError) {
      setError(authError);
      setDeletingQuestionId(null);
      return;
    }

    const { error: deleteError } = await supabase
      .from("questions")
      .delete()
      .eq("id", question.id)
      .eq("exam_id", exam?.id);

    if (deleteError) {
      setError(getTestErrorMessage(deleteError));
      setDeletingQuestionId(null);
      return;
    }
    setDeletingQuestionId(null);
    await loadTest();
  };

  const deleteTest = async () => {
    if (!exam) return;
    if (!window.confirm("Delete this lesson test and all its questions? This cannot be undone.")) return;
    setSavingTest(true);
    setError("");
    const authError = await requireSignedInUser();
    if (authError) {
      setError(authError);
      setSavingTest(false);
      return;
    }
    const { error: deleteError } = await supabase.from("exams").delete().eq("id", exam.id);
    if (deleteError) {
      setError(getTestErrorMessage(deleteError));
      setSavingTest(false);
      return;
    }
    setExam(null);
    setQuestions([]);
    setTestTitle(lesson ? `${lesson.title} MCQ Test` : "");
    setTestPublished(false);
    setSavingTest(false);
  };

  const updateOption = (index: number, patch: Partial<QuestionForm["options"][number]>) => {
    setQuestionForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, ...patch } : option,
      ),
    }));
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header>
        <Link
          to={`/admin/courses/${courseId}/lessons`}
          className="text-sm font-bold text-brandTeal hover:underline"
        >
          ← Back to lessons
        </Link>
        <h1 className="mt-2 text-2xl font-black text-brandDark">
          {lesson ? `MCQ test: ${lesson.title}` : "Lesson MCQ test"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          A test is optional. Add answer choices to each question and mark exactly one correct answer.
        </p>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center font-semibold text-slate-500">
          Loading lesson test...
        </div>
      ) : !exam ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void createTest();
          }}
          className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7"
        >
          <div>
            <h2 className="text-lg font-black text-brandDark">No test added</h2>
            <p className="mt-1 text-sm text-slate-500">Create an optional MCQ test for this lesson.</p>
          </div>
          <label className="block text-sm font-bold text-slate-700">
            Test title
            <input
              className={fieldClassName}
              value={testTitle}
              onChange={(event) => setTestTitle(event.target.value)}
              maxLength={200}
              required
            />
          </label>
          <button
            type="submit"
            disabled={savingTest || !lesson}
            className="rounded-xl bg-brandTeal px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60"
          >
            {savingTest ? "Creating..." : "Create optional test"}
          </button>
        </form>
      ) : (
        <>
          <form
            onSubmit={(event) => void saveTestSettings(event)}
            className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <label className="min-w-[240px] flex-1 text-sm font-bold text-slate-700">
              Test title
              <input
                className={fieldClassName}
                value={testTitle}
                onChange={(event) => setTestTitle(event.target.value)}
                maxLength={200}
                required
              />
            </label>
            <label className="flex items-center gap-2 pb-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={testPublished}
                onChange={(event) => setTestPublished(event.target.checked)}
                className="h-4 w-4 accent-brandTeal"
              />
              Published
            </label>
            <button
              type="submit"
              disabled={savingTest}
              className="rounded-xl bg-brandTeal px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              Save test
            </button>
            <button
              type="button"
              onClick={() => void deleteTest()}
              disabled={savingTest}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              Remove test
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-brandDark">Questions ({questions.length})</h2>
              <p className="text-sm text-slate-500">Add MCQ questions and mark one correct choice for each.</p>
            </div>
            <button
              type="button"
              onClick={() => openQuestionForm()}
              className="rounded-xl bg-brandTeal px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              Add question
            </button>
          </div>

          {formOpen && (
            <form
              onSubmit={(event) => void handleSaveQuestion(event)}
              className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7"
            >
              <h2 className="text-lg font-black text-brandDark">
                {editingQuestionId ? "Edit question" : "New MCQ question"}
              </h2>
              <label className="block text-sm font-bold text-slate-700">
                Question
                <textarea
                  className={fieldClassName}
                  value={questionForm.text}
                  onChange={(event) => setQuestionForm((current) => ({ ...current, text: event.target.value }))}
                  rows={3}
                  required
                />
              </label>
              <label className="block max-w-xs text-sm font-bold text-slate-700">
                Marks
                <input
                  className={fieldClassName}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={questionForm.marks}
                  onChange={(event) => setQuestionForm((current) => ({ ...current, marks: event.target.value }))}
                  required
                />
              </label>
              <fieldset className="space-y-3">
                <legend className="text-sm font-bold text-slate-700">
                  Answer options <span className="font-normal text-slate-500">(select the correct answer)</span>
                </legend>
                {questionForm.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={option.isCorrect}
                      onChange={() => setQuestionForm((current) => ({
                        ...current,
                        options: current.options.map((item, optionIndex) => ({
                          ...item,
                          isCorrect: optionIndex === index,
                        })),
                      }))}
                      aria-label={`Mark option ${index + 1} correct`}
                      className="h-4 w-4 accent-brandTeal"
                    />
                    <input
                      className={fieldClassName}
                      value={option.text}
                      onChange={(event) => updateOption(index, { text: event.target.value })}
                      maxLength={1000}
                      placeholder={`Option ${index + 1}`}
                      aria-label={`Option ${index + 1} text`}
                    />
                    {questionForm.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setQuestionForm((current) => ({
                          ...current,
                          options: current.options.filter((_, optionIndex) => optionIndex !== index),
                        }))}
                        className="rounded-lg px-2 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                        aria-label={`Remove option ${index + 1}`}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {questionForm.options.length < 6 && (
                  <button
                    type="button"
                    onClick={() => setQuestionForm((current) => ({
                      ...current,
                      options: [...current.options, { text: "", isCorrect: false }],
                    }))}
                    className="text-sm font-bold text-brandTeal hover:underline"
                  >
                    + Add option
                  </button>
                )}
              </fieldset>
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
                  {saving ? "Saving..." : editingQuestionId ? "Save question" : "Add question"}
                </button>
              </div>
            </form>
          )}

          {questions.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center">
              <p className="font-bold text-slate-700">No questions yet</p>
              <p className="mt-1 text-sm text-slate-500">The test will be empty until you add an MCQ.</p>
            </div>
          ) : (
            <ol className="space-y-4">
              {questions.map((question) => (
                <li key={question.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-brandTeal">
                        Question {question.question_order} · {question.marks} mark{question.marks === 1 ? "" : "s"}
                      </p>
                      <h3 className="mt-1 font-bold text-brandDark">{question.question_text}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openQuestionForm(question)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-brandTeal hover:text-brandTeal"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteQuestion(question)}
                        disabled={deletingQuestionId === question.id}
                        className="rounded-lg border border-red-100 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        {deletingQuestionId === question.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => (
                      <li
                        key={option.option_order}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          option.is_correct
                            ? "border-green-200 bg-green-50 font-bold text-green-800"
                            : "border-slate-100 text-slate-600"
                        }`}
                      >
                        {option.option_text}
                        {option.is_correct && <span className="ml-2 text-xs">Correct answer</span>}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </section>
  );
}
