"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { motion } from "framer-motion";
import { Coffee, Loader2 } from "lucide-react";
import { useState } from "react";

const schema = z.object({
  userName: z.string().min(1, "Tên đăng nhập là bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
   const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { userName: "", password: "" },
  });

  const onSubmit = async (values: FormData) => {
    if (isSubmitting) return; 
    try {
      setIsSubmitting(true);
      await login(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT: Background gradient + brand */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 px-10"
        >
          <Coffee size={60} className="mx-auto drop-shadow-lg" />
          <h1 className="text-4xl font-bold drop-shadow-md">Coffee Management</h1>
          <p className="text-lg opacity-90">
            Quản lý quán cà phê dễ dàng, nhanh chóng và thông minh.
          </p>
        </motion.div>
      </div>

      {/* RIGHT: Form đăng nhập */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8"
        >
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
            Đăng nhập tài khoản
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập tên đăng nhập"
                        className="focus:ring-2 focus:ring-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Nhập mật khẩu"
                        className="focus:ring-2 focus:ring-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Quên mật khẩu?{" "}
            <a
              href="#"
              className="text-amber-600 hover:underline font-medium"
            >
              Khôi phục
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
