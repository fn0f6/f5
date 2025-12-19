
import React, { useState } from 'react';
import { 
  LayoutDashboard, User as UserIcon, LogOut, Menu, X, 
  ShieldCheck, Home, Zap, Ship, ChevronRight, ChevronLeft, Layers, Compass
} from 'lucide-react';
import { UserRole, User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType;
  onLogout: () => void;
  currentView: string;
  setView: (view: any) => void;
  lang?: string;
  t?: any;
}

export const DashboardLayout: React.FC<LayoutProps> = ({ children, user, onLogout, currentView, setView, lang, t }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);
  const isRTL = lang === 'ar';
  
  const NavItem = ({ icon: Icon, label, view, roles }: { icon: any, label: string, view: string, roles?: UserRole[] }) => {
    if (roles && !roles.includes(user.role)) return null;
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          setView(view);
          if (window.innerWidth < 1024) setIsOpen(false);
        }}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 mb-3 font-black uppercase tracking-tight relative overflow-hidden group ${
          isActive 
            ? 'bg-yellow-500 text-slate-950 shadow-[0_15px_40px_rgba(234,179,8,0.3)] scale-[1.02]' 
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Icon size={20} className={`${isActive ? 'text-slate-950' : 'text-slate-500 group-hover:text-yellow-500'} transition-colors shrink-0`} />
        <span className="text-xs truncate">{label}</span>
        {isActive && <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden relative" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-[150] lg:top-8 lg:bottom-auto ${isOpen ? (isRTL ? 'lg:right-[340px]' : 'lg:left-[340px]') : (isRTL ? 'lg:right-8' : 'lg:left-8')} w-14 h-14 bg-yellow-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 border-2 border-white/20`}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Modern Responsive Sidebar */}
      <aside 
        className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-[110] bg-[#0a0f1e]/95 backdrop-blur-2xl border-x border-white/5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[50px_0_100px_rgba(0,0,0,0.5)] ${
          isOpen ? 'w-full sm:w-80 translate-x-0' : `w-80 ${isRTL ? 'translate-x-full' : '-translate-x-full'}`
        }`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Ship size={24} className="text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white uppercase tracking-tighter leading-none">Empire</span>
              <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest mt-1">Command Hub</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto no-scrollbar">
            <NavItem icon={LayoutDashboard} label={t.nav_dashboard} view="admin_dashboard" roles={[UserRole.ADMIN, UserRole.MODERATOR]} />
            <NavItem icon={UserIcon} label={t.nav_profile} view="user_dashboard" />
            <NavItem icon={Home} label={t.nav_home} view="home" />
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
            <div className="p-4 bg-white/5 rounded-3xl flex items-center gap-4">
               <img src={user.avatar} className="w-10 h-10 rounded-xl border border-yellow-500/30" />
               <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white truncate uppercase">{user.displayName}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">{user.role}</p>
               </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-500 py-4 rounded-[1.5rem] hover:bg-red-500 hover:text-white transition-all font-black text-xs uppercase"
            >
              <LogOut size={18} />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? (isRTL ? 'lg:mr-80' : 'lg:ml-80') : 'm-0'}`}>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 no-scrollbar relative">
          <div className="max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
