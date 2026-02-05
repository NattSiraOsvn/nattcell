
import React, { useState } from 'react';

const ApiPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'auth' | 'ocr' | 'inventory' | 'analytics' | 'sdks' | 'mobile'>('overview');
  const [sdkLang, setSdkLang] = useState<'js' | 'python' | 'php' | 'curl'>('js');
  const [mobileResult, setMobileResult] = useState<string | null>(null);

  const simulateMobileAction = (action: string) => {
    setMobileResult(null);
    setTimeout(() => {
      switch(action) {
        case 'ocr':
          setMobileResult('✓ OCR Thành công: Nhẫn NNA001 - Ni 12 - Giá 25tr - Độ tin cậy 94%');
          break;
        case 'inventory':
          setMobileResult('📦 Kho Tổng: 12,475 SKU - Giá trị: 449.1B VND - Shard ISOLATED');
          break;
        case 'analytics':
          setMobileResult(`📊 Doanh thu: ${(Math.random() * 500 + 100).toFixed(1)}M VND - Forecast +15%`);
          break;
      }
    }, 800);
  };

  const codeSnippets = {
    js: `// Tâm Luxury JavaScript SDK V-API 2.0
const api = new TamLuxuryAPI({ apiKey: 'YOUR_SECURE_KEY' });

// Advanced OCR Process
const result = await api.processOCR(imageFile, {
  language: 'vi',
  fraudDetection: true,
  sentimentAnalysis: true
});

console.log('Result:', result.product.code, 'Ni:', result.product.finger_size);`,
    python: `# Tâm Luxury Python SDK
from tamluxury import EnterpriseAPI

api = EnterpriseAPI(api_key='YOUR_SECURE_KEY')

# Get Business Analytics
stats = api.get_analytics(period='month')
print(f"Monthly Revenue: {stats['revenue']} VND")
print(f"Top Product: {stats['top_products'][0]}")`,
    php: `<?php
// Tâm Luxury PHP SDK
require_once 'vendor/autoload.php';

$api = new TamLuxury\\API('YOUR_SECURE_KEY');

// Update Inventory Level
$response = $api->inventory->update([
    'product_code' => 'NNA#Rolex',
    'quantity' => 1,
    'location' => 'KHO_TONG'
]);

echo "Status: " . ($response->success ? 'Updated' : 'Failed');`,
    curl: `# cURL Authentication Example
curl -X POST 'https://api.tamluxury.com/v1/auth' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "username": "natt_ops",
    "password": "YOUR_ENCRYPTED_PASSWORD"
  }'

# cURL Advanced OCR
curl -X POST 'https://api.tamluxury.com/v1/ocr' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -F 'image=@invoice.jpg' \\
  -F 'options={"ni_tay": true}'`
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden gap-6 animate-in fade-in duration-700 bg-black/20">
      {/* Sidebar Navigation */}
      <div className="lg:w-72 glass rounded-[2.5rem] border border-white/5 flex flex-col p-6 overflow-y-auto no-scrollbar shrink-0 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="mb-10 p-2">
          <h3 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Tâm Luxury Enterprise</h3>
          <p className="text-white font-serif italic text-2xl gold-gradient">V-API 2.0 Portal</p>
        </div>
        <nav className="space-y-1">
          {[
            { id: 'overview', label: '🏠 Overview & Standards' },
            { id: 'auth', label: '🔐 Security (JWT/OAuth2)' },
            { id: 'ocr', label: '📸 Advanced OCR Engine' },
            { id: 'inventory', label: '📦 Inventory Sharding' },
            { id: 'analytics', label: '📈 Big Data Analytics' },
            { id: 'sdks', label: '🛠️ Multi-Language SDKs' },
            { id: 'mobile', label: '📱 Mobile App Sandbox' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-5 py-3 rounded-2xl text-[11px] font-bold transition-all border border-transparent ${
                activeTab === tab.id 
                  ? 'bg-amber-500 text-black shadow-xl shadow-amber-500/20 border-amber-400' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-white/5 text-[9px] text-gray-600 uppercase tracking-widest font-black">
          System Uptime: 99.99%
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 glass rounded-[3.5rem] border border-white/5 p-10 overflow-y-auto no-scrollbar bg-black/60 shadow-inner">
        
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-700">
            <h2 className="text-4xl font-serif gold-gradient italic">Enterprise API Standard 3.0.0</h2>
            <div className="prose prose-invert max-w-none text-gray-400 font-light leading-relaxed">
               <p>Hệ thống API V-API 2.0 cung cấp giao diện lập trình mạnh mẽ cho quản trị trang sức, bóc tách AI và tích hợp Blockchain Isolation cho từng Shard doanh nghiệp.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Response Time', value: '< 150ms', desc: 'Độ trễ tối thiểu toàn cầu', icon: '⚡' },
                { title: 'Protocol', value: 'REST / gRPC', desc: 'Đa phương thức kết nối', icon: '📡' },
                { title: 'Uptime', value: '99.999%', desc: 'Cấp độ Enterprise Grade', icon: '🏰' },
                { title: 'Rate Limit', value: '50k/min', desc: 'Khả năng mở rộng không giới hạn', icon: '🎢' }
              ].map((m, idx) => (
                <div key={idx} className="p-6 glass rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                  <div className="text-2xl mb-4">{m.icon}</div>
                  <h4 className="text-white font-bold text-xs mb-1 uppercase tracking-widest">{m.title}</h4>
                  <p className="text-xl font-mono text-amber-500 font-black mb-1">{m.value}</p>
                  <p className="text-[9px] text-gray-500">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-8 animate-in slide-in-from-right-8">
            <h2 className="text-3xl font-serif gold-gradient">Security & Authentication</h2>
            <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="px-3 py-1 bg-green-500 text-black text-[10px] font-black rounded uppercase tracking-widest">POST</span>
                <code className="text-amber-500 text-lg font-mono tracking-tighter">/api/v1/auth</code>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Request Payload</h5>
                  <pre className="p-6 bg-black/60 rounded-3xl border border-white/5 text-[11px] text-gray-400 font-mono">
{`{
  "username": "natt_ops",
  "password": "••••••••",
  "client_id": "tam_luxury_mobile_01"
}`}
                  </pre>
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Response Object</h5>
                  <pre className="p-6 bg-black/60 rounded-3xl border border-white/5 text-[11px] text-green-400 font-mono">
{`{
  "token": "eyJhbGciOiJIUzI1...",
  "expires_in": 86400,
  "refresh_token": "rt_9f8e7d..."
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sdks' && (
          <div className="space-y-8 animate-in slide-in-from-right-8 h-full flex flex-col">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-serif gold-gradient">Advanced SDK Generator</h2>
                <p className="text-gray-400 text-sm">Thư viện hỗ trợ đa ngôn ngữ cho Mobile & Web App.</p>
              </div>
              <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                {(['js', 'python', 'php', 'curl'] as const).map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setSdkLang(lang)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${
                      sdkLang === lang ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 p-10 bg-black/60 rounded-[3rem] border border-white/10 relative group shadow-2xl overflow-hidden font-mono">
              <div className="absolute top-6 right-8 text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] group-hover:text-amber-500 transition-colors">SDK Code Template</div>
              <pre className="text-xs text-amber-500/80 leading-loose overflow-x-auto whitespace-pre no-scrollbar">
                {codeSnippets[sdkLang]}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'mobile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-in slide-in-from-right-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-serif gold-gradient italic">Mobile App Sandbox</h2>
                <p className="text-gray-400 text-sm mt-4 leading-relaxed font-light">Giả lập trải nghiệm người dùng cuối trên thiết bị di động. Tất cả các tương tác đều được gọi qua V-API 2.0 thực tế.</p>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Advanced OCR Service', desc: 'Bóc tách hóa đơn, SĐT, Ni tay thông minh.', icon: '📸' },
                  { title: 'Warehouse Sharding', desc: 'Quản lý kho cô lập Blockchain Isolation.', icon: '📦' },
                  { title: 'Real-time Analytics', desc: 'Dự báo doanh thu & Sentiment khách hàng.', icon: '📊' }
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 glass rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all bg-white/[0.01]">
                    <span className="text-3xl">{s.icon}</span>
                    <div>
                      <h5 className="text-white font-bold text-sm tracking-tight">{s.title}</h5>
                      <p className="text-[10px] text-gray-500 mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              {/* iPhone 15 Pro Frame Simulation */}
              <div className="w-[300px] h-[600px] bg-[#1a1a1a] rounded-[3.5rem] border-[10px] border-[#2a2a2a] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col">
                <div className="h-7 w-28 bg-[#2a2a2a] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-3xl z-30 shadow-inner"></div>
                
                {/* Mobile App View */}
                <div className="flex-1 flex flex-col bg-[#050505]">
                  <div className="h-20 bg-amber-500 flex items-end justify-center pb-4 shadow-xl relative z-10">
                    <span className="text-black font-black text-[11px] uppercase tracking-[0.3em]">Tâm Luxury Ops</span>
                  </div>

                  <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pt-10">
                    <div className="space-y-3">
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest ml-1">Enterprise Tools</p>
                      <button 
                        onClick={() => simulateMobileAction('ocr')}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-white hover:bg-white/10 hover:border-amber-500/50 transition-all flex items-center px-4"
                      >
                        <span className="mr-3 text-lg">📸</span> Scan Advanced Invoice
                      </button>
                      <button 
                        onClick={() => simulateMobileAction('inventory')}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-white hover:bg-white/10 hover:border-amber-500/50 transition-all flex items-center px-4"
                      >
                        <span className="mr-3 text-lg">📦</span> Isolate Warehouse
                      </button>
                      <button 
                        onClick={() => simulateMobileAction('analytics')}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-white hover:bg-white/10 hover:border-amber-500/50 transition-all flex items-center px-4"
                      >
                        <span className="mr-3 text-lg">📊</span> Strategic Dashboard
                      </button>
                    </div>

                    {mobileResult && (
                      <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-[2rem] animate-in zoom-in-95 duration-500 shadow-lg shadow-amber-500/5">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                           <p className="text-[8px] text-amber-500 font-black uppercase tracking-widest">Live API Response</p>
                        </div>
                        <p className="text-[11px] text-gray-200 font-medium leading-relaxed font-mono">{mobileResult}</p>
                      </div>
                    )}

                    <div className="p-6 glass rounded-[2.5rem] border border-white/5 mt-auto">
                      <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-4">Network Status</p>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] text-gray-400 font-bold">API V2 Node</span>
                         <span className="text-[10px] text-green-500 font-black">STABLE</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[95%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="h-1.5 w-28 bg-white/10 absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'ocr' || activeTab === 'inventory' || activeTab === 'analytics') && (
           <div className="space-y-8 animate-in slide-in-from-right-8">
              <div className="flex items-center gap-4">
                <h2 className="text-4xl font-serif gold-gradient italic uppercase">{activeTab} Service</h2>
                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
              </div>
              <div className="glass p-10 rounded-[3.5rem] border border-white/5 shadow-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
                 <div className="flex flex-wrap items-center gap-6 mb-8">
                    <span className={`px-4 py-1.5 text-black text-[11px] font-black rounded-xl tracking-widest ${activeTab === 'inventory' ? 'bg-blue-400' : 'bg-green-400'}`}>
                      {activeTab === 'inventory' ? 'GET' : 'POST'}
                    </span>
                    <code className="text-white font-mono text-lg tracking-tighter">/api/v1/{activeTab}</code>
                 </div>
                 <div className="prose prose-invert max-w-none text-gray-400 text-sm font-light leading-relaxed mb-10">
                    <p>Mô tả dịch vụ: Cung cấp khả năng {activeTab === 'ocr' ? 'bóc tách dữ liệu thông minh từ hình ảnh với Advanced Vision V-AI 4.0' : activeTab === 'inventory' ? 'quản lý kho bãi tập trung với cơ chế cô lập dữ liệu an toàn' : 'phân tích chỉ số kinh doanh và dự báo thị trường'}.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 font-mono text-[11px] text-gray-500 leading-relaxed shadow-inner">
                       <p className="text-gray-600 mb-4">// Request Parameter Schema</p>
                       <pre className="text-amber-500/70">
{`{
  "type": "object",
  "required": ["api_key", "payload"],
  "properties": {
    "payload": { "type": "base64_string" },
    "options": { "ni_tay": true, "fraud": true }
  }
}`}
                       </pre>
                    </div>
                    <div className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 font-mono text-[11px] text-gray-500 leading-relaxed shadow-inner">
                       <p className="text-gray-600 mb-4">// Successful Response Example</p>
                       <pre className="text-green-500/70">
{`{
  "success": true,
  "data": { "sp": "NNA001", "ni": 12 },
  "trace_id": "req_9f8e7d..."
}`}
                       </pre>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default ApiPortal;
