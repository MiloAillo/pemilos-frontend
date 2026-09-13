import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import OrchestraBg from "@/assets/Orchestra.webp";

interface ParallaxBackgroundProps {
  children?: ReactNode;
  className?: string;
  src?: string;
  alt?: string;
  speed?: number;
}

const ParallaxBackground = ({
  children,
  className = "",
  src = OrchestraBg,
  alt = "Background",
  speed = 0.1,
}: ParallaxBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${(speed * 100) - 20}%`, `${(-speed * 100) - 20}%`]
  );

  return (
    <div ref={ref} className={`fixed top-0 left-0 overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        draggable={false}
        className="pointer-events-none h-[200vh] object-center sepia"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          objectFit: "cover",
          y,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none bg-amber-950/70"
        // style={{ backgroundColor: "rgba(78, 42, 10, 0.7)" }}
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};

export default ParallaxBackground;
