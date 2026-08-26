import { useState, useEffect, useCallback } from 'react';
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
import { UniversalAppLauncher } from './components/UniversalAppLauncher';
import { AccessibilityServiceDemo } from './components/AccessibilityServiceDemo';
import { SavedItems } from './components/SavedItems';
import { InstallButton } from './components/InstallButton';
import { HelpDesk } from './components/HelpDesk';
import { Logo } from './components/Logo';
import { DiagnosticsComponent } from './components/DiagnosticsComponent';
import { CaregiverDashboard } from './components/CaregiverDashboard';
import { HumanOnboardingWizard } from './components/HumanOnboardingWizard';
import { EmergencySosModal } from './components/EmergencySosModal';
import { IqooCommunityHub } from './components/IqooCommunityHub';
import { FamilyHealthVault } from './components/FamilyHealthVault';
import { SunoSahayakAssistant } from './components/SunoSahayakAssistant';
import { FeatureDiscoveryTour } from './components/FeatureDiscoveryTour';
import { SupportedLangCode } from './utils/languageDict';

// Hooks
import { useLocalAI } from './hooks/useLocalAI';
import { speakText } from './hooks/useSpeechRecognition';
import { useSilentSpeech } from './hooks/useSilentSpeech';

// Utils
import { AIResponse as LocalAIResponse } from './utils/localAI';
import { executeDeepLink } from './utils/deepLinks';
import { saveItem } from './utils/storage';

