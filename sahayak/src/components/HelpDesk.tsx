import { useState, useEffect } from 'react';
import { getForumPosts, addForumPost, ForumPost } from '../utils/communityService';
import { MessageSquare, Plus, Send, Lock } from 'lucide-react';
import { User } from 'firebase/auth';

interface HelpDeskProps {
  user: User | null;
  onSignIn: () => void;
}

export function HelpDesk({ user, onSignIn }: HelpDeskProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [category, setCategory] = useState('General');
  const [isPosting, setIsPosting] = useState(false);

  const fetchPosts = async () => {
    const data = await getForumPosts();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPostClick = () => {
    if (!user) {
      onSignIn();
      return;
    }
    setIsPosting(!isPosting);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !user) return;
    
    await addForumPost({
      title: newTitle,
      description: newDesc,
      category,
      author: user.displayName || user.email || 'Anonymous User'
    });

    setNewTitle('');
    setNewDesc('');
    setIsPosting(false);
    fetchPosts();
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white/90 border border-slate-200 rounded-3xl p-6 shadow-sm backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <MessageSquare size={18} />
          </div>
          <h2 className="text-base font-black text-slate-900 font-display">
            Community Help Desk
          </h2>
        </div>
        <button
          onClick={handleNewPostClick}
          className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1 text-xs hover:bg-slate-800 transition-all shadow-xs"
        >
          {user ? <Plus size={14} /> : <Lock size={12} />} 
          <span>{user ? 'New Post' : 'Sign In'}</span>
        </button>
      </div>

      {isPosting && user && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <input
            type="text"
            placeholder="Question Title (e.g. eye tracking winks)"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <textarea
            placeholder="Describe your issue or tip..."
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <div className="flex gap-2">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-xl p-2.5 focus:outline-none"
            >
              <option value="General">General</option>
              <option value="Eye/Face Tracking">Eye/Face Tracking</option>
              <option value="Voice Controls">Voice Controls</option>
              <option value="Switch Controls">Switch Controls</option>
            </select>
            <button
              type="submit"
              className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Send size={14} /> 
              <span>Post Question</span>
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2.5">
        {posts.map(post => (
          <div key={post.id || post.title} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 flex flex-col gap-1.5 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                {post.category}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {post.replies} replies
              </span>
            </div>
            <h3 className="text-xs font-black text-slate-900 mt-1">{post.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{post.description}</p>
            <div className="text-[10px] text-slate-400 flex justify-between mt-1 pt-1 border-t border-slate-100">
              <span>By {post.author}</span>
              <span>{new Date(post.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
