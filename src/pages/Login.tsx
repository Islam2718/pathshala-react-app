import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Login() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        const loginValue = identifier.trim();
        const payload = loginValue.includes("@")
            ? { email: loginValue, password }
            : { phone: loginValue, password };

        const { error: signInError } = await supabase.auth.signInWithPassword(payload as any);

        if (signInError) {
            setError(signInError.message);
            setLoading(false);
            return;
        }

        navigate("/");
    };

    return (
        <section className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
                <div className="mb-8 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-brandTeal">Login to </p>
                    <h1 className="mt-2 text-3xl font-black text-brandDark">Pico Learn</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        {/* <label htmlFor="identifier" className="mb-2 block text-sm font-semibold text-slate-700">
                            Email or Phone
                        </label> */}
                        <input
                            id="identifier"
                            type="text"
                            value={identifier}
                            onChange={(event) => setIdentifier(event.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-brandTeal focus:bg-white"
                            placeholder="Email or Phone !"
                        />
                    </div>

                    <div>
                        {/* <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                            Password
                        </label> */}
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-brandTeal focus:bg-white"
                            placeholder="Password !"
                        />
                    </div>

                    {error && (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-brandDark px-5 py-3 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don&apos;t have an account? {" "}
                    <Link to="/signup" className="font-bold text-brandTeal hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </section>
    );
}

export default Login;