import { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, LogIn, RefreshCw } from 'lucide-react';
import { spotify, getSpotifyAuthUrl, SpotifyTrack } from '../utils/spotify';

export function SpotifyControls() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(false);

  // Parse token from hash fragment on callback
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get('access_token');
      if (token) {
        spotify.setToken(token);
        setIsAuthenticated(true);
        window.location.hash = ''; // clear hash
      }
    } else {
      setIsAuthenticated(spotify.isAuthenticated());
    }
  }, []);

  const fetchCurrentTrack = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    const data = await spotify.getCurrentlyPlaying();
    setTrack(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentTrack();
      const interval = setInterval(fetchCurrentTrack, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  const handlePlay = async () => {
    await spotify.play();
    fetchCurrentTrack();
  };

  const handlePause = async () => {
    await spotify.pause();
    fetchCurrentTrack();
  };

  const handleNext = async () => {
    await spotify.next();
    fetchCurrentTrack();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-4 w-full bg-white/90 border border-slate-200 rounded-3xl p-6 shadow-sm backdrop-blur-xl animate-in fade-in duration-300">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Music size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 font-display">
              Spotify Hands-Free Controls
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Connect Spotify to play, pause, and skip music tracks hands-free using voice commands or gaze winks.
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <LogIn size={16} /> 
          <span>Connect Spotify Account</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full bg-white/90 border border-slate-200 rounded-3xl p-6 shadow-sm backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Music size={18} />
          </div>
          <h2 className="text-base font-black text-slate-900 font-display">
            Spotify Active
          </h2>
        </div>
        <button 
          onClick={fetchCurrentTrack} 
          className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          title="Refresh currently playing track"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {track ? (
        <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
          {track.albumArt && (
            <img src={track.albumArt} alt={track.album} className="w-14 h-14 rounded-xl object-cover shadow-xs" />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-black text-slate-900 truncate">{track.name}</h3>
            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{track.artist}</p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium">No track actively playing. Start Spotify on your device.</p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={handlePlay}
          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Play size={14} /> Play
        </button>
        <button
          onClick={handlePause}
          className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all"
        >
          <Pause size={14} /> Pause
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center transition-all"
          title="Skip track"
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
}
