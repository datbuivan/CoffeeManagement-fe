"use client";

import { useRouter } from "next/navigation";
import { motion, easeOut } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const buttonVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <motion.div
      className="flex items-center justify-center h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="max-w-md w-full shadow-lg border-0">
          <CardHeader className="text-center">
            <motion.div variants={iconVariants}>
              <XCircle className="text-red-500 w-16 h-16 mx-auto mb-2" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Thanh toán thất bại 😞
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <motion.div variants={itemVariants}>
              <Alert variant="destructive">
                <AlertTitle>Giao dịch không thành công</AlertTitle>
              </Alert>
            </motion.div>

            <motion.div
              className="flex justify-center space-x-4"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <motion.div variants={buttonVariants}>
                <Button onClick={() => router.push("/cart")} className="bg-blue-600 hover:bg-blue-700">
                  Thử thanh toán lại
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants}>
                <Button variant="outline" onClick={() => router.push("/")}>
                  Quay lại trang chủ
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}