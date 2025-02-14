"use client";
import React from "react";
import { motion, TargetAndTransition, Variants } from "framer-motion";

function createVariants(
  direction: string,
  startDistance: number,
  endDistance: number,
  duration: number,
  delay: number,
  type: string
) {
  const componentsVariants: Variants = {
    offscreen: {
      y: direction === "y" ? startDistance : 0,
      x: direction === "x" ? startDistance : 0,
      opacity: 0,
    },
    onscreen: {
      y: direction === "y" ? endDistance : 0,
      x: direction === "x" ? endDistance : 0,
      opacity: 1,
      transition: {
        type: type,
        bounce: 0.4,
        duration: duration,
        delay: delay,
      },
    },
  };
  return componentsVariants;
}

const VariantsComponent = ({
  children,
  direction = "y",
  startDistance = 100,
  endDistance = 0,
  className,
  duration = 2,
  delay = 0,
  whileHoverObject = undefined,
  isOnce = true,
  type = "spring",
}: {
  children: React.ReactNode;
  direction?: "x" | "y";
  startDistance?: number;
  endDistance?: number;
  className?: string;
  duration?: number;
  delay?: number;
  whileHoverObject?: TargetAndTransition;
  isOnce?: boolean;
  type?: string;
}) => {
  return (
    <motion.div
      variants={createVariants(
        direction,
        startDistance,
        endDistance,
        duration,
        delay,
        type
      )}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: isOnce, amount: "some" }}
      className={className}
      whileHover={whileHoverObject}
    >
      {children}
    </motion.div>
  );
};

export default VariantsComponent;
