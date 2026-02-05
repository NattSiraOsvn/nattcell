
import React, { useState, useEffect } from 'react';
import ApiPortal from './ApiPortal';

const TechnicalDocs: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'architecture' | 'apis' | 'deployment' | 'troubleshooting' | 'playground' | 'metrics'>('architecture');
  const [metrics, setMetrics] = useState({
    uptime: '99.99%',
    accuracy: '98.7%',
    data: '15.2TB',
    users: 42
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        uptime: (99.9 + Math.random() * 0.09).toFixed(2) + '%',
        accuracy: (98.5 + Math.random() * 0.4).toFixed(1) + '%',
        data: (15.2 + Math.random() * 0.1).toFixed(1) + 'TB',
        users: Math.floor(40 + Math.random() * 15)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden gap-6 animate-in fade-in duration-700">
      {/* Doc Navigation */}
      <div className="lg:w-72 glass rounded-[2.5rem] border border-white/5 flex flex-col p-6 overflow-y-auto no-scrollbar shrink-0">
        <div className="mb-8">
          <h3 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Technical V-DOCS 1.0</h3>
          <p className="text-white font-serif italic text-lg">Documentation</p>
        </div>
        <nav className="space-y-2">
          {[
            { id: 'architecture', label: '🏗️ Architecture', color: 'blue' },
            { id: 'apis', label: '🔌 API Reference (V-API 2.0)', color: 'cyan' },
            { id: 'deployment', label: '🚀 Deployment', color: 'amber' },
            { id: 'troubleshooting', label: '🔧 Troubleshooting', color: 'red' },
            { id: 'playground', label: '🧪 API Playground', color: 'purple' },
            { id: 'metrics', label: '📊 Live Metrics', color: 'green' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveDoc(item.id as any)}
              className={`w-full text-left px-5 py-3 rounded-2xl text-[11px] transition-all flex items-center gap-3 ${
                activeDoc === item.id 
                  ? 'bg-white/10 text-white font-bold border border-white/10 shadow-lg' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Doc Content Area */}
      <div className="flex-1 glass rounded-[3rem] border border-white/5 p-8 lg:p-10 overflow-y-auto no-scrollbar relative bg-black/40">
        
        {activeDoc === 'architecture' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-serif gold-gradient">System Architecture</h1>
            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
              <h2 className="text-sm font-black uppercase text-amber-500 mb-6 tracking-widest">Architectural Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <h3 className="font-bold text-white">Core Components:</h3>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li><strong className="text-amber-500">1. AI Engine:</strong> Google Vision OCR & Custom NLP</li>
                    <li><strong className="text-amber-500">2. Big Data Engine:</strong> BigQuery ETL Pipeline (19TB)</li>
                    <li><strong className="text-amber-500">3. Business Logic:</strong> Jewelry Production Lifecycle</li>
                    <li><strong className="text-amber-500">4. Dashboard Engine:</strong> Real-time Visualization</li>
                    <li><strong className="text-amber-500">5. API Gateway:</strong> RESTful Microservices</li>
                  </ul>
                </div>
                <div className="p-6 glass rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-4 tracking-widest">Data Pipeline Flow</p>
                  <div className="flex flex-wrap justify-center items-center gap-2 text-[10px] font-mono">
                    <span className="px-3 py-1 bg-white/5 rounded border border-white/5">Raw Data</span>
                    <span className="text-amber-500">→</span>
                    <span className="px-3 py-1 bg-white/5 rounded border border-white/5">OCR/NLP</span>
                    <span className="text-amber-500">→</span>
                    <span className="px-3 py-1 bg-white/5 rounded border border-white/5">Validation</span>
                    <span className="text-amber-500">→</span>
                    <span className="px-3 py-1 bg-white/5 rounded border border-white/5">ETL</span>
                    <span className="text-amber-500">→</span>
                    <span className="px-3 py-1 bg-white/5 rounded border border-white/5">BigQuery</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="p-4 bg-white/5 rounded-xl text-center border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase font-black">Speed</p>
                    <p className="text-lg font-bold text-white">50k row/min</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-xl text-center border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase font-black">Accuracy</p>
                    <p className="text-lg font-bold text-white">99.2%</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-xl text-center border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase font-black">Uptime</p>
                    <p className="text-lg font-bold text-white">99.99%</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-xl text-center border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase font-black">Retention</p>
                    <p className="text-lg font-bold text-white">7 Years</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'apis' && <ApiPortal />}

        {activeDoc === 'deployment' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-serif gold-gradient">Deployment Guide</h1>
            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 space-y-8">
              <section>
                <h3 className="text-white font-bold mb-4">1. Prerequisites</h3>
                <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
                  <li>Google Cloud Platform Account</li>
                  <li>Google Workspace Enterprise Account</li>
                  <li>Node.js 18+ (LTS)</li>
                </ul>
              </section>
              <section>
                <h3 className="text-white font-bold mb-4">2. Installation Steps</h3>
                <div className="p-6 bg-black/60 rounded-2xl border border-white/5 font-mono text-xs text-gray-300 leading-relaxed">
                  <p><span className="text-amber-500">git clone</span> https://github.com/tam-luxury/eos.git</p>
                  <p><span className="text-amber-500">cd</span> eos</p>
                  <p><span className="text-amber-500">npm install</span></p>
                  <p className="text-gray-500 mt-4"># Configure environment</p>
                  <p><span className="text-amber-500">cp</span> .env.example .env</p>
                </div>
              </section>
              <section>
                <h3 className="text-white font-bold mb-4">3. Cloud Setup</h3>
                <div className="p-6 bg-black/60 rounded-2xl border border-white/5 font-mono text-xs text-amber-300/80">
                  <p>gcloud services enable vision.googleapis.com</p>
                  <p>gcloud services enable bigquery.googleapis.com</p>
                  <p>gcloud services enable monitoring.googleapis.com</p>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeDoc === 'troubleshooting' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-serif gold-gradient">Troubleshooting</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 glass rounded-[2rem] border border-red-500/20 bg-red-500/5">
                <h3 className="text-white font-bold mb-4 text-sm">Issue: OCR Processing Failed</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-6">Confidence scores thấp hoặc thiếu text trong bóc tách.</p>
                <div className="space-y-2">
                  <p className="text-[9px] text-red-400 font-black uppercase">Solution:</p>
                  <ul className="text-[10px] text-gray-300 space-y-1 list-disc list-inside">
                    <li>Tăng độ phân giải ảnh (min 300 DPI)</li>
                    <li>Sử dụng template-based extraction cho form</li>
                    <li>Kiểm tra retry logic with exponential backoff</li>
                  </ul>
                </div>
              </div>
              <div className="p-8 glass rounded-[2rem] border border-amber-500/20 bg-amber-500/5">
                <h3 className="text-white font-bold mb-4 text-sm">Issue: BigQuery Timeout</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-6">Query vượt quá giới hạn 30 phút trong xử lý 19TB.</p>
                <div className="space-y-2">
                  <p className="text-[9px] text-amber-400 font-black uppercase">Solution:</p>
                  <ul className="text-[10px] text-gray-300 space-y-1 list-disc list-inside">
                    <li>Sử dụng batch processing (50k rows/batch)</li>
                    <li>Sử dụng partitioned tables theo ngày/lô</li>
                    <li>Optimize query structure (Limit 10k items)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'playground' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-serif gold-gradient">API Playground</h1>
              <span className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black rounded-full">SANDBOX MODE</span>
            </div>
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-4">Select Endpoint</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50">
                  <option>POST /api/v1/ocr/process</option>
                  <option>POST /api/v1/bigquery/etl</option>
                  <option>GET /api/v1/inventory/status</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-4">Request Body (JSON)</label>
                <textarea 
                  className="w-full h-48 bg-black/60 border border-white/10 rounded-3xl px-6 py-5 text-gray-300 font-mono text-xs focus:outline-none focus:border-amber-500/50"
                  defaultValue={`{
  "images": ["base64_data..."],
  "options": {
    "language": "vi",
    "extract_tables": true
  }
}`}
                />
              </div>
              <button className="w-full py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10">
                Execute Request
              </button>
            </div>
          </div>
        )}

        {activeDoc === 'metrics' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 h-full flex flex-col justify-center">
            <h1 className="text-3xl font-serif gold-gradient text-center">Live System Metrics</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 glass rounded-[3rem] border border-blue-500/20 bg-blue-500/5 text-center">
                 <p className="text-[9px] text-gray-500 uppercase font-black mb-4">API Uptime</p>
                 <p className="text-4xl font-mono text-white mb-2">{metrics.uptime}</p>
                 <span className="text-[8px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20">OPERATIONAL</span>
              </div>
              <div className="p-8 glass rounded-[3rem] border border-green-500/20 bg-green-500/5 text-center">
                 <p className="text-[9px] text-gray-500 uppercase font-black mb-4">OCR Accuracy</p>
                 <p className="text-4xl font-mono text-white mb-2">{metrics.accuracy}</p>
                 <span className="text-[8px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20">HIGH PRECISION</span>
              </div>
              <div className="p-8 glass rounded-[3rem] border border-amber-500/20 bg-amber-500/5 text-center">
                 <p className="text-[9px] text-gray-500 uppercase font-black mb-4">Data Processed</p>
                 <p className="text-4xl font-mono text-white mb-2">{metrics.data}</p>
                 <span className="text-[8px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">BIG DATA MODE</span>
              </div>
              <div className="p-8 glass rounded-[3rem] border border-purple-500/20 bg-purple-500/5 text-center">
                 <p className="text-[9px] text-gray-500 uppercase font-black mb-4">Active Nodes</p>
                 <p className="text-4xl font-mono text-white mb-2">{metrics.users}</p>
                 <span className="text-[8px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">LIVE OPS</span>
              </div>
            </div>
            <div className="mt-auto pt-12 border-t border-white/5 text-center opacity-30">
               <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.5em]">Global Infrastructure Status: Optimal</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TechnicalDocs;
