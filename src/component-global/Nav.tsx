import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";

function Nav() {
    const { t, i18n } = useTranslation();
    const { session } = useAuth();
    const navigate = useNavigate();
    const currentLanguage = i18n.resolvedLanguage || i18n.language || 'en';

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const username =
        session?.user?.user_metadata?.full_name ||
        session?.user?.email?.split('@')[0] ||
        'User';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <>
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center gap-4">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-0 cursor-pointer">
                            <div className="flex-shrink-0 flex items-center gap-0 cursor-pointer">
                                <img src="/4.png" alt="Logo" className="h-10 w-auto object-contain" />

                                <div className="text-3xl font-black tracking-tight flex items-center">
                                    <span className="text-brandDark">pico</span>
                                    <span className="text-brandTeal">learn</span>
                                </div>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center gap-5">
                            <Link to="/courses" className="text-slate-600 hover:text-brandTeal font-bold transition">
                                {t('nav_courses')}
                            </Link>

                            <select
                                value={currentLanguage}
                                onChange={(event) => changeLanguage(event.target.value)}
                                className="bg-slate-100 text-slate-600 hover:text-brandTeal font-bold transition rounded-md px-2 py-1"
                                aria-label="Select language"
                            >
                                <option value="en">EN</option>
                                <option value="bn">BN</option>
                            </select>
                            {session ? (
                                <>
                                    <span className="font-bold text-slate-700">{username} <span className="border border-slate-300 px-2 py-1 rounded-full"> 150</span></span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-full shadow-md transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-brandTeal hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-full shadow-md transition transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>

                        <div className="md:hidden flex items-center">
                            <button className="text-slate-600 hover:text-brandTeal focus:outline-none">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Nav;