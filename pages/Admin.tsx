
import React, { useEffect, useState } from 'react';
import { 
  Users, ShieldCheck, Settings, Database, 
  History, Terminal, Zap, ShieldAlert, FileText, 
  Plus, Trash2, Edit3, Globe, LayoutGrid, Activity,
  Palette, Save, Image as ImageIcon,
  Monitor, Fingerprint, Lock, Shield, Layers, 
  Download, Upload, Server, Layout, Clock, Eye, 
  Search, UserCheck, UserX, Copy, Check, Sparkles, Filter, Link as LinkIcon
} from 'lucide-react';
import { api } from '../services/api';
import { User, SiteConfig, Page, Asset, AnalyticsData } from '../types';
import { Button, Input, Badge, Card, Toast } from '../components/UI';
import { PageEditor } from './PageEditor';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [c, u, a, p, ast] = await Promise.all([
        api.getSiteConfig(), 
        api.admin.getUsers(), 
        api.admin.getAnalytics(),
        api.getPages(),
        api.admin.getAssets()
      ]);
      setConfig(c); 
      setUsers(u); 
      setAnalytics(a); 
      setPages(p);
      setAssets(ast);
    } catch (err) {
      setToast({ message: "فشل في جلب البيانات من السيرفر", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    try {
      await api.admin.updateUserStatus(id, newStatus as any);
      showToast(`تم تغيير حالة المستخدم بنجاح`, 'success');
      loadAll();
    } catch (err) {
      showToast("فشل في تحديث الحالة", 'error');
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617] font-cairo">
      <div className="w-20 h-20 border-b-4 border-yellow-500 rounded-full animate-spin mb-6"></div>
      <p className="text-yellow-500 font-black uppercase tracking-[0.4em] animate-pulse">Establishing Secure Uplink...</p>
    </div>
  );

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.includes(searchTerm)
  );

  return (
    <div className="space-y-12 animate-royal pb-24 font-cairo" dir="rtl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modern Elite Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
             <div className="px-4 py-1 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase rounded-sm skew-x-[-20deg]">LEVEL 5 CLEARANCE</div>
             <div className="h-px w-20 bg-gradient-to-r from-yellow-500 to-transparent"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <ShieldCheck className="text-yellow-500 w-12 h-12 md:w-16 md:h-16" /> 
            CORE <span className="text-yellow-500">CONTROL</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-2 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/5 shadow-2xl">
          <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={LayoutGrid} label="الإحصائيات" />
          <TabBtn active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="الأسطول" />
          <TabBtn active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} icon={FileText} label="الصفحات" />
          <TabBtn active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon={Settings} label="النظام" />
        </div>
      </div>

      {activeTab === 'overview' && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in-up">
          <div className="lg:col-span-8 space-y-10">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard icon={Users} label="إجمالي الطاقم" value={analytics.totalUsers} color="cyan" growth={`+${analytics.growthRate}%`} />
                <StatCard icon={Zap} label="النشاط الحالي" value={analytics.activeNow} color="yellow" />
                <StatCard icon={Activity} label="زمن الاستجابة" value="12ms" color="green" />
                <StatCard icon={ShieldAlert} label="حالة الأمان" value="مؤمن" color="indigo" />
             </div>
             
             <Card className="border-yellow-500/20 bg-[#0a0a0a]/80">
                <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                   <h3 className="text-2xl font-black text-white uppercase flex items-center gap-3">
                     <History size={24} className="text-yellow-500" /> سجل العمليات الحي
                   </h3>
                   <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
                      <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Live Feed</span>
                   </div>
                </div>
                <div className="space-y-4">
                   <LogEntry user="Shadow_Captain" action="تعديل إعدادات النظام" time="منذ ثوانٍ" />
                   <LogEntry user="Elite_Pilot" action="تسجيل دخول جديد" time="منذ دقيقتين" />
                   <LogEntry user="Admin" action="تحديث الصفحة الرئيسية" time="منذ ساعة" />
                </div>
             </Card>
          </div>

          <aside className="lg:col-span-4 space-y-10">
             <Card className="bg-yellow-500/5 border-yellow-500/20">
                <h3 className="text-xl font-black text-yellow-500 uppercase mb-8 flex items-center gap-3">
                  <Terminal size={20} /> أوامر سريعة
                </h3>
                <div className="space-y-4">
                   <Shortcut keys="CTRL + P" label="منشئ الصفحات" />
                   <Shortcut keys="CTRL + U" label="إدارة الطاقم" />
                   <Button onClick={() => api.admin.exportData()} variant="gold" className="w-full h-16 mt-4 shadow-yellow-500/20">
                      تصدير قاعدة البيانات
                   </Button>
                   <Button onClick={() => showToast("تم تنظيف الكاش", "info")} variant="secondary" className="w-full h-14">
                      تنظيف الذاكرة المؤقتة
                   </Button>
                </div>
             </Card>
          </aside>
        </div>
      )}

      {activeTab === 'users' && (
        <Card className="p-0 border-white/5 overflow-hidden animate-fade-in-up bg-[#050505]/90">
           <div className="p-10 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-yellow-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-500/20"><Users size={28}/></div>
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter">سجل أسطول الهامور</h3>
              </div>
              <div className="relative w-full md:w-[500px]">
                <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن قبطان بالاسم أو المعرف..." 
                  className="w-full h-16 bg-[#111] border-2 border-white/5 rounded-3xl pr-16 pl-8 text-white font-black text-sm focus:border-yellow-500 transition-all outline-none uppercase placeholder:text-slate-800 shadow-inner" 
                />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="bg-black/40 text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] border-b border-white/5">
                    <th className="p-10">هوية القبطان</th>
                    <th className="p-10">المستوى</th>
                    <th className="p-10">الحالة</th>
                    <th className="p-10 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-all group">
                      <td className="p-10 flex items-center gap-6">
                         <img src={u.avatar} className="w-14 h-14 rounded-2xl border-2 border-white/10 group-hover:border-yellow-500 transition-all shadow-lg" />
                         <div>
                            <p className="font-black text-white text-lg tracking-tight uppercase leading-none mb-1 group-hover:text-yellow-500 transition-colors">{u.displayName}</p>
                            <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">{u.email}</p>
                         </div>
                      </td>
                      <td className="p-10"><Badge type={u.role === 'admin' ? 'info' : 'default'} className="bg-indigo-500/5 text-indigo-400 border-indigo-500/10 uppercase">{u.role}</Badge></td>
                      <td className="p-10">
                         <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${u.status === 'active' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]'}`}></div>
                            <span className={`text-[11px] font-black uppercase ${u.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{u.status === 'active' ? 'نشط' : 'محظور'}</span>
                         </div>
                      </td>
                      <td className="p-10 text-left">
                         <button 
                           onClick={() => handleUpdateStatus(u.id, u.status)}
                           className={`p-4 rounded-2xl transition-all border border-white/5 ${u.status === 'active' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}
                         >
                           {u.status === 'active' ? <UserX size={24} /> : <UserCheck size={24} />}
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </Card>
      )}

      {editingPage && (
        <PageEditor 
          initialPage={editingPage} 
          onSave={(p) => api.savePage(p).then(() => { setEditingPage(null); loadAll(); showToast("تم تحديث الصفحة بنجاح"); })} 
          onCancel={() => setEditingPage(null)} 
        />
      )}
    </div>
  );
};

