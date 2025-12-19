
import React, { useState, useEffect } from 'react';
import { User, ViewState } from '../types';
import { 
  Edit2, Globe, Trophy, Anchor, Zap, Map, 
  Lock, Clock, Copy, Check, LogOut, Star, AlertCircle, 
  Fingerprint, ShieldCheck, Smartphone, Hash, CheckCircle2, Monitor,
  Mail, X, Sparkles, User as UserIcon, Share2, Save
} from 'lucide-react';
import { updateUserProfile } from '../services/api';
import { Language } from '../utils/translations';

interface UserDashboardProps {
    user: User;
    setView?: (view: ViewState) => void;
    lang: Language;
    t: any;
    onLogout?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, setView, lang, t, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      displayName: user.displayName || user.username,
      nickname: user.nickname || ''
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      displayName: user.displayName || user.username,
      nickname: user.nickname || ''
    });
  }, [user]);

  const handleSave = async () => {
      if (!formData.displayName.trim()) return;
      setLoading(true);
      try {
          await updateUserProfile(user.id, {
              displayName: formData.displayName,
              nickname: formData.nickname
          });
          setSaveSuccess(true);
          setTimeout(() => {
              setSaveSuccess(false);
              setIsEditing(false);
              window.location.reload(); 
          }, 1000);
      } catch (err) {
          alert("خطأ في حفظ البيانات");
      } finally {
          setLoading(false);
      }
  };

  const copyId = () => {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-royal pb-32 px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Identity Hero Section */}
      <div className="relative rounded-[4rem] overflow-hidden bg-slate-950 border border-white/5 shadow-4xl group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-black"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          <div className="relative z-10 p-12 md:p-24 flex flex-col items-center text-center">
              <div className="relative mb-12 group/avatar">
                 <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] md:rounded-[4rem] overflow-hidden border-4 border-yellow-500/30 shadow-2xl bg-slate-900 relative z-10 transition-transform duration-700 group-hover/avatar:scale-105">
                    <img src={user.avatar} className="w-full h-full object-cover" alt="Captain"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 </div>
                 <div className="absolute -bottom-4 -right-4 bg-yellow-500 w-16 h-16 rounded-2xl border-4 border-slate-950 z-20 shadow-xl flex items-center justify-center animate-pulse">
                    <ShieldCheck className="w-8 h-8 text-slate-950" />
                 </div>
              </div>
              
              <div className="space-y-8 w-full max-w-4xl">
                  {isEditing ? (
                      <div className="space-y-6 max-w-xl mx-auto">
                          <input 
                              value={formData.displayName}
                              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                              className="text-3xl md:text-5xl font-black text-center text-white bg-white/5 border-2 border-white/10 focus:border-yellow-500 rounded-3xl px-8 py-6 outline-none w-full transition-all"
                              placeholder="الاسم..."
                          />
                          <input 
                              value={formData.nickname}
                              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                              className="text-xl md:text-2xl font-black text-center text-yellow-500 bg-white/5 border-2 border-white/10 focus:border-indigo-500 rounded-2xl px-8 py-4 outline-none w-full transition-all"
                              placeholder="اللقب..."
                          />
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-2xl transition-all">
                              {formData.displayName}
                          </h1>
                          <p className="text-2xl md:text-4xl text-yellow-500 font-black uppercase tracking-widest opacity-80">
                              {formData.nickname || "NO TITLE ASSIGNED"}
                          </p>
                      </div>
                  )}

                  <div className="pt-12 flex flex-col sm:flex-row gap-6 justify-center">
                      {!isEditing ? (
                          <>
                            <button onClick={() => setIsEditing(true)} className="px-12 py-5 bg-yellow-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
                                <Edit2 size={20} /> {t.edit_profile}
                            </button>
                            <button onClick={copyId} className="px-12 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                <Share2 size={20} /> {copied ? "COPIED" : "SHARE PROFILE"}
                            </button>
                          </>
                      ) : (
                          <div className="flex gap-4 w-full justify-center">
                              <button onClick={handleSave} disabled={loading} className="px-12 py-5 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3">
                                {loading ? <Clock className="animate-spin" /> : <Save size={20} />} {t.save}
                              </button>
                              <button onClick={() => setIsEditing(false)} className="px-12 py-5 bg-white/5 text-slate-400 rounded-2xl font-black uppercase tracking-widest hover:text-white transition-all">
                                {t.cancel}
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* Stats and Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <StatCard icon={Anchor} label={t.stats_voyages} value="128" color="indigo" />
                  <StatCard icon={Zap} label={t.stats_power} value="5.2K" color="yellow" />
                  <StatCard icon={Map} label={t.stats_islands} value="14" color="green" />
                  <StatCard icon={Trophy} label={t.stats_rank} value="#42" color="orange" />
              </div>

              <div className="bg-slate-900/40 rounded-[3rem] p-10 border border-white/5 space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <Lock className="text-indigo-500" size={24} />
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t.security_title}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InfoRow label="Captain ID" value={user.id} icon={Fingerprint} />
                      <InfoRow label="Access Level" value={user.role} icon={ShieldCheck} />
                      <InfoRow label="Email Uplink" value={user.email} icon={Mail} />
                      <InfoRow label="Session Status" value="ENCRYPTED" icon={Hash} />
                  </div>
              </div>
          </div>

          <div className="space-y-8">
              <div className="bg-indigo-600/10 rounded-[3rem] p-10 border border-indigo-500/20">
                  <h3 className="text-lg font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                      <Sparkles size={20}/> SYSTEM ALERTS
                  </h3>
                  <div className="space-y-4">
                      <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-xs font-bold leading-relaxed">
                          Your profile encryption has been upgraded to Tier 5.
                      </div>
                      <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-xs font-bold text-yellow-500/80 leading-relaxed">
                          New mission available in the Eastern Sea nodes.
                      </div>
                  </div>
              </div>
              
              <button onClick={onLogout} className="w-full py-6 bg-red-500/10 text-red-500 rounded-3xl font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all border border-red-500/20 flex items-center justify-center gap-4">
                  <LogOut size={20}/> {t.sign_out}
              </button>
          </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => {
    const colors: any = {
        indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        green: "bg-green-500/10 text-green-500 border-green-500/20",
        orange: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    };
    return (
        <div className={`p-8 rounded-[2.5rem] border ${colors[color]} text-center space-y-3 group hover:-translate-y-2 transition-all`}>
            <div className="w-12 h-12 mx-auto bg-slate-900 rounded-xl flex items-center justify-center">
                <Icon size={24} />
            </div>
            <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
            <p className="text-[10px] font-black uppercase opacity-60">{label}</p>
        </div>
    );
};

const InfoRow = ({ label, value, icon: Icon }: any) => (
    <div className="space-y-3">
        <p className="text-[10px] font-black text-slate-500 uppercase px-2">{label}</p>
        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex items-center gap-4 group hover:border-indigo-500/30 transition-all">
            <Icon size={18} className="text-slate-600 group-hover:text-indigo-500" />
            <span className="text-xs font-bold text-slate-300 truncate flex-1">{value}</span>
        </div>
    </div>
);
