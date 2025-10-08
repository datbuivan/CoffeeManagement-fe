// app/users/user-form.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { User } from "@/model/user.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  userName: z.string().min(1, "Tên đăng nhập không được để trống"),
  fullName: z.string().min(1, "Tên đầy đủ không được để trống"),
  employeeCode: z.string().min(1, "Mã nhân viên không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  roleNames: z.array(z.string()).optional(),
  avatarUrl: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  availableRoles: string[];
  onSuccess: () => void;
}

export default function UserForm({
  isOpen,
  onClose,
  user,
  availableRoles,
  onSuccess,
}: UserFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      fullName: "",
      employeeCode: "",
      password: "",
      email: "",
      phoneNumber: "",
      roleNames: [],
      avatarUrl: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  // Reset form khi mở/đóng hoặc user thay đổi
  useEffect(() => {
    if (isOpen) {
      if (user) {
        form.reset({
          userName: user.userName,
          fullName: user.fullName,
          employeeCode: user.employeeCode,
          password: "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          roleNames: user.roles,
          avatarUrl: "", // Avatar sẽ được handle riêng nếu cần
        });
      } else {
        form.reset({
          userName: "",
          fullName: "",
          employeeCode: "",
          password: "",
          email: "",
          phoneNumber: "",
          roleNames: [],
          avatarUrl: "",
        });
      }
    }
  }, [isOpen, user, form]);

  // Submit form
  const onSubmit = async (values: FormData) => {
    setIsLoading(true);

    try {
      // TODO: Gọi API ở đây
      // if (user) {
      //   await UserService.update(user.id, values);
      // } else {
      //   await UserService.create(values);
      // }

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Save user:", {
        id: user?.id,
        ...values,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Có lỗi xảy ra khi lưu nhân viên!");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for form
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: easeOut }
    },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[700px] sm:w-[900px] max-w-none sm:max-w-none">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <SheetHeader className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] rounded-t-lg p-6">
            <SheetTitle className="text-2xl font-bold text-[#6B4E31]">
              {user ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
            </SheetTitle>
            <SheetDescription className="text-[#6B4E31]/80">
              {user
                ? "Cập nhật thông tin nhân viên"
                : "Tạo nhân viên mới cho cửa hàng"}
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6 px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bên trái: Các trường thông tin - Grid 2 cột trên lg */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!user && (
                      <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel className="text-[#6B4E31] font-medium">
                              Tên đăng nhập <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên đăng nhập"
                                {...field}
                                className="border-[#D2B48C] focus:border-[#6B4E31]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className={!user ? "md:col-span-1" : "md:col-span-2"}>
                          <FormLabel className="text-[#6B4E31] font-medium">
                            Tên đầy đủ <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên đầy đủ"
                              {...field}
                              className="border-[#D2B48C] focus:border-[#6B4E31]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="employeeCode"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel className="text-[#6B4E31] font-medium">
                            Mã nhân viên <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập mã nhân viên"
                              {...field}
                              className="border-[#D2B48C] focus:border-[#6B4E31]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                        control={form.control}
                        name="roleNames"
                        render={({ field }) => (
                        <FormItem className="!w-full md:col-span-1"> {/* !w-full override bất kỳ w-fit nào */}
                            <FormLabel className="text-[#6B4E31] font-medium">Vai trò</FormLabel>
                            <FormControl>
                            <Select
                                onValueChange={(value) => field.onChange([value])}
                                defaultValue={field.value?.[0] || ""}
                            >
                                <SelectTrigger className="border-[#D2B48C] focus:border-[#6B4E31] w-full">
                                <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                {availableRoles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                    {role}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel className="text-[#6B4E31] font-medium">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Nhập email"
                              {...field}
                              className="border-[#D2B48C] focus:border-[#6B4E31]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel className="text-[#6B4E31] font-medium">Số điện thoại</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập số điện thoại"
                              {...field}
                              className="border-[#D2B48C] focus:border-[#6B4E31]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!user && (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel className="text-[#6B4E31] font-medium">
                              Mật khẩu <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                {...field}
                                className="border-[#D2B48C] focus:border-[#6B4E31]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                </div>
                </div>

                {/* Bên phải: Ảnh đại diện */}
                <div className="flex flex-col items-center justify-start lg:col-span-1">
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="w-full max-w-xs">
                        <FormLabel className="text-[#6B4E31] font-medium">Ảnh đại diện</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                              {/* Avatar */}
                              <Image
                                src={field.value || "/default-avatar.jpg"}
                                alt="avatar"
                                width={192}
                                height={192}
                                className="h-48 w-48 rounded-full object-cover border border-gray-300"
                              />
                             
                              {/* Nút chọn ảnh (overlay trên avatar) */}
                              <Label
                                htmlFor="avatarInput"
                                className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow cursor-pointer hover:bg-gray-100"
                              >
                                <Upload className="h-4 w-4" />
                              </Label>

                              {/* Input file ẩn */}
                              <input
                                id="avatarInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    const url = URL.createObjectURL(e.target.files[0]);
                                    field.onChange(url);
                                  }
                                }}
                              />
                            </div>

                            {/* Nút xoá ảnh */}
                            {field.value && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => field.onChange("")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}

                            <p className="text-xs text-gray-500">
                              Chọn các ảnh có định dạng (jpg, jpeg, png, gif)
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <SheetFooter className="flex flex-row justify-end gap-2 pt-6 border-t border-[#D2B48C]/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="border-[#D2B48C] text-[#6B4E31] hover:bg-[#EED6B3]/50"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31] font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">⏳</span>
                      {user ? "Đang cập nhật..." : "Đang thêm..."}
                    </>
                  ) : (
                    <>{user ? "Cập nhật" : "Thêm mới"}</>
                  )}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}