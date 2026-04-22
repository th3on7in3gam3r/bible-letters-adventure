/**
 * UserBar — unified top-left auth/profile bar for Home screen.
 * Shows: avatar + name when signed in (with Pro badge if applicable),
 * or Sign In button for guests.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, SignInButton, SignOutButton } from '@clerk/clerk-react';
import { LogIn, LogOut, ExternalLink, Crown } from 'lucide-react';
import { useState } from 'react';

interface UserBarProps {
  isPremium: boolean;
}

export default function UserBar({ isPremium }: UserBarProps) {
  const { user, isLoaded } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isLoaded) return null;

  if (!user) {
    return (
      <SignInButton mode="modal">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md transition-colors"
          aria-label="Sign in to save your progress"
        >
          <LogIn size={15} />
          Sign In
        </motion.button>
      </SignInButton>
    );
  }

  const displayName = user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Friend';
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarUrl = user.imageUrl;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 bg-white border-2 border-green-200 px-3 py-1.5 rounded-full shadow-sm"
        aria-label="Account menu"
        aria-expanded={menuOpen}
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-black shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : initials}
        </div>
        <span className="text-gray-700 font-bold text-sm max-w-[80px] truncate">{displayName}</span>
        {isPremium && (
          <span className="flex items-center gap-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
            <Crown size={9} /> PRO
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              className="absolute left-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
              role="menu"
            >
              {/* Profile info */}
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="font-black text-gray-800 text-sm truncate">{displayName}</p>
                <p className="text-xs text-gray-400 truncate">{user.emailAddresses[0]?.emailAddress}</p>
                {isPremium && (
                  <span className="inline-flex items-center gap-1 mt-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    <Crown size={9} /> Pro Member
                  </span>
                )}
              </div>

              {/* Links */}
              <a
                href="https://biblefunland.com/profile"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <ExternalLink size={14} /> View Profile
              </a>

              {!isPremium && (
                <a
                  href="https://biblefunland.com/premium"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-black text-orange-600 hover:bg-orange-50 transition-colors"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  <Crown size={14} /> Go Pro ✨
                </a>
              )}

              {/* Sign out */}
              <div className="border-t border-gray-50">
                <SignOutButton>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </SignOutButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
