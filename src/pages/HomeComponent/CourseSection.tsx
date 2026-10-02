import { useState } from "react";

const CoursesSection = () => {
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', label: 'All Courses' },
        { id: 'preschool', label: 'Pre School' },
        { id: 'primary', label: 'Class 1-5' },
        { id: 'secondary', label: 'Class 6-10' },
        { id: 'higher', label: 'Class 11-12' },
        { id: 'job', label: 'Job Preparation' },
    ];

    // Authorized Course Data
    const courses = [
        {
            id: 1,
            title: "Pre School Foundation Course",
            category: "preschool",
            categoryLabel: "Pre School",
            board: "Play Group",
            image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.9,
            students: 4200,
            subjects: ["English", "Bangla", "Math", "Rhymes"],
            lessons: 48,
            tests: 12,
            tag: "Kids Favorite",
            tagColor: "bg-pink-500 text-white",
            color: "from-pink-500 to-rose-500"
        },
        {
            id: 2,
            title: "Class 1-2 Full Syllabus (NCTB)",
            category: "primary",
            categoryLabel: "Class 1-5",
            board: "NCTB",
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.8,
            students: 3800,
            subjects: ["Bangla", "English", "Math"],
            lessons: 96,
            tests: 24,
            tag: "Authorized",
            tagColor: "bg-brandYellow text-brandDark",
            color: "from-brandTeal to-teal-600"
        },
        {
            id: 3,
            title: "Class 3-5 Math & Science Special",
            category: "primary",
            categoryLabel: "Class 1-5",
            board: "NCTB",
            image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.7,
            students: 2200,
            subjects: ["Math", "Science", "English"],
            lessons: 72,
            tests: 18,
            tag: "Updated 2024",
            tagColor: "bg-blue-500 text-white",
            color: "from-blue-500 to-indigo-600"
        },
        {
            id: 4,
            title: "Class 6-8 Full Academic Course",
            category: "secondary",
            categoryLabel: "Class 6-10",
            board: "NCTB",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.9,
            students: 9800,
            subjects: ["Math", "Science", "English", "ICT"],
            lessons: 180,
            tests: 45,
            tag: "Popular",
            tagColor: "bg-orange-500 text-white",
            color: "from-orange-500 to-red-500"
        },
        {
            id: 5,
            title: "SSC Preparation (Class 9-10) Full Syllabus",
            category: "secondary",
            categoryLabel: "Class 6-10",
            board: "NCTB / All Boards",
            image: "https://images.unsplash.com/photo-1607157954349-2c2ae0d0e8e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.8,
            students: 14500,
            subjects: ["Math", "Physics", "Chemistry", "Biology"],
            lessons: 240,
            tests: 60,
            tag: "SSC Special",
            tagColor: "bg-purple-500 text-white",
            color: "from-purple-500 to-fuchsia-600"
        },
        {
            id: 6,
            title: "HSC Science Group Complete Course",
            category: "higher",
            categoryLabel: "Class 11-12",
            board: "NCTB / All Boards",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.9,
            students: 11200,
            subjects: ["Physics", "Chemistry", "Higher Math", "Biology"],
            lessons: 320,
            tests: 80,
            tag: "HSC Special",
            tagColor: "bg-emerald-500 text-white",
            color: "from-emerald-500 to-teal-600"
        },
        {
            id: 7,
            title: "HSC Commerce & Humanities Full Course",
            category: "higher",
            categoryLabel: "Class 11-12",
            board: "NCTB / All Boards",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.7,
            students: 6400,
            subjects: ["Accounting", "Business", "Economics", "Civics"],
            lessons: 280,
            tests: 70,
            tag: "Updated",
            tagColor: "bg-cyan-500 text-white",
            color: "from-cyan-500 to-blue-600"
        },
        {
            id: 8,
            title: "BCS Preliminary Complete Preparation",
            category: "job",
            categoryLabel: "Job Preparation",
            board: "BPSC Syllabus",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.9,
            students: 22000,
            subjects: ["Bangla", "English", "Math", "GK", "Science"],
            lessons: 400,
            tests: 120,
            tag: "Best Seller",
            tagColor: "bg-brandYellow text-brandDark",
            color: "from-brandDark to-slate-800"
        },
        {
            id: 9,
            title: "Bank Job Preparation (All Banks)",
            category: "job",
            categoryLabel: "Job Preparation",
            board: "Bank Recruitment",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.8,
            students: 18600,
            subjects: ["Math", "English", "GK", "Computer"],
            lessons: 320,
            tests: 100,
            tag: "Trending",
            tagColor: "bg-blue-500 text-white",
            color: "from-blue-600 to-indigo-700"
        },
        {
            id: 10,
            title: "Primary Teacher Registration Exam",
            category: "job",
            categoryLabel: "Job Preparation",
            board: "NTRCA Syllabus",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.7,
            students: 8900,
            subjects: ["Bangla", "English", "Math", "GK"],
            lessons: 180,
            tests: 50,
            tag: "Hot",
            tagColor: "bg-red-500 text-white",
            color: "from-red-500 to-orange-600"
        }
    ];

    const filteredCourses = activeTab === 'all' 
        ? courses 
        : courses.filter(c => c.category === activeTab);

    return (
        <section className="py-24 bg-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">                
                {/* Section Header */}
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-brandTeal font-bold text-sm mb-4 border border-teal-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        Academic Courses
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-brandDark mb-3">
                        Courses for Every Stage of Learning
                    </h3>
                    <p className="text-slate-500 font-medium max-w-2xl">
                        From Pre School to Class 12 and Job Preparation — all courses follow the authorized government syllabus.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 md:px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border-2 ${
                                activeTab === tab.id
                                    ? 'bg-brandTeal text-white border-brandTeal shadow-lg scale-105'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-brandTeal hover:text-brandTeal'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course) => (
                        <div 
                            key={course.id} 
                            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col"
                        >
                            {/* Course Image */}
                            <div className="relative h-44 overflow-hidden bg-slate-200">
                                <img 
                                    src={course.image} 
                                    alt={course.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                
                                <div className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-30 group-hover:opacity-50 transition-opacity`}></div>

                                {/* Tag Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-md tracking-wider ${course.tagColor}`}>
                                        {course.tag}
                                    </span>
                                </div>

                                {/* Authorized Badge */}
                                <div className="absolute top-3 right-3">
                                    <div className="bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-md" title="Authorized">
                                        <svg className="w-4 h-4 text-brandTeal" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <div className="absolute bottom-3 left-3">
                                    <span className="text-xs font-black bg-white/95 backdrop-blur-sm text-brandDark px-3 py-1.5 rounded-full shadow-md">
                                        {course.categoryLabel}
                                    </span>
                                </div>
                            </div>

                            {/* Course Details */}
                            <div className="p-5 flex-1 flex flex-col">
                                
                                {/* Board & Rating */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-black text-brandTeal bg-teal-50 px-2 py-1 rounded-md uppercase tracking-wider">
                                        {course.board}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                        <span className="text-sm font-bold text-brandDark">{course.rating}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h4 className="text-base font-black text-brandDark leading-snug mb-3 group-hover:text-brandTeal transition line-clamp-2 min-h-[3rem]">
                                    {course.title}
                                </h4>

                                {/* Subjects List */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {course.subjects.slice(0, 3).map((sub, idx) => (
                                        <span key={idx} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                            {sub}
                                        </span>
                                    ))}
                                    {course.subjects.length > 3 && (
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                            +{course.subjects.length - 3} more
                                        </span>
                                    )}
                                </div>

                                {/* Stats Section - Lessons & Tests */}
                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-xs mb-4">
                                        <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                                            <svg className="w-4 h-4 text-brandTeal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                            {course.lessons} Lessons
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                                            <svg className="w-4 h-4 text-brandTeal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            {course.tests} Tests
                                        </div>
                                    </div>

                                    {/* View Course Button */}
                                    <button className="w-full bg-brandTeal hover:bg-teal-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition transform hover:-translate-y-0.5 shadow-sm flex items-center justify-center gap-2">
                                        Explore Course
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                    </button>

                                    {/* Student Count */}
                                    <div className="flex items-center justify-center gap-1 text-xs text-slate-400 font-semibold mt-3">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        {(course.students / 1000).toFixed(1)}k+ students enrolled
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-slate-400 font-bold text-lg">এই ক্যাটাগরিতে এখনো কোনো কোর্স যোগ করা হয়নি।</p>
                    </div>
                )}

                {/* View All Button */}
                <div className="mt-14 text-center">
                    <button className="bg-brandDark hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1 inline-flex items-center gap-2">
                        Browse All Courses
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </button>
                </div>

            </div>
        </section>
    );
};

export default CoursesSection;