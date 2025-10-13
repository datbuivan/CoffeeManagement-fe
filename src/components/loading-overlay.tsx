"use client";

import { motion, AnimatePresence } from "framer-motion";
import ModifiedClassicLoader from "./mvpblocks/modified-classic-loader";
import { useLoadingStore } from "@/store/loading.store";

export default function LoadingOverlay() {
  const isLoading = useLoadingStore((s) => s.isLoading);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
        >
          <ModifiedClassicLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
