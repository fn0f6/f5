
import React, { useState, useRef } from 'react';
import { Page, PageBlock, BlockType, SmartLink } from '../types';
import { Button, Input } from '../components/UI';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Save, X, 
  Settings, Layers, MousePointer2, Link, 
  Type, Image as ImageIcon, Layout, Palette, ChevronDown, ChevronUp,
  Play, TrendingUp, CreditCard, Share2, Users, Upload, Monitor, AlignLeft, AlignCenter, AlignRight,
  Zap, Ship, Star, PlayCircle, ShieldCheck, ArrowRight, Sparkles, Rocket, Pipette,
  Maximize, Box, CloudLightning, HelpCircle, List, Minus, Terminal, Check,
  // Added missing icons used in the component
  MessageSquare, Info, Video, Eye, EyeOff
} from 'lucide-react';

interface PageEditorProps {
  initialPage: Page;
  onSave: (page: Page) => void;
  onCancel: () => void;
}

const AVAILABLE_ICONS = [
  { id: 'play', icon: Play, label: 'تشغيل' },
  { id: 'zap', icon: Zap, label: 'توهج' },
  { id: 'ship', icon: Ship, label: 'سفينة' },
  { id: 'star', icon: Star, label: 'نجمة' },
  { id: 'shield', icon: ShieldCheck, label: 'درع' },
  { id: 'rocket', icon: Rocket, label: 'صاروخ' },
  { id: 'sparkles', icon: Sparkles, label: 'سحر' },
  { id: 'share', icon: Share2, label: 'مشاركة' },
  { id: 'arrow-right', icon: ArrowRight, label: 'سهم' },
  { id: 'users', icon: Users, label: 'مستخدمين' },
  { id: 'message', icon: MessageSquare, label: 'رسالة' },
  { id: 'info', icon: Info, label: 'معلومات' }
];

