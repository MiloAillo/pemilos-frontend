import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

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
} as const;

export default function CurtainTransition({
  mode,
  onClosed,
}: CurtainTransitionProps) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<"animating" | "done">("animating");
  const hasFiredClosed = useRef(false);

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

  if (mode === "close") {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{ background: "#242633" }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2"
          initial={{ x: "-110%", rotateY: -15, scaleX: 0.9 }}
          animate={{ x: "0%", rotateY: 0, scaleX: 1 }}
          transition={sharedTransition}
          onAnimationComplete={() => setPhase("done")}
          style={{
            backgroundImage: FOLD_GRADIENT,
            backgroundSize: "80px 100%",
            boxShadow:
              "inset -8px 0 24px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.3)",
            transformOrigin: "right center",
            backfaceVisibility: "hidden",
          }}
        />
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2"
          initial={{ x: "110%", rotateY: 15, scaleX: 0.9 }}
          animate={{ x: "0%", rotateY: 0, scaleX: 1 }}
          transition={sharedTransition}
          style={{
            backgroundImage: FOLD_GRADIENT,
            backgroundSize: "80px 100%",
            boxShadow:
              "inset 8px 0 24px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.3)",
            transformOrigin: "left center",
            backfaceVisibility: "hidden",
          }}
        />
        <motion.div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...sharedTransition, delay: DURATION * 0.5 }}
          style={{
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
        />
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
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        initial={{ x: "0%", rotateY: 0, scaleX: 1, filter: "brightness(1.8)" }}
        animate={leftExit}
        transition={{
          duration: DURATION,
          ease: [0.4, 0, 0.2, 1],
          times: [0, 0.65, 1],
        }}
        onAnimationComplete={() => setPhase("done")}
        style={{
          backgroundImage: FOLD_GRADIENT,
          backgroundSize: "80px 100%",
          boxShadow:
            "inset -8px 0 24px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.3)",
          transformOrigin: "right center",
          backfaceVisibility: "hidden",
        }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        initial={{ x: "0%", rotateY: 0, scaleX: 1, filter: "brightness(1.8)" }}
        animate={rightExit}
        transition={{
          duration: DURATION,
          ease: [0.4, 0, 0.2, 1],
          times: [0, 0.65, 1],
        }}
        style={{
          backgroundImage: FOLD_GRADIENT,
          backgroundSize: "80px 100%",
          boxShadow:
            "inset 8px 0 24px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.3)",
          transformOrigin: "left center",
          backfaceVisibility: "hidden",
        }}
      />
      <motion.div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          zIndex: 1,
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
