"use client"

import { useState, useMemo } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { Staff, StaffFormData, StaffStatus } from "../../../model/staff.model";
import { StaffFormDialog } from "./StaffFormDialog";
import { Role } from "@/model/role.model"; 

export type RoleFilter = "all" | string; 

const mockRoles: Role[] = [
    { id: "1", name: "Quản lý", description: "Quản lý chung", createdAt: new Date(), updatedAt: new Date() },
    { id: "2", name: "Nhân viên", description: "Pha chế và phục vụ", createdAt: new Date(), updatedAt: new Date() },
    { id: "3", name: "Phục vụ", description: "Chỉ phục vụ", createdAt: new Date(), updatedAt: new Date() },
];

export const mockStaff: Staff[] = [
    { id: "STAFF001", name: "Nguyễn Văn An", email: "an.nguyen@example.com", gender: "Nam", role: mockRoles[0], roleId: "1", status: "Đang hoạt động" as StaffStatus, createdAt: new Date(), updatedAt: new Date() },
    { id: "STAFF002", name: "Trần Thị Bích", email: "bich.tran@example.com", gender: "Nữ", role: mockRoles[1], roleId: "2", status: "Đang hoạt động" as StaffStatus, createdAt: new Date(), updatedAt: new Date() },
];

export default function StaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>(mockStaff);
    const [nameFilter, setNameFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all"); 


    const handleSaveStaff = async (data: StaffFormData & { id?: string }) => {
        await new Promise(res => setTimeout(res, 500)); // Giả lập gọi API

        const newRole = mockRoles.find(r => r.id === data.roleId) || mockRoles[1]; 
        
        const staffData = data as Partial<Staff>;

        if (staffData.id) { 
            setStaffList(staffList.map(s => (s.id === staffData.id ? { ...s, ...staffData, role: newRole, updatedAt: new Date() } as Staff : s)));
        } else { 
            const newStaff: Staff = {
                ...staffData,
                id: `STAFF${Date.now()}`,
                status: "Đang hoạt động" as StaffStatus,
                role: newRole, 
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Staff;
            setStaffList([...staffList, newStaff]);
        }
    };

    const handleDeleteStaff = (staffId: string) => {
        setStaffList(staffList.filter(s => s.id !== staffId));
    };

    const filteredStaff = useMemo(() => {
        return staffList.filter(staff =>
            staff.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
            (roleFilter === 'all' || staff.role.name === roleFilter)
        );
    }, [staffList, nameFilter, roleFilter]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý Nhân sự</h1>
                {/* Giả định StaffFormDialog được truyền Role data cho dropdown */}
                <StaffFormDialog mode="add" onSave={handleSaveStaff} allRoles={mockRoles}> 
                    <Button><PlusCircle className="mr-2 h-4 w-4" />Thêm nhân sự</Button>
                </StaffFormDialog>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Tìm kiếm theo tên..." value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="max-w-sm" />
                {/* Sửa lỗi type: onValueChange nhận RoleFilter (string name) */}
                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleFilter)}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Lọc theo chức vụ" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả chức vụ</SelectItem>
                        {/* Lặp qua danh sách Role Name */}
                        {mockRoles.map(role => (
                            <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                        ))}
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
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStaff.length > 0 ? (
                            filteredStaff.map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell className="font-medium">{staff.id}</TableCell>
                                    <TableCell>{staff.name}</TableCell>
                                    <TableCell>{staff.email}</TableCell>
                                    {/* Sửa lỗi hiển thị: Truy cập staff.role.name */}
                                    <TableCell>{staff.role.name}</TableCell> 
                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${staff.status === 'Đang hoạt động' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {staff.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                <StaffFormDialog mode="edit" initialData={staff} onSave={handleSaveStaff} allRoles={mockRoles}>
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
                                <TableCell colSpan={6} className="h-24 text-center">Không có nhân sự nào phù hợp.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}