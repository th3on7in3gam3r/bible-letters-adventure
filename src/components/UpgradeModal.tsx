import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Users, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordsCompleted: number;
  freeLimit: number;
}

export default function UpgradeModal({ isOpen, onClose, wordsCompleted, freeLimit }: UpgradeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, onClose, modalRef);

  if (!isOpen) return null;

  const handleUpgrade = (plan: 'pro' | 'family') => {
    window.open(`https://biblefunland.com/premium?plan=${plan}&source=bible-letters`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-sm bg-black/60 z-50"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-modal-title"
          >
            <div ref={modalRef} className="rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-t-3xl text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close upgrade modal"
                >
                  <X size={24} />
                </button>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 id="upgrade-modal-title" className="text-3xl font-display font-black mb-2">Amazing Progress!</h2>
                <p className="text-blue-100 text-lg">You've completed {wordsCompleted} of {freeLimit} free words!</p>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <p className="text-xl font-semibold mb-2 text-gray-700">Unlock All 52 Bible Words + More!</p>
                  <p className="text-gray-600">Continue your faith journey with unlimited access</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Pro */}
                  <motion.div whileHover={{ y: -4 }} className="border-2 border-blue-200 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-center gap-2 mb-4">
                      <Crown className="text-blue-600" size={28} />
                      <h3 className="text-2xl font-display font-black text-blue-600">Pro</h3>
                    </div>
                    <div className="mb-4">
                      <div className="text-4xl font-black text-gray-900">$4.99</div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {["All 52 Bible words unlocked", "Unlimited hints & replays", "Ad-free experience", "Progress sync across devices"].map((t) => (
                        <li key={t} className="flex items-start gap-2 text-sm">
                          <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleUpgrade('pro')} className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg">
                      Upgrade to Pro
                    </button>
                  </motion.div>

                  {/* Family */}
                  <motion.div whileHover={{ y: -4 }} className="border-2 border-purple-200 rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-white relative overflow-hidden">
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black px-3 py-1 rounded-full">BEST VALUE</div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="text-purple-600" size={28} />
                      <h3 className="text-2xl font-display font-black text-purple-600">Family</h3>
                    </div>
                    <div className="mb-4">
                      <div className="text-4xl font-black text-gray-900">$9.99</div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {["Everything in Pro", "Up to 6 family members", "Parent dashboard & controls", "Access to all biblefunland.com features"].map((t, i) => (
                        <li key={t} className="flex items-start gap-2 text-sm">
                          <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-purple-600" />
                          <span className={i === 0 ? "font-bold" : ""}>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleUpgrade('family')} className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg">
                      Upgrade to Family
                    </button>
                  </motion.div>
                </div>

                <div className="text-center text-sm text-gray-500">
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
