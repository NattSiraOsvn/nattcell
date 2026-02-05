
import React, { useState, useEffect } from 'react';
import { ShardingService } from '../services/blockchainService';
import { EventBridge } from '../services/eventBridge';
import AIAvatar from './AIAvatar';
import { PersonaID, UserRole, BusinessMetrics, UserPosition } from '../types';

// Interface nhận đúng Props từ DynamicModuleRenderer để tránh Crash
interface DataArchiveVaultProps {
  currentRole: UserRole;
  currentPosition: UserPosition;
  logAction: (action: string, details: string) => void;
  metrics: BusinessMetrics;
  updateFinance: (data: Partial<BusinessMetrics>) => void;
}

interface ArchivePartition {
  tableName: string;
  recordCount: number;
  dataSize: string;
  hash: string;
  status: 'VERIFIED' | 'CORRUPTED' | 'SEALED';
}

interface ArchiveYear {
  year: number;
  status: 'OPEN' | 'CLOSING' | 'LOCKED' | 'ARCHIVED';
  revenue: number;
  taxPaid: number;
  merkleRoot: string;
  docCount: number;
  lastAudit: string;
  retentionUntil: string;
  partitions: ArchivePartition[];
}

const DataArchiveVault: React.FC<DataArchiveVaultProps> = ({ currentRole, logAction }) => {
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [archives, setArchives] = useState<ArchiveYear[]>([]);
  const [isSealing, setIsSealing] = useState(false);

  // Chỉ Master mới có quyền niêm phong số liệu
  const canSeal = currentRole === UserRole.MASTER;

  useEffect(() => {
    const generatedArchives: ArchiveYear[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 6; i++) {
      const y = currentYear - i;
      let status: ArchiveYear['status'] = 'ARCHIVED';
      
      if (i === 0) status = 'OPEN';
      else if (i === 1) status = 'CLOSING';
      else if (i === 2) status = 'LOCKED';
      else status = 'ARCHIVED';

      const revenueBase = 100000000000 + (Math.random() * 500000000000);
      
      // Tạo Partition Hashes Deterministic
      const partHashes = {
        sales: ShardingService.generateShardHash({ year: y, table: 'sales', type: 'PARTITION' }),
        inv: ShardingService.generateShardHash({ year: y, table: 'invoices', type: 'PARTITION' }),
        stock: ShardingService.generateShardHash({ year: y, table: 'inventory', type: 'PARTITION' }),
        gl: ShardingService.generateShardHash({ year: y, table: 'ledger', type: 'PARTITION' })
      };

      generatedArchives.push({
        year: y,
        status: status,
        revenue: revenueBase,
        taxPaid: revenueBase * 0.1,
        merkleRoot: status === 'OPEN' ? 'PENDING...' : ShardingService.generateShardHash({ year: y, parts: partHashes, type: 'ROOT' }),
        docCount: Math.floor(10000 + Math.random() * 20000),
        lastAudit: status === 'OPEN' ? 'Real-time' : `31/12/${y}`,
        retentionUntil: `31/12/${y + 10}`,
        partitions: [
          { tableName: 'sales_orders', recordCount: Math.floor(15000 + Math.random() * 5000), dataSize: '4.2 GB', hash: partHashes.sales, status: status === 'OPEN' ? 'VERIFIED' : 'SEALED' },
          { tableName: 'e_invoices', recordCount: Math.floor(15000 + Math.random() * 5000), dataSize: '2.1 GB', hash: partHashes.inv, status: status === 'OPEN' ? 'VERIFIED' : 'SEALED' },
          { tableName: 'inventory_movements', recordCount: Math.floor(40000 + Math.random() * 10000), dataSize: '5.8 GB', hash: partHashes.stock, status: status === 'OPEN' ? 'VERIFIED' : 'SEALED' },
          { tableName: 'general_ledger', recordCount: Math.floor(8000 + Math.random() * 2000), dataSize: '1.2 GB', hash: partHashes.gl, status: status === 'OPEN' ? 'VERIFIED' : 'SEALED' }
        ]
      });
    }
    setArchives(generatedArchives);
    setActiveYear(currentYear);
  }, []);

  const handleSealYear = (year: number) => {
    if (!canSeal) {
      alert("⚠️ TRUY CẬP BỊ TỪ CHỐI: Chỉ Master Natt mới có quyền niêm phong số liệu.");
      return;
    }

    if (!window.confirm(`XÁC NHẬN QUẢN TRỊ:\nBạn đang thực hiện niêm phong số liệu năm ${year}.\nHành động này sẽ khóa dữ liệu trong 10 năm.\n\nTiếp tục?`)) return;

    setIsSealing(true);
    
    setTimeout(() => {
      const newHash = ShardingService.generateShardHash({ year, timestamp: Date.now(), magic: 'OMEGA_SEAL_10Y' });
      
      setArchives(prev => prev.map(a => a.year === year ? { 
        ...a, 
        status: 'LOCKED', 
        merkleRoot: newHash, 
        lastAudit: new Date().toLocaleDateString('vi-VN'),
        retentionUntil: `31/12/${year + 10}`,
        partitions: a.partitions.map(p => ({...p, status: 'SEALED' as const}))
      } : a));
      
      // Phát sự kiện toàn hệ thống
      // Fix: Wrap payload in EventEnvelope object with required metadata to match EventBridge.publish signature
      EventBridge.publish('ARCHIVE_SEALED', {
        event_name: 'ARCHIVE_SEALED',
        event_version: 'v1',
        event_id: `EVT-${Date.now()}`,
        occurred_at: new Date().toISOString(),
        producer: 'data-archive-vault',
        trace: {
          correlation_id: `COR-${year}-${Date.now()}`,
          causation_id: null,
          trace_id: `TRC-${Date.now()}`
        },
        tenant: { org_id: 'tam-luxury', workspace_id: 'default' },
        payload: { year, merkleRoot: newHash }
      });
      logAction('FISCAL_YEAR_SEAL', `Đã niêm phong số liệu năm ${year}. Merkle Root: ${newHash}`);
      
      setIsSealing(false);
    }, 2000);
  };

  const selectedArchive = archives.find(a => a.year === activeYear);

  return (
    <div className="h-full bg-[#020202] p-8 md:p-12 overflow-hidden flex flex-col animate-in fade-in duration-700">
      
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 mb-8 gap-6">
         <div>
            <div className="flex items-center gap-4 mb-2">
               <span className="text-4xl">🗄️</span>
               <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">Data Archive Vault</h2>
            </div>
            <p className="ai-sub-headline text-gray-500 font-black tracking-[0.3em] ml-1">
               Bộ nhớ vĩnh cửu • Tuân thủ pháp lý 10 năm
            </p>
         </div>
         <div className="flex items-center gap-6 bg-black/40 p-4 rounded-2xl border border-white/5">
            <div className="flex flex-col items-end">
               <span className="text-[9px] text-gray-500 font-bold uppercase">Retention Policy</span>
               <span className="text-xl font-mono font-black text-amber-500">10 YEARS</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col items-end">
               <span className="text-[9px] text-gray-500 font-bold uppercase">Encryption</span>
               <span className="text-xl font-mono font-black text-green-500">AES-256</span>
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 flex-1 min-h-0">
         
         {/* LEFT: TIMELINE */}
         <div className="xl:col-span-3 space-y-4 overflow-y-auto no-scrollbar pr-2 border-r border-white/5">
            {archives.map(arch => (
               <div 
                  key={arch.year}
                  onClick={() => setActiveYear(arch.year)}
                  className={`p-6 rounded-[2rem] border cursor-pointer transition-all group relative overflow-hidden ${
                     activeYear === arch.year 
                     ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
                     : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
               >
                  <div className="flex justify-between items-center mb-2">
                     <span className={`text-3xl font-serif font-black italic tracking-