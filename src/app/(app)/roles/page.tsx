// app/roles/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Role } from "@/model/role.model";
import RoleList from "./role-list";

// Mock data
const initialRoles: Role[] = [
  { id: "role-01", name: "Admin", description: "Quản trị viên hệ thống" },
  { id: "role-02", name: "Manager", description: "Quản lý cửa hàng" },
  { id: "role-03", name: "Staff", description: "Nhân viên bán hàng" },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  // Load roles từ mock
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    // TODO: Uncomment khi có API
    // const response = await RoleService.getAll();
    // setRoles(response.data);
    
    // Mock data
    setRoles(initialRoles);
  };

  // Xóa role
  const handleDelete = async (id: string) => {
    // TODO: Uncomment khi có API
    // await RoleService.delete(id);
    
    // Mock: xóa local
    setRoles(roles.filter((role) => role.id !== id));
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
        <RoleList
          roles={roles}
          onUpdate={loadRoles}
          onDelete={handleDelete}
        />
      </div>
    </motion.div>
  );
}