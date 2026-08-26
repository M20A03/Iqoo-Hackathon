import { useState } from 'react';
import {
  FolderHeart,
  User,
  Plus,
  QrCode,
  Printer,
  HeartPulse,
  Clock,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  bloodGroup: string;
  chronicConditions: string[];
  allergies: string[];
  records: HealthRecord[];
}

export interface HealthRecord {
  id: string;
  date: string;
  type: 'vitals' | 'stethoscope' | 'anemia' | 'prescription';
  title: string;
  summary: string;
  severity: 'normal' | 'caution' | 'urgent';
  vitals?: {
    bpm?: number;
    spo2?: number;
    hrv?: number;
    hbEstimate?: number;
    lungSound?: string;
  };
}

const DEFAULT_FAMILY: FamilyMember[] = [
  {
    id: 'mem-1',
    name: 'Ramesh Kumar (Self)',
    relation: 'Self',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+ Positive',
    chronicConditions: ['None'],
    allergies: ['Penicillin'],
    records: [
      {
        id: 'rec-1',
        date: '25 Aug 2026',
        type: 'vitals',
        title: 'Post-Workout Gym Recovery Vitals',
        summary: 'Heart rate 74 BPM, SpO2 99%, HRV 62ms (Recovery Index 92/100).',
        severity: 'normal',
        vitals: { bpm: 74, spo2: 99, hrv: 62 },
      },
      {
        id: 'rec-2',
        date: '18 Aug 2026',
        type: 'prescription',
        title: 'Augmentin 625mg &rarr; Jan Aushadhi Generic Switch',
        summary: 'Saved ₹175 (80%) by switching to PM Jan Aushadhi Amoxicillin + Clavulanic Acid.',
        severity: 'normal',
      },
    ],
  },
  {
    id: 'mem-2',
    name: 'Sushila Devi (Mother)',
    relation: 'Mother',
    age: 62,
    gender: 'Female',
    bloodGroup: 'B+ Positive',
    chronicConditions: ['Type 2 Diabetes', 'Mild Hypertension'],
    allergies: ['Sulfa drugs'],
    records: [
      {
        id: 'rec-3',
        date: '24 Aug 2026',
        type: 'stethoscope',
        title: 'Acoustic Lung Stethoscope Check',
        summary: 'Mild Bronchial Wheeze detected in lower right lobe. Inhaler advised.',
        severity: 'caution',
        vitals: { lungSound: 'Wheeze (450Hz)', bpm: 82, spo2: 96 },
      },
      {
        id: 'rec-4',
        date: '20 Aug 2026',
        type: 'anemia',
        title: 'Palpebral Sclera Optical Screening',
        summary: 'Hemoglobin estimate 10.8 g/dL (Mild Anemia). Iron-rich diet advised.',
        severity: 'caution',
        vitals: { hbEstimate: 10.8 },
      },
    ],
  },
];

