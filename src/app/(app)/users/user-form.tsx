"use client";

import { useEffect, useState } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User } from "@/model/user.model";
import { Loader2, Upload, X } from "lucide-react";
import { userService } from "@/services/user.service";


interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  roles: string[];
  onSuccess: () => void;
}

export default function UserForm({
  isOpen,
  onClose,
  user,
  roles,
  onSuccess,
}: UserFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    employeeCode: "",
    password: "",
    roleName: "",
    isActive: true,
  });

  // Reset form khi mở
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          userName: user.userName || "",
          fullName: user.fullName,
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          employeeCode: user.employeeCode || "",
          password: "",
          roleName: user.roleName || "",
          isActive: user.isActive ?? true
        });
        setImagePreview(user.avatarUrl || null);
        setImageFile(null);
      } else {
        setFormData({
          userName: "",
          fullName: "",
          email: "",
          phoneNumber: "",
          employeeCode: "",
          password: "",
          roleName: "",
          isActive: true,
        });
        setImagePreview(null);
        setImageFile(null);
      }
      setErrors({});
    }
  }, [isOpen, user]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Họ tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "Tên đăng nhập không được để trống";
    } else if (formData.userName.length < 2) {
      newErrors.userName = "Tên đăng nhập phải có ít nhất 2 ký tự";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Mã nhân viên
    if (formData.employeeCode && formData.employeeCode.length > 10) {
      newErrors.employeeCode = "Mã nhân viên tối đa 10 ký tự";
    }

    // Password (chỉ khi tạo mới)
    if (!user) {
      if (!formData.password.trim()) {
        newErrors.password = "Mật khẩu không được để trống";
      } else if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }
    }

    // Avatar validation
    if (imageFile) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(imageFile.type)) {
        newErrors.avatarUrl = "Ảnh chỉ được định dạng JPG, JPEG, PNG hoặc GIF";
      } else if (imageFile.size > 5 * 1024 * 1024) {
        newErrors.avatarUrl = "Ảnh không được vượt quá 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Chọn avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Xóa lỗi avatar nếu có
      if (errors.avatarUrl) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.avatarUrl;
          return newErrors;
        });
      }
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Xóa lỗi khi user sửa
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const clearAvatar = () => {
    setImageFile(null);
    setImagePreview(null);
    handleChange("avatarUrl", null);
    const fileInput = document.getElementById('avatarUrl') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };


  // Gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("userName", formData.userName);
      submitData.append("fullName", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("employeeCode", formData.employeeCode);
      if (!user && formData.password) submitData.append("password", formData.password);
      if (user ) submitData.append("isActive", formData.isActive.toString());
      if (formData.roleName) submitData.append("roleName", formData.roleName);
      if (imageFile) submitData.append("avatarUrl", imageFile);

      
      if (user) {
        const res = await userService.update(user.id, submitData);
        if(res.statusCode === 201 && res.data)
          toast.success("Cập nhật người dùng thành công!");
      } else {
        const res = await userService.create(submitData);
        if(res.statusCode ===200 && res.data)
          toast.success("Thêm người dùng thành công!");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi lưu người dùng!");
    }
    finally {
      setIsSubmitting(false);
    }
  };

  // Animation
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: easeOut } },
  };

