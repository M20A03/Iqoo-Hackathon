import { useState, useEffect } from 'react';
import { LogOut, LogIn, User as UserIcon, X, Smartphone, Globe } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';

// Firebase
import { auth, signOut } from './utils/firebase';

// Components
import { AuthComponent } from './components/AuthComponent';
import { ModeSelector, ControlMode } from './components/ModeSelector';
import { ScanComponent } from './components/ScanComponent';
import { FaceTracker } from './components/FaceTracker';
import { EyeTracking } from './components/EyeTracking';
import { SwitchControl } from './components/SwitchControl';
import { VoiceComponent } from './components/VoiceComponent';
import { AIResponse as AIResponseView } from './components/AIResponse';
import { SpotifyControls } from './components/SpotifyControls';
import { AccessibilityServiceDemo } from './components/AccessibilityServiceDemo';
import { SavedItems } from './components/SavedItems';
import { InstallButton } from './components/InstallButton';
import { HelpDesk } from './components/HelpDesk';
import { Logo } from './components/Logo';

// Hooks
import { useLocalAI } from './hooks/useLocalAI';
import { speakText } from './hooks/useSpeechRecognition';
import { useSilentSpeech } from './hooks/useSilentSpeech';

// Utils
import { AIResponse as LocalAIResponse } from './utils/localAI';
import { executeDeepLink } from './utils/deepLinks';
import { saveItem } from './utils/storage';

import { CaregiverDashboard } from './components/CaregiverDashboard';

