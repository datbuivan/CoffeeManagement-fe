"use client";

import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] overflow-hidden relative">
      {/* Pháo hoa dạng vòng tròn (motion) */}
      <motion.div
        className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-red-500"
        animate={{ y: ["-100%", "100%"], x: ["-50%", "50%"], scale: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-0 left-1/3 w-2 h-2 rounded-full bg-yellow-400"
        animate={{ y: ["-100%", "100%"], x: ["0%", "100%"], scale: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-0 left-2/3 w-2 h-2 rounded-full bg-blue-400"
        animate={{ y: ["-100%", "100%"], x: ["0%", "-50%"], scale: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center p-8 bg-white/80 rounded-3xl shadow-xl backdrop-blur-md"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <XCircle className="mx-auto h-24 w-24 text-red-600" />
        </motion.div>

        <motion.h1
          className="mt-4 text-8xl font-extrabold text-[#6B4E31]"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
        >
          403
        </motion.h1>

        <motion.p
          className="mt-4 text-2xl text-[#6B4E31]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Bạn không có quyền truy cập trang này
        </motion.p>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 120 }}
        >
        </motion.div>
      </motion.div>
    </div>
  );
}