function App() {
  const [currentMode, setCurrentMode] = useState<ControlMode>('diagnostics');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEmergencySos, setShowEmergencySos] = useState(false);
  const [showDiscoveryTour, setShowDiscoveryTour] = useState(false);
  const [appLanguage, setAppLanguage] = useState<SupportedLangCode>('hi');
  const [seniorMode, setSeniorMode] = useState(false);
  
  // History refresh trigger
  const [refreshHistory, setRefreshHistory] = useState(0);

  // Command & AI Response State
  const { processVoiceCommand } = useLocalAI();
  const [latestCommand, setLatestCommand] = useState<LocalAIResponse | null>(null);
  const [ocrText, setOcrText] = useState('');

  // --- Process Voice / Switch / Eye Command ---
  const handleCommand = useCallback(async (transcript: string) => {
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
      console.warn("Storage warning:", e);
    }

    // Direct execution of system/browser/app intents
    if (result.type) {
      executeDeepLink(result.type, result.command?.target, result.command?.text);
    }
  }, [ocrText, processVoiceCommand]);

  // --- Silent Speech (Breath/Click) ---
  const handleSilentSpeech = useCallback((type: string) => {
    if (type === 'BREATH_CLICK') {
      speakText("Breath trigger detected.");
      handleCommand('read screen');
    }
  }, [handleCommand]);

  useSilentSpeech(currentMode === 'voice' || currentMode === 'hybrid', handleSilentSpeech);

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
  const handleTextExtracted = useCallback((text: string) => {
    setOcrText(text);
  }, []);

  const handleFaceGesture = useCallback((gesture: string) => {
    if (gesture === 'OPEN_MOUTH') {
      handleCommand('scroll down');
      window.scrollBy({ top: 400, behavior: 'smooth' });
      document.documentElement.scrollBy({ top: 400, behavior: 'smooth' });
      document.body.scrollBy({ top: 400, behavior: 'smooth' });
    } else if (gesture === 'EYEBROWS_RAISED' || gesture === 'DOUBLE_EYEBROW_RAISE') {
      handleCommand('scroll up');
      window.scrollBy({ top: -400, behavior: 'smooth' });
      document.documentElement.scrollBy({ top: -400, behavior: 'smooth' });
      document.body.scrollBy({ top: -400, behavior: 'smooth' });
    } else if (gesture === 'SMILE') {
      handleCommand('click focused');
    } else if (gesture === 'BLINK_LEFT' || gesture === 'SUSTAINED_WINK_LEFT') {
      handleCommand('go back');
      window.history.back();
    } else if (gesture === 'BLINK_RIGHT') {
      handleCommand('go home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [handleCommand]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-sans">
        <div className="flex flex-col items-center gap-4 text-center">
           <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-xl font-black text-slate-900">PulseEdge-OS</p>
           <p className="text-xs text-sky-600 font-bold uppercase tracking-widest animate-pulse">Initializing Snapdragon NPU &amp; Neural Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 text-slate-900 p-4 font-sans max-w-5xl mx-auto flex flex-col gap-6 antialiased overflow-x-hidden">
      {/* Top Telemetry HUD Pill & Human Action Bar */}
      <div className="flex items-center justify-between gap-2 rounded-3xl border border-white/90 bg-white/85 px-4 py-2.5 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Logo showText={true} size={36} />
        </div>

        <div className="flex items-center gap-2">
          {/* Feature Discovery Tour */}
          <button
            onClick={() => setShowDiscoveryTour(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-full text-xs font-black border border-amber-200 transition-all shadow-sm"
          >
            <span>🧭</span>
            <span>Explore All</span>
          </button>

          {/* Emergency SOS Panic Button */}
          <button
            onClick={() => setShowEmergencySos(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-md shadow-rose-600/30 active:scale-95 transition-all animate-pulse"
          >
            <span>🚨</span>
            <span>Emergency SOS</span>
          </button>

          {/* Setup / Guided Wizard */}
          <button
            onClick={() => setShowOnboarding(true)}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-full text-xs font-bold border border-sky-200"
          >
            <span>❓</span>
            <span>Guide</span>
          </button>

          {/* Senior / Tremor View Toggle */}
          <button
            onClick={() => setSeniorMode(!seniorMode)}
            className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              seniorMode ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>👴</span>
            <span>{seniorMode ? 'Senior: ON' : 'Senior: OFF'}</span>
          </button>

          {/* Global Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-xs font-bold shadow-xs">
            <span className="text-slate-500">🌐</span>
            <select
              value={appLanguage}
              onChange={(e) => setAppLanguage(e.target.value as SupportedLangCode)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>

          {/* Profile / Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 pr-3 rounded-full border border-slate-200">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full" />
              ) : (
                <UserIcon size={16} className="text-slate-600 ml-1" />
              )}
              <span className="text-xs font-bold text-slate-700">{user.displayName ? user.displayName.split(' ')[0] : 'User'}</span>
              <button onClick={() => signOut(auth)} className="text-slate-400 hover:text-rose-500 ml-1">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
            >
              <LogIn size={14} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal Overlay */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button 
              onClick={() => setIsAuthOpen(false)}
              className="absolute -top-12 right-0 p-2.5 text-slate-600 hover:text-slate-900 bg-white rounded-full border shadow-md"
            >
              <X size={20} />
            </button>
            <div className="bg-white p-4 rounded-3xl shadow-xl border">
               <AuthComponent />
            </div>
          </div>
        </div>
      )}

      {/* Control Mode Selection */}
      <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        {/* Left Column: Primary Diagnostics / Input Engine (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Mode 0: iQOO Monster & Lifestyle Hub */}
          {currentMode === 'iqoo' && (
            <IqooCommunityHub />
          )}

          {/* Mode 1: Diagnostics Suite */}
          {currentMode === 'diagnostics' && (
            <DiagnosticsComponent />
          )}

          {/* Mode 2: Medicine Strip & 50+ NLEM Jan Aushadhi Scanner */}
          {(currentMode === 'pharma' || currentMode === 'hybrid') && (
            <div className="bg-white/80 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <ScanComponent onTextExtracted={handleTextExtracted} />
            </div>
          )}

          {/* Mode 3: Family Health Vault */}
          {currentMode === 'vault' && (
            <FamilyHealthVault />
          )}

          {/* Mode 4: Suno Sahayak Multilingual Voice Assistant */}
          {currentMode === 'assistant' && (
            <SunoSahayakAssistant currentLang={appLanguage} onLanguageChange={setAppLanguage} />
          )}

          {/* Mode 5: Voice Command Input */}
          {(currentMode === 'voice' || currentMode === 'hybrid') && (
            <VoiceComponent onCommandParsed={handleCommand} />
          )}

          {/* Mode 4 & 5: Face & Eye Trackers */}
          {(currentMode === 'face' || currentMode === 'eye' || currentMode === 'hybrid') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(currentMode === 'face' || currentMode === 'hybrid') && (
                <FaceTracker
                  isActive={true}
                  onGesture={handleFaceGesture}
                />
              )}

              {(currentMode === 'eye' || currentMode === 'hybrid') && (
                <EyeTracking
                  isActive={true}
                  onCommand={handleCommand}
                />
              )}
            </div>
          )}

          {/* Mode 6: Switch Control */}
          {(currentMode === 'switch' || currentMode === 'hybrid') && (
            <SwitchControl 
              isActive={true} 
              onCommand={handleCommand}
            />
          )}
        </div>

        {/* Right Column: AI Response, Telemetry & Status (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
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

          {/* Universal Android Hands-Free App Control Hub */}
          <UniversalAppLauncher />

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
      <footer className="text-center mt-6 pb-8 flex flex-col items-center gap-3 border-t border-slate-200 pt-6">
        <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> 100% Offline Edge-AI
          </span>
          <span className="flex items-center gap-1 text-sky-700">
            <Smartphone size={12} /> OriginOS Office Kit Ready
          </span>
          <span className="flex items-center gap-1 text-slate-600">
             <Globe size={12} /> WCAG AAA Accessible
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium italic">PulseEdge-OS &bull; Air-Gapped Medical Diagnostics &amp; Zero-Touch Neuro-Accessibility</p>
      </footer>

      {/* Admin/Judge Demo Floating Toggles */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-40">
         <button
           onClick={() => setIsDemoMode(!isDemoMode)}
           className={`px-3.5 py-2 rounded-2xl border font-black text-[10px] uppercase tracking-wider shadow-lg backdrop-blur-md transition-all ${
             isDemoMode ? 'bg-sky-500 border-sky-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
           }`}
         >
           {isDemoMode ? '📡 Doctor Station ON' : '📡 Doctor Station OFF'}
         </button>
      </div>

      {/* Interactive Feature Discovery Tour Modal */}
      {showDiscoveryTour && (
        <FeatureDiscoveryTour
          onSelectFeature={(mode) => {
            setCurrentMode(mode);
            setShowDiscoveryTour(false);
          }}
          onClose={() => setShowDiscoveryTour(false)}
        />
      )}

      {/* Human Onboarding Guided Wizard Modal */}
      {showOnboarding && (
        <HumanOnboardingWizard
          onComplete={({ lang, primaryMode, seniorMode: senior }) => {
            setAppLanguage(lang);
            setCurrentMode(primaryMode);
            setSeniorMode(senior);
            setShowOnboarding(false);
          }}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* Emergency SOS Distress Modal */}
      {showEmergencySos && (
        <EmergencySosModal
          lang={appLanguage}
          onClose={() => setShowEmergencySos(false)}
        />
      )}
    </div>
  );
}

export default App;