function App() {
  const [currentMode, setCurrentMode] = useState<ControlMode>('voice');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // History refresh trigger
  const [refreshHistory, setRefreshHistory] = useState(0);

  // Command & AI Response State
  const { processVoiceCommand } = useLocalAI();
  const [latestCommand, setLatestCommand] = useState<LocalAIResponse | null>(null);
  const [ocrText, setOcrText] = useState('');

  // --- Silent Speech (Breath/Click) ---
  useSilentSpeech(currentMode === 'voice' || currentMode === 'hybrid', (type) => {
    if (type === 'BREATH_CLICK') {
      speakText("Breath trigger detected.");
      handleCommand('read screen');
    }
  });

  // --- Auth Listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        setIsAuthOpen(false); // Close modal on success
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Dynamic Body Classes based on mode ---
  useEffect(() => {
    document.body.className = ''; // Reset
    if (currentMode === 'eye') {
      document.body.classList.add('mode-visual');
    } else if (currentMode === 'switch') {
      document.body.classList.add('mode-motor');
    } else if (currentMode === 'voice') {
      document.body.classList.add('mode-cognitive');
    }
  }, [currentMode]);

  // --- OCR Text Extracted ---
  const handleTextExtracted = (text: string) => {
    setOcrText(text);
  };

  // --- Process Voice / Switch / Eye Command ---
  const handleCommand = async (transcript: string) => {
    const result = await processVoiceCommand(transcript, ocrText);
    setLatestCommand(result);

    // Save to local offline storage (IndexedDB)
    try {
      await saveItem({
        type: 'command',
        content: `Heard: "${transcript}" -> ${result.response}`,
        timestamp: Date.now()
      });
      setRefreshHistory(prev => prev + 1);
    } catch (e) {
      console.warn('Could not save command offline:', e);
    }
    
    // Auto read response
    if (result && result.response) {
      speakText(result.response);
    }

    // Execute deep link trigger (actually open apps / maps / call dialer on the phone)
    if (result && result.type) {
      executeDeepLink(result.type, result.command?.target, result.command?.text || result.command?.contact);
    }
  };

  // --- Face Tracker handler ---
  const handleFaceGesture = (gesture: string) => {
    let commandStr = '';
    switch (gesture) {
      case 'OPEN_MOUTH':
        commandStr = 'scroll down';
        break;
      case 'BLINK_LEFT':
        commandStr = 'go back';
        break;
      case 'BLINK_RIGHT':
        commandStr = 'go home';
        break;
      case 'SMILE':
        commandStr = 'click 1';
        break;
      case 'EYEBROWS_RAISED':
        commandStr = 'help';
        break;
      case 'SUSTAINED_WINK_LEFT':
        commandStr = 'call caregiver';
        break;
      case 'DOUBLE_EYEBROW_RAISE':
        commandStr = 'read medicine';
        break;
      default:
        return;
    }
    
    speakText(`Gesture detected: ${commandStr}`);
    handleCommand(commandStr);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text-primary font-sans">
        <div className="flex flex-col items-center gap-4 text-center">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           <p className="text-xl font-black font-serif text-primary">PulseEdge-OS</p>
           <p className="text-xs text-text-secondary font-bold uppercase tracking-widest animate-pulse">Initializing Neural Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen bg-background text-text-primary p-4 font-sans max-w-5xl mx-auto flex flex-col gap-8 antialiased overflow-x-hidden">
      {/* Header with Profile Section */}
      <header className="flex justify-between items-center border-b border-surface-border pb-6 pt-2">
        <Logo showText={true} size={48} />
        
        {/* Profile Card / Login Button */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-surface p-2 pr-4 rounded-2xl border border-surface-border shadow-card group hover:border-accent transition-all">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'Profile'} className="w-10 h-10 rounded-xl border-2 border-primary shadow-sm" />
              ) : (
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <UserIcon className="text-primary" size={20} />
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-text-primary truncate max-w-[120px]">{user.displayName || 'User'}</p>
                <p className="text-[10px] text-text-secondary truncate max-w-[120px] font-bold">{user.email}</p>
              </div>
              <button 
                onClick={() => signOut(auth)}
                className="p-2.5 bg-surface-light text-error hover:bg-error hover:text-white transition-all rounded-xl border border-surface-border"
                aria-label="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl border border-primary-dark hover:bg-primary-light transition-all text-sm font-black shadow-soft uppercase tracking-widest active:scale-95"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal Overlay */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 bg-primary/20 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md animate-in slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setIsAuthOpen(false)}
              className="absolute -top-12 right-0 p-3 text-text-primary hover:bg-primary hover:text-white transition-all bg-surface rounded-full border border-surface-border shadow-soft"
            >
              <X size={24} />
            </button>
            <div className="bg-surface p-2 rounded-3xl shadow-soft">
               <AuthComponent />
            </div>
          </div>
        </div>
      )}

      {/* Control Mode Selection */}
      <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Input Modes (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Scan Camera Input */}
          <div className="bg-surface rounded-3xl border border-surface-border shadow-card overflow-hidden">
             <ScanComponent onTextExtracted={handleTextExtracted} />
          </div>

          {/* Voice Command Input */}
          {(currentMode === 'voice' || currentMode === 'hybrid') && (
            <div className="animate-in slide-in-from-left duration-500">
               <VoiceComponent onCommandParsed={handleCommand} />
            </div>
          )}

          {/* Face & Eye Trackers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FaceTracker
              isActive={currentMode === 'face' || currentMode === 'hybrid'}
              onGesture={handleFaceGesture}
            />

            <EyeTracking
              isActive={currentMode === 'eye' || currentMode === 'hybrid'}
              onCommand={handleCommand}
            />
          </div>

          {/* Switch Control */}
          <SwitchControl 
            isActive={currentMode === 'switch' || currentMode === 'hybrid'} 
            onCommand={handleCommand}
          />
        </div>

        {/* Right Column: AI Response & Status (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* AI Response Box */}
          {latestCommand && (
            <div className="animate-in zoom-in-95 duration-300">
               <AIResponseView
                 message={latestCommand.response}
                 action={latestCommand.type}
               />
            </div>
          )}

          {/* Accessibility Service Logs */}
          <AccessibilityServiceDemo 
            latestCommand={latestCommand} 
          />

          {/* Spotify Playback Controls */}
          <SpotifyControls />

          {/* Q&A Help Desk */}
          <HelpDesk user={user} onSignIn={() => setIsAuthOpen(true)} />
          
          {/* Saved History */}
          <SavedItems refreshTrigger={refreshHistory} />

          {/* PulseEdge: Caregiver Dashboard */}
          {(isDemoMode || currentMode === 'hybrid') && (
            <CaregiverDashboard />
          )}
        </div>
      </main>

      {/* PWA Floating Install Button */}
      <InstallButton />

      {/* Footer */}
      <footer className="text-center mt-12 pb-12 flex flex-col items-center gap-4 border-t border-surface-border pt-8">
        <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] font-black uppercase tracking-widest text-text-muted">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full border border-success/20">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span> Offline Mode Ready
          </span>
          <span className="flex items-center gap-2">
            <Smartphone size={12} className="text-primary" /> OriginOS Integrated
          </span>
          <span className="flex items-center gap-2">
             <Globe size={12} className="text-primary" /> WCAG AAA Compliant
          </span>
        </div>
        <p className="text-[11px] text-text-secondary font-bold italic opacity-60">Empowering lives through neural sensor-driven accessibility.</p>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full"></div>
      </footer>

      {/* Admin/Judge Demo Floating Toggles */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-40">
         <button
           onClick={() => setIsDemoMode(!isDemoMode)}
           className={`p-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-tighter shadow-soft backdrop-blur-md transition-all ${
             isDemoMode ? 'bg-primary border-primary text-white' : 'bg-white border-surface-border text-text-secondary'
           }`}
         >
           {isDemoMode ? '📡 Telemetry ON' : '📡 Telemetry OFF'}
         </button>
      </div>
    </div>
  );
}

export default App;
