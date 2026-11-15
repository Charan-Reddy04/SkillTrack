
import React from "react";

const features = [
  {
    icon: "🎯",
    title: "Learning Goals",
    description:
      "Set personal learning goals, organise your targets and monitor your completion progress.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: "🗺️",
    title: "Roadmap Explorer",
    description:
      "Follow structured developer roadmaps and track completed topics step by step.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: "📚",
    title: "Learning Resources",
    description:
      "Save and organise useful tutorials, documentation and learning materials.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: "💻",
    title: "Coding Practice",
    description:
      "Maintain your coding problem history and track your solving progress.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: "🧠",
    title: "Skill Assessment",
    description:
      "Test your technical knowledge with quizzes and review your assessment scores.",
    color: "bg-pink-100 text-pink-700",
  },
  {
    icon: "📊",
    title: "Analytics & Reports",
    description:
      "Understand your learning activities through progress statistics and reports.",
    color: "bg-indigo-100 text-indigo-700",
  },
];

const steps = [
  ["01", "Plan", "Create goals and decide what you want to learn."],
  ["02", "Learn", "Explore roadmaps and useful learning resources."],
  ["03", "Practice", "Solve coding problems and participate in contests."],
  ["04", "Track", "Record study sessions and measure your progress."],
  ["05", "Improve", "Review your performance and keep growing."],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-xl font-bold text-white shadow-lg shadow-violet-200">
              S
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Skill<span className="text-violet-600">Track</span>
              </h1>
              <p className="text-[10px] font-medium tracking-widest text-slate-400">
                LEARN. PRACTICE. GROW.
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#home" className="transition hover:text-violet-600">Home</a>
            <a href="#features" className="transition hover:text-violet-600">Features</a>
            <a href="#how-it-works" className="transition hover:text-violet-600">How It Works</a>
            <a href="#about" className="transition hover:text-violet-600">About</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-violet-50 sm:inline-flex"
            >
              Login
            </a>
            <a
              href="/register"
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Get Started <span className="ml-1">→</span>
            </a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <main>
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-br from-[#f7f5ff] via-white to-[#eeedff]"
        >
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-bold text-violet-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                YOUR PERSONAL LEARNING COMPANION
              </div>

              <h1 className="max-w-2xl text-5xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Your Learning Journey,
                <span className="mt-2 block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  All in One Place.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                Plan your goals, explore learning roadmaps, practise coding
                and track your growth. Everything you need to become better,
                organised in one platform.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="/register"
                  className="rounded-2xl bg-violet-600 px-7 py-4 font-bold text-white shadow-xl shadow-violet-200 transition hover:-translate-y-1 hover:bg-violet-700"
                >
                  Start Learning Free <span className="ml-2">→</span>
                </a>
                <a
                  href="#features"
                  className="rounded-2xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
                >
                  Explore Features
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-500">
                <span>✓ Organise your learning</span>
                <span>✓ Track your progress</span>
                <span>✓ Grow consistently</span>
              </div>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-violet-300/50 to-indigo-300/40 blur-2xl" />

              <div className="relative rotate-1 rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-violet-200/60 sm:p-7">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">WELCOME BACK</p>
                    <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                      Your Dashboard
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-lg">
                    👨‍💻
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    ["Active Goals", "03", "🎯", "text-violet-600"],
                    ["Topics Done", "24", "📘", "text-blue-600"],
                    ["Problems", "56", "💻", "text-emerald-600"],
                    ["Study Hours", "32h", "⏱️", "text-amber-600"],
                  ].map(([label, value, icon, color]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{icon}</span>
                        <span className={`text-xl font-black ${color}`}>{value}</span>
                      </div>
                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Overall Learning Progress
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Keep moving forward!
                      </p>
                    </div>
                    <span className="text-2xl font-black text-violet-600">72%</span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-violet-100">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-600 to-indigo-500" />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white">
                  <div>
                    <p className="text-xs text-violet-200">DAILY MOTIVATION</p>
                    <p className="mt-1 text-sm font-bold">
                      Small steps. Big achievements.
                    </p>
                  </div>
                  <span className="text-3xl">🚀</span>
                </div>
              </div>

              <div className="absolute -left-7 top-24 hidden rounded-2xl border border-white bg-white p-4 shadow-xl sm:block">
                <span className="text-xl">🔥</span>
                <p className="mt-1 text-lg font-black text-slate-900">7 Days</p>
                <p className="text-xs text-slate-500">Learning streak</p>
              </div>

              <div className="absolute -right-5 bottom-12 hidden rounded-2xl border border-white bg-white p-4 shadow-xl sm:block">
                <span className="text-xl">🏆</span>
                <p className="mt-1 text-sm font-extrabold text-slate-900">
                  Keep Growing!
                </p>
                <p className="text-xs text-slate-500">Your journey continues</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-extrabold tracking-[0.25em] text-violet-600">
                EVERYTHING YOU NEED
              </span>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                One Platform. Endless Growth.
              </h2>
              <p className="mt-5 leading-7 text-slate-500">
                Bring your learning goals, practice and progress together
                with tools designed for students.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-500">
                    {feature.description}
                  </p>
                  <div className="mt-5 text-sm font-bold text-violet-600 transition group-hover:translate-x-1">
                    Explore your potential →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="bg-gradient-to-br from-[#171333] via-[#21194c] to-[#30216d] px-6 py-24 text-white lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-extrabold tracking-[0.25em] text-violet-300">
                YOUR LEARNING CYCLE
              </span>
              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Five Steps to Better Learning
              </h2>
              <p className="mt-5 leading-7 text-violet-100/70">
                A simple process that helps you stay focused and keep improving.
              </p>
            </div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map(([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur transition hover:-translate-y-2 hover:bg-white/[0.12]"
                >
                  <span className="text-4xl font-black text-violet-300/50">
                    {number}
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-violet-100/70">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="px-6 py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-extrabold tracking-[0.25em] text-violet-600">
                ABOUT SKILLTRACK
              </span>
              <h2 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                Turn Your Learning Goals Into Real Progress.
              </h2>
              <p className="mt-6 leading-8 text-slate-600">
                SkillTrack is designed to make student learning more organised,
                measurable and productive. It brings essential learning
                activities into one convenient platform.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Organise personal learning goals.",
                  "Maintain coding and study records.",
                  "Measure progress and identify improvement areas.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-700">
                      ✓
                    </span>
                    <p className="font-semibold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-violet-100 to-indigo-100 p-8 sm:p-12">
              <div className="rounded-3xl bg-white p-8 shadow-xl shadow-violet-200/60">
                <div className="text-5xl">🌱</div>
                <h3 className="mt-6 text-3xl font-black text-slate-900">
                  Your Growth Matters.
                </h3>
                <p className="mt-4 leading-7 text-slate-500">
                  Every topic you complete, every problem you solve and
                  every hour you study takes you one step closer to your goals.
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-violet-100">
                    <div className="h-full w-3/4 rounded-full bg-violet-600" />
                  </div>
                  <span className="text-sm font-extrabold text-violet-700">
                    Keep going!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24 lg:px-10">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-700 px-7 py-16 text-center shadow-2xl shadow-violet-200 sm:px-14">
            <span className="text-4xl">🚀</span>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black text-white sm:text-5xl">
              Ready to Take Control of Your Learning?
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-violet-100">
              Start organising your goals, building your skills and tracking
              your progress with SkillTrack.
            </p>
            <a
              href="/register"
              className="mt-9 inline-flex rounded-2xl bg-white px-8 py-4 font-extrabold text-violet-700 shadow-lg transition hover:-translate-y-1 hover:bg-violet-50"
            >
              Get Started Now →
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#171333] px-6 py-12 text-white lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <a href="/" className="text-2xl font-black">
              Skill<span className="text-violet-400">Track</span>
            </a>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              A personal learning and growth platform helping students
              organise their learning journey and improve consistently.
            </p>
          </div>

          <div>
            <h4 className="font-bold">Explore</h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <a href="#home" className="hover:text-white">Home</a>
              <a href="#features" className="hover:text-white">Features</a>
              <a href="#how-it-works" className="hover:text-white">How It Works</a>
              <a href="#about" className="hover:text-white">About</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold">Account</h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <a href="/login" className="hover:text-white">Login</a>
              <a href="/register" className="hover:text-white">Create Account</a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SkillTrack. All rights reserved.
          <p className="mt-2">Plan • Learn • Practice • Track • Improve</p>
        </div>
      </footer>
    </div>
  );
}
