import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Globe, MapPin, ChevronRight, Heart, Activity } from 'lucide-react';

const VolunteerLanding = ({ onJoin }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden font-sans">
      {/* Hackathon Banner */}
      <div className="bg-primary/20 border-b border-primary/30 text-primary text-center py-2 text-xs font-black uppercase tracking-[0.2em] relative z-50">
        Google Solution Challenge 2026
      </div>

      {/* Navbar */}
      <nav className="fixed top-8 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black shadow-[0_0_15px_rgba(244,63,94,0.5)]">G</div>
          <span className="font-bold text-xl tracking-tighter">GEOSMART <span className="text-primary font-black">HERO</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <a href="#missions" className="hover:text-white transition-colors">Missions</a>
          <a href="#impact" className="hover:text-white transition-colors">Impact</a>
        </div>
        <button 
          onClick={onJoin}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-black text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
        >
          Volunteer Now
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              <Activity size={12} fill="currentColor" className="animate-pulse" />
              Live Dispatch System Active
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-tight mb-6">
              Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Skills</span> Into <span className="italic font-light">Impact.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
              GeoSmart Hero connects your unique skills to people in immediate need. No bureaucracy, just pure AI-coordinated rescue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onJoin}
                className="bg-white text-black px-8 py-4 rounded-full font-black text-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Start Rescuing <ChevronRight size={20} />
              </button>
              <div className="flex items-center gap-3 px-6">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-gray-800" />
                  ))}
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  <span className="text-white">250+</span> Heroes Online
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative h-[500px] hidden lg:block"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="w-full h-full p-8 border border-white/10 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-xl relative overflow-hidden group shadow-2xl shadow-primary/5">
               {/* 3D-like floating UI elements */}
               <div className="absolute top-10 right-10 p-4 bg-[#111b21] rounded-2xl border border-primary/20 shadow-2xl animate-[float_4s_ease-in-out_infinite]">
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary mb-2 tracking-widest">
                    <MapPin size={12} /> NEW MISSION
                  </div>
                  <div className="text-sm font-bold">Medical Help Needed</div>
                  <div className="text-[10px] text-gray-400">2.4km from you</div>
               </div>
               
               <div className="absolute bottom-20 left-10 p-4 bg-[#111b21] rounded-2xl border border-emerald-500/20 shadow-2xl animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 mb-2 tracking-widest">
                    <Users size={12} /> HERO ARRIVED
                  </div>
                  <div className="text-sm font-bold">Volunteer Aryan</div>
                  <div className="text-[10px] text-gray-400">On-site at Dharavi</div>
               </div>

               <div className="flex flex-col items-center justify-center h-full text-center">
                  <Shield size={120} className="text-primary/20 mb-8" />
                  <h3 className="text-2xl font-black tracking-wide">The Hero Network</h3>
                  <p className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-widest">Active Across India</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox label="Active Rescues" value="1,240" />
          <StatBox label="Response Time" value="< 2m" />
          <StatBox label="Registered Heroes" value="250" />
          <StatBox label="Lives Touched" value="10k+" />
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-8 bg-[#0a0a0a]">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">How to Save a Life.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2" />
               <ProcessCard step="1" title="Register Your Skills" desc="Sign up and tell us what you're good at. Medical, rescue, driving, or organizing." />
               <ProcessCard step="2" title="Receive AI Dispatch" desc="When a crisis hits nearby requiring your specific skill, our AI dispatcher pings you." />
               <ProcessCard step="3" title="Navigate & Resolve" desc="Use the app to navigate to the location, help the victims, and mark the mission as resolved." />
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <motion.div 
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <Heart size={48} className="text-primary mx-auto mb-8 animate-pulse" />
          <h2 className="text-5xl font-black mb-8">Ready to be the difference?</h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            The next crisis won't wait. Your community needs your skills today. Join the GeoSmart network and start making an impact.
          </p>
          <button 
            onClick={onJoin}
            className="px-12 py-5 bg-primary hover:bg-primary/90 text-white rounded-full font-black text-xl shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-all active:scale-95"
          >
            Become a Hero Now
          </button>
        </motion.div>
      </section>

      <footer className="py-12 border-t border-white/5 px-8 text-center text-gray-500 text-sm font-bold uppercase tracking-widest">
        &copy; 2026 GeoSmart AI. Built for Google Solution Challenge.
      </footer>
    </div>
  );
};

const StatBox = ({ label, value }) => (
  <div className="text-center p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-primary/30 transition-colors">
    <div className="text-5xl font-black mb-2 text-white">{value}</div>
    <div className="text-xs uppercase font-bold text-gray-500 tracking-widest">{label}</div>
  </div>
);

const ProcessCard = ({ step, title, desc }) => (
   <div className="bg-[#111b21] p-8 rounded-3xl border border-white/5 relative z-10 hover:-translate-y-2 transition-transform duration-300">
      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-primary/30">
         {step}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
   </div>
);

export default VolunteerLanding;