export function FamilyHealthVault() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(DEFAULT_FAMILY);
  const [activeMemberId, setActiveMemberId] = useState<string>(DEFAULT_FAMILY[0].id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // New Member Form State
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Father');
  const [newAge, setNewAge] = useState('');
  const [newBloodGroup, setNewBloodGroup] = useState('B+');
  const [newConditions, setNewConditions] = useState('');

  const activeMember = familyMembers.find((m) => m.id === activeMemberId) || familyMembers[0];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMember: FamilyMember = {
      id: `mem-${Date.now()}`,
      name: newName,
      relation: newRelation,
      age: parseInt(newAge) || 45,
      gender: 'Male',
      bloodGroup: newBloodGroup,
      chronicConditions: newConditions ? newConditions.split(',').map((s) => s.trim()) : ['None'],
      allergies: ['None'],
      records: [
        {
          id: `rec-${Date.now()}`,
          date: 'Today',
          type: 'vitals',
          title: 'Initial Health Checkup Baseline',
          summary: 'Baseline established in Sahayak Offline Health Vault.',
          severity: 'normal',
          vitals: { bpm: 72, spo2: 98 },
        },
      ],
    };

    setFamilyMembers([...familyMembers, newMember]);
    setActiveMemberId(newMember.id);
    setShowAddModal(false);
    setNewName('');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const deleteRecord = (recordId: string) => {
    setFamilyMembers(
      familyMembers.map((m) =>
        m.id === activeMemberId
          ? { ...m, records: m.records.filter((r) => r.id !== recordId) }
          : m
      )
    );
  };

  return (
    <div className="flex flex-col gap-5 w-full bg-white/90 border border-slate-200 rounded-3xl p-6 shadow-md backdrop-blur-xl animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-100 text-rose-600 rounded-2xl">
            <FolderHeart className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                100% Offline &bull; ABHA Ready
              </span>
              <span className="text-[10px] font-mono text-slate-400">Zero Cloud Leakage</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 font-display mt-0.5">
              Family Health Record Vault &amp; Medical ID
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-all"
          >
            <QrCode size={15} />
            <span>Doctor QR</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
          >
            <Printer size={15} />
            <span>Print Medical ID</span>
          </button>
        </div>
      </div>

      {/* Member Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {familyMembers.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMemberId(m.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shrink-0 ${
              activeMemberId === m.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <User size={14} />
            <span>{m.name}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
              activeMemberId === m.id ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {m.relation}
            </span>
          </button>
        ))}

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-dashed border-slate-300 text-slate-600 hover:border-sky-500 hover:text-sky-600 text-xs font-bold transition-all shrink-0"
        >
          <Plus size={14} />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Active Member Emergency Medical Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-sky-50/50 text-slate-900 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <HeartPulse className="h-36 w-36 text-rose-600" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-wider uppercase text-slate-600 font-mono">
                OFFLINE EMERGENCY HEALTH PASSPORT
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full shadow-xs">
              Blood: {activeMember.bloodGroup}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
            <div>
              <h3 className="text-2xl font-black font-display text-slate-900">{activeMember.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Age: {activeMember.age} yrs &bull; Gender: {activeMember.gender} &bull; Relation: {activeMember.relation}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs">
                <span className="text-slate-500 text-[10px] font-bold block uppercase tracking-wider">Chronic Conditions</span>
                <span className="font-bold text-amber-700">{activeMember.chronicConditions.join(', ')}</span>
              </div>
              <div className="bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs">
                <span className="text-slate-500 text-[10px] font-bold block uppercase tracking-wider">Allergies</span>
                <span className="font-bold text-rose-700">{activeMember.allergies.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Checkup Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Clock size={14} className="text-sky-600" />
            Checkup History &amp; Vitals Logs ({activeMember.records.length})
          </h4>
          <span className="text-[11px] text-slate-500">Auto-saved from diagnostics &amp; pharma</span>
        </div>

        {activeMember.records.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No checkup records yet. Run a Stethoscope or Vitals check to add records!
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeMember.records.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-slate-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${
                      rec.severity === 'normal' ? 'bg-emerald-500' : rec.severity === 'caution' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    <span className="text-xs font-black text-slate-900">{rec.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {rec.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.summary}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {rec.vitals?.bpm && (
                    <span className="text-[11px] font-mono font-bold bg-sky-50 text-sky-700 px-2 py-1 rounded-lg border border-sky-200">
                      {rec.vitals.bpm} BPM
                    </span>
                  )}
                  {rec.vitals?.spo2 && (
                    <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-200">
                      {rec.vitals.spo2}% SpO2
                    </span>
                  )}
                  <button
                    onClick={() => deleteRecord(rec.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                    title="Delete record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Family Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
            <h3 className="text-lg font-black font-display text-slate-900">Add Family Member to Health Vault</h3>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Grandparent">Grandparent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 58"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="A+">A+ Positive</option>
                    <option value="A-">A- Negative</option>
                    <option value="B+">B+ Positive</option>
                    <option value="B-">B- Negative</option>
                    <option value="O+">O+ Positive</option>
                    <option value="O-">O- Negative</option>
                    <option value="AB+">AB+ Positive</option>
                    <option value="AB-">AB- Negative</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chronic Illnesses</label>
                  <input
                    type="text"
                    placeholder="e.g. Diabetes, BP"
                    value={newConditions}
                    onChange={(e) => setNewConditions(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all shadow-md shadow-sky-500/20"
                >
                  Save to Offline Vault
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offline Doctor QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="max-w-sm w-full rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 text-center text-slate-900">
            <div className="p-3 bg-sky-100 text-sky-700 rounded-2xl inline-block mx-auto">
              <QrCode className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black font-display text-slate-900">Doctor Offline QR Code</h3>
            <p className="text-xs text-slate-600">
              Any Primary Health Centre doctor can scan this encrypted payload to inspect {activeMember.name}’s vitals and health history without internet.
            </p>

            <div className="p-4 bg-slate-950 rounded-2xl flex flex-col items-center justify-center gap-2 border border-slate-800">
              <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center">
                <QrCode className="h-28 w-28 text-slate-900" />
              </div>
              <p className="text-[10px] font-mono text-cyan-300">BASE64_AES_ENCRYPTED_TELEMETRY</p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