return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[700px] sm:w-[900px] max-w-none sm:max-w-none flex flex-col h-full">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto"
        >
          <SheetHeader className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] rounded-t-lg p-6">
            <SheetTitle className="text-2xl font-bold text-[#6B4E31]">
              {user ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
            </SheetTitle>
            <SheetDescription className="text-[#6B4E31]/80">
              {user
                ? "Cập nhật thông tin người dùng trong hệ thống."
                : "Tạo tài khoản mới cho nhân viên hoặc quản trị viên."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cột trái: thông tin người dùng */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Họ tên */}
                  <div>
                    <Label htmlFor="fullName" className="text-[#6B4E31] font-medium">
                      Họ tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Nhập họ tên"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="border-[#D2B48C] focus:border-[#6B4E31] mt-1"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-[#6B4E31] font-medium">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      autoComplete="off"
                      className="border-[#D2B48C] focus:border-[#6B4E31] mt-1"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <Label htmlFor="userName" className="text-[#6B4E31] font-medium">
                      Tên đăng nhập
                    </Label>
                    <Input
                      id="userName"
                      placeholder="Nhập tên đăng nhập"
                      value={formData.userName}
                      onChange={(e) => handleChange("userName", e.target.value)}
                      className="border-[#D2B48C] focus:border-[#6B4E31] mt-1"
                    />
                    {errors.userName && (
                      <p className="text-sm text-red-500 mt-1">{errors.userName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-[#6B4E31] font-medium">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Nhập số điện thoại"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      className="border-[#D2B48C] focus:border-[#6B4E31] mt-1"
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                {/* Mã nhân viên */}
                <div>
                  <Label htmlFor="employeeCode" className="text-[#6B4E31] font-medium">
                    Mã nhân viên
                  </Label>
                  <Input
                    id="employeeCode"
                    placeholder="VD: NV001"
                    value={formData.employeeCode}
                    onChange={(e) => handleChange("employeeCode", e.target.value)}
                    className="border-[#D2B48C] focus:border-[#6B4E31] mt-1"
                  />
                  {errors.employeeCode && (
                    <p className="text-sm text-red-500 mt-1">{errors.employeeCode}</p>
                  )}
                </div>

                {/* Password */}
                {!user && (
                  <div>
                    <Label htmlFor="password" className="text-[#6B4E31] font-medium">
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      autoComplete="new-password"
                      className="border-[#D2B48C] focus:border-[#6B4E31] mt-1"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                    )}
                  </div>
                )}

                {/* Role */}
                <div>
                  <Label htmlFor="roleName" className="text-[#6B4E31] font-medium">
                    Vai trò
                  </Label>
                  <Select
                    value={formData.roleName}
                    onValueChange={(value) => handleChange("roleName", value)}
                  >
                    <SelectTrigger className="border-[#D2B48C] focus:border-[#6B4E31] w-full mt-1">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.roleName && (
                    <p className="text-sm text-red-500 mt-1">{errors.roleName}</p>
                  )}
                </div>

                {/* Trạng thái */}
                <div className="flex items-center justify-between border-t border-[#D2B48C]/30 pt-4 mt-4">
                  <Label htmlFor="isActive" className="text-[#6B4E31] font-medium">
                    Kích hoạt
                  </Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange("isActive", checked)}
                  />
                </div>
              </div>

              {/* Cột phải: Avatar */}
              <div className="flex flex-col items-center justify-start lg:col-span-1">
                <div className="w-full max-w-xs">
                  <Label className="text-[#6B4E31] font-medium">Ảnh đại diện</Label>
                  <div className="flex flex-col items-center gap-3 mt-2">
                    <div className="relative">
                      {/* Avatar */}
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="avatar"
                          className="h-48 w-48 rounded-full object-cover border-4 border-[#D2B48C]"
                        />
                      ) : (
                        <div className="h-48 w-48 rounded-full bg-[#F5F5DC] border-4 border-[#D2B48C] flex items-center justify-center">
                          <Upload className="h-12 w-12 text-[#D2B48C]" />
                        </div>
                      )}

                      {/* Nút chọn ảnh */}
                      <Label
                        htmlFor="avatarUrl"
                        className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#6B4E31] bg-white shadow-lg cursor-pointer hover:bg-[#F5F5DC] transition-colors"
                      >
                        <Upload className="h-5 w-5 text-[#6B4E31]" />
                      </Label>

                      {/* Input file ẩn */}
                      <input
                        id="avatarUrl"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>

                    {/* Nút xoá ảnh */}
                    {imagePreview  && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearAvatar}
                        className="border-[#D2B48C] hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Xóa ảnh
                      </Button>
                    )}

                    <p className="text-xs text-center text-gray-500">
                      JPG, JPEG, PNG, GIF (tối đa 5MB)
                    </p>

                    {errors.avatarUrl && (
                      <p className="text-sm text-red-500 text-center">
                        {errors.avatarUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <SheetFooter className="flex flex-row justify-end gap-2 mt-auto pt-6 border-t border-[#D2B48C]/20">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#D2B48C] hover:bg-[#C19A6B] text-[#6B4E31] font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : user ? (
                  "Cập nhật"
                ) : (
                  "Thêm mới"
                )}
              </Button>
            </SheetFooter>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
