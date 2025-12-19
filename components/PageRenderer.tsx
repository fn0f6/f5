
import React from 'react';
import { PageBlock, SiteConfig, NewsItem } from '../types';
import { DynamicBlock } from './DynamicBlock';

interface PageRendererProps {
  blocks: PageBlock[];
  config: SiteConfig;
  pageSettings?: {
    backgroundImage?: string;
    backgroundColor?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundAttachment?: string;
  };
  news?: NewsItem[]; 
  className?: string;
  selectedBlockId?: string;
  onSelectBlock?: (id: string) => void;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ blocks, config, pageSettings, news, className, selectedBlockId, onSelectBlock }) => {
  const themeColors = {
    primary: config.theme?.colors?.primary || config.primaryColor || '#EAB308',
    secondary: config.theme?.colors?.secondary || config.secondaryColor || '#0F172A',
    accent: config.theme?.colors?.accent || '#78350F'
  };

  const pageStyle: React.CSSProperties = {
     minHeight: '100%',
     backgroundColor: pageSettings?.backgroundColor || 'transparent',
  };

  if (pageSettings?.backgroundImage) {
      pageStyle.backgroundImage = `url(${pageSettings.backgroundImage})`;
      pageStyle.backgroundSize = pageSettings.backgroundSize || 'cover';
      pageStyle.backgroundPosition = pageSettings.backgroundPosition || 'center';
      pageStyle.backgroundRepeat = pageSettings.backgroundRepeat || 'no-repeat';
      pageStyle.backgroundAttachment = pageSettings.backgroundAttachment || 'scroll';
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div className="py-40 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px] bg-slate-950/20 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-white/5 m-10">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl font-black text-white">+</span>
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">هذه الصفحة قيد الإنشاء</h3>
        <p className="text-slate-400 font-bold max-w-sm mx-auto">لم يتم إضافة أي كتل محتوى لهذه الصفحة بعد. استخدم لوحة التحكم لإضافة عناصر جديدة.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-full h-full ${className || ''}`} style={pageStyle}>
      {blocks.map((block) => (
        <div 
            key={block.id} 
            className={`relative group/block transition-all duration-300 ${
                onSelectBlock ? 'cursor-pointer hover:ring-4 hover:ring-indigo-500/50 hover:z-10' : ''
            } ${selectedBlockId === block.id ? 'ring-4 ring-yellow-500 z-20 shadow-[0_0_50px_rgba(234,179,8,0.3)]' : ''}`}
            onClick={(e) => {
                if (onSelectBlock) {
                    e.stopPropagation();
                    onSelectBlock(block.id);
                }
            }}
        >
             <DynamicBlock 
                block={block} 
                themeColors={themeColors}
                newsData={news}
            />
            
            {onSelectBlock && (
                <div className={`absolute top-4 right-4 bg-yellow-500 text-slate-950 text-[10px] px-4 py-1.5 uppercase font-black rounded-xl shadow-2xl z-30 pointer-events-none transition-all duration-200 ${selectedBlockId === block.id ? 'opacity-100 scale-110' : 'opacity-0 scale-90 group-hover/block:opacity-100'}`}>
                    {block.type.replace('_', ' ')}
                </div>
            )}
        </div>
      ))}
    </div>
  );
};
