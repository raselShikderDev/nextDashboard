import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1 overflow-auto p-6"
    >
      {children}
    </motion.div>
  );
}
