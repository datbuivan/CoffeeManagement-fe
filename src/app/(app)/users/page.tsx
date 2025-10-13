// app/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "@/model/user.model";
import UserList from "./user-list";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { roleService } from "@/services/role.service";


export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    loadData ();
  }, []);

  const loadData  = async () => {
    try{
    setLoading(true);
      const userRes = await userService.getAll();

      if (userRes.statusCode === 200 && userRes.data) {
        const userIds = userRes.data.map((user: User) => user.id);

        const rolesRes = await roleService.getRolesByUserIds(userIds);

         const rolesMap = rolesRes.statusCode === 200 && rolesRes.data 
          ? rolesRes.data 
          : {};

        const updatedUsers = userRes.data.map((user: User) => {
          const userRoles = rolesMap[user.id] || [];
          const roleName = userRoles.length > 0 ? userRoles.join(", ") : "";
          
          return { ...user, roleName };
        });

        setUsers(updatedUsers);
      } else {
        toast.error("Không thể tải danh sách người dùng!");
      }
    }catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải dữ liệu!");
    } finally {
      toast.dismiss(); // ẩn toast loading
      setLoading(false);
    }
    
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteById(id);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("Xóa người dùng thành công!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Lỗi khi xóa người dùng!");
    }
  };

  // Animation variants for page
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="pt-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <UserList
          users={users}
          onUpdate={loadData}
          onDelete={handleDelete}
        />
      </div>
    </motion.div>
  );
}