import { useEffect, useState } from 'react';
import { Trash2, ArchiveX, Database } from 'lucide-react';
import { getAllItems, deleteItem, clearAllItems, SavedItem } from '../utils/storage';

interface SavedItemsProps {
  refreshTrigger: number;
}

export function SavedItems({ refreshTrigger }: SavedItemsProps) {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    loadItems();
  }, [refreshTrigger]);

  const loadItems = async () => {
    const data = await getAllItems();
    setItems(data);
  };

  const handleDelete = async (id?: number) => {
    if (id === undefined) return;
    await deleteItem(id);
    loadItems();
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all saved history?')) {
      await clearAllItems();
      loadItems();
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-white/90 border border-slate-200 p-6 rounded-3xl shadow-sm backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <Database size={18} />
          </div>
          <h2 className="text-base font-black text-slate-900 font-display">
            Offline Command History
          </h2>
        </div>
        <button 
          onClick={handleClearAll} 
          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors" 
          title="Clear all history"
        >
          <ArchiveX size={16} />
        </button>
      </div>
      
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
        {items.map(item => (
          <div key={item.id} className="bg-slate-50/80 p-3.5 rounded-2xl flex justify-between items-start gap-3 border border-slate-200/80 shadow-xs">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-sky-700 uppercase font-black tracking-wider mb-0.5 block">
                {item.type.replace('_', ' ')} &bull; {new Date(item.timestamp).toLocaleTimeString()}
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed break-words">{item.content}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              title="Delete item"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
