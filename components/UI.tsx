
import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  isTextarea?: boolean;
  forceUppercase?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, className, isTextarea, forceUppercase, ...props }) => {
  // التصميم الجديد: نص أبيض فاقع، خلفية داكنة جداً، إطار مضيء عند التركيز
  const baseStyles = `w-full px-8 py-5 bg-[#111] border-2 rounded-2xl text-lg font-black text-white caret-yellow-400 transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] placeholder:text-slate-800 outline-none tracking-widest ${
    error ? 'border-red-500 bg-red-500/5 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/5 focus:border-yellow-500/50 focus:bg-[#151515] focus:shadow-[0_0_30px_rgba(234,179,8,0.15)]'
  } ${className}`;

  const handleInput = (e: any) => {
    if (forceUppercase) {
      e.target.value = e.target.value.replace(/\s+/g, '').toUpperCase();
    }
    if (props.onInput) props.onInput(e);
  };

  return (
    <div className="mb-6 space-y-3">
      <label className="block text-[10px] font-black uppercase text-slate-500 px-4 tracking-[0.4em]">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          className={`${baseStyles} min-h-[160px] resize-none leading-relaxed`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          onInput={handleInput}
        />
      ) : (
        <input
          className={baseStyles}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          onInput={handleInput}
        />
      )}
      {error && <p className="mt-2 px-4 text-[10px] text-red-500 font-black uppercase tracking-widest animate-pulse">{error}</p>}
    </div>
  );
};

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'shimmer' | 'gold';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className, 
  disabled,
  ...props 
}) => {
  const baseStyles = "relative px-8 py-4 rounded-xl font-black transition-all duration-500 flex items-center justify-center text-[11px] uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group active:scale-95 shadow-xl";
  
  const variants = {
    primary: "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] border-b-4 border-indigo-800",
    gold: "bg-yellow-500 text-slate-950 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_40px_rgba(234,179,8,0.5)] border-b-4 border-yellow-700",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
    danger: "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] border-b-4 border-red-700",
    ghost: "text-slate-500 hover:text-white hover:bg-white/5",
    shimmer: "bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-600 text-slate-950 shadow-[0_15px_40px_rgba(234,179,8,0.3)]"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'shimmer' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
      )}
    </button>
  );
};

// --- Toast System ---
export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'border-green-500 bg-green-500/10 text-green-500',
    error: 'border-red-500 bg-red-500/10 text-red-500',
    info: 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
  };

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info;

  return (
    <div className={`fixed bottom-8 left-8 z-[300] flex items-center gap-4 px-6 py-4 rounded-2xl border-2 backdrop-blur-xl animate-royal shadow-2xl ${styles[type]}`}>
      <Icon size={24} />
      <span className="text-xs font-black uppercase tracking-widest">{message}</span>
      <button onClick={onClose} className="ml-2 hover:scale-125 transition-transform"><X size={18} /></button>
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 p-8 md:p-10 shadow-3xl ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; type?: 'success' | 'warning' | 'info' | 'danger' | 'default'; className?: string }> = ({ children, type = 'default', className = '' }) => {
  const styles = {
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
    default: 'bg-white/5 text-slate-500 border-white/10'
  };

  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${styles[type]} ${className}`}>
      {children}
    </span>
  );
};
