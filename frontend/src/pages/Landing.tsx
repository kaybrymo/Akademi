import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  MessageSquare, 
  Wallet, 
  Bell, 
  ShieldCheck, 
  ArrowRight,
  Star,
  Quote,
  Sparkles
} from 'lucide-react';

export default function Landing() {
  const [ctaEmail, setCtaEmail] = React.useState('');
  return (
    <div className="w-full bg-[#FBF9F4] text-[#141E18] font-sans selection:bg-[#0F5338] selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column — Content & Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 pr-0 lg:pr-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif font-bold text-[#141E18] tracking-tight leading-[1.12] mb-6">
              Learn with tutors <span className="italic font-normal text-[#0F5338]">who actually get you.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Akademi connects students with vetted tutors for personalised 1:1 and group sessions. Discover, book, chat, and pay — all from one calm, focused workspace.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-12">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full px-6 py-3 text-sm font-semibold shadow-xs transition-all active:scale-[0.98]"
              >
                Find your tutor <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register?role=tutor"
                className="inline-flex items-center justify-center bg-white border border-[#E8E3D7] hover:bg-slate-50 text-slate-800 rounded-full px-6 py-3 text-sm font-semibold transition-colors shadow-2xs"
              >
                Teach on Akademi
              </Link>
            </div>

            {/* 3 Metric Stat Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8E3D7] max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18]">120+</p>
                <p className="text-xs text-slate-500 mt-0.5">Vetted Tutors</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18]">20k+</p>
                <p className="text-xs text-slate-500 mt-0.5">Sessions Completed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18] flex items-center gap-1">
                  4.9 <Star className="h-4 w-4 fill-amber-400 text-amber-400 inline" />
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Avg Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column — Hero Frame & Floating Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Back dark green card backdrop */}
              <div className="absolute top-4 right-0 w-[92%] h-[100%] bg-[#0F5338] rounded-3xl -z-10" />
              
              {/* Foreground Image container */}
              <div className="relative mr-8 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <img 
                  src="/images/hero-student.jpg" 
                  alt="Student studying with online tutor" 
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>

              {/* Floating Tutor Pill */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="absolute -bottom-6 left-4 sm:left-6 bg-white rounded-2xl p-3.5 shadow-lg border border-[#E8E3D7] flex items-center gap-3.5 max-w-xs"
              >
                <img 
                  src="/images/tutor-adaeze.jpg" 
                  alt="Adaeze Nwosu" 
                  className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-[#0F5338]/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#141E18]">Adaeze Nwosu</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500">Spanish · Today, 6:00 PM</p>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold mt-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 5.0 (84 reviews)
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0F5338] mb-2">Everything You Need</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
            A focused workspace for learning — not another noisy app.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Search,
              title: "Find tutors that fit",
              desc: "Search by subject, level, language, price, and availability. Read reviews and watch intro videos before booking."
            },
            {
              icon: Calendar,
              title: "Book in seconds",
              desc: "See real-time availability across time zones and lock in 1:1 or group sessions with a single tap."
            },
            {
              icon: MessageSquare,
              title: "Chat in real time",
              desc: "Message tutors before, during, and after class. Share files, homework, and recordings without leaving Akademi."
            },
            {
              icon: Wallet,
              title: "Wallet & payouts",
              desc: "Top up once, learn many times. Tutors get paid securely with transparent commission and instant payouts."
            },
            {
              icon: Bell,
              title: "Smart reminders",
              desc: "Automated email, SMS, and push notifications keep every session on schedule for students and tutors alike."
            },
            {
              icon: ShieldCheck,
              title: "Verified & safe",
              desc: "Every tutor is identity-checked and reviewed. Parents can monitor minors with built-in guardian controls."
            }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#E8E3D7] p-6 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#0F5338]/10 text-[#0F5338] flex items-center justify-center mb-5 font-bold">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#141E18] mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. COURSES SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0F5338] mb-2">Featured Courses</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
              Hand-picked courses to jumpstart your learning.
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-[#0F5338] hover:underline flex items-center gap-1 shrink-0"
          >
            Browse all courses &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Mastering Calculus Foundations",
              level: "Intermediate",
              sessions: "12 sessions",
              tutor: "Daniel Okafor",
              rating: "4.9",
              rate: "₦8,500/hr",
              image: "/images/tutor-daniel.jpg"
            },
            {
              title: "Conversational Spanish in 30 Days",
              level: "Beginner",
              sessions: "20 sessions",
              tutor: "Adaeze Nwosu",
              rating: "5.0",
              rate: "₦6,000/hr",
              image: "/images/tutor-adaeze.jpg"
            },
            {
              title: "Physics for Engineers",
              level: "Advanced",
              sessions: "16 sessions",
              tutor: "Dr. Ibrahim Sanni",
              rating: "4.9",
              rate: "₦12,000/hr",
              image: "/images/tutor-ibrahim.jpg"
            }
          ].map((course, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#E8E3D7] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-6"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {course.level} · {course.sessions}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {course.rating}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#141E18] mb-6 leading-snug">
                  {course.title}
                </h3>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E8E3D7]">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={course.image} 
                    alt={course.tutor} 
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#141E18] leading-tight">{course.tutor}</p>
                    <p className="text-[10px] text-slate-400">Lead tutor</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0F5338] bg-[#0F5338]/10 px-2.5 py-1 rounded-full">
                  {course.rate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS (Full-width deep Forest Green) */}
      <section id="how" className="py-24 bg-[#0E4833] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300/80 mb-2">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-4">
              From <span className="italic font-normal text-emerald-200">"I need help"</span> to your first session — in under five minutes.
            </h2>
            <p className="text-emerald-100/80 text-sm">
              Built for students, parents, and independent tutors. No installs, no paperwork — just a calmer way to learn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discover",
                desc: "Browse profiles, ratings, and subjects. Filter by language, level, and price."
              },
              {
                step: "02",
                title: "Book",
                desc: "Pick a slot that works for both of you. Pay securely from your Akademi wallet."
              },
              {
                step: "03",
                title: "Learn",
                desc: "Join live with chat, video, and shared files. Replay recordings anytime."
              },
              {
                step: "04",
                title: "Grow",
                desc: "Track your progress, leave reviews, and rebook the tutors you love."
              }
            ].map((item, i) => (
              <div key={i} className="border-t border-emerald-600/40 pt-6">
                <span className="text-xs font-mono font-bold text-emerald-300 mb-3 block">{item.step}</span>
                <h3 className="text-lg font-serif font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-emerald-100/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VETTED TUTORS SECTION */}
      <section id="tutors" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0F5338] mb-2">Verified Educators</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
              Vetted experts across 80+ subjects.
            </h2>
          </div>
          <Link
            to="/tutors"
            className="text-xs font-bold text-[#0F5338] hover:underline flex items-center gap-1 shrink-0"
          >
            Browse all tutors &rarr;
          </Link>
        </div>

        {/* 3 Tutor Photo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              id: "1",
              name: "Daniel Okafor",
              subjects: "Mathematics · Physics",
              tag: "Curriculum planning",
              rating: "4.9",
              sessions: "310 sessions",
              rate: "₦8,500/hr",
              image: "/images/tutor-daniel.jpg"
            },
            {
              id: "2",
              name: "Adaeze Nwosu",
              subjects: "Spanish · French",
              tag: "Language study roadmap",
              rating: "5.0",
              sessions: "420 sessions",
              rate: "₦6,000/hr",
              image: "/images/tutor-adaeze.jpg"
            },
            {
              id: "3",
              name: "Dr. Ibrahim Sanni",
              subjects: "Physics · Engineering",
              tag: "University admissions",
              rating: "4.9",
              sessions: "540 sessions",
              rate: "₦12,000/hr",
              image: "/images/tutor-ibrahim.jpg"
            }
          ].map((tutor, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#E8E3D7] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-64 sm:h-72 w-full overflow-hidden bg-slate-100 relative">
                <img 
                  src={tutor.image} 
                  alt={tutor.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {tutor.rating}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#141E18]">{tutor.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{tutor.subjects}</p>
                  <span className="inline-block bg-[#F3EFE6] text-[#0F5338] text-[11px] font-semibold px-3 py-1 rounded-full mb-4">
                    {tutor.tag}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E8E3D7]">
                  <div>
                    <span className="text-xs font-bold text-[#141E18]">{tutor.rate}</span>
                    <span className="text-[10px] text-slate-400 block">{tutor.sessions}</span>
                  </div>
                  <Link
                    to={`/tutors/${tutor.id}`}
                    className="border border-[#0F5338] text-[#0F5338] hover:bg-[#0F5338] hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 1:1 Consultancy Advisory Card */}
        <div className="bg-white rounded-2xl border border-[#E8E3D7] p-8 sm:p-10 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F5338] bg-[#0F5338]/10 px-3 py-1 rounded-full inline-block mb-3">
                1:1 Advisory
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18] mb-3">
                More than tutoring — book 1:1 consultancy sessions.
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                Beyond weekly lessons, our tutors offer targeted advisory sessions: university admissions, curriculum design, exam strategy and career guidance. Pay per session, no long commitments.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-3">
              {[
                { id: "1", name: "Daniel Okafor", tag: "Curriculum planning", image: "/images/tutor-daniel.jpg" },
                { id: "2", name: "Adaeze Nwosu", tag: "Language study roadmap", image: "/images/tutor-adaeze.jpg" },
                { id: "3", name: "Dr. Ibrahim Sanni", tag: "University admissions", image: "/images/tutor-ibrahim.jpg" }
              ].map((advisor, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-[#FBF9F4] border border-[#E8E3D7]">
                  <div className="flex items-center gap-3">
                    <img src={advisor.image} alt={advisor.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-[#141E18]">{advisor.name}</p>
                      <p className="text-[10px] text-slate-500">{advisor.tag}</p>
                    </div>
                  </div>
                  <Link to={`/tutors/${advisor.id}`} className="text-xs font-bold text-[#0F5338] hover:underline">
                    Book session &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIAL QUOTE SECTION */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="w-10 h-10 rounded-full bg-[#0F5338]/10 text-[#0F5338] flex items-center justify-center mx-auto mb-6">
          <Quote className="h-5 w-5" />
        </div>
        <blockquote className="text-2xl sm:text-3xl font-serif text-[#141E18] leading-snug mb-6">
          “I went from dreading Calculus to actually enjoying it. My tutor felt like a patient older sibling — and booking weekly sessions takes mere seconds.”
        </blockquote>
        <div className="flex items-center justify-center gap-3">
          <img 
            src="/images/hero-student.jpg" 
            alt="Amaka N." 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs" 
          />
          <div className="text-left">
            <p className="text-xs font-bold text-[#141E18]">Amaka Nze</p>
            <p className="text-[11px] text-slate-500">A-Level Mathematics Student</p>
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section id="cta" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0E4833] rounded-3xl text-white p-10 sm:p-16 text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-4 text-white">
              Your next breakthrough is one session away.
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base mb-8 leading-relaxed">
              Join thousands of students learning smarter — and tutors building careers — on Akademi.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                value={ctaEmail}
                onChange={(e) => setCtaEmail(e.target.value)}
                placeholder="Enter your email address..." 
                className="w-full sm:w-auto flex-1 h-11 px-4 text-xs rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <Link
                to={ctaEmail ? `/register?email=${encodeURIComponent(ctaEmail)}` : '/register'}
                className="w-full sm:w-auto bg-[#F59E0B] hover:bg-amber-500 text-slate-950 font-bold rounded-full px-6 py-3 text-xs shadow-lg transition-all"
              >
                Get started &rarr;
              </Link>
            </div>
            
            <p className="text-[11px] text-emerald-200/70 mt-4">Free to join. No credit card needed.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
