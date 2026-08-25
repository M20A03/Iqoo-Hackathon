// src/components/CaregiverDashboard.tsx
import { useEffect, useState, useRef } from 'react';
import { Activity, ShieldCheck, Clipboard, HeartPulse, Zap, Clock, AlertTriangle } from 'lucide-react';
import { getAllItems, SavedItem } from '../utils/storage';

export function CaregiverDashboard() {
  const [logs, setLogs] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const complianceScore = 94;
  const heartRate = 72;
  const spo2 = 98;

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const items = await getAllItems();
        setLogs(items.slice(0, 20));
      } catch (error) {
        console.error("Failed to load logs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sahayak_super_clipboard') {
        setIsSyncing(true);
        loadLogs(); // Refresh logs on sync
        setTimeout(() => setIsSyncing(false), 2000);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0; // Keep newest at top as per current design
    }
  }, [logs]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-border pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl flex items-center gap-3">
            <ShieldCheck className="text-accent" size={32} />
            Caregiver <span className="text-secondary">Dashboard</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1 flex items-center gap-2 font-medium">
            <Clock size={14} className="text-primary" /> Real-time Telemetry & Health Monitoring
          </p>
        </div>

        <div className="flex items-center gap-3 bg-accent-soft px-4 py-2 rounded-full border border-accent/20 shadow-sm">
          <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-accent uppercase tracking-widest">Live Sync Active</span>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Zap size={18} />} label="System Status" value="Online" color="text-success" />
        <StatCard icon={<Activity size={18} />} label="Compliance" value={`${complianceScore}%`} color="text-secondary" />
        <StatCard icon={<HeartPulse size={18} />} label="Heart Rate" value={`${heartRate} BPM`} color="text-error" />
        <StatCard icon={<AlertTriangle size={18} />} label="Alerts (24h)" value="2" color="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vitals & Spectrogram Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <HealthMetricCard
                label="Heart Rate"
                value={heartRate}
                unit="BPM"
                icon={<HeartPulse className="text-error" />}
                chartColor="#D94111"
             />
             <HealthMetricCard
                label="SpO2 Level"
                value={spo2}
                unit="%"
                icon={<Activity className="text-accent" />}
                chartColor="#2CA470"
             />
          </div>

          {/* Pulmonary Acoustic Spectrogram */}
          <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-card card-gradient">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Activity className="text-secondary" size={20} /> Pulmonary Acoustic Spectrogram
            </h3>
            <div className="w-full h-40 bg-surface-light rounded-xl flex items-end gap-1.5 p-4 border border-surface-border">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${Math.random() * 80 + 10}%`,
                    opacity: 0.5 + (i / 40) * 0.5
                  }}
                />
              ))}
            </div>
            <p className="text-[10px] text-text-muted mt-3 italic text-center uppercase tracking-widest font-bold">Frequency Analysis (200Hz - 1000Hz)</p>
          </div>
        </div>

        {/* Logs & Sync Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-card flex flex-col h-full max-h-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg flex items-center gap-2">
                <Clipboard className="text-accent" size={20} /> Activity Logs
              </h3>
              {isSyncing && <span className="text-[10px] text-secondary animate-pulse-soft font-black uppercase">Syncing...</span>}
            </div>

            <div
              ref={scrollRef}
              className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                   <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-xs text-text-secondary font-medium">Fetching records...</span>
                </div>
              ) : logs.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-10 italic">No recent activity detected.</p>
              ) : (
                logs.map((log, i) => (
                  <div
                    key={log.id || i}
                    className="group bg-surface-light hover:bg-accent-soft transition-colors p-4 rounded-xl border border-surface-border flex flex-col gap-1 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-primary font-black uppercase tracking-tighter">
                        {log.type}
                      </span>
                      <span className="text-[10px] text-text-muted font-bold">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary font-medium leading-tight">{log.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            className="w-full py-4 bg-secondary hover:bg-secondary-hover text-primary font-black rounded-xl shadow-soft transition-transform active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wider text-sm border-b-4 border-secondary-hover"
            onClick={() => {
               const msg = `prescription:{"name": "Paracetamol", "category": "Analgesic", "warning": "Take after meals"}`;
               localStorage.setItem('sahayak_super_clipboard', JSON.stringify({ timestamp: Date.now(), lastAction: 'Demo prescription', payload: msg }));
               alert("Simulated Super Clipboard: Prescription data sent to phone.");
            }}
          >
            <Clipboard size={18} /> Push New Prescription
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="bg-surface p-4 rounded-2xl border border-surface-border shadow-card flex flex-col gap-1">
      <div className="flex items-center gap-2 text-text-muted text-[10px] font-black uppercase tracking-wider">
        <span className="text-primary">{icon}</span> {label}
      </div>
      <p className={`text-xl font-serif font-black ${color}`}>{value}</p>
    </div>
  );
}

function HealthMetricCard({ label, value, unit, icon, chartColor }: { label: string, value: number, unit: string, icon: any, chartColor: string }) {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-card card-gradient relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-text-muted font-black uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-serif font-black text-primary group-hover:text-secondary transition-colors">{value}</span>
            <span className="text-xs text-text-muted font-bold">{unit}</span>
          </div>
        </div>
        <div className="p-3 bg-surface-light rounded-xl border border-surface-border">
          {icon}
        </div>
      </div>
      <div className="w-full h-1 bg-surface-light rounded-full overflow-hidden">
        <div className="h-full animate-pulse" style={{ width: '70%', backgroundColor: chartColor }}></div>
      </div>
    </div>
  );
}