const BLOCK_TEMPLATES: Record<BlockType, Partial<PageBlock>> = {
  hero: { 
    title: 'مهمة جديدة', 
    subtitle: 'أفق البحار الرقمية', 
    content: 'ابدأ بكتابة قصتك الأسطورية هنا وصف كيف ستغزو العالم.', 
    actions: [
        { label: 'انطلق الآن', value: '#', style: 'royal-gradient', icon: 'rocket' },
        { label: 'Share', value: '#share', style: 'solid', icon: 'share' }
    ], 
    style: { paddingY: '24', textAlign: 'center', overlayOpacity: 0.5 } 
  },
  text_image: { title: 'الميزة الكبرى', subtitle: 'لماذا نحن؟', content: 'وصف تفصيلي للميزات والخدمات التي تقدمها إمبراطوريتك.', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1000', style: { paddingY: '20', textAlign: 'left' }, actions: [] },
  features_grid: { title: 'قدرات الأسطول', subtitle: 'نظام متكامل', items: [{ title: 'سرعة البرق', content: 'استجابة فورية في أقل من 10 ملي ثانية.', icon: 'zap' }, { title: 'درع نانو', content: 'حماية كاملة ضد الاختراق والتشفير.', icon: 'shield' }, { title: 'اتصال عالمي', content: 'وصول من أي مكان في المحيط الرقمي.', icon: 'ship' }], style: { paddingY: '20', textAlign: 'center', gridCols: 3 }, actions: [] },
  stats_counter: { items: [{ label: 'قبطان نشط', value: '1.2K' }, { label: 'رحلة ناجحة', value: '15K' }, { label: 'جزيرة مكتشفة', value: '840' }], style: { paddingY: '10', textAlign: 'center' }, actions: [] },
  gallery: { title: 'معرض الإنجازات', subtitle: 'لقطات من الميدان', items: [{ title: 'الجزيرة الذهبية', subtitle: 'استكشاف 2024', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600' }, { title: 'سفينة القيادة', subtitle: 'التصميم الأول', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee87?q=80&w=600' }, { title: 'المدينة العائمة', subtitle: 'التوسع الشمالي', image: 'https://images.unsplash.com/photo-1506929197327-fb87b3ee5f91?q=80&w=600' }], style: { paddingY: '20', textAlign: 'center', gridCols: 3 }, actions: [] },
  faq: { title: 'أسئلة البحارة', subtitle: 'كل ما تريد معرفته', items: [{ question: 'كيف يمكنني الانضمام؟', answer: 'ببساطة قم بإنشاء هويتك الملكية عبر صفحة التسجيل.' }, { question: 'هل النظام آمن؟', answer: 'نستخدم أقوى بروتوكولات التشفير AES-512 لحماية بياناتك.' }], style: { paddingY: '20', textAlign: 'center' }, actions: [] },
  cta_bar: { title: 'هل أنت جاهز للقيادة؟', content: 'انضم لآلاف القادة الذين يبنون إمبراطورياتهم اليوم.', actions: [{ label: 'ابدأ مجاناً', value: '/register', style: 'royal-gradient', icon: 'zap' }], style: { paddingY: '12', textAlign: 'center' } },
  divider: { style: { paddingY: '10', textAlign: 'center' }, title: '', content: '', actions: [] },
  video_block: { title: 'العرض الرسمي', content: 'شاهد قوة أسطول الهامور في هذا المقطع الحصري.', image: 'https://www.youtube.com/embed/dQw4w9WgXcQ', style: { paddingY: '20', textAlign: 'center' }, actions: [] },
  pricing_table: { title: 'باقات الدعم', subtitle: 'اختر مستواك', items: [], actions: [], style: { paddingY: '20', textAlign: 'center' } },
  social_links: { items: [], actions: [], style: { paddingY: '10', textAlign: 'center' }, title: '', content: '' },
  team_section: { items: [], actions: [], style: { paddingY: '20', textAlign: 'center' }, title: '', content: '' },
  news_ticker: { content: 'أخبار عاجلة: اكتشاف قارة جديدة في المحيط الهادئ... سفن القيادة تستعد للإقلاع...', style: { paddingY: '5', textAlign: 'left' }, title: '', actions: [] }
};

export const PageEditor: React.FC<PageEditorProps> = ({ initialPage, onSave, onCancel }) => {
  const [page, setPage] = useState<Page>(initialPage);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);

  const updateBlock = (id: string, updates: Partial<PageBlock>) => {
    setPage(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const addBlock = (type: BlockType) => {
    const template = BLOCK_TEMPLATES[type];
    const newBlock: PageBlock = {
      id: `block_${Date.now()}`,
      type,
      title: template.title || '',
      subtitle: template.subtitle || '',
      content: template.content || '',
      actions: template.actions || [],
      items: template.items || [],
      image: template.image || '',
      style: { 
        paddingY: '20', 
        textAlign: 'center', 
        ...template.style 
      }
    };
    setPage(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
    setSelectedBlockId(newBlock.id);
  };

  const removeBlock = (id: string) => {
    if (!confirm('هل أنت متأكد من تدمير هذه الكتلة؟')) return;
    setPage(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
    setSelectedBlockId(null);
  };

  const moveBlock = (idx: number, direction: 'up' | 'down') => {
    const newBlocks = [...page.blocks];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
    setPage(prev => ({ ...prev, blocks: newBlocks }));
  };

  const selectedBlock = page.blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[200] flex flex-col overflow-hidden animate-royal font-cairo">
      {/* Top Navigation Bar */}
      <div className="h-24 bg-slate-900 border-b border-white/5 flex items-center justify-between px-10 shrink-0 shadow-2xl z-[210]">
         <div className="flex items-center gap-8">
            <button onClick={onCancel} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all hover:bg-red-500/20"><X size={24}/></button>
            <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Empire Page Builder</h2>
                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mt-1">Editing: {page.label}</span>
            </div>
         </div>
         <div className="flex gap-4">
            <button onClick={() => setShowGlobalSettings(!showGlobalSettings)} className={`px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 ${showGlobalSettings ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                <Settings size={18} /> MISSION SPECS
            </button>
            <Button onClick={() => onSave(page)} className="bg-yellow-500 text-slate-950 px-12 h-14 rounded-2xl font-black shadow-xl shadow-yellow-500/30 flex items-center gap-2">
                <Save size={20}/> DEPLOY MISSION
            </Button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Components Library */}
        <aside className="w-96 border-l border-white/5 bg-slate-900/40 backdrop-blur-3xl p-8 flex flex-col gap-10 overflow-y-auto no-scrollbar shrink-0">
           
           {showGlobalSettings ? (
               <div className="space-y-8 animate-fade-in-up">
                   <div className="flex items-center justify-between">
                       <h3 className="text-lg font-black text-white uppercase tracking-tighter">Mission Specs</h3>
                       <button onClick={() => setShowGlobalSettings(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
                   </div>
                   <Input label="Page Label" value={page.label} onChange={e => setPage({...page, label: e.target.value})} />
                   <Input label="Mission Slug" value={page.slug} onChange={e => setPage({...page, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} />
                   <div className="space-y-6 pt-6 border-t border-white/5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Mission Status</label>
                        <button 
                            onClick={() => setPage({...page, isHidden: !page.isHidden})}
                            className={`w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 ${page.isHidden ? 'bg-slate-800 text-slate-400' : 'bg-green-600 text-white shadow-lg'}`}
                        >
                            {page.isHidden ? <EyeOff size={18}/> : <Eye size={18}/>}
                            {page.isHidden ? 'OFFLINE' : 'ONLINE'}
                        </button>
                   </div>
               </div>
           ) : (
               <>
                <div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Component Vault</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <BlockTool icon={Layout} label="Hero" onClick={() => addBlock('hero')} />
                        <BlockTool icon={ImageIcon} label="Text & Img" onClick={() => addBlock('text_image')} />
                        <BlockTool icon={Layers} label="Features" onClick={() => addBlock('features_grid')} />
                        <BlockTool icon={ImageIcon} label="Gallery" onClick={() => addBlock('gallery')} />
                        <BlockTool icon={TrendingUp} label="Stats" onClick={() => addBlock('stats_counter')} />
                        <BlockTool icon={HelpCircle} label="FAQ" onClick={() => addBlock('faq')} />
                        <BlockTool icon={Zap} label="CTA Bar" onClick={() => addBlock('cta_bar')} />
                        <BlockTool icon={Video} label="Video" onClick={() => addBlock('video_block')} />
                        <BlockTool icon={Minus} label="Divider" onClick={() => addBlock('divider')} />
                        <BlockTool icon={Terminal} label="Ticker" onClick={() => addBlock('news_ticker')} />
                    </div>
                </div>

                <div className="flex-1 pt-10 border-t border-white/5">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Mission Structure</h3>
                    <div className="space-y-3">
                        {page.blocks.map((b, idx) => (
                        <div key={b.id} onClick={() => setSelectedBlockId(b.id)} className={`p-5 rounded-3xl border-2 transition-all cursor-pointer group flex items-center justify-between ${selectedBlockId === b.id ? 'bg-yellow-500 border-yellow-500 text-slate-950 shadow-xl' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] opacity-40">#{idx+1}</span>
                                <Layers size={18} /> 
                                <span className="text-xs font-black uppercase">{b.type}</span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'up'); }} className="p-1 hover:text-white"><ChevronUp size={16}/></button>
                                <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'down'); }} className="p-1 hover:text-white"><ChevronDown size={16}/></button>
                            </div>
                        </div>
                        ))}
                        {page.blocks.length === 0 && (
                            <div className="text-center py-10 px-4 border-2 border-dashed border-white/5 rounded-3xl">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">No modules deployed. Select a component to begin mission construction.</p>
                            </div>
                        )}
                    </div>
                </div>
               </>
           )}
        </aside>

        {/* Central Editor View */}
        <main className="flex-1 overflow-y-auto p-16 bg-[#020617] no-scrollbar relative">
           <div className="max-w-5xl mx-auto space-y-12 pb-40">
              {selectedBlock ? (
                <div className="glass p-16 rounded-[5rem] border-indigo-500/20 space-y-16 animate-fade-in-up relative">
                   <div className="flex items-center justify-between border-b border-white/5 pb-8">
                      <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-yellow-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-500/10">
                              <Settings size={28} />
                          </div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Configure Module: <span className="text-yellow-500">{selectedBlock.type}</span></h3>
                      </div>
                      <div className="flex items-center gap-4">
                          <button onClick={() => removeBlock(selectedBlock.id)} className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={24}/></button>
                          <button onClick={() => setSelectedBlockId(null)} className="w-12 h-12 bg-white/5 text-slate-500 rounded-2xl flex items-center justify-center hover:text-white transition-all"><X size={24}/></button>
                      </div>
                   </div>

                   <div className="space-y-16">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {selectedBlock.type !== 'divider' && selectedBlock.type !== 'news_ticker' && (
                             <>
                                <Input label="Primary Heading" value={selectedBlock.title} onChange={e => updateBlock(selectedBlock.id, {title: e.target.value})} />
                                <Input label="Secondary Signal" value={selectedBlock.subtitle} onChange={e => updateBlock(selectedBlock.id, {subtitle: e.target.value})} />
                             </>
                         )}
                         {(selectedBlock.type === 'hero' || selectedBlock.type === 'text_image' || selectedBlock.type === 'cta_bar' || selectedBlock.type === 'news_ticker') && (
                            <div className="md:col-span-2">
                                <Input isTextarea label="Core Content" value={selectedBlock.content} onChange={e => updateBlock(selectedBlock.id, {content: e.target.value})} />
                            </div>
                         )}
                      </div>
                      
                      {/* Dynamic Items List (for Gallery, Features, Stats, FAQ) */}
                      {(['gallery', 'features_grid', 'stats_counter', 'faq'].includes(selectedBlock.type)) && (
                        <div className="p-10 bg-slate-900/40 rounded-[3rem] border border-white/5 space-y-10">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-black text-white uppercase flex items-center gap-3"><List size={24} className="text-indigo-500"/> MODULE ENTRIES</h4>
                                <button 
                                    onClick={() => {
                                        const newItem = selectedBlock.type === 'faq' ? { question: 'New Question', answer: 'New Answer' } :
                                                       selectedBlock.type === 'gallery' ? { title: 'New Entry', image: '' } :
                                                       selectedBlock.type === 'features_grid' ? { title: 'New Feature', content: '', icon: 'zap' } :
                                                       { label: 'Label', value: 'Value' };
                                        updateBlock(selectedBlock.id, { items: [...(selectedBlock.items || []), newItem] });
                                    }}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all"
                                >
                                    + ADD ENTRY
                                </button>
                            </div>
                            <div className="space-y-4">
                                {selectedBlock.items?.map((item, idx) => (
                                    <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex flex-col gap-6 relative group">
                                        <button 
                                            onClick={() => {
                                                const ni = [...(selectedBlock.items || [])]; ni.splice(idx, 1); updateBlock(selectedBlock.id, {items: ni});
                                            }}
                                            className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X size={14}/>
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedBlock.type === 'faq' ? (
                                                <>
                                                    <Input label="Question" value={item.question} onChange={e => { const ni = [...selectedBlock.items!]; ni[idx].question = e.target.value; updateBlock(selectedBlock.id, {items: ni}); }} />
                                                    <Input label="Answer" value={item.answer} onChange={e => { const ni = [...selectedBlock.items!]; ni[idx].answer = e.target.value; updateBlock(selectedBlock.id, {items: ni}); }} />
                                                </>
                                            ) : selectedBlock.type === 'gallery' ? (
                                                <>
                                                    <Input label="Entry Name" value={item.title} onChange={e => { const ni = [...selectedBlock.items!]; ni[idx].title = e.target.value; updateBlock(selectedBlock.id, {items: ni}); }} />
                                                    <Input label="Image URL" value={item.image} onChange={e => { const ni = [...selectedBlock.items!]; ni[idx].image = e.target.value; updateBlock(selectedBlock.id, {items: ni}); }} />
                                                </>
                                            ) : (
                                                <>
                                                    <Input label="Label / Title" value={item.label || item.title} onChange={e => { const ni = [...selectedBlock.items!]; if(ni[idx].label) ni[idx].label = e.target.value; else ni[idx].title = e.target.value; updateBlock(selectedBlock.id, {items: ni}); }} />
                                                    <Input label="Value / Content" value={item.value || item.content} onChange={e => { const ni = [...selectedBlock.items!]; if(ni[idx].value) ni[idx].value = e.target.value; else ni[idx].content = e.target.value; updateBlock(selectedBlock.id, {items: ni}); }} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                      )}

                      {/* Appearance Section */}
                      <div className="p-10 bg-white/5 rounded-[4rem] border border-white/5 space-y-10 shadow-inner">
                         <h4 className="text-xl font-black text-white uppercase flex items-center gap-3"><Palette size={24} className="text-yellow-500"/> VISUAL PROTOCOL</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {(['hero', 'text_image', 'video_block'].includes(selectedBlock.type)) && (
                                <Input label="Media Asset (URL)" value={selectedBlock.image || ''} onChange={e => updateBlock(selectedBlock.id, {image: e.target.value})} />
                            )}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase px-4">Uplink Alignment</label>
                                <div className="grid grid-cols-3 gap-3 bg-slate-950 p-2 rounded-2xl">
                                    <AlignSelect active={selectedBlock.style.textAlign === 'left'} onClick={() => updateBlock(selectedBlock.id, {style: {...selectedBlock.style, textAlign: 'left'}})} icon={AlignLeft} />
                                    <AlignSelect active={selectedBlock.style.textAlign === 'center'} onClick={() => updateBlock(selectedBlock.id, {style: {...selectedBlock.style, textAlign: 'center'}})} icon={AlignCenter} />
                                    <AlignSelect active={selectedBlock.style.textAlign === 'right'} onClick={() => updateBlock(selectedBlock.id, {style: {...selectedBlock.style, textAlign: 'right'}})} icon={AlignRight} />
                                </div>
                            </div>
                            <Input label="Padding-Y Axis" value={selectedBlock.style.paddingY} onChange={e => updateBlock(selectedBlock.id, {style: {...selectedBlock.style, paddingY: e.target.value}})} />
                            {(['gallery', 'features_grid'].includes(selectedBlock.type)) && (
                                <Input label="Grid Columns" type="number" value={selectedBlock.style.gridCols || 3} onChange={e => updateBlock(selectedBlock.id, {style: {...selectedBlock.style, gridCols: parseInt(e.target.value)}})} />
                            )}
                         </div>
                         
                         {selectedBlock.type === 'hero' && (
                             <div className="space-y-8 pt-8 border-t border-white/5">
                                <Input label="Custom Background Gradient" placeholder="linear-gradient(135deg, ...)" value={selectedBlock.style.backgroundGradient || ''} onChange={e => updateBlock(selectedBlock.id, {style: {...selectedBlock.style, backgroundGradient: e.target.value}})} />
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                                    <span>Signal Overlay Intensity</span>
                                    <span className="text-yellow-500">{(selectedBlock.style.overlayOpacity || 0) * 100}%</span>
                                    </div>
                                    <input 
                                    type="range" min="0" max="1" step="0.1" 
                                    value={selectedBlock.style.overlayOpacity || 0.5} 
                                    onChange={e => updateBlock(selectedBlock.id, {style: {...selectedBlock.style, overlayOpacity: parseFloat(e.target.value)}})}
                                    className="w-full h-3 bg-slate-950 rounded-full appearance-none cursor-pointer accent-yellow-500"
                                    />
                                </div>
                             </div>
                         )}
                      </div>

                      {/* Action Buttons Section */}
                      {selectedBlock.actions.length > 0 && (
                        <div className="space-y-10 pt-10 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-black text-white uppercase flex items-center gap-3"><Ship size={24} className="text-indigo-500"/> ACTION DEPLOYMENT</h4>
                                <button 
                                    onClick={() => {
                                        const na = [...selectedBlock.actions, { label: 'New Action', value: '#', style: 'solid', icon: 'zap' }];
                                        updateBlock(selectedBlock.id, {actions: na as SmartLink[]});
                                    }}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all"
                                >
                                    + ADD ACTION
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-8">
                            {selectedBlock.actions.map((action, idx) => (
                                <div key={idx} className="bg-slate-900/60 p-10 rounded-[3.5rem] border border-white/5 space-y-8 relative group/action">
                                    <button 
                                        onClick={() => {
                                            const na = [...selectedBlock.actions]; na.splice(idx, 1); updateBlock(selectedBlock.id, {actions: na});
                                        }}
                                        className="absolute top-6 right-6 w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <Input label="Button Signal" value={action.label} onChange={e => {
                                            const na = [...selectedBlock.actions]; na[idx].label = e.target.value; updateBlock(selectedBlock.id, {actions: na});
                                        }} />
                                        <Input label="Uplink Target" value={action.value} onChange={e => {
                                            const na = [...selectedBlock.actions]; na[idx].value = e.target.value; updateBlock(selectedBlock.id, {actions: na});
                                        }} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase px-4">Visual Style</label>
                                            <select 
                                                value={action.style} 
                                                onChange={e => { const na = [...selectedBlock.actions]; na[idx].style = e.target.value as any; updateBlock(selectedBlock.id, {actions: na}); }}
                                                className="w-full h-14 bg-slate-950 border-2 border-white/5 rounded-2xl px-6 text-white outline-none focus:border-yellow-500"
                                            >
                                                <option value="solid">Solid Base</option>
                                                <option value="outline">Outline Protocol</option>
                                                <option value="royal-gradient">Royal Gradient</option>
                                                <option value="shimmer">Neural Shimmer</option>
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase px-4">Assigned Icon</label>
                                            <div className="grid grid-cols-6 gap-2 bg-slate-950 p-2 rounded-2xl">
                                                {AVAILABLE_ICONS.map(item => (
                                                <button 
                                                    key={item.id} 
                                                    onClick={() => {
                                                        const na = [...selectedBlock.actions]; na[idx].icon = item.id; updateBlock(selectedBlock.id, {actions: na});
                                                    }}
                                                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${action.icon === item.id ? 'bg-yellow-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
                                                >
                                                    <item.icon size={16} />
                                                </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                      )}
                   </div>
                </div>
              ) : (
                <div className="py-60 text-center flex flex-col items-center animate-pulse">
                   <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center mb-10 border-4 border-dashed border-white/10 shadow-inner">
                       <Ship size={100} className="text-slate-800" />
                    </div>
                   <h2 className="text-4xl font-black text-slate-700 uppercase tracking-[0.6em]">SELECT A MODULE TO COMMENCE DESIGN</h2>
                   <p className="text-slate-600 font-bold uppercase tracking-widest mt-6">Awaiting qptain instructions...</p>
                </div>
              )}
           </div>
        </main>
      </div>
    </div>
  );
};

// --- Helper Components ---

const BlockTool = ({ icon: Icon, label, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-4 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:bg-yellow-500 hover:text-slate-950 transition-all group shadow-2xl hover:scale-105 active:scale-95">
     <Icon size={32} className="group-hover:scale-110 transition-transform" />
     <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const AlignSelect = ({ active, onClick, icon: Icon }: any) => (
    <button onClick={onClick} className={`p-4 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-yellow-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>
        <Icon size={20} />
    </button>
);
