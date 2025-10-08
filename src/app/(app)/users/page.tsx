// app/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "@/model/user.model";
import UserList from "./user-list";

// Mock data
const initialUsers: User[] = [
  { id: "user-01", userName: "admin", fullName: "Quản Trị Viên", employeeCode: "EMP001", email: "admin@coffee.com", phoneNumber: "0123456789", roles: ["Admin"] },
  { id: "user-02", userName: "staff1", fullName: "Nhân Viên 1", employeeCode: "EMP002", email: "staff1@coffee.com", phoneNumber: "0987654321", roles: ["Staff"] },
  { id: "user-03", userName: "manager", fullName: "Quản Lý", employeeCode: "EMP003", phoneNumber: "0111222333", roles: ["Manager"] },
  { id: "user-04", userName: "staff2", fullName: "Nhân Viên 2", employeeCode: "EMP004", roles: ["Staff"] },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Load users từ mock
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // TODO: Uncomment khi có API
    // const response = await UserService.getAll();
    // setUsers(response.data);
    
    // Mock data
    setUsers(initialUsers);
  };

  // Xóa user
  const handleDelete = async (id: string) => {
    // TODO: Uncomment khi có API
    // await UserService.delete(id);
    
    // Mock: xóa local
    setUsers(users.filter((user) => user.id !== id));
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
          onUpdate={loadUsers}
          onDelete={handleDelete}
        />
      </div>
    </motion.div>
  );
}