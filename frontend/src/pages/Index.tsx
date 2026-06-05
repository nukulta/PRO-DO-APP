import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layout, Calendar, MessageSquare, Plus, CheckCircle2, Circle, Clock, Search, Bell, Sidebar, MoreHorizontal, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-xl"
    >
      <div className="text-xl font-bold tracking-tight flex items-center gap-2 cursor-pointer text-white" onClick={() => navigate('/')}>
        <div className="w-5 h-5 bg-white rounded-sm"></div>
        ProDO
      </div>
      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/resources')} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Resources</button>
        <button onClick={() => navigate('/community')} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Community</button>
        <button
          onClick={() => navigate('/register')}
          className="px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-zinc-200 transition-all"
        >
          Get Started
        </button>
      </div>
    </motion.nav>
  );
};

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true, margin: "-100px" }}
    className={className}
  >
    {children}
  </motion.div>
);

const FeatureCard = ({ title, desc, icon, className = "", delay = 0 }) => (
  <FadeIn delay={delay} className={`p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/10 hover:bg-zinc-900/80 transition-all duration-300 group ${className}`}>
    <div className="mb-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </div>
    <div className="h-32 w-full bg-black/40 rounded-xl border border-white/5 relative overflow-hidden group-hover:border-white/10 transition-colors">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
    </div>
  </FadeIn>
);

