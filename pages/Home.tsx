
import React from 'react';
import { ShieldCheck, Zap, Globe, Cpu, ArrowRight, Ship, Lock, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500 selection:text-white">
      {/* Navbar Landing */}
      <nav className="fixed top-0 w-full h-24 px-8 md:px-16 flex items-center justify-between glass-effect z-50 border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20"><Ship size={28}/></div>
           <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter uppercase leading-none">SecureDash</span>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-1">Enterprise v5.5</span>
           </div>
        </div>
        <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-400">
           <a href="#features" className="hover:text-white transition-all uppercase tracking-widest">المميزات</a>
           <a href="#security" className="hover:text-white transition-all uppercase tracking-widest">الأمان</a>
           <a href="#pricing" className="hover:text-white transition-all uppercase tracking-widest">الخطط</a>
        </div>
        <button 
          onClick={onLogin}
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all border-b-4 border-indigo-800"
        >
          دخول المنصة
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-56 pb-32 px-8 text-center max-w-6xl mx-auto flex flex-col items-center gap-10 animate-slide">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>
         
         <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">الجيل الخامس من لوحات التحكم متاح الآن</span>
         </div>

         <h1 className="text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">
           إدارة ذكية <br /> بلمسة ملكية
         </h1>
         
         <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed">
           المنصة المتكاملة لإدارة المستخدمين، المحتوى، والعمليات الأمنية في بيئة سحابية فائقة السرعة.
         </p>
         
         <div className="flex flex-wrap justify-center gap-6 mt-6">
            <button className="bg-white text-slate-950 px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 group hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all">
              ابدأ الآن مجاناً <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/5 border-2 border-white/10 px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
              النسخة التجريبية
            </button>
         </div>

         {/* Stats Mini Bar */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 w-full max-w-4xl">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                <p className="text-3xl font-black text-white">99.9%</p>
                <p className="text-[10px] text-slate-500 font-black uppercase mt-2">Uptime</p>
            </div>
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                <p className="text-3xl font-black text-white">256-bit</p>
                <p className="text-[10px] text-slate-500 font-black uppercase mt-2">Security</p>
            </div>
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                <p className="text-3xl font-black text-white">1.2ms</p>
                <p className="text-[10px] text-slate-500 font-black uppercase mt-2">Latency</p>
            </div>
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                <p className="text-3xl font-black text-white">24/7</p>
                <p className="text-[10px] text-slate-500 font-black uppercase mt-2">Support</p>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">لماذا تختار SecureDash؟</h2>
            <div className="w-24 h-2 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard icon={Zap} title="سرعة خارقة" desc="كود نظيف تماماً يضمن استجابة فورية للواجهات حتى مع أضخم قواعد البيانات." />
          <FeatureCard icon={ShieldCheck} title="أمان متطور" desc="نظام حماية متكامل ضد هجمات الـ SQL Injection والـ XSS مع تشفير AES." />
          <FeatureCard icon={Globe} title="تغطية عالمية" desc="دعم كامل لجميع اللغات والاتجاهات (RTL/LTR) مع توافق كامل مع السيو." />
          <FeatureCard icon={Cpu} title="ذكاء اصطناعي" desc="تحليلات تنبؤية تساعدك على فهم سلوك المستخدمين وتوقع نمو أعمالك." />
          <FeatureCard icon={Lock} title="تحكم بالصلاحيات" desc="نظام أدوار متطور (RBAC) يمنحك السيطرة الكاملة على من يرى ماذا." />
          <FeatureCard icon={BarChart3} title="تقارير حية" desc="لوحات بيانات تفاعلية تعرض إحصائياتك في الوقت الفعلي برسوم بيانية مذهلة." />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="p-10 bg-slate-900/40 rounded-[3rem] border border-white/5 shadow-sm hover:shadow-2xl hover:border-indigo-500/30 transition-all group relative overflow-hidden">
     <div className="absolute top-0 right-0 p-20 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors"></div>
     <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-inner">
        <Icon size={32} />
     </div>
     <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">{title}</h3>
     <p className="text-slate-400 text-base leading-relaxed font-medium">{desc}</p>
  </div>
);
