
import React, { useState, useEffect } from 'react';
import { Ship, Menu, X, Globe, User as UserIcon, LogOut, ChevronDown, Facebook, Twitter, Instagram, Youtube, Languages } from 'lucide-react';
import { SiteConfig, User, ViewState, Page, AdItem } from '../types';
import { PageRenderer } from '../components/PageRenderer';
import { Language } from '../utils/translations';
import { api } from '../services/api';
import { Badge } from '../components/UI';

interface PublicProps {
  config: SiteConfig;
  user: User | null;
  pages: Page[];
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: any; 
}

export const PublicLayout: React.FC<PublicProps> = ({ config, user, pages, currentView, setView, onLogout, lang, setLang, t }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [ads, setAds] = useState<AdItem[]>([]);

  useEffect(() => {
    api.getAds().then(list => {
      setAds(list.filter(a => a.isActive));
    });
    
    // Apply Global Font & Direction
    let font = config.globalFont || (lang === 'ar' ? 'Cairo' : 'Inter');
    if (font === 'System') font = 'sans-serif';
    document.body.style.fontFamily = `'${font}', sans-serif`;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [config.globalFont, lang]);

  if (!pages || pages.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-center p-10 font-cairo">
        <div className="w-20 h-20 bg-yellow-500 rounded-[2rem] flex items-center justify-center shadow-2xl mb-8 animate-bounce">
           <Ship size={40} className="text-slate-950" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">INITIATING COMMAND CORE</h1>
        <p className="text-slate-500 max-w-sm font-bold uppercase tracking-widest">Fetching mission parameters... Hold station.</p>
        <button onClick={() => window.location.reload()} className="mt-12 px-12 py-4 bg-yellow-500 text-slate-950 font-black rounded-2xl shadow-2xl hover:scale-105 transition-all">REBOOT UPLINK</button>
      </div>
    );
  }

  let activePage = pages.find(p => p.slug === currentView) || pages[0];

  const pageBgStyle: React.CSSProperties = {
    backgroundColor: activePage?.background?.value || '#020617',
    minHeight: '100vh'
  };

  if (activePage?.background?.type === 'image') {
    pageBgStyle.backgroundImage = `url(${activePage.background.value})`;
    pageBgStyle.backgroundSize = 'cover';
    pageBgStyle.backgroundPosition = 'center';
    pageBgStyle.backgroundAttachment = 'fixed';
  }

  const headerBaseClass = config.headerSticky ? 'sticky top-0 w-full' : 'relative w-full';
  const headerHeight = config.headerHeight ? `${config.headerHeight}px` : '100px';
  
  const getHeaderStyle = () => {
    if (config.headerStyle === 'glass') return 'bg-black/40 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-b border-white/5';
    if (config.headerStyle === 'solid') return 'bg-slate-950 border-b border-white/10 shadow-2xl';
    return 'bg-transparent';
  };

  const SocialIcon: React.FC<{ platform: string; url: string }> = ({ platform, url }) => {
     if (!url || url === '#') return null;
     return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-yellow-500 hover:text-slate-950 hover:scale-110 transition-all border border-white/5 shadow-xl">
           {platform === 'facebook' && <Facebook size={20}/>}
           {platform === 'twitter' && <Twitter size={20}/>}
           {platform === 'instagram' && <Instagram size={20}/>}
           {platform === 'youtube' && <Youtube size={20}/>}
        </a>
     );
  };

  return (
    <div className={`min-h-screen flex flex-col relative ${lang === 'ar' ? 'font-cairo' : 'font-inter'}`} style={pageBgStyle}>
      
      {config.backgroundImage && (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <img src={config.backgroundImage} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-black" style={{ opacity: config.bodyOverlayOpacity ?? 0.5 }}></div>
        </div>
      )}

      {/* Header */}
      <nav className={`${headerBaseClass} z-[100] transition-all duration-700 ${getHeaderStyle()}`} style={{ height: headerHeight }}>
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-5 cursor-pointer group" onClick={() => setView('home')}>
             <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-all">
                {config.siteLogo ? <img src={config.siteLogo} className="w-10 h-10 object-contain" alt="" /> : <Ship className="text-slate-950 w-8 h-8" />}
             </div>
             <div className="flex flex-col">
                <span className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{config.siteName}</span>
                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mt-1">Operational Protocol Active</span>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {pages.filter(p => !p.isHidden).map(p => (
              <button key={p.id} onClick={() => setView(p.slug)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === p.slug ? 'bg-yellow-500 text-slate-950 shadow-2xl' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5">
             {config.headerCta?.show && (
                <a href={config.headerCta.url} className="hidden md:block px-8 py-3 bg-yellow-500 text-slate-950 font-black text-[10px] uppercase rounded-xl hover:scale-105 transition-all shadow-xl">
                   {config.headerCta.label}
                </a>
             )}
             {user ? (
               <div className="relative">
                 <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all shadow-xl">
                    <img src={user.avatar} className="w-10 h-10 rounded-xl border-2 border-yellow-500/20" />
                    <div className="hidden sm:block">
                       <p className="text-xs font-black text-white uppercase leading-none mb-1">{user.displayName}</p>
                       <p className="text-[9px] text-yellow-500 font-black uppercase tracking-widest">{user.role}</p>
                    </div>
                    <ChevronDown size={14} className="text-slate-600" />
                 </button>
                 {isProfileOpen && (
                   <div className="absolute top-full mt-4 left-0 sm:right-0 w-72 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-royal z-[200]">
                      <button onClick={() => { setView(user.role === 'admin' ? 'admin_dashboard' : 'user_dashboard'); setIsProfileOpen(false); }} className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} p-5 hover:bg-yellow-500 hover:text-slate-950 rounded-3xl text-xs font-black uppercase flex items-center gap-4 transition-all`}>
                        <UserIcon size={18}/> {t.nav_dashboard}
                      </button>
                      <button onClick={onLogout} className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} p-5 hover:bg-red-500 hover:text-white rounded-3xl text-xs font-black uppercase flex items-center gap-4 transition-all mt-2 border-t border-white/5`}>
                        <LogOut size={18}/> {t.sign_out}
                      </button>
                   </div>
                 )}
               </div>
             ) : (
               <div className="flex gap-4">
                  <button onClick={() => setView('login')} className="hidden sm:block bg-slate-800 text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-slate-700 transition-all border border-white/5">ENTER HUB</button>
                  <button onClick={() => setView('register')} className="bg-yellow-500 text-slate-950 px-10 py-3 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:scale-105 transition-all">JOIN FLEET</button>
               </div>
             )}
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-3 bg-white/5 rounded-2xl text-white shadow-xl">
                {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
             </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className={`flex-1 relative ${activePage?.background?.isBlurred ? 'backdrop-blur-md' : ''}`}>
         {activePage?.background?.type === 'image' && <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: activePage.background.overlayOpacity || 0.5 }}></div>}
         <div className="relative z-10"><PageRenderer blocks={activePage?.blocks || []} config={config} /></div>
      </main>

      {/* Footer */}
      {config.showFooter !== false && (
        <footer className={`bg-black/98 border-t border-white/5 py-32 relative z-10 px-8 ${config.footerLayout === 'centered' ? 'text-center' : ''}`}>
           <div className={`max-w-7xl mx-auto ${config.footerLayout === 'elaborate' ? 'grid grid-cols-1 lg:grid-cols-12 gap-20' : 'flex flex-col items-center gap-12'}`}>
              <div className={`${config.footerLayout === 'elaborate' ? 'lg:col-span-4' : 'flex flex-col items-center'} space-y-8`}>
                 <div className={`flex items-center gap-5 ${config.footerLayout === 'centered' ? 'justify-center' : ''}`}>
                    <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-4xl">
                       {config.footerLogo ? <img src={config.footerLogo} className="w-10 h-10 object-contain" alt="" /> : <Ship size={36}/>}
                    </div>
                    <span className="text-4xl font-black text-white uppercase tracking-tighter">{config.siteName}</span>
                 </div>
                 <p className="text-slate-500 text-lg leading-relaxed font-bold opacity-80 max-w-xl">{config.footerText}</p>
                 <div className="flex gap-3">{config.footerSocials?.map(social => <SocialIcon key={social.platform} platform={social.platform} url={social.url} />)}</div>
              </div>

              {config.footerLayout === 'elaborate' && (
                <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
                   <div className="space-y-6">
                      <h4 className="text-xs font-black text-yellow-500 uppercase tracking-widest">{t.navigation}</h4>
                      <ul className="space-y-4 text-slate-400 font-bold text-sm">
                         {config.footerLinks?.map((link, i) => <li key={i} className="hover:text-white cursor-pointer transition-all"><a href={link.url}>{link.label}</a></li>)}
                      </ul>
                   </div>
                   <div className="space-y-6">
                      <h4 className="text-xs font-black text-yellow-500 uppercase tracking-widest">{t.fleet_ops}</h4>
                      <ul className="space-y-4 text-slate-400 font-bold text-sm">
                         <li className="hover:text-white cursor-pointer transition-all" onClick={() => setView('login')}>Command Log</li>
                         <li className="hover:text-white cursor-pointer transition-all">Node Status</li>
                      </ul>
                   </div>
                   <div className="space-y-8">
                      <h4 className="text-xs font-black text-yellow-500 uppercase tracking-widest">{t.support_core}</h4>
                      {config.footerCta?.show && <a href={config.footerCta.url} className="inline-block px-10 py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-2xl shadow-2xl hover:scale-105 transition-all">{config.footerCta.label}</a>}
                      
                      {/* Language Switcher Button Group */}
                      <div className="pt-6 border-t border-white/5 space-y-4">
                         <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{t.switch_lang}</h4>
                         <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-white/5 w-fit">
                            <button onClick={() => setLang('ar')} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${lang === 'ar' ? 'bg-yellow-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>{t.lang_ar}</button>
                            <button onClick={() => setLang('en')} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${lang === 'en' ? 'bg-yellow-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>{t.lang_en}</button>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              <div className="w-full pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] lg:col-span-12">
                 <span>© {new Date().getFullYear()} {config.siteName.toUpperCase()}. {t.encrypted_msg}</span>
                 <div className="flex gap-10">
                    <span className="text-yellow-500/40">{t.latency}: 12ms</span>
                    <span className="text-yellow-500/40">{t.uplink}: {t.active}</span>
                 </div>
              </div>
           </div>
        </footer>
      )}
    </div>
  );
};