const TestimonialCard = ({ quote, author, role, delay }) => (
  <FadeIn delay={delay} className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      ))}
    </div>
    <p className="text-zinc-300 mb-6 text-lg">"{quote}"</p>
    <div className="flex flex-col">
      <div className="text-white font-medium text-sm">{author}</div>
      <div className="text-zinc-500 text-xs">{role}</div>
    </div>
  </FadeIn>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="min-h-screen font-sans bg-black text-white selection:bg-white/20">
      <Navbar />

      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-300">v2.0 is now live</span>
          </div>
        </FadeIn>

        <motion.h1
          className="text-6xl md:text-8xl font-bold tracking-tight mb-8 max-w-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Master your workflow,<br />
          <span className="text-white">amplify results.</span>
        </motion.h1>

        <FadeIn delay={0.2}>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 mx-auto leading-relaxed">
            ProDO is the all-in-one workspace for high-performing teams. Manage projects, chat in real-time, and document everything.
          </p>
        </FadeIn>

        <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-24">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            Start for free
          </button>
          <button
            onClick={() => navigate('/resources')}
            className="px-8 py-4 bg-white/5 text-white rounded-full font-semibold hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md"
          >
            How it works
          </button>
        </FadeIn>

        {/* Hero Visual */}
        <motion.div
          style={{ y: heroY }}
          className="relative w-full max-w-6xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
          <div className="rounded-xl border border-white/10 shadow-2xl bg-[#0a0a0a] overflow-hidden">
            {/* Simulated App Header */}
            <div className="h-10 border-b border-white/5 flex items-center px-4 justify-between bg-[#050505]">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-md border border-white/5">
                <Search className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] text-zinc-500">Search tasks...</span>
              </div>
            </div>
            {/* Simulated Content */}
            <div className="flex h-[600px] text-[10px] md:text-xs font-sans">
              {/* Sidebar */}
              <div className="w-56 border-r border-white/5 hidden md:flex flex-col bg-[#080808]">
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center gap-2 font-bold text-zinc-200">
                    <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded"></div>
                    ProDO Workspace
                  </div>
                </div>
                <div className="p-3 space-y-6">
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 text-zinc-500 font-semibold text-[10px] uppercase tracking-wider">Main</div>
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-white/5 text-white rounded-md border border-white/5">
                      <Layout className="w-3.5 h-3.5" /> All Tasks
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 hover:text-white transition-colors">
                      <Calendar className="w-3.5 h-3.5" /> Timeline
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 hover:text-white transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-zinc-500 font-semibold text-[10px] uppercase tracking-wider">Projects</span>
                      <Plus className="w-3 h-3 text-zinc-600" />
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Website Redesign
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Q4 Roadmap
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> Marketing
                    </div>
                  </div>
                </div>
                <div className="mt-auto p-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[9px] text-white">JD</div>
                    <div className="flex-1 text-zinc-300">John Doe</div>
                  </div>
                </div>
              </div>

              {/* Board */}
              <div className="flex-1 bg-black flex flex-col">
                <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]">
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-white">All Tasks</h2>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-400">Sprint 24</span>
                  </div>
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-black flex items-center justify-center">U1</div>
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-black flex items-center justify-center">U2</div>
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-black flex items-center justify-center"><Plus className="w-3 h-3" /></div>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-hidden">
                  <div className="grid grid-cols-3 gap-6 h-full">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-zinc-400 font-medium">
                          <span className="w-2 h-2 rounded-full bg-zinc-600"></span> TODO
                        </div>
                        <MoreHorizontal className="w-3 h-3 text-zinc-600" />
                      </div>
                      <div className="p-3 bg-[#111] border border-white/5 rounded-lg hover:border-zinc-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[9px] border border-orange-500/20">High</span>
                        </div>
                        <div className="text-zinc-200 mb-1">Revamp Landing Page</div>
                        <div className="text-zinc-500 text-[10px]">Update hero section visuals...</div>
                      </div>
                      <div className="p-3 bg-[#111] border border-white/5 rounded-lg hover:border-zinc-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] border border-blue-500/20">Medium</span>
                        </div>
                        <div className="text-zinc-200 mb-1">Q3 Analytics Report</div>
                        <div className="text-zinc-500 text-[10px] flex items-center gap-1"><Clock className="w-3 h-3" /> Tomorrow</div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-zinc-400 font-medium">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span> IN PROGRESS
                        </div>
                        <MoreHorizontal className="w-3 h-3 text-zinc-600" />
                      </div>
                      <div className="p-3 bg-[#111] border border-white/5 rounded-lg hover:border-zinc-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 text-[9px] border border-red-500/20">Urgent</span>
                        </div>
                        <div className="text-zinc-200 mb-1">Fix API Latency</div>
                        <div className="text-zinc-500 text-[10px]">Investigate connection pool limit</div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-purple-500 text-[8px] flex items-center justify-center text-white font-bold">V</div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-zinc-400 font-medium">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span> DONE
                        </div>
                        <MoreHorizontal className="w-3 h-3 text-zinc-600" />
                      </div>
                      <div className="p-3 bg-[#111] border border-white/5 rounded-lg opacity-60">
                        <div className="flex justify-between items-start mb-2">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[9px]">Low</span>
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        </div>
                        <div className="text-zinc-300 line-through mb-1">Team Onboarding</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">Trusted by innovative teams worldwide</p>
          <div className="flex justify-center flex-wrap gap-12 grayscale opacity-50">
            {/* Simple text placeholders for logos as per design constraint */}
            {['Acme Corp', 'Nebula', 'Velocity', 'Trio', 'FoxRun'].map(brand => (
              <span key={brand} className="text-xl font-bold text-zinc-400 font-serif italic">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything you need,<br /><span className="text-zinc-500">all in one place.</span></h2>
          <p className="text-xl text-zinc-400">Stop switching between apps. ProDO integrates your tasks, docs, and communication into a single, cohesive operating system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            className="md:col-span-2"
            title="Advanced Project Management"
            desc="Kanban boards, Gantt charts, and list views. Visualize your work your way with powerful filtering and sorting."
            icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            delay={0.1}
          />
          <FeatureCard
            className="md:col-span-1"
            title="Real-time Chat"
            desc="Contextual discussions right alongside your tasks."
            icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
            delay={0.2}
          />
          <FeatureCard
            className="md:col-span-1"
            title="Knowledge Base"
            desc="Create beautiful internal documentation."
            icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            delay={0.3}
          />
          <FeatureCard
            className="md:col-span-2"
            title="Team Flow"
            desc="See what everyone is working on without pestering them. Automated status updates and check-ins."
            icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            delay={0.4}
          />
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 border-t border-white/5 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Seamless Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {[
              { title: "Capture", desc: "Instantly capture ideas and tasks from anywhere." },
              { title: "Organize", desc: "Prioritize with drag-and-drop ease." },
              { title: "Execute", desc: "Focus mode to help you cross the finish line." }
            ].map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.2} className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center z-10 mb-6 text-2xl font-bold">
                  0{idx + 1}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-zinc-400 max-w-xs">{step.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Loved by productivity enthusiasts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            quote="ProDO has completely transformed how our design team operates. The dark mode is simply stunning."
            author="Sarah Jenkins"
            role="Product Designer @ TechFlow"
            delay={0.1}
          />
          <TestimonialCard
            quote="Finally, a project management tool that doesn't feel like a spreadsheet. It's fast, fluid, and focused."
            author="Michael Chen"
            role="Founder @ StartUp Inc"
            delay={0.2}
          />
          <TestimonialCard
            quote="The community templates saved us weeks of setup time. Highly recommended for remote teams."
            author="Elena Rodriguez"
            role="Operations Lead"
            delay={0.3}
          />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6">
        <FadeIn className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 blur-[80px] rounded-full"></div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to ship faster?</h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">Join thousands of teams who have switched to a better way of working.</p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-5 bg-white text-black text-lg rounded-full font-bold hover:bg-zinc-200 transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            Get Started for Free
          </button>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
          <div className="mb-4 md:mb-0 flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-800 rounded-sm"></div>
            &copy; {new Date().getFullYear()} ProDO Team. All rights reserved.
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
