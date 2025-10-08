// src/model/table.model.ts (tạo file mới)

export interface Table {
  id: string;
  name: string;
  status: "Available" | "Occupied" | "Cleaning";
}
