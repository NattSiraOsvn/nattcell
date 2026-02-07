
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const data = [
  { name: 'Quý 1', value: 400, risk: 20 },
  { name: 'Quý 2', value: 300, risk: 45 },
  { name: 'Quý 3', value: 600, risk: 10 },
  { name: 'Quý 4', value: 800, risk: 5 },
];

const pieData = [
  { name: 'Pháp lý', value: 40, color: '#ef4444' },
  { name: 'Tài chính', value: 30, color: '#3b82f6' },
  { name: 'Vận hành', value: 20, color: '#10b981' },
  { name: 'Khác', value: 10, color: '#6366f1' },
];

const DataAnalytics: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-serif mb-2">Phân tích Dữ liệu Kiểm toán</h2>
        <p className="text-gray-400">Trực quan hóa rủi ro và hiệu quả tài chính doanh nghiệp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-6 text-gray-300">Biến động Lợi nhuận & Chỉ số Rủi ro</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-6 text-gray-300">Cấu trúc Rủi ro Hệ thống</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-xs text-gray-400">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 glass p-8 rounded-3xl border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-xl mb-1">Kết luận Kiểm toán Tạm thời</h4>
            <p className="text-sm text-gray-400 italic">Dựa trên mô hình AI đã huấn luyện của Anh Natt</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-green-500">92%</span>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Độ Tin Cậy</p>
          </div>
        </div>
        <div className="mt-6 text-gray-300 text-sm leading-relaxed">
          Số liệu cho thấy rủi ro tài chính đang ở mức thấp nhất trong Quý 4. Tuy nhiên, rủi ro pháp lý đang có xu hướng tăng 15% do các thay đổi về luật xuất nhập khẩu vừa ban hành. Khuyến nghị tập trung rà soát các hợp đồng quốc tế trong tháng tới.
        </div>
      </div>
    </div>
  );
};

export default DataAnalytics;
