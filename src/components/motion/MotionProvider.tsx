"use client";

import { MotionConfig } from "framer-motion";

/** Turns animations off for visitors who ask their device for reduced motion. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
