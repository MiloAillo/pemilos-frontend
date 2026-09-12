import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";

type CurtainTransitionProps = {
  mode: "close" | "open";
  onClosed?: () => void;
};

const FOLD_GRADIENT = `
  repeating-linear-gradient(
    90deg,
    #7f1d1d 0px,
    #991b1b 10px,
    #450a0a 20px,
    #5c1010 30px,
    #7f1d1d 40px,
    #6b1010 50px,
    #450a0a 60px,
    #851515 70px,
    #7f1d1d 80px
  )
`;

const VALANCE_STYLE = {
  height: "6vh",
  background:
    "linear-gradient(180deg, #D4AF37 0%, #C5A028 40%, #B8960F 100%)",
  boxShadow:
    "0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
  borderBottom: "1px solid rgba(184,134,11,0.4)",
  zIndex: 1,
  overflow: "hidden",
  position: "relative",
} as const;

const PANEL_STYLE_BASE = {
  backgroundImage: FOLD_GRADIENT,
  backgroundSize: "80px 100%",
  backfaceVisibility: "hidden",
  willChange: "transform, filter",
} as const;

type Sparkle = { id: number; left: string; top: string; delay: number; size: number };

function useSparkles(count: number, seed: string) {
  return useMemo<Sparkle[]>(() => {
    const rand = (i: number) => {
      const x = Math.sin(i * 999 + seed.length) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${20 + rand(i) * 60}%`,
      top: `${15 + rand(i + 50) * 40}%`,
      delay: rand(i + 100) * 0.4,
      size: 3 + rand(i + 200) * 5,
    }));
  }, [count, seed]);
}

export default function CurtainTransition({
  mode,
  onClosed,
}: CurtainTransitionProps) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<"animating" | "done">("animating");
  const hasFiredClosed = useRef(false);
  const sparkles = useSparkles(14, mode);

  useEffect(() => {
    setPhase("animating");
    hasFiredClosed.current = false;
  }, [mode]);

  useEffect(() => {
    if (phase === "done" && !hasFiredClosed.current) {
      hasFiredClosed.current = true;
      onClosed?.();
    }
  }, [phase, onClosed]);

  const DURATION = prefersReduced ? 0.01 : 0.7;

  const sharedTransition = {
    duration: DURATION,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  const exitTransition = {
    duration: DURATION,
    ease: [0.4, 0, 0.2, 1] as const,
    times: [0, 0.65, 1],
  };

  if (mode === "close") {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden>
        <div className="absolute inset-0" style={{ background: "#242633" }} />
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2"
          initial={{ x: "-110%", rotateY: -15, scaleX: 0.9 }}
          animate={{ x: "0%", rotateY: 0, scaleX: 1 }}
          transition={sharedTransition}
          onAnimationComplete={() => setPhase("done")}
          style={{
            ...PANEL_STYLE_BASE,
            boxShadow:
              "inset -8px 0 24px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.3)",
            transformOrigin: "right center",
          }}
        />
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2"
          initial={{ x: "110%", rotateY: 15, scaleX: 0.9 }}
          animate={{ x: "0%", rotateY: 0, scaleX: 1 }}
          transition={sharedTransition}
          style={{
            ...PANEL_STYLE_BASE,
            boxShadow:
              "inset 8px 0 24px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.3)",
            transformOrigin: "left center",
          }}
        />
        <motion.div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...sharedTransition, delay: DURATION * 0.5 }}
          style={{
            zIndex: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />
        <motion.div
          className="absolute top-0 left-0 right-0"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={sharedTransition}
          style={VALANCE_STYLE}
        >
          {!prefersReduced && (
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: "220%" }}
              transition={{
                duration: DURATION * 1.2,
                ease: "easeInOut",
                delay: DURATION * 0.4,
              }}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "40%",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                transform: "skewX(-20deg)",
              }}
            />
          )}
        </motion.div>
      </div>
    );
  }

  const leftExit = {
    x: ["0%", "-105%", "-100%"],
    rotateY: [0, -18, -15],
    scaleX: [1, 1.08, 1],
    filter: ["brightness(1.8)", "brightness(1.2)", "brightness(1)"],
  };

  const rightExit = {
    x: ["0%", "105%", "100%"],
    rotateY: [0, 18, 15],
    scaleX: [1, 1.08, 1],
    filter: ["brightness(1.8)", "brightness(1.2)", "brightness(1)"],
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{ background: "#242633" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={sharedTransition}
      />

      <AnimatePresence>
        {phase === "done" && !prefersReduced && (
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {sparkles.map((s) => (
              <motion.span
                key={s.id}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.6], y: 24 }}
                transition={{
                  duration: 0.9,
                  delay: s.delay,
                  ease: "easeOut",
                }}
                style={{
                  position: "absolute",
                  left: s.left,
                  top: s.top,
                  width: s.size,
                  height: s.size,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #fff9d6 0%, #D4AF37 60%, transparent 100%)",
                  boxShadow: "0 0 6px 2px rgba(212,175,55,0.6)",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        initial={{ x: "0%", rotateY: 0, scaleX: 1, filter: "brightness(1.8)" }}
        animate={leftExit}
        transition={exitTransition}
        onAnimationComplete={() => setPhase("done")}
        style={{
          ...PANEL_STYLE_BASE,
          boxShadow:
            "inset -8px 0 24px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.3)",
          transformOrigin: "right center",
        }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        initial={{ x: "0%", rotateY: 0, scaleX: 1, filter: "brightness(1.8)" }}
        animate={rightExit}
        transition={exitTransition}
        style={{
          ...PANEL_STYLE_BASE,
          boxShadow:
            "inset 8px 0 24px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.3)",
          transformOrigin: "left center",
        }}
      />
      <motion.div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{
          zIndex: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
        }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: "-100%", opacity: 0 }}
        transition={sharedTransition}
        style={VALANCE_STYLE}
      />
    </div>
  );
}