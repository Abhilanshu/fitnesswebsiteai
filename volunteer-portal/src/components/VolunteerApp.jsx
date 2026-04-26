import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapPin, Navigation, CheckCircle, Clock, Shield, Bell, ChevronLeft, MessageSquare, Phone, MoreVertical, Send, User, Award, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5002/api';

const MOCK_MISSIONS = [
  { _id: 'm1', category: 'Medical', location: { address: 'Sector 4, Near Apollo' }, description: 'Elderly patient needing immediate asthma medication transport.', urgency: 5, createdAt: new Date().toISOString() },
  { _id: 'm2', category: 'Rescue', location: { address: 'Old Bridge, River Bank' }, description: 'Two people trapped in flooded car.', urgency: 5, createdAt: new Date().toISOString() }
];

const LEADERBOARD = [
  { rank: 1, name: 'Priya Patel', points: 2450, missions: 42 },
  { rank: 2, name: 'Rahul Verma', points: 2100, missions: 38 },
  { rank: 3, name: 'Aryan Sharma', points: 1850, missions: 31 },
  { rank: 4, name: 'Neha Gupta', points: 1600, missions: 29 },
];

const VolunteerApp = ({ volunteer, onLogout }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('missions'); // 'missions' | 'chat' | 'profile' | 'leaderboard'
  const [chatMessages, setChatMessages] = useState([]);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    loadMissions();
    const interval = setInterval(loadMissions, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeTab]);

  // Sync missions to chat messages
  useEffect(() => {
    if (missions.length === 0) return;
    
    const newMessages = missions.map(m => ({
      id: m._id,
      text: `🚨 EMERGENCY MISSION ASSIGNED: ${m.category} rescue at ${m.location.address}. ${m.description}. Priority: ${m.urgency}/5. Please proceed immediately.`,
      sender: 'dispatcher',
      timestamp: new Date(m.createdAt)
    }));
    
    setChatMessages(prev => {
      const existingIds = new Set(prev.map(msg => msg.id));
      const filtered = newMessages.filter(msg => !existingIds.has(msg.id));
      if (filtered.length === 0) return prev;
      return [...prev, ...filtered].sort((a, b) => a.timestamp - b.timestamp);
    });
  }, [missions]);

  const loadMissions = async () => {
    try {
      const response = await axios.get(`${API_URL}/needs`);
      let myMissions = response.data.filter(n => 
        n.assignedVolunteers.some(v => v._id === volunteer._id) && 
        n.status !== 'Resolved'
      );
      if (myMissions.length === 0) {
        // Fallback for hackathon demo
        setMissions(MOCK_MISSIONS);
      } else {
        setMissions(myMissions);
      }
    } catch (error) {
      console.warn("API failed, using mock missions for hackathon demo");
      // Use local state if we already set mock missions, so we can 'resolve' them locally
      setMissions(prev => prev.length > 0 ? prev : MOCK_MISSIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await axios.post(`${API_URL}/volunteers/update-status`, { needId: id, status: 'Resolved' });
      loadMissions();
    } catch (error) {
      // Mock resolve
      setMissions(prev => prev.filter(m => m._id !== id));
      
      // Add a chat message for resolution
      setChatMessages(prev => [...prev, {
        id: `res-${id}`,
        text: `✅ Mission at ${MOCK_MISSIONS.find(m=>m._id===id)?.location.address || 'Location'} marked as RESOLVED. Great work, ${volunteer.name}!`,
        sender: 'dispatcher',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-[#111b21] border-b border-white/5 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onLogout} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-sm tracking-wide">{volunteer.name}</h2>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Live Status: Active
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="p-2 bg-white/5 rounded-lg cursor-pointer">
             <Bell size={18} className="text-gray-300" />
          </div>
          {missions.length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] flex items-center justify-center rounded-full font-black shadow-[0_0_10px_rgba(244,63,94,0.5)]">
              {missions.length}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#0b141a]">
        <AnimatePresence mode="wait">
          {activeTab === 'missions' && (
            <motion.div 
              key="missions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 space-y-6 pb-24"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black italic tracking-tighter uppercase text-white">Active Missions</h3>
                <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded font-bold tracking-widest flex items-center gap-1">
                  <Flame size={12}/> HIGH PRIORITY
                </span>
              </div>

              {missions.length > 0 ? (
                missions.map((mission, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={mission._id} 
                    className="bg-[#111b21] rounded-2xl border-l-4 border-primary p-5 space-y-4 shadow-xl border-y border-r border-y-white/5 border-r-white/5"
                  >
                    <div className="flex justify-between items-start">
                       <div className="px-2 py-1 bg-primary/10 rounded text-[9px] font-black text-primary uppercase tracking-widest">
                         {mission.category} EMERGENCY
                       </div>
                       <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                          <Clock size={10} /> Just now
                       </div>
                    </div>
                    <div>
                       <h4 className="text-lg font-bold flex items-center gap-2"><MapPin size={16} className="text-gray-400"/> {mission.location.address}</h4>
                       <p className="text-xs text-gray-400 mt-2 leading-relaxed">{mission.description}</p>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                       <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors">
                         <Navigation size={14} /> GPS ROUTE
                       </button>
                       <button 
                         onClick={() => handleResolve(mission._id)}
                         className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                       >
                         <CheckCircle size={14} /> RESOLVE
                       </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 text-center opacity-50 flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Shield size={32} className="text-gray-400" />
                  </div>
                  <p className="font-bold text-lg text-white">Area Clear</p>
                  <p className="text-xs text-gray-400 mt-2">Waiting for Dispatch assignments</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full bg-[#0b141a]"
            >
              {/* Dispatch Chat Header */}
              <div className="bg-[#202c33] p-3 flex justify-between items-center border-b border-white/5 shadow-md z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Shield size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">AI Dispatcher</div>
                    <div className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">Official Channel</div>
                  </div>
                </div>
                <div className="flex gap-4 text-gray-400">
                  <Phone size={18} className="cursor-pointer hover:text-white" />
                  <MoreVertical size={20} className="cursor-pointer hover:text-white" />
                </div>
              </div>

              {/* Chat Content */}
              <div 
                ref={chatScrollRef}
                className="flex-1 p-4 overflow-y-auto space-y-4"
                style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(11, 20, 26, 0.95)' }}
              >
                {chatMessages.length === 0 && (
                   <div className="text-center text-xs text-gray-500 bg-[#111b21] mx-auto py-2 px-4 rounded-xl max-w-xs border border-white/5">
                      Messages are end-to-end encrypted. No active missions yet.
                   </div>
                )}
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex justify-start">
                    <div className="bg-[#202c33] p-3 rounded-xl rounded-tl-none max-w-[85%] shadow-sm border border-white/5">
                      <div className="text-sm leading-relaxed text-white/90">{msg.text}</div>
                      <div className="text-[9px] text-gray-500 mt-2 text-right font-medium">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-[#202c33] flex gap-3 items-center border-t border-white/5">
                <input 
                  disabled
                  placeholder="Responses disabled in Dispatch channel"
                  className="flex-1 bg-[#2a3942] rounded-full px-5 py-3 text-xs text-gray-400 border-none outline-none font-medium"
                />
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center opacity-50">
                  <Send size={18} className="ml-1" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
             <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 space-y-6 pb-24"
             >
                <div className="text-center mb-8">
                   <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award size={32} className="text-primary" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-widest text-white">Hero Rankings</h3>
                   <p className="text-xs text-gray-500 font-bold mt-1">TOP VOLUNTEERS THIS WEEK</p>
                </div>

                <div className="space-y-3">
                   {LEADERBOARD.map((hero, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-[#111b21] p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                         {idx === 0 && <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />}
                         {idx === 1 && <div className="absolute top-0 left-0 w-1 h-full bg-gray-400" />}
                         {idx === 2 && <div className="absolute top-0 left-0 w-1 h-full bg-amber-700" />}
                         
                         <div className={`w-8 font-black text-center ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-700' : 'text-gray-600'}`}>
                            #{hero.rank}
                         </div>
                         <div className="flex-1">
                            <div className="font-bold text-sm text-white">{hero.name} {hero.name === volunteer.name ? '(You)' : ''}</div>
                            <div className="text-[10px] text-gray-500 font-medium mt-0.5">{hero.missions} Missions Completed</div>
                         </div>
                         <div className="text-right">
                            <div className="font-black text-primary">{hero.points}</div>
                            <div className="text-[8px] uppercase tracking-widest text-gray-500">PTS</div>
                         </div>
                      </div>
                   ))}
                   
                   {/* Current User if not in top 4 */}
                   {!LEADERBOARD.find(h => h.name === volunteer.name) && (
                      <div className="mt-8 flex items-center gap-4 bg-primary/10 p-4 rounded-2xl border border-primary/20">
                         <div className="w-8 font-black text-center text-primary">
                            #42
                         </div>
                         <div className="flex-1">
                            <div className="font-bold text-sm text-white">{volunteer.name} (You)</div>
                            <div className="text-[10px] text-gray-500 font-medium mt-0.5">2 Missions Completed</div>
                         </div>
                         <div className="text-right">
                            <div className="font-black text-primary">150</div>
                            <div className="text-[8px] uppercase tracking-widest text-gray-500">PTS</div>
                         </div>
                      </div>
                   )}
                </div>
             </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center pb-24"
            >
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-md" />
                <div className="relative w-full h-full bg-[#111b21] rounded-full flex items-center justify-center text-primary font-black text-4xl border-2 border-primary/30 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                  {volunteer.name.charAt(0)}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">{volunteer.name}</h3>
              <p className="text-primary text-xs font-black uppercase tracking-widest mt-2 bg-primary/10 inline-block px-3 py-1 rounded-full">{volunteer.skills.join(' • ')}</p>
              
              <div className="grid grid-cols-2 gap-4 text-left mt-10">
                <div className="bg-[#111b21] p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Award size={80} />
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Impact Rank</div>
                  <div className="text-2xl font-black text-yellow-500">GOLD</div>
                </div>
                <div className="bg-[#111b21] p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Shield size={80} />
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Missions</div>
                  <div className="text-2xl font-black text-emerald-400">12</div>
                </div>
              </div>

              <div className="mt-8 bg-[#111b21] p-5 rounded-2xl border border-white/5 text-left">
                 <div className="text-[10px] text-gray-500 font-bold uppercase mb-4 tracking-widest">Recent Badges</div>
                 <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                          <MapPin size={20} className="text-blue-500" />
                       </div>
                       <span className="text-[8px] font-bold text-gray-400 uppercase">First Responder</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                          <Heart size={20} className="text-primary" />
                       </div>
                       <span className="text-[8px] font-bold text-gray-400 uppercase">Life Saver</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Tab Bar */}
      <footer className="fixed bottom-0 w-full bg-[#111b21]/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center z-50">
        <TabButton icon={<Shield size={22}/>} label="MISSIONS" active={activeTab === 'missions'} onClick={() => setActiveTab('missions')} />
        <TabButton icon={<MessageSquare size={22}/>} label="DISPATCH" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <TabButton icon={<Award size={22}/>} label="RANKING" active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} />
        <TabButton icon={<User size={22}/>} label="PROFILE" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </footer>
    </div>
  );
};

const TabButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${active ? 'text-primary scale-110' : 'text-gray-500 hover:text-gray-300'}`}
  >
    {active && (
      <motion.div layoutId="tab-indicator" className="absolute -top-4 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(244,63,94,1)]" />
    )}
    {icon}
    <span className={`text-[8px] font-black tracking-widest ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
  </button>
);

export default VolunteerApp;
