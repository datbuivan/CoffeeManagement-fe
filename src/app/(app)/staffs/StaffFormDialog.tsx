"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Staff, StaffFormData } from "./staff.model";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";

const staffFormSchema = z.object({
  name: z.string().min(1, { message: "Tên không được để trống." }),
  email: z.string().email({ message: "Địa chỉ email không hợp lệ." }),
  role: z.enum(["Quản lý", "Nhân viên", "Pha chế", "Thu ngân"]),
  gender: z.enum(["Nam", "Nữ", "Khác"]),
  birthDate: z.date().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  idCardNumber: z.string().optional(),
  workShift: z.string().optional(),
  idCardIssueDate: z.date().optional(),
});

interface StaffFormDialogProps {
  mode: 'add' | 'edit';
  initialData?: Staff;
  onSave: (data: StaffFormData & { id?: string }) => Promise<void>;
  children: React.ReactNode;
}

export function StaffFormDialog({ mode, initialData, onSave, children }: StaffFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = ["Quản lý", "Nhân viên", "Pha chế", "Thu ngân"];
  const genders = ["Nam", "Nữ", "Khác"];

  const form = useForm({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Nhân viên",
      gender: "Nam",
      avatarUrl: "",
      idCardNumber: "",
      workShift: "",
      birthDate: undefined,
      idCardIssueDate: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        form.reset({
          ...initialData,
          birthDate: initialData.birthDate ? new Date(initialData.birthDate) : undefined,
          idCardIssueDate: initialData.idCardIssueDate ? new Date(initialData.idCardIssueDate) : undefined,
        });
      } else {
        form.reset({
          name: "",
          email: "",
          role: "Nhân viên",
          gender: "Nam",
          avatarUrl: "",
          idCardNumber: "",
          workShift: "",
          birthDate: undefined,
          idCardIssueDate: undefined,
        });
      }
    }
  }, [isOpen, initialData, mode, form]);

  async function onSubmit(values: StaffFormData) {
    const promise = onSave({
      id: initialData?.id,
      ...values,
    });

    toast.promise(promise, {
      loading: 'Đang lưu...',
      success: () => {
        setIsOpen(false);
        return 'Đã lưu thông tin thành công!';
      },
      error: 'Đã xảy ra lỗi khi lưu.',
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Thêm nhân sự mới' : 'Chỉnh sửa thông tin'}</DialogTitle>
          <DialogDescription>
            Điền các thông tin chi tiết cho nhân sự.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bên trái: Các trường input */}
              <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và Tên</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Chức vụ</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} >
                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Giới tính</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {genders.map((gender) => (
                            <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="birthDate" render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""} 
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="idCardNumber" render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Số CMND</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="idCardIssueDate" render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Ngày cấp</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""} 
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="workShift" render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Ca làm việc</FormLabel>
                      <FormControl><Input {...field} placeholder="Ví dụ: Sáng, Chiều, Tối" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
              
              {/* Bên phải: Ảnh đại diện */}
              <div className="flex flex-col items-center justify-start">
                <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                    <FormItem className="w-full max-w-xs">
                    <FormLabel>Ảnh đại diện</FormLabel>
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
                                const url = URL.createObjectURL(e.target.files[0])
                                field.onChange(url)
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
            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Hủy</Button>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}