// --- Specialized Components ---

const StatCard = ({ icon: Icon, label, value, color, growth }: any) => {
  const colors: any = {
    cyan: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    yellow: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5",
    green: "text-green-500 border-green-500/20 bg-green-500/5",
    indigo: "text-indigo-400 border-indigo-600/20 bg-indigo-600/5",
  };
  return (
    <Card className={`relative overflow-hidden group transition-all duration-500 ${colors[color]} hover:-translate-y-2`}>
       {growth && (
          <div className="absolute top-6 left-6 bg-green-500 text-slate-950 text-[9px] font-black px-3 py-1.5 rounded-xl shadow-xl animate-pulse">
             {growth}
          </div>
       )}
       <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-[#000]/60 border border-white/10 rounded-3xl flex items-center justify-center text-current shadow-2xl group-hover:scale-110 transition-transform">
             <Icon size={40} />
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">{label}</p>
             <p className="text-5xl font-black text-white tracking-tighter">{value}</p>
          </div>
       </div>
    </Card>
  );
};

const TabBtn = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${active ? 'bg-yellow-500 text-slate-950 shadow-[0_15px_30px_rgba(234,179,8,0.25)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    <Icon size={18} /> {label}
  </button>
);

const Shortcut = ({ keys, label }: any) => (
  <div className="flex justify-between items-center p-6 bg-black/40 rounded-[1.5rem] border border-white/5 hover:border-yellow-500/20 transition-all">
     <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
     <kbd className="px-4 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-yellow-500 font-black text-[10px] shadow-xl uppercase">{keys}</kbd>
  </div>
);

const LogEntry = ({ user, action, time }: any) => (
  <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 hover:bg-white/[0.06] transition-all group">
     <div className="flex items-center gap-6">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-yellow-500 text-xs border border-white/5 shadow-inner group-hover:bg-yellow-500 group-hover:text-slate-950 transition-all">LOG</div>
        <div>
           <p className="text-base font-black text-white uppercase tracking-tight group-hover:text-yellow-500 transition-colors">{user}</p>
           <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">{action}</p>
        </div>
     </div>
     <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{time}</span>
  </div>
);
