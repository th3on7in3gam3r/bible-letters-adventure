import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Music, Shield, ChevronRight, Lock, Trash2, AlertTriangle, ChartNoAxesCombined, Clock3, Target, GraduationCap } from "lucide-react";

import { soundManager } from "../services/soundService";

interface SettingsProps {
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  onToggleMusic: (enabled: boolean) => void;
  onResetProgress: () => void;
  completedWords: string[];
  skippedWords: string[];
  totalPlayMinutes: number;
  accuracyRate: number;
  badges: string[];
  hintUsage: Record<string, number>;
  parentMode: boolean;
  onToggleParentMode: (enabled: boolean) => void;
  key?: string;
}

export default function Settings({ 
  soundEnabled, 
  musicEnabled, 
  onToggleSound, 
  onToggleMusic,
  onResetProgress,
  completedWords,
  skippedWords,
  totalPlayMinutes,
  accuracyRate,
  badges,
  hintUsage,
  parentMode,
  onToggleParentMode,
}: SettingsProps) {
  const [showParentalControls, setShowParentalControls] = useState(false);
  const [parentalVerified, setParentalVerified] = useState(false);
  const [verificationValue, setVerificationValue] = useState("");
  const [error, setError] = useState(false);
  const isSmallScreen = window.innerWidth < 640;

  // Simple math challenge for parental verification
  const challenge = { a: 7, b: 8, result: 15 };

  const handleVerify = () => {
    if (parseInt(verificationValue) === challenge.result) {
      soundManager.play('correct');
      setParentalVerified(true);
      setError(false);
    } else {
      soundManager.play('incorrect');
      setError(true);
      setVerificationValue("");
    }
  };

  const exportReport = async () => {
    const report = [
      "Bible Letters Adventure Parent Report",
      `Completed words: ${completedWords.length}`,
      `Skipped words: ${skippedWords.length}`,
      `Accuracy: ${accuracyRate}%`,
      `Play time: ${totalPlayMinutes} minutes`,
      `Badges: ${badges.length ? badges.join(", ") : "None yet"}`,
      `Hints used (by word): ${
        Object.keys(hintUsage).length
          ? Object.entries(hintUsage)
              .sort((a, b) => b[1] - a[1])
              .map(([word, count]) => `${word} (${count})`)
              .join(", ")
          : "None"
      }`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(report);
      alert("Progress report copied to clipboard.");
    } catch {
      alert(report);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-6 sm:p-8 border-8 border-blue-50 relative max-h-[90dvh] flex flex-col"
    >
      <div className="flex items-center gap-4 mb-6 sm:mb-8 shrink-0">
        <div className="p-2 sm:p-3 bg-blue-100 rounded-2xl text-blue-600">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-gray-800 tracking-tight tracking-tighter sm:tracking-tight uppercase">Settings</h2>
      </div>

      <div className="space-y-4 sm:space-y-6 overflow-y-auto pr-2 custom-scrollbar pb-6">
        {/* Sound Effects */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`p-2.5 sm:p-3 rounded-2xl ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
              {soundEnabled ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />}
            </div>
            <div>
              <p className="font-black text-lg sm:text-xl text-gray-800">Sound Effects</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Blorps and pops!</p>
            </div>
          </div>
          <button 
            onClick={() => onToggleSound(!soundEnabled)}
            className={`w-12 h-6 sm:w-16 sm:h-8 rounded-full relative transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-gray-300'} shrink-0`}
          >
            <motion.div 
              animate={{ x: soundEnabled ? (isSmallScreen ? 24 : 32) : 4 }}
              className="absolute top-1 left-0 w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        {/* Music */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`p-2.5 sm:p-3 rounded-2xl ${musicEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
              <Music className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="font-black text-lg sm:text-xl text-gray-800">Music</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Happy tunes</p>
            </div>
          </div>
          <button 
            onClick={() => onToggleMusic(!musicEnabled)}
            className={`w-12 h-6 sm:w-16 sm:h-8 rounded-full relative transition-colors ${musicEnabled ? 'bg-blue-500' : 'bg-gray-300'} shrink-0`}
          >
            <motion.div 
              animate={{ x: musicEnabled ? (isSmallScreen ? 24 : 32) : 4 }}
              className="absolute top-1 left-0 w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        {/* Parent / Teacher Mode */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`p-2.5 sm:p-3 rounded-2xl ${parentMode ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="font-black text-lg sm:text-xl text-gray-800">Parent / Teacher View</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Shows verse refs & accuracy details</p>
            </div>
          </div>
          <button
            onClick={() => onToggleParentMode(!parentMode)}
            className={`w-12 h-6 sm:w-16 sm:h-8 rounded-full relative transition-colors ${parentMode ? 'bg-purple-500' : 'bg-gray-300'} shrink-0`}
            aria-label={`${parentMode ? 'Disable' : 'Enable'} parent teacher mode`}
            aria-pressed={parentMode}
          >
            <motion.div
              animate={{ x: parentMode ? (isSmallScreen ? 24 : 32) : 4 }}
              className="absolute top-1 left-0 w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        {/* Parental Controls Section */}
        <div className="mt-12 border-t-2 border-gray-100 pt-8">
          {!showParentalControls ? (
            <button 
              onClick={() => {
                soundManager.play('click');
                setShowParentalControls(true);
              }}
              className="flex items-center justify-between w-full p-6 bg-yellow-50 text-yellow-700 rounded-3xl border-2 border-yellow-100 hover:bg-yellow-100 transition-colors group"
            >
              <div className="flex items-center gap-4 text-left">
                <Lock className="group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-black text-xl">Parental Controls</p>
                  <p className="text-sm font-medium opacity-70">Manage progress and safety</p>
                </div>
              </div>
              <ChevronRight />
            </button>
          ) : (
            <AnimatePresence mode="wait">
              {!parentalVerified ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200"
                >
                  <p className="text-center font-black text-lg mb-4">Adults Only: Solve to Enter</p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-3xl font-black">{challenge.a} + {challenge.b} =</span>
                    <input 
                      type="number" 
                      value={verificationValue}
                      onChange={(e) => setVerificationValue(e.target.value)}
                      className="w-20 p-2 bg-white/20 border-2 border-white/30 rounded-xl text-white text-3xl font-black text-center focus:outline-none focus:bg-white/30"
                    />
                  </div>
                  {error && <p className="text-center text-xs font-bold text-red-200 mb-4 uppercase tracking-widest">Try again!</p>}
                  <div className="flex gap-2">
                    <button 
                      onClick={handleVerify}
                      className="flex-1 py-3 bg-white text-blue-600 rounded-2xl font-black uppercase text-sm shadow-lg active:scale-95 transition-transform"
                    >
                      Verify
                    </button>
                    <button 
                      onClick={() => {
                        soundManager.play('click');
                        setShowParentalControls(false);
                      }}
                      className="px-6 py-3 bg-blue-700 text-white rounded-2xl font-black uppercase text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 rounded-3xl border-4 border-red-50 space-y-4"
                >
                  <div className="rounded-2xl border-2 border-blue-100 p-4 bg-blue-50/50">
                    <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-wider text-xs mb-3">
                      <ChartNoAxesCombined size={14} />
                      Parent Dashboard
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-white rounded-xl p-2 text-center border border-blue-100">
                        <div className="text-[10px] uppercase font-black text-gray-400">Completed</div>
                        <div className="text-lg font-display font-black text-blue-700">{completedWords.length}</div>
                      </div>
                      <div className="bg-white rounded-xl p-2 text-center border border-orange-100">
                        <div className="text-[10px] uppercase font-black text-gray-400">Skipped</div>
                        <div className="text-lg font-display font-black text-orange-600">{skippedWords.length}</div>
                      </div>
                      <div className="bg-white rounded-xl p-2 text-center border border-purple-100">
                        <div className="text-[10px] uppercase font-black text-gray-400">Play</div>
                        <div className="text-lg font-display font-black text-purple-600">{totalPlayMinutes}m</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2">
                      <Target size={14} className="text-green-600" />
                      Accuracy: <span className="text-green-700">{accuracyRate}%</span>
                      <Clock3 size={14} className="text-purple-500 ml-3" />
                      Time: <span className="text-purple-600">{totalPlayMinutes} minutes</span>
                    </div>

                    {completedWords.length > 0 && (
                      <div className="mb-2">
                        <div className="text-[10px] uppercase font-black text-gray-400 mb-1">Completed words</div>
                        <div className="max-h-20 overflow-y-auto custom-scrollbar text-xs text-gray-600 bg-white rounded-xl border border-blue-100 p-2">
                          {completedWords.join(", ")}
                        </div>
                      </div>
                    )}

                    {skippedWords.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase font-black text-gray-400 mb-1">Needs practice</div>
                        <div className="max-h-20 overflow-y-auto custom-scrollbar text-xs text-orange-700 bg-orange-50 rounded-xl border border-orange-100 p-2">
                          {skippedWords.join(", ")}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={exportReport}
                      className="mt-3 w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider"
                    >
                      Copy Parent Report
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-red-500 mb-2">
                    <AlertTriangle size={20} />
                    <p className="font-black uppercase tracking-wider text-sm">Danger Zone</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (confirm("Reset all progress? This cannot be undone.")) {
                        onResetProgress();
                        setParentalVerified(false);
                        setShowParentalControls(false);
                      }
                    }}
                    className="flex items-center justify-between w-full p-4 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 size={20} />
                      <span className="font-black text-lg">Reset Game Progress</span>
                    </div>
                  </button>
                  
                  <p className="text-[10px] text-gray-400 font-medium text-center italic">
                    All completed words will be cleared from your collection.
                  </p>
                  
                  <button 
                    onClick={() => setParentalVerified(false)}
                    className="w-full py-2 text-gray-400 font-black text-xs uppercase"
                  >
                    Lock Settings
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )
          }
        </div>
      </div>

      <button 
        onClick={() => {
          soundManager.play('click');
          setShowParentalControls(false);
        }}
        className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-500 transition-colors"
      >
        <ChevronRight size={24} className="rotate-90" />
      </button>
    </motion.div>
  );
}
