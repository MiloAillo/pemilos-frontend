import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface KioskPinModalProps {
  isOpen: boolean;
  onCorrectPin: () => void;
  onCancel?: () => void;
}

const KioskPinModal = ({ isOpen, onCorrectPin, onCancel }: KioskPinModalProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  const CORRECT_PIN_HASH = import.meta.env.VITE_KIOSK_PIN_HASH || "";
  const MAX_ATTEMPTS = 3;
  const LOCK_DURATION = 60; // 1 minute in seconds

  // Simple hash function for PIN verification (in production, use proper hashing)
  const hashPin = (inputPin: string): string => {
    let hash = 0;
    for (let i = 0; i < inputPin.length; i++) {
      const char = inputPin.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  };

  // Lockout timer
  useEffect(() => {
    if (isLocked && lockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setLockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            setError("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockTimeRemaining]);

  // Prevent ESC key from closing modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown, true);
      return () => window.removeEventListener("keydown", handleKeyDown, true);
    }
  }, [isOpen]);

  const handleNumberClick = (num: string) => {
    if (isLocked) return;
    if (pin.length < 15) {
      setPin(pin + num);
      setError("");
    }
  };

  const handleBackspace = () => {
    if (isLocked) return;
    setPin(pin.slice(0, -1));
    setError("");
  };

  const handleClear = () => {
    if (isLocked) return;
    setPin("");
    setError("");
  };

  const handleSubmit = () => {
    if (isLocked) return;

    const inputHash = hashPin(pin);
    
    if (inputHash === CORRECT_PIN_HASH) {
      setPin("");
      setError("");
      setFailedAttempts(0);
      onCorrectPin();
    } else {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      setPin("");
      
      if (newFailedAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setLockTimeRemaining(LOCK_DURATION);
        setError(`Terlalu banyak percobaan gagal. Terkunci selama ${LOCK_DURATION} detik.`);
      } else {
        setError(`PIN salah. Sisa percobaan: ${MAX_ATTEMPTS - newFailedAttempts}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Keluar Mode Kiosk</h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isLocked}
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* PIN Display */}
        <div className="mb-6 bg-black/30 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
          <div className="flex gap-2">
            {Array.from({ length: 15 }).map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx < pin.length
                    ? "bg-sky-500 shadow-lg shadow-sky-500/50"
                    : "bg-gray-600/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {isLocked ? (
              <div>
                <p className="font-semibold">{error}</p>
                <p className="mt-1 text-lg font-mono">{lockTimeRemaining}s</p>
              </div>
            ) : (
              error
            )}
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              disabled={isLocked}
              className={`h-16 text-2xl font-bold rounded-xl transition-all ${
                isLocked
                  ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                  : "bg-sky-600/20 hover:bg-sky-600/40 text-white border-2 border-sky-500/30 hover:border-sky-500/60 active:scale-95"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Bottom Row: Clear, 0, Backspace */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={handleClear}
            disabled={isLocked}
            className={`h-16 text-lg font-semibold rounded-xl transition-all ${
              isLocked
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-red-600/20 hover:bg-red-600/40 text-red-300 border-2 border-red-500/30 hover:border-red-500/60 active:scale-95"
            }`}
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick("0")}
            disabled={isLocked}
            className={`h-16 text-2xl font-bold rounded-xl transition-all ${
              isLocked
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-sky-600/20 hover:bg-sky-600/40 text-white border-2 border-sky-500/30 hover:border-sky-500/60 active:scale-95"
            }`}
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            disabled={isLocked}
            className={`h-16 text-lg font-semibold rounded-xl transition-all ${
              isLocked
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 border-2 border-yellow-500/30 hover:border-yellow-500/60 active:scale-95"
            }`}
          >
            ←
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLocked || pin.length !== 15}
          className={`w-full h-14 text-lg font-bold rounded-xl transition-all ${
            isLocked || pin.length !== 15
              ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30 active:scale-95"
          }`}
        >
          {isLocked ? "Terkunci" : pin.length !== 15 ? "Masukkan 15 Digit PIN" : "Buka Kiosk"}
        </button>

        {/* Helper Text */}
        <p className="mt-4 text-center text-gray-400 text-sm">
          Masukkan PIN 15 digit untuk keluar dari mode kiosk
        </p>
      </div>
    </div>
  );
};

export default KioskPinModal;
