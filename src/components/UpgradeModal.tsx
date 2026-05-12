import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Users, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useDarkMode } from '../hooks/useDarkMode';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordsCompleted: number;
  freeLimit: number;
}

export default function UpgradeModal({ isOpen, onClose, wordsCompleted, freeLimit }: UpgradeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isDark } = useDarkMode();
  
  useFocusTrap(isOpen, onClose, modalRef);

  if (!isOpen) return null;

  const handleUpgrade = (plan: 'pro' | 'family') => {
    // Redirect to biblefunland.com premium page
    window.open(`https://biblefunland.com/premium?plan=${plan}&source=bible-letters`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 backdrop-blur-sm z-50 ${isDark ? 'bg-black/60' : 'bg-black/60'}`}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-modal-title"
          >
            <div 
              ref={modalRef}
              className={`rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-t-3xl text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Close upgrade modal"
                >
                  <X size={24} />
                </button>

                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="text-6xl mb-4"
                  aria-hidden="true"
                >
                  🎉
                </motion.div>

                <h2 id="upgrade-modal-title" className="text-3xl font-display font-black mb-2">
                  Amazing Progress!
                </h2>
                <p className="text-blue-100 text-lg">
                  You've completed {wordsCompleted} of {freeLimit} free words!
                </p>
              </div>

              {/* Content */}
              <div className={`p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-center mb-8">
                  <p className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                    Unlock All 52 Bible Words + More!
                  </p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Continue your faith journey with unlimited access to all features
                  </p>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Pro Plan */}
                  <motion.div
                    whileHover={{ y: -4, boxShadow: isDark ? '0 20px 40px rgba(37,99,235,0.2)' : '0 20px 40px rgba(59,130,246,0.3)' }}
                    className={`border-2 border-blue-200 rounded-2xl p-6 ${isDark ? 'bg-gray-700 border-blue-900' : 'bg-gradient-to-br from-blue-50 to-white'}`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Crown className={isDark ? 'text-blue-400' : 'text-blue-600'} size={28} />
                      <h3 className={`text-2xl font-display font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Pro</h3>
                    </div>
                    
                    <div className="mb-4">
                      <div className={`text-4xl font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>$4.99</div>
                      <div className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>per month</div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2 text-sm">
                        <Sparkles size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={isDark ? 'text-gray-200' : ''}>All 52 Bible words unlocked</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Sparkles size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={isDark ? 'text-gray-200' : ''}>Unlimited hints & replays</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Sparkles size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={isDark ? 'text-gray-200' : ''}>Ad-free experience</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Sparkles size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={isDark ? 'text-gray-200' : ''}>Progress sync across devices</span>
                      </li>
                    </ul>

                    <button
                      onClick={() => handleUpgrade('pro')}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                      aria-label="Upgrade to Pro plan"
                    >
                      Upgrade to Pro
                    </button>
                  </motion.div>

                  {/* Family Plan */}
                  <motion.div
                    whileHover={{ y: -4, boxShadow: isDark ? '0 20px 40px rgba(168,85,247,0.2)' : '0 20px 40px rgba(139,92,246,0.3)' }}
                    className={`border-2 border-purple-200 rounded-2xl p-6 relative overflow-hidden ${isDark ? 'bg-gray-700 border-purple-900' : 'bg-gradient-to-br from-purple-50 to-white'}`}
                  >
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black px-3 py-1 rounded-full">
                      BEST VALUE
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Users className={isDark ? 'text-purple-400' : 'text-purple-600'} size={28} />
                      <h3 className={`text-2xl font-display font-black ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Family</h3>
                    </div>
                    
                    <div className="mb-4">
                      <div className={`text-4xl font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>$9.99</div>
                      <div className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>per month</div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2 text-sm">
                        <Sparkles size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        <span className={isDark ? 'text-gray-200' : ''}><strong>Everything in Pro</strong></span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Sparkles size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        <span className={isDark ? 'text-gray-200' : ''}>Up to 6 family members</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Sparkles size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        <span className={isDark ? 'text-gray-200' : ''}>Parent dashboard & controls</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Sparkles size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        <span className={isDark ? 'text-gray-200' : ''}>Access to all biblefunland.com features</span>
                      </li>
                    </ul>

                    <button
                      onClick={() => handleUpgrade('family')}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                      aria-label="Upgrade to Family plan - Best Value"
                    >
                      Upgrade to Family
                    </button>
                  </motion.div>
                </div>

                <div className={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <p>✨ 7-day free trial • Cancel anytime • Secure payment</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
