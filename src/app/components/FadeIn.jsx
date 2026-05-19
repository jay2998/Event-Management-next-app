"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FadeIn({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const directionVariants = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: -40 },
    right: { x: 40 },
  };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionVariants[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
