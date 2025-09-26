// app/checkout/InvoicePanel.tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CartItem } from "../orders/page";

interface InvoicePanelProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
}

export function InvoicePanel({ items, subtotal, discount }: InvoicePanelProps) {
  const finalTotal = subtotal - discount;

  return (
    // Bỏ rounded-lg shadow-sm
    <div className="bg-white/80 p-0 rounded-md overflow-hidden flex flex-col h-full">
      {/* Header hóa đơn giống hình */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="font-bold">HĐ 000.001 / 1.1 - Bàn 012/Tầng 1</div>
        <div className="text-sm text-gray-600">30/11/2021 8:30 AM</div>
      </div>
      
      {/* Thêm div để chứa bảng và cho phép cuộn */}
      <div className="flex-grow overflow-y-auto scroll-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="w-[45%] text-left font-bold py-3">Tên món</TableHead>
              <TableHead className="w-[20%] text-center font-bold py-3">Số lượng</TableHead>
              <TableHead className="w-[35%] text-right font-bold py-3">Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium py-3">{item.name}</TableCell>
                <TableCell className="text-center py-3">{item.qty}</TableCell>
                <TableCell className="text-right py-3">{(item.price * item.qty).toLocaleString()} VND</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* Bỏ TableFooter ở đây, sẽ hiển thị thủ công */}
        </Table>
      </div>

      {/* Hiển thị Tạm tính, Khuyến mãi, Tổng thanh toán ra ngoài bảng */}
      <div className="p-4 border-t space-y-2">
        <div className="flex justify-between font-bold">
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between text-green-600 font-bold">
          <span>Khuyến mãi</span>
          <span>- {discount.toLocaleString()} VND</span>
        </div>
      </div>

      <div className="p-4 border-t flex justify-between items-center bg-gray-100/50">
        <span className="text-xl font-bold">Tổng thanh toán</span>
        <span className="text-xl font-bold text-blue-600">{finalTotal.toLocaleString()} VND</span>
      </div>
    </div>
  );
}