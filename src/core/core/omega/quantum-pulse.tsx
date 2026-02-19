
import React from 'react';

interface QuantumPulseProps {
  intensity?: number;
  message?: string;
}

const QuantumPulse: React.FC<QuantumPulseProps> = ({ intensity = 1, message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-12">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Vòng sóng lan tỏa */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-[pulse_2s_infinite_ease-in-out]"></div>
        <div className="absolute inset-[-10px] rounded-full border border-cyan-400/30 animate-[pulse_2s_infinite_ease-in-out_0.5s]"></div>
        <div className="absolute inset-[-20px] rounded-full border border-cyan-400/10 animate-[pulse_2s_infinite_ease-in-out_1s]"></div>
        
        {/* Hạt lượng tử trung tâm */}
        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center animate-[spin_5s_linear_infinite]">
          <span className="text-2xl text-black font-black">⚛️</span>
        </div>
      </div>

      <div className="text-center space-y-3">
        <h3 className="text-xl font-serif gold-gradient italic uppercase tracking-widest">Quantum Staging Active</h3>
        <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed italic font-light">
          {message || "Hệ thống đang đồng bộ hóa nhịp độ của bạn vào thực thể dữ liệu. Vui lòng chờ trong tích tắc..."}
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default QuantumPulse;
