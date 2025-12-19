
import React from 'react';
import { PageBlock, SmartLink, NewsItem } from '../types';
import { 
  ArrowRight, Star, Layers, MousePointer2, Image as ImageIcon, 
  Play, Users, CreditCard, Facebook, Twitter, Instagram, Youtube,
  TrendingUp, ShieldCheck, Zap, Ship, CheckCircle2, PlayCircle, Video, Sparkles, Rocket,
  ChevronDown, HelpCircle, MessageSquare, Info, Share2
} from 'lucide-react';

interface DynamicBlockProps {
  block: PageBlock;
  themeColors: { primary: string; secondary: string; accent: string };
  newsData?: NewsItem[];
}

const IconMap: Record<string, any> = {
  'play': Play,
  'play-circle': PlayCircle,
  'arrow-right': ArrowRight,
  'zap': Zap,
  'ship': Ship,
  'star': Star,
  'shield': ShieldCheck,
  'rocket': Rocket,
  'sparkles': Sparkles,
  'users': Users,
  'credit-card': CreditCard,
  'message': MessageSquare,
  'info': Info,
  'share': Share2
};

export const DynamicBlock: React.FC<DynamicBlockProps> = ({ block, themeColors, newsData }) => {
  const getAlignmentClass = () => {
    if (block.style.textAlign === 'center') return 'text-center items-center justify-center mx-auto';
    if (block.style.textAlign === 'right') return 'text-right items-end justify-end ml-auto';
    return 'text-left items-start justify-start mr-auto';
  };

  const textStyle = {
    color: block.style.textColor || (block.style.isDark ? '#f8fafc' : '#020617')
  };

  const renderButtons = () => (
    <div className={`flex flex-col sm:flex-row flex-wrap gap-4 mt-8 sm:mt-12 w-full sm:w-auto ${getAlignmentClass()}`}>
       {block.actions && block.actions.map((action, i) => {
         const Icon = action.icon ? IconMap[action.icon] : null;
         const buttonStyle: React.CSSProperties = {};
         const activeThemeColor = themeColors[action.themeColor as keyof typeof themeColors] || themeColors.primary;

         if (action.customBg) {
            buttonStyle.background = action.customBg;
            buttonStyle.border = 'none';
         } else if (action.style === 'outline') {
            buttonStyle.border = `2px solid ${activeThemeColor}`;
            buttonStyle.color = activeThemeColor;
            buttonStyle.background = 'transparent';
         } else if (action.style === 'royal-gradient') {
            buttonStyle.background = 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)';
            buttonStyle.border = 'none';
         } else if (action.style === 'solid' || action.style === 'shimmer' || action.style === 'primary') {
            buttonStyle.backgroundColor = activeThemeColor;
            buttonStyle.border = 'none';
         }

         if (action.customTextColor) {
            buttonStyle.color = action.customTextColor;
         } else if (!action.customBg && action.style !== 'outline') {
            buttonStyle.color = '#020617';
         }

         return (
           <a 
             key={i} 
             href={action.value} 
             className={`${getButtonClass(action)} w-full sm:w-auto text-center justify-center`}
             style={buttonStyle}
           >
             <span className="relative z-10">{action.label}</span>
             {Icon && <Icon size={18} className="ms-2 relative z-10" />}
             {action.style === 'shimmer' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>}
           </a>
         );
       })}
    </div>
  );

  const blockPadding = `py-${block.style.paddingY || '20'}`;

  switch (block.type) {
    case 'hero':
      const hasGradient = !!block.style.backgroundGradient;
      const heroStyle: React.CSSProperties = {
          minHeight: '80vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden'
      };

      if (hasGradient) {
          heroStyle.background = block.style.backgroundGradient;
      } else if (block.image) {
          heroStyle.backgroundImage = `url(${block.image})`;
          heroStyle.backgroundSize = 'cover';
          heroStyle.backgroundPosition = 'center';
      }

      return (
        <div className={`p-8 md:p-24 ${block.style.textAlign === 'center' ? 'items-center text-center' : 'items-start text-left'}`} style={heroStyle}>
           <div className="absolute inset-0 bg-black z-[1]" style={{ opacity: block.style.overlayOpacity !== undefined ? block.style.overlayOpacity : 0.5 }}></div>
           <div className={`relative z-10 max-w-5xl space-y-8 animate-royal flex flex-col w-full ${block.style.textAlign === 'center' ? 'items-center' : 'items-start'}`}>
              <h1 className="text-5xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none">{block.title}</h1>
              <p className="text-xl md:text-3xl text-yellow-500 font-black uppercase tracking-[0.3em]">{block.subtitle}</p>
              <div className="w-24 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-lg md:text-2xl text-slate-200 max-w-3xl font-bold leading-relaxed">{block.content}</p>
              {renderButtons()}
           </div>
        </div>
      );

    case 'gallery':
        return (
            <div className={`${blockPadding} px-8 max-w-7xl mx-auto space-y-16 animate-royal`}>
                <div className={getAlignmentClass()}>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">{block.title}</h2>
                    <p className="text-yellow-500 font-black uppercase tracking-widest">{block.subtitle}</p>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${block.style.gridCols || 3} gap-8`}>
                    {block.items?.map((item: any, idx: number) => (
                        <div key={idx} className="group relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-yellow-500/50 transition-all duration-500">
                            <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                                <h4 className="text-lg font-black text-white uppercase">{item.title}</h4>
                                <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">{item.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );

    case 'faq':
        return (
            <div className={`${blockPadding} px-8 max-w-4xl mx-auto space-y-16 animate-royal`}>
                <div className="text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">{block.title}</h2>
                    <p className="text-yellow-500 font-black uppercase tracking-widest">{block.subtitle}</p>
                </div>
                <div className="space-y-4">
                    {block.items?.map((item: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 hover:bg-white/5 transition-all cursor-pointer group">
                            <h4 className="text-lg font-black text-white uppercase group-hover:text-yellow-500 transition-colors flex items-center gap-4">
                                <HelpCircle className="text-yellow-500" size={20} />
                                {item.question}
                            </h4>
                            <p className="mt-4 text-slate-400 font-bold leading-relaxed">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        );

    case 'features_grid':
        return (
            <div className={`${blockPadding} px-8 max-w-7xl mx-auto space-y-16 animate-royal`}>
                <div className={getAlignmentClass()}>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">{block.title}</h2>
                    <p className="text-yellow-500 font-black uppercase tracking-widest">{block.subtitle}</p>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${block.style.gridCols || 3} gap-8`}>
                    {block.items?.map((item: any, idx: number) => {
                        const Icon = item.icon ? IconMap[item.icon] : Zap;
                        return (
                            <div key={idx} className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] hover:bg-slate-900/50 transition-all group">
                                <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-6 group-hover:bg-yellow-500 group-hover:text-slate-950 transition-all">
                                    <Icon size={32} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase mb-3">{item.title}</h4>
                                <p className="text-slate-400 font-bold leading-relaxed text-sm">{item.content}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );

    case 'text_image':
        const isRight = block.style.textAlign === 'right';
        return (
            <div className={`${blockPadding} px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-royal`}>
                <div className={`${isRight ? 'lg:order-2' : ''} space-y-8`}>
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{block.title}</h2>
                    <p className="text-yellow-500 font-black uppercase tracking-widest">{block.subtitle}</p>
                    <p className="text-lg text-slate-400 font-bold leading-relaxed">{block.content}</p>
                    {renderButtons()}
                </div>
                <div className={`${isRight ? 'lg:order-1' : ''}`}>
                    <img src={block.image} className="w-full h-auto rounded-[3rem] border-4 border-white/5 shadow-4xl" alt="" />
                </div>
            </div>
        );

    case 'stats_counter':
        return (
            <div className={`${blockPadding} bg-slate-950/50 backdrop-blur-xl border-y border-white/5`}>
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {block.items?.map((item: any, idx: number) => (
                        <div key={idx} className="space-y-2">
                            <p className="text-5xl font-black text-white tracking-tighter">{item.value}</p>
                            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        );

    case 'divider':
        return (
            <div className="py-12 flex justify-center items-center">
                <div className="w-full max-w-md h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full"></div>
            </div>
        );

    default:
      return (
        <div className={`py-24 px-8 max-w-7xl mx-auto ${getAlignmentClass()}`}>
           <div className={`max-w-4xl space-y-6 ${getAlignmentClass()}`}>
              {block.title && <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white">{block.title}</h2>}
              {block.subtitle && <p className="text-lg font-black uppercase tracking-widest text-yellow-500">{block.subtitle}</p>}
           </div>
           {renderButtons()}
        </div>
      );
  }
};

function getButtonClass(action: SmartLink) {
  const base = "relative px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center text-[11px] group active:scale-95 overflow-hidden shadow-lg ";
  if (action.style === 'solid' || action.style === 'shimmer' || action.style === 'royal-gradient' || action.style === 'primary') return base + "text-slate-950 hover:brightness-110";
  return base;
}
