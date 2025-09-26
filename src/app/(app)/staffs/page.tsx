"use client"

import { useState, useMemo } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Staff, StaffFormData, StaffRole } from "./staff.model";
import { StaffFormDialog } from "./StaffFormDialog";

// Dữ liệu mẫu
export const mockStaff: Staff[] = [
  { id: "STAFF001", name: "Nguyễn Văn An", email: "an.nguyen@example.com", gender: "Nam", role: "Quản lý", status: "Đang hoạt động", createdAt: new Date(), updatedAt: new Date() },
  { id: "STAFF002", name: "Trần Thị Bích", email: "bich.tran@example.com", gender: "Nữ", role: "Nhân viên", status: "Đang hoạt động", createdAt: new Date(), updatedAt: new Date() },
];

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>(mockStaff);
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | StaffRole>("all");

  const handleSaveStaff = async (data: StaffFormData & { id?: string }) => {
    await new Promise(res => setTimeout(res, 500)); // Giả lập gọi API

    if (data.id) { // Chế độ sửa
      setStaffList(staffList.map(s => (s.id === data.id ? { ...s, ...data } : s)));
    } else { // Chế độ thêm
      const newStaff: Staff = {
        ...data,
        id: `STAFF${Date.now()}`,
        status: "Đang hoạt động",
        createdAt: new Date(), // Thêm các trường còn thiếu
        updatedAt: new Date(),
      };
      setStaffList([...staffList, newStaff]);
    }
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffList(staffList.filter(s => s.id !== staffId));
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter(staff =>
      staff.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (roleFilter === 'all' || staff.role === roleFilter)
    );
  }, [staffList, nameFilter, roleFilter]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Nhân sự</h1>
        <StaffFormDialog mode="add" onSave={handleSaveStaff}>
          <Button><PlusCircle className="mr-2 h-4 w-4" />Thêm nhân sự</Button>
        </StaffFormDialog>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Input placeholder="Tìm kiếm theo tên..." value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="max-w-sm" />
        <Select value={roleFilter} onValueChange={(value: "all" | StaffRole) => setRoleFilter(value)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Lọc theo chức vụ" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chức vụ</SelectItem>
            <SelectItem value="Quản lý">Quản lý</SelectItem>
            <SelectItem value="Nhân viên">Nhân viên</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã NS</TableHead>
              <TableHead>Họ và Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Chức vụ</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <StaffFormDialog mode="edit" initialData={staff} onSave={handleSaveStaff}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Sửa</DropdownMenuItem>
                        </StaffFormDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>Xóa</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                              <AlertDialogDescription>Hành động này sẽ xóa vĩnh viễn nhân sự &quot;{staff.name}&quot;.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteStaff(staff.id)} className="bg-red-500 hover:bg-red-600">Xóa</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">Không có nhân sự nào phù hợp.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}