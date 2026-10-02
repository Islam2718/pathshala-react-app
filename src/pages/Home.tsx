// import React from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../component-global/Hero.tsx';
import CoursesSection from './HomeComponent/CourseSection.tsx';

function Home() {
  const { t } = useTranslation();

  // demo data starts 
  const students = [
    {
      id: 1,
      name: "Ayesha Siddiqua",
      role: "New Student",
      course: "Web Development",
      status: "Just Enrolled",
      statusType: "new", // new, active, completed
      avatar: "https://i.pravatar.cc/150?img=1", // ডেমো ছবি
      time: "2 mins ago"
    },
    {
      id: 2,
      name: "Rahim Uddin",
      role: "Old Student",
      course: "Python Programming",
      status: "Completed MCQ Test",
      statusType: "active",
      avatar: "https://i.pravatar.cc/150?img=3",
      time: "15 mins ago"
    },
    {
      id: 3,
      name: "Sara Khan",
      role: "New Student",
      course: "Graphic Design",
      status: "Enrolled in Tutorial",
      statusType: "new",
      avatar: "https://i.pravatar.cc/150?img=5",
      time: "1 hour ago"
    },
    {
      id: 4,
      name: "Tanvir Ahmed",
      role: "Old Student",
      course: "Data Science",
      status: "Practicing Lesson",
      statusType: "active",
      avatar: "https://i.pravatar.cc/150?img=8",
      time: "3 hours ago"
    },
    {
      id: 5,
      name: "Nusrat Jahan",
      role: "New Student",
      course: "Digital Marketing",
      status: "Just Enrolled",
      statusType: "new",
      avatar: "https://i.pravatar.cc/150?img=9",
      time: "5 hours ago"
    },
    {
      id: 6,
      name: "Imran Hossain",
      role: "Old Student",
      course: "App Development",
      status: "Completed Course",
      statusType: "completed",
      avatar: "https://i.pravatar.cc/150?img=11",
      time: "1 day ago"
    }
  ];


  const getStatusBadge = (type: any, statusText: any) => {
    switch (type) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-brandTeal border border-teal-100">
            <span className="w-1.5 h-1.5 rounded-full bg-brandTeal animate-pulse"></span>
            {statusText}
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            {statusText}
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600 border border-yellow-100">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {statusText}
          </span>
        );
      default:
        return null;
    }
  };
  // demo data starts ends  
  return (
    <>
      <Hero />
      <CoursesSection />
      {/* students grid section  */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="flex flex-col items-center justify-center text-center mb-10">
            <h2 className="text-brandTeal font-bold tracking-wide uppercase text-sm mb-2">{t('our_tiny')}</h2>
            <h3 className="text-3xl font-black text-brandDark">{t('peeps')}</h3>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar with online/status indicator */}
                  <div className="relative">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-50 h-50 rounded-full object-cover border-2 border-slate-100"
                    />
                    {/* Role Badge (New/Old) */}
                    <span className={`absolute -bottom-1 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white ${student.role === 'New Student'
                      ? 'bg-brandYellow text-brandDark'
                      : 'bg-slate-200 text-slate-600'
                      }`}>
                      {student.role === 'New Student' ? 'NEW' : 'OLD'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <h4 className="text-brandDark font-bold text-base leading-tight">{student.name}</h4>
                    <p className="text-slate-500 text-sm font-medium mt-0.5">{student.course}</p>
                  </div>
                </div>

                {/* Bottom Section: Status & Time */}
                <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                  {getStatusBadge(student.statusType, student.status)}
                  <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">{student.time}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      
      
      <section id="roles" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brandTeal font-bold tracking-wide uppercase text-sm mb-2">{t('tailored_for_everyone')}</h2>
            <h3 className="text-3xl md:text-4xl font-black text-brandDark">{t('one_platform_three_roles')}</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* <!-- Student Card --> */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition duration-300 group">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-brandTeal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-brandDark mb-3">For Students</h4>
              <ul className="space-y-3 text-slate-600 font-medium">
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Create comprehensive profiles</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Enroll in courses & tutorials</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Take regular MCQ tests</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Practice lessons daily</li>
              </ul>
            </div>

            {/* <!-- Teacher Card --> */}
            <div className="bg-brandDark rounded-3xl p-8 border border-slate-800 shadow-2xl transform md:-translate-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-bl-full opacity-20"></div>
              <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <svg className="w-8 h-8 text-brandTeal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3 relative z-10">For Teachers</h4>
              <ul className="space-y-3 text-slate-300 font-medium relative z-10">
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Manage personal students</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Create courses & lessons</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Design exams & question papers</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Track student performance</li>
              </ul>
            </div>

            {/* <!-- School Card --> */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition duration-300 group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-brandDark mb-3">For Schools</h4>
              <ul className="space-y-3 text-slate-600 font-medium">
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Manage entire school education</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Organization enrollment</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Centralized dashboard</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brandTeal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Bulk student management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- CTA Section --> */}
      <section className="py-20 bg-brandTeal relative overflow-hidden">
        <div className="absolute inset-0 bg-teal-600 opacity-20 pattern-dots"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to start your learning journey?</h2>
          <p className="text-teal-50 text-lg mb-10 font-medium max-w-2xl mx-auto">Join thousands of students, teachers, and schools who are already growing with Pico Learn.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-brandTeal hover:bg-slate-50 font-black py-4 px-10 rounded-full shadow-xl transition transform hover:-translate-y-1 text-lg">
              Create Free Account
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-full transition text-lg">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

    </>
  )
}
export default Home;