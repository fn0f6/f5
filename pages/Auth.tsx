
import React, { useState, useEffect } from 'react';
import { 
  Lock, Mail, User as UserIcon, ShieldCheck, Zap, 
  Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight,
  Shield, Key, Fingerprint, Sparkles, Ship, Rocket
} from 'lucide-react';
import { Input, Button, Card } from '../components/UI';
import { api } from '../services/api';
import { ViewState } from '../types';

interface AuthProps {
  onSuccess: () => void;
  setView: (view: ViewState) => void;
}

const PasswordStrength = ({ password }: { password: string }) => {
  const [strength, setStrength] = useState(0);
  useEffect(() => {
    let s = 0;
    if (password.length > 6) s += 25;
    if (/[A-Z]/.test(password)) s += 25;
    if (/[0-9]/.test(password)) s += 25;
    if (/[^A-Za-z0-9]/.test(password)) s += 25;
    setStrength(s);
  }, [password]);

  const getColor = () => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getLabel = () => {
    if (strength === 0) return '';
    if (strength <= 25) return 'ضعيفة جداً';
    if (strength <= 50) return 'متوسطة';
    if (strength <= 75) return 'جيدة';
    return 'قوية جداً';
  };

  if (!password) return null;

  return (
    <div className="mt-4 space-y-2 px-6">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
        <span className="text-slate-500">قوة التشفير:</span>
        <span className={strength <= 25 ? 'text-red-500' : strength <= 75 ? 'text-yellow-500' : 'text-green-500'}>{getLabel()}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${getColor()} transition-all duration-500`} style={{ width: `${strength}%` }}></div>
      </div>
    </div>
  );
};

export const LoginPage: React.FC<AuthProps> = ({ onSuccess, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.auth.login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden font-cairo">
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-yellow-500/10 blur-[150px] rounded-full"></div>
      </div>

      <Card className="w-full max-w-[500px] relative z-10 border-white/5 bg-slate-900/40 backdrop-blur-3xl p-12 md:p-16 rounded-[4rem] shadow-[0_80px_160px_rgba(0,0,0,0.8)]">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-yellow-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_20px_50px_rgba(234,179,8,0.3)] animate-royal">
             <Fingerprint size={48} className="text-slate-950" />
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">الدخول للمنصة</h1>
          <p className="text-slate-400 font-bold text-sm tracking-wide">أدخل بيانات الاعتماد المشفرة للوصول</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/20 text-red-500 p-6 rounded-3xl text-xs font-black uppercase flex items-center gap-4 mb-8 animate-shake">
            <AlertCircle size={24} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-8 top-10 text-slate-700 group-hover:text-indigo-500 transition-colors z-10" size={24} />
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@hamour.com"
              className="pl-20 border-white/5 bg-white/5 focus:bg-white/10"
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-8 top-10 text-slate-700 group-hover:text-indigo-500 transition-colors z-10" size={24} />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-8 top-10 text-slate-600 hover:text-white z-10"
            >
              {showPass ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
            <Input
              label="كلمة المرور"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="pl-20 pr-20 border-white/5 bg-white/5 focus:bg-white/10"
            />
          </div>
          
          <Button type="submit" variant="shimmer" className="w-full h-20 rounded-3xl mt-8 shadow-3xl text-xl" isLoading={loading}>
            <span className="flex items-center gap-3">فك التشفير والدخول <ArrowRight /></span>
          </Button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-slate-500 font-bold text-sm">ليس لديك هوية ملكية؟</p>
          <button 
            onClick={() => setView('register')}
            className="mt-4 text-yellow-500 font-black uppercase tracking-[0.2em] hover:text-white transition-all text-xs"
          >
            إنشاء حساب جديد الآن
          </button>
        </div>
      </Card>
    </div>
  );
};

export const RegisterPage: React.FC<AuthProps> = ({ onSuccess, setView }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.username.length < 4) {
      setError('اسم المستخدم يجب أن يكون 4 أحرف على الأقل');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      await api.auth.register(formData.username, formData.email, formData.password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden font-cairo">
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[50rem] h-[50rem] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[40rem] h-[40rem] bg-yellow-500/10 blur-[150px] rounded-full"></div>
      </div>

      <Card className="w-full max-w-[600px] relative z-10 border-white/5 bg-slate-900/40 backdrop-blur-3xl p-12 md:p-16 rounded-[4rem] shadow-[0_80px_160px_rgba(0,0,0,0.8)]">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-royal">
             <Rocket size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">صناعة هوية ملكية</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">انضم لأسطول الهامور اليوم</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/20 text-red-500 p-6 rounded-3xl text-xs font-black uppercase flex items-center gap-4 mb-8">
            <AlertCircle size={24} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input
                label="اسم القبطان"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                placeholder="اسم المستخدم"
                className="bg-white/5 border-white/5"
             />
             <Input
                label="البريد المشفر"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="user@hamour.com"
                className="bg-white/5 border-white/5"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <Input
                  label="مفتاح الأمان"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  placeholder="••••••••"
                  className="bg-white/5 border-white/5"
                />
                <PasswordStrength password={formData.password} />
             </div>
             <Input
                label="تأكيد المفتاح"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                placeholder="••••••••"
                className="bg-white/5 border-white/5"
             />
          </div>
          
          <Button type="submit" variant="primary" className="w-full h-20 rounded-3xl mt-8 shadow-3xl text-xl" isLoading={loading}>
             إنشاء الهوية والتحليق
          </Button>
        </form>

        <div className="mt-10 text-center border-t border-white/5 pt-8">
          <button 
            onClick={() => setView('login')}
            className="text-slate-500 font-black uppercase tracking-widest hover:text-white transition-all text-[10px]"
          >
            لديك حساب بالفعل؟ <span className="text-indigo-400 ml-2 underline">سجل دخولك</span>
          </button>
        </div>
      </Card>
    </div>
  );
};
