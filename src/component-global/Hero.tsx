import { useTranslation } from "react-i18next";

function Hero() {
    const { t } = useTranslation();

    return (
        <>
            <header className="relative pt-20 pb-24 lg:pt-32 lg:pb-36 overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] blob-bg rounded-full -z-10 opacity-70"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                        <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-brandTeal font-bold text-sm mb-6 border border-teal-100">
                                <span className="w-2 h-2 rounded-full bg-brandTeal animate-pulse"></span>
                                {t('hero_badge')}
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black text-brandDark leading-tight mb-6">
                                {t('hero_title')} <br />
                                <span className="text-brandTeal">{t('hero_title_highlight')}</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium">
                                {t('hero_subtitle')}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <button className="bg-brandDark hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                    {t('start_learning')}
                                </button>
                                <button className="bg-white hover:bg-slate-50 text-brandDark border-2 border-slate-200 font-bold py-3.5 px-8 rounded-full shadow-sm transition transform hover:-translate-y-1">
                                    {t('im_teacher')}
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-6 relative flex justify-center">
                            <div className="relative w-full max-w-md">
                                <div className="absolute -top-6 -left-6 text-brandYellow animate-bounce">
                                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /></svg>
                                </div>
                                <div className="absolute bottom-10 -right-4 text-brandYellow animate-pulse">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /></svg>
                                </div>

                                <div className="bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-slate-100 relative z-10 flex flex-col items-center">
                                    <div className="w-48 h-48 bg-teal-100 rounded-full flex items-center justify-center mb-4 relative">
                                        <span className="text-6xl">🐥</span>
                                        <div className="absolute -bottom-4 bg-brandDark text-white text-xs font-bold px-4 py-1 rounded-full">{t('reading')}</div>
                                    </div>
                                    <h3 className="text-2xl font-black text-brandDark mt-4">{t('interactive_learning')}</h3>
                                    <p className="text-slate-500 text-center mt-2 font-medium">{t('interactive_learning_desc')}</p>

                                    <div className="mt-6 w-full bg-blue-50 rounded-2xl p-4 flex items-center justify-center gap-3 border border-blue-100">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                        <span className="font-bold text-blue-800">{t('course_enrolled')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Hero;