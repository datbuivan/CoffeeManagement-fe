// app/orders/TableSelectionView.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@/model/table.model";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export default function TableSelectionView({ tables, onSelectTable }: { 
  tables: Table[]; 
  onSelectTable: (table: Table | null) => void;
}) {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Button
            variant="outline"
            className={cn(
              "h-32 text-lg font-semibold rounded-lg flex flex-col justify-center items-center",
              "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
            )}
            onClick={() => {onSelectTable(null)}} 
        >
            <ShoppingBag className="h-8 w-8 mb-2" />
            Mang về
        </Button>

        {tables.map((table) => (
          <Button
            key={table.id}
            variant="outline"
            disabled={table.status !== "Available"}
            onClick={() => {onSelectTable(table);}}
            className={cn(
              "h-32 text-base font-semibold rounded-lg transition-all flex flex-col justify-center items-center text-center",
              table.status === "Occupied" ? "bg-red-100 text-red-800 border-red-300" 
                : table.status === "Cleaning"
                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                : "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
            )}
          >
            <span>{table.name}</span>
            <span className="text-xs font-normal mt-1 text-gray-500">({table.status})</span>
          </Button>
        ))}
      </div>
    </div>
  );
}