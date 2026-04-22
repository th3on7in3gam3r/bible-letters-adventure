import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  hoverScale?: number;
  tapScale?: number;
  hoverRotate?: number;
}

export default function AnimatedButton({
  children,
  hoverScale = 1.03,
  tapScale = 0.97,
  hoverRotate = 0,
  className,
  ...buttonProps
}: AnimatedButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={reducedMotion ? undefined : { scale: hoverScale, rotate: hoverRotate }}
      whileTap={reducedMotion ? undefined : { scale: tapScale }}
      className={className}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}
