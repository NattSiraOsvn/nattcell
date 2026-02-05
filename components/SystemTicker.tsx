
import React, { useState, useEffect } from 'react';

const SystemTicker: React.FC = () => {
  const [prices, setPrices] = useState({
    sjc_buy: 78500000,
    sjc_sell: 80500000,
    gold9999: 64200000,
    gold18k: 46800000
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        sjc_buy: prev.sjc_buy + (Math.random() > 0.5 ? 50000 : -50000),
        sjc_sell: prev.sjc_sell + (Math.random() > 0.5 ? 50000 : -50000),
        gold9999: prev.gold9999 + (Math.random() > 0.5 ? 30000 : -30000),
        gold18k: prev.gold18k + (Math.random() > 0.5 ? 20000 : -20000),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: number) => (val / 1000).toLocaleString() + 'k';

  const messages = [
    { type: 'GOLD', text: `🏆 GIÁ VÀNG SJC: MUA ${formatCurrency(prices.sjc_buy)} - BÁN ${formatCurrency(prices.sjc_sell)}` },
    { type: 'GOLD', text: `💎 VÀNG NHẪN 999.9: ${formatCurrency(prices.gold9999)}` },
    { type: 'GOLD', text: `✨ VÀNG 18K (AU750): ${formatCurrency(prices.gold18k)}` },
    { type: 'ALERT', text: '🚨 CẢNH BÁO: HỆ THỐNG SẼ BẢO TRÌ SHARD KẾ TOÁN LÚC 23:00 ĐÊM NAY' },
    { type: 'NEWS', text: '📢 TIN NỘI BỘ: CHÚC MỪNG PHÒNG KINH DOANH ĐẠT 120% KPI THÁNG' },
    { type: 'SYSTEM', text: '📡 ĐỒNG BỘ OMEGA: ĐÃ CẬP NHẬT 15,000 SKU TỪ KHO MASTER' }
  ];

  return (
    <div className="h-8 bg-[#0a0a0a] border-b border-white/10 flex items-center overflow-hidden shrink-0 relative z-50 shadow-md">
      <div className="absolute left-0 top-0 bottom-0 bg-amber-500 text-black px-3 flex items-center z-20 font-black text-[9px] uppercase tracking-widest">
        THỊ TRƯỜNG TRỰC TUYẾN
      </div>
      <div className="whitespace-nowrap animate-[marquee_45s_linear_infinite] flex items-center gap-16 pl-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px]">{msg.type === 'GOLD' ? '💰' : msg.type === 'ALERT' ? '⚠️' : msg.type === 'NEWS' ? '🎉' : '🤖'}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              msg.type === 'GOLD' ? 'text-amber-400 font-mono' : 
              msg.type === 'ALERT' ? 'text-red-500 animate-pulse' : 
              msg.type === 'NEWS' ? 'text-green-400' : 'text-blue-400'
            }`}>
              {msg.text}
            </span>
          </div>
        ))}
        {messages.map((msg, i) => (
          <div key={`dup-${i}`} className="flex items-center gap-2">
            <span className="text-[10px]">{msg.type === 'GOLD' ? '💰' : msg.type === 'ALERT' ? '⚠️' : msg.type === 'NEWS' ? '🎉' : '🤖'}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              msg.type === 'GOLD' ? 'text-amber-400 font-mono' : 
              msg.type === 'ALERT' ? 'text-red-500 animate-pulse' : 
              msg.type === 'NEWS' ? 'text-green-400' : 'text-blue-400'
            }`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default SystemTicker;
