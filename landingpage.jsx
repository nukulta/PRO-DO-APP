import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:bg-black/50 dark:border-white/10">
      <div className="text-xl font-bold tracking-tight flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-5 h-5 bg-black dark:bg-white rounded-sm"></div>
        ProDO
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/resources')} className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Resources</button>
        <button onClick={() => navigate('/community')} className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Community</button>
        <button
          onClick={() => navigate('/register')}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

const FeatureCard = ({ title, desc, icon, className, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    viewport={{ once: true }}
    className={`bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 ${className}`}
  >
    <div className="mb-4">
      <div className="p-3 bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] rounded-xl w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
    {/* Abstract visual representation at bottom of card */}
    <div className="h-24 w-full bg-white dark:bg-[#1a1a1a] rounded-xl border border-dotted border-gray-300 dark:border-[#333] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
    </div>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-white text-gray-900 dark:bg-black dark:text-white selection:bg-gray-200 dark:selection:bg-gray-800">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">v2.0 is now live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
        >
          Organize work,<br />
          <span className="text-gray-400 dark:text-gray-600">build connections.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mb-10"
        >
          ProDO combines task management, real-time collaboration, and community building into one seamless workspace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl"
          >
            Start for free
          </button>
          <button
            onClick={() => navigate('/resources')}
            className="px-8 py-3 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-200 dark:bg-[#111] dark:text-white dark:hover:bg-[#222] transition-all border border-transparent dark:border-gray-800"
          >
            Explore resources
          </button>
        </motion.div>

        {/* Hero Visual - Simulated App UI */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 w-full max-w-5xl h-[400px] md:h-[600px] bg-white dark:bg-[#0a0a0a] rounded-t-2xl shadow-2xl border border-gray-200 dark:border-[#333] overflow-hidden relative"
          style={{ perspective: '1000px' }}
        >
          {/* Simulated App Header */}
          <div className="h-12 border-b border-gray-100 dark:border-[#222] flex items-center px-4 gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 text-center text-xs text-gray-400 font-mono">ProDO Workspace</div>
          </div>
          {/* Simulated App Content */}
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-100 dark:border-[#222] p-4 hidden md:block">
              <div className="w-full h-8 bg-gray-100 dark:bg-[#222] rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-4 w-3/4 bg-gray-50 dark:bg-[#151515] rounded"></div>)}
              </div>
            </div>
            {/* Main Board */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50 dark:bg-black/50">
              {/* Card columns */}
              {[1, 2, 3].map(col => (
                <div key={col} className="flex flex-col gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-[#222] rounded mb-2"></div>
                  {[1, 2].map(card => (
                    <div key={card} className="bg-white dark:bg-[#111] p-4 rounded-lg shadow-sm border border-gray-100 dark:border-[#222]">
                      <div className="h-4 w-full bg-gray-100 dark:bg-[#222] rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-50 dark:bg-[#1a1a1a] rounded"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bento Grid Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything you need to work</h2>
          <p className="text-gray-500">Powerful tools, integrated into one cohesive platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            className="md:col-span-2"
            title="Project Management"
            desc="Kanban, Lists, Timeline. visualize your work your way."
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            delay={0.1}
          />
          <FeatureCard
            className="md:col-span-1"
            title="Real-time Chat"
            desc="Discuss tasks right where they happen."
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
            delay={0.2}
          />
          <FeatureCard
            className="md:col-span-1"
            title="Documentation"
            desc="Wiki and docs fully integrated."
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            delay={0.3}
          />
          <FeatureCard
            className="md:col-span-2"
            title="Community Hub"
            desc="Connect with other teams, share templates, and grow."
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            delay={0.4}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-[#222] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ProDO Team. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;