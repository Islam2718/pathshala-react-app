import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            phone,
            options: {
                data: {
                    full_name: name,
                    phone,
                },
                emailRedirectTo: `${window.location.origin}/login`,
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        if (data.user && !data.session) {
            setSuccess("Check your email to confirm your account before logging in.");
            setName("");
            setPhone("");
            setEmail("");
            setPassword("");
        } else {
            navigate("/");
        }

        setLoading(false);
    };

    return (
        <section className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
                <div className="mb-8 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-brandTeal">Join now</p>
                    <h1 className="mt-2 text-3xl font-black text-brandDark">Create your account</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        {/* <label htmlFor="signup-name" className="mb-2 block text-sm font-semibold text-slate-700">
                            Name
                        </label> */}
                        <input
                            id="signup-name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-brandTeal focus:bg-white"
                            placeholder="Your full name"
                        />
                    </div>

                    <div>
                        {/* <label htmlFor="signup-phone" className="mb-2 block text-sm font-semibold text-slate-700">
                            Phone
                        </label> */}
                        <input
                            id="signup-phone"
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-brandTeal focus:bg-white"
                            placeholder="Phone number (e.g., +8801XXXXXXXXX)"
                        />
                    </div>

                    <div>
                        {/* <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold text-slate-700">
                            Email
                        </label> */}
                        <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-brandTeal focus:bg-white"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        {/* <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold text-slate-700">
                            Password
                        </label> */}
                        <input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            minLength={6}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-brandTeal focus:bg-white"
                            placeholder="Minimum 6 characters"
                        />
                    </div>

                    {error && (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-brandTeal px-5 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account? {" "}
                    <Link to="/login" className="font-bold text-brandTeal hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
}

export default Signup;