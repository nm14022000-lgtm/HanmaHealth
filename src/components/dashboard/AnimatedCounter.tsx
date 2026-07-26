import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({ value, duration = 0.8, className, suffix = "", decimals = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(prevValue.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        node.textContent = latest.toFixed(decimals) + suffix;
      },
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value, duration, suffix, decimals]);

  return <span ref={ref} className={className}>0{suffix}</span>;
}
