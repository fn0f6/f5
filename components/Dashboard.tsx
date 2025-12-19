
import React, { useState, useEffect } from 'react';
import { 
  Users, BarChart3, Newspaper, ShieldAlert, Settings, 
  Menu, X, LogOut, Sun, Moon, Bell, Search, TrendingUp,
  UserPlus, DollarSign, Activity
} from 'lucide-react';
import { api } from '../services/api';
import { User, AnalyticsData, UserRole } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadData = async () => {
      const [s, u] = await Promise.all([api.admin.getAnalytics(), api.admin.getUsers()]);
      setStats(s);
      setUsers(u);
    };
    loadData();
    
    // إعداد الثيم
    const savedTheme = localStorage.getItem('sd_theme') as any || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('sd_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
      }`}
    >
      <Icon size={20} />
      {sidebarOpen && <span className="font-semibold text-sm">{label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-[var(--bg-main)]">
      {/* Sidebar */}
      <aside className={`glass-effect border-e border-[var(--border-color)] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} p-4 flex flex-col gap-8`}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xl">
            <ShieldAlert />
          </div>
          {sidebarOpen && <span className="text-xl font-black tracking-tighter">SD PRO</span>}
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavItem id="overview" icon={BarChart3} label="نظرة عامة" />
          <NavItem id="users" icon={Users} label="المستخدمين" />
          <NavItem id="news" icon={Newspaper} label="الأخبار" />
          <NavItem id="moderation" icon={ShieldAlert} label="الرقابة" />
          <NavItem id="settings" icon={Settings} label="الإعدادات" />
        </nav>

        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut size={20} />
          {sidebarOpen && <span className="font-bold text-sm">تسجيل الخروج</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-[var(--border-color)] flex items-center justify-between px-8 bg-[var(--bg-card)]">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن أي شيء..." 
                className="bg-slate-100 dark:bg-slate-900 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="relative">
              <Bell size={22} className="text-slate-500" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </div>
            <div className="flex items-center gap-3 ps-4 border-s border-[var(--border-color)]">
              <img src="https://ui-avatars.com/api/?name=Admin" className="w-10 h-10 rounded-full border-2 border-indigo-500/20" />
              <div className="hidden lg:block text-end">
                <p className="text-sm font-bold">إدارة النظام</p>
                <p className="text-[10px] text-slate-500 uppercase font-black">Admin Access</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Panel Content */}
        <div className="flex-1 overflow-y-auto p-8 animate-slide">
          {activeTab === 'overview' && stats && (
            <div className="flex flex-col gap-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="إجمالي المستخدمين" value={stats.totalUsers} growth="+12%" icon={Users} color="indigo" />
                <StatsCard title="الجلسات النشطة" value={stats.activeSessions} growth="+5%" icon={Activity} color="emerald" />
                <StatsCard title="الإيرادات اليومية" value={`$${stats.dailyRevenue}`} growth="+8%" icon={DollarSign} color="amber" />
                <StatsCard title="معدل النمو" value={`${stats.growthRate}%`} growth="Stable" icon={TrendingUp} color="blue" />
              </div>

              {/* Chart Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[var(--bg-card)] p-6 rounded-3xl shadow-sm border border-[var(--border-color)]">
                  <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                    <TrendingUp className="text-indigo-500" /> إحصائيات التفاعل الأسبوعي
                  </h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.chartData}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: theme === 'dark' ? '#0f172a' : '#fff'}}
                        />
                        <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* User List Shortcut */}
                <div className="bg-[var(--bg-card)] p-6 rounded-3xl shadow-sm border border-[var(--border-color)]">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="font-black">آخر المنضمين</h3>
                     <button className="text-xs text-indigo-600 font-bold hover:underline">عرض الكل</button>
                   </div>
                   <div className="flex flex-col gap-4">
                     {users.slice(0, 5).map(u => (
                       <div key={u.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all cursor-pointer">
                         <div className="flex items-center gap-3">
                           <img src={u.avatar} className="w-10 h-10 rounded-xl" />
                           <div>
                             <p className="text-sm font-bold">{u.displayName}</p>
                             <p className="text-[10px] text-slate-500">@{u.username}</p>
                           </div>
                         </div>
                         <button className="p-2 text-slate-400 hover:text-indigo-600"><Settings size={16}/></button>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatsCard = ({ title, value, growth, icon: Icon, color }: any) => (
  <div className="bg-[var(--bg-card)] p-6 rounded-[2rem] shadow-sm border border-[var(--border-color)] group hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500 group-hover:bg-${color}-500 group-hover:text-white transition-all`}>
        <Icon size={24} />
      </div>
      <span className={`text-xs font-black px-2 py-1 rounded-full ${growth.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
        {growth}
      </span>
    </div>
    <h4 className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-wider">{title}</h4>
    <p className="text-2xl font-black">{value}</p>
  </div>
);
