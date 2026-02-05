
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, ComposedChart, Line
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import AIAvatar from './AIAvatar';
import { PersonaID } from '../types';

const AdvancedAnalytics: React.FC = () => {
  const [isThinking, setIsThinking] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [scenario, setScenario] = useState<'STANDARD' | 'AGGRESSIVE' | 'CONSERVATIVE'>('STANDARD');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mounting Guard: Đảm bảo layout đã ổn định trước khi render chart
    const timer = setTimeout(() => setIsMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const audit2024Data = [
    { name: 'Nhẫn kết 0001', hddt: 24, xuat: 38, lech: -14 },
    { name: 'Nhẫn trang sức 0002', hddt: 32, xuat: 45, lech: -13 },
    { name: 'Nhẫn kết NK319', hddt: 32, xuat: 45, lech: -13 },
    { name: 'Dây chuyền D866', hddt: 33, xuat: 45, lech: -12 },
    { name: 'KC Tấm 2.4-2.7mm', hddt: 11, xuat: 238, lech: -227 },
  ];

  const forecastData = useMemo(() => {
    const base = [
      { name: 'T8/25', actual: 420, forecast: 420 },
      { name: 'T9/25', actual: 380, forecast: 380 },
      { name: 'T10/25', actual: 510, forecast: 510 },
      { name: 'T11/25', actual: 640, forecast: 640 },
      { name: 'T12/25', actual: 820, forecast: 820 },
    ];
    const multiplier = scenario === 'AGGRESSIVE' ? 1.3 : scenario === 'CONSERVATIVE' ? 0.8 : 1.0;
    return [
      ...base,
      { name: 'T1/26', actual: null, forecast: 950 * multiplier },
      { name: 'T2/26', actual: null, forecast: 1100 * multiplier },
      { name: 'T3/26', actual: null, forecast: 850 * multiplier },
    ];
  }, [scenario]);

  useEffect(() => {
    const runAISummary = async () => {
      setIsThinking(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Phân tích dữ liệu: Lệch sổ sách 2024 (Kim cương tấm -227), Kịch bản 2026 (${scenario}). THIÊN tư vấn chiến lược.`
        });
        setAiAnalysis(response.text || '');
      } catch (e) {
        setAiAnalysis('Thiên đang băm Shard dữ liệu đối soát...');
      } finally {
        setIsThinking(false);
      }
    };
    runAISummary();
  }, [scenario]);

  return (
    <div className="p-8 md:p-12 max-w-[1800px] mx-auto h-full overflow-y-auto no-scrollbar space-y-12 animate-in fade-in duration-1000 pb-40">
      
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <span className="text-4xl animate-pulse">🔮</span>
             <h2 className="ai-headline text-6xl italic uppercase tracking-tighter leading-none">Omega Neural Analytics</h2>
          </div>
          <p className="ai-sub-headline text-cyan-300/40 ml-1 italic font-black">Audit Discrepancy Engine • v7.0 Active</p>
        </div>
        
        <div className="flex bg-black/40 p-2 rounded-[2rem] border border-white/10 backdrop-blur-xl">
           {(['CONSERVATIVE', 'STANDARD', 'AGGRESSIVE'] as const).map(s => (
             <button
               key={s}
               onClick={() => setScenario(s)}
               className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 scenario === s ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'text-gray-500 hover:text-white'
               }`}
             >
               {s === 'AGGRESSIVE' ? '🚀 Tấn công' : s === 'CONSERVATIVE' ? '🛡️ Bảo vệ' : '⚖️ Chuẩn'}
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
         {/* CHART 1: BAR CHART */}
         <div className="ai-panel p-10 bg-black/40 border-red-500/10 flex flex-col group overflow-hidden">
            <h3 className="ai-sub-headline text-red-500 italic mb-10">CHÊNH LỆCH HDĐT vs THỰC XUẤT 2024</h3>
            <div className="w-full h-[400px] min-h-[400px]">
               {isMounted && (
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={audit2024Data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                     <XAxis dataKey="name" stroke="#444" fontSize={9} interval={0} angle={-15} textAnchor="end" />
                     <YAxis stroke="#444" fontSize={10} />
                     <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                     <Bar dataKey="hddt" fill="#3b82f6" name="HDĐT" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="xuat" fill="#f59e0b" name="Thực Xuất" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
               )}
            </div>
         </div>

         {/* CHART 2: COMPOSED CHART */}
         <div className="ai-panel p-10 bg-black/40 border-indigo-500/10 flex flex-col overflow-hidden">
            <h3 className="ai-sub-headline text-indigo-400 italic mb-10">DỰ BÁO DOANH THU (PREDICTIVE NODE)</h3>
            <div className="w-full h-[400px] min-h-[400px]">
               {isMounted && (
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                     <XAxis dataKey="name" stroke="#444" fontSize={10} fontStyle="italic" />
                     <YAxis stroke="#444" fontSize={10} />
                     <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px' }} />
                     <Area type="monotone" dataKey="forecast" fill="#3b82f6" fillOpacity={0.05} stroke="none" />
                     <Area type="monotone" dataKey="actual" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.1} name="Thực tế" />
                     <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={3} name="Dự báo AI" dot={{ fill: '#3b82f6', r: 4 }} />
                  </ComposedChart>
               </ResponsiveContainer>
               )}
            </div>
         </div>
      </div>

      <div className="mt-12 p-10 glass rounded-[3rem] border border-blue-500/20 bg-blue-500/5 flex items-center gap-10">
         <AIAvatar personaId={PersonaID.THIEN} size="md" isThinking={isThinking} />
         <div className="flex-1">
            <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2">Thiên Strategic Advisor</h4>
            <p className="text-sm text-gray-400 italic leading-relaxed font-light">
               {aiAnalysis || "Thiên đang bóc tách Shard dữ liệu đối soát..."}
            </p>
         </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
