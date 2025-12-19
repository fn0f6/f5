
import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { User, ViewState, UserRole, SiteConfig, Page } from './types';
import { AdminDashboard } from './pages/Admin';
import { UserDashboard } from './pages/User';
import { LoginPage, RegisterPage } from './pages/Auth';
import { PublicLayout } from './pages/Public';
import { DashboardLayout } from './components/Layout';
import { translations, Language } from './utils/translations';
import { Hammer } from 'lucide-react';
import { Toast } from './components/UI';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('home');
  const [lang, setLang] = useState<Language>('ar');
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Page[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [globalToast, setGlobalToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const t = translations[lang];

  const boot = async () => {
    setLoading(true);
    try {
      const [u, p, c] = await Promise.all([
        api.auth.getCurrentUser(), 
        api.getPages(), 
        api.getSiteConfig()
      ]);
      setUser(u); 
      setPages(p); 
      setConfig(c);
      
      if (u) {
        const isAdmin = [UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR, UserRole.SUPPORT].includes(u.role);
        if (view === 'home' || view === 'login') {
          setView(isAdmin ? 'admin_dashboard' : 'user_dashboard');
        }
      }
    } catch (e) {
      console.error("Boot failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    boot();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center font-cairo">
        <div className="w-20 h-20 border-b-4 border-yellow-500 rounded-full animate-spin mb-8 shadow-2xl shadow-yellow-500/20"></div>
        <div className="text-yellow-500 font-black uppercase tracking-[0.4em] animate-pulse">جاري فك تشفير البيانات...</div>
      </div>
    );
  }

  const isMaintenance = config?.maintenanceMode && user?.role !== UserRole.ADMIN;
  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 text-center font-cairo" dir="rtl">
         <div className="w-32 h-32 bg-yellow-500 rounded-[3rem] flex items-center justify-center shadow-2xl mb-12 animate-bounce">
            <Hammer size={64} className="text-slate-950" />
         </div>
         <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-none">السفينة تحت الصيانة</h1>
         <p className="text-2xl text-slate-500 max-w-2xl leading-relaxed font-bold">نقوم بتعزيز أنظمة الدفاع والهجوم. سنعود للسيطرة قريباً!</p>
         <div className="mt-12 text-[11px] text-yellow-500 font-black uppercase tracking-[0.6em] animate-pulse">DOCKING PROTOCOL: ACTIVE</div>
      </div>
    );
  }

  const handleAuthSuccess = () => {
    setGlobalToast({ message: "تمت عملية التحقق بنجاح، مرحباً بك أيها القبطان", type: 'success' });
    boot();
  };

  const handleLogout = async () => {
    api.auth.logout();
    setUser(null);
    setView('home');
    window.location.reload();
  };

  const renderView = () => {
    if (view === 'login') return <LoginPage onSuccess={handleAuthSuccess} setView={setView} />;
    if (view === 'register') return <RegisterPage onSuccess={handleAuthSuccess} setView={setView} />;

    const isAdminView = view === 'admin_dashboard' && [UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR, UserRole.SUPPORT].includes(user?.role || UserRole.USER);

    if (isAdminView && user) {
      return (
        <DashboardLayout user={user} onLogout={handleLogout} currentView={view} setView={setView} lang={lang} t={t}>
          <AdminDashboard />
        </DashboardLayout>
      );
    }

    if (view === 'user_dashboard' && user) {
      return (
        <DashboardLayout user={user} onLogout={handleLogout} currentView={view} setView={setView} lang={lang} t={t}>
          <UserDashboard user={user} setView={setView} lang={lang} t={t} onLogout={handleLogout} />
        </DashboardLayout>
      );
    }

    return (
      <PublicLayout 
        config={config!} user={user} pages={pages} currentView={view} 
        setView={setView} onLogout={handleLogout} lang={lang} setLang={setLang} t={t} 
      />
    );
  };

  return (
    <div className={`min-h-screen ${lang === 'ar' ? 'font-cairo' : 'font-inter'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {globalToast && <Toast message={globalToast.message} type={globalToast.type} onClose={() => setGlobalToast(null)} />}
      {renderView()}
    </div>
  );
}
