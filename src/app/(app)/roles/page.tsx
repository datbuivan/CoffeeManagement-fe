// app/roles/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Role } from "@/model/role.model";
import RoleList from "./role-list";
import { roleService } from "@/services/role.service";


export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);

  // Load roles từ mock
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    
    const response = await roleService.getAll();
    if(response.statusCode === 200 && response.data){
      setRoles(response.data);
    }
    else{
      console.error("Lỗi khi tải quyền:", response.message);
    }
    
  };

  const handleDelete = async (id: string) => {
    try{
      const res = await roleService.deleteById(id);
        if(res.statusCode === 200){
          setRoles((role) => role.filter(r => r.id !== id))
        }
        else{
        alert(res.message ?? "Không thể xóa quyền");
        }
    }
    catch(error){
      console.error("Error deleting role:", error);
      alert("Có lỗi xảy ra khi xóa quyền!");
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
        <RoleList
          roles={roles}
          onUpdate={loadRoles}
          onDelete={handleDelete}
        />
      </div>
    </motion.div>
  );
}