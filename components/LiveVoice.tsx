
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const LiveVoice: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Chưa kết nối');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startLive = async () => {
    try {
      // Use process.env.API_KEY directly as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setStatus('Đang kết nối Live API...');
      
      const sessionPromise = ai.live.connect({
        // Fixed: Use recommended model name for real-time audio conversation tasks
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'Bạn là Thiên, đang trò chuyện trực tiếp với Anh Natt. Hãy phản hồi ngắn gọn, súc tích và thông minh.'
        },
        callbacks: {
          onopen: () => {
            setStatus('Đang lắng nghe...');
            setIsActive(true);
          },
          onmessage: async (msg) => {
            // Logic xử lý audio stream như ví dụ API...
            console.log('Live Message:', msg);
          },
          onclose: () => {
            setStatus('Đã đóng kết nối');
            setIsActive(false);
          },
          onerror: (e) => {
            console.error(e);
            setStatus('Lỗi kết nối');
          }
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      setStatus('Lỗi khởi tạo');
    }
  };

  const stopLive = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      setIsActive(false);
      setStatus('Chưa kết nối');
    }
  };

  return (
    <div className="fixed bottom-24 right-8 z-50">
      <div className={`glass p-6 rounded-[2rem] border transition-all duration-500 flex items-center space-x-4 shadow-2xl ${
        isActive ? 'border-amber-500 bg-amber-500/5 w-64' : 'border-white/10 w-48'
      }`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
          isActive ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
        }`} onClick={isActive ? stopLive : startLive}>
          <span className="text-xl text-black">{isActive ? '⏹️' : '🎙️'}</span>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Thiên Live Voice</p>
          <p className={`text-xs font-bold ${isActive ? 'text-amber-500' : 'text-white'}`}>{status}</p>
        </div>
      </div>
    </div>
  );
};

export default LiveVoice;
