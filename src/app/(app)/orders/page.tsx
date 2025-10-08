"use client";

import { useState, useEffect } from "react";
import Cart from "./Cart";
import Menu from "./Menu";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/model/cart-item.model";
import { Table } from "@/model/table.model";
import { Category } from "@/model/category.model";
import { Product } from "@/model/product.model";
import { ProductSize } from "@/model/product-size.model";
import {
  Search,
  SquareDashedKanban,
  ReceiptText,
  Trash2,
} from "lucide-react";
import TableSelectionView from "./table-selection-view";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import PaymentModal from "./payment-modal";

const mockProducts: Product[] = [
  { 
    id: 'prod-01', 
    name: "Cà phê sữa", 
    imageUrl: "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png", 
    isAvailable: true, 
    categoryId: 'cat-01',
    productSize: [
      { id: 'size-01', name: 'S', price: 25000 },
      { id: 'size-02', name: 'M', price: 30000 },
      { id: 'size-03', name: 'L', price: 35000 }
    ]
  },
  { 
    id: 'prod-02', 
    name: "Trà đào", 
    imageUrl: "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png", 
    isAvailable: true, 
    categoryId: 'cat-01',
    productSize: [
      { id: 'size-01', name: 'S', price: 30000 },
      { id: 'size-02', name: 'M', price: 35000 }
    ]
  },
  { 
    id: 'prod-03', 
    name: "Sinh tố xoài", 
    imageUrl: "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png", 
    isAvailable: true, 
    categoryId: 'cat-01',
    productSize: [
      { id: 'size-01', name: 'M', price: 40000 },
      { id: 'size-02', name: 'L', price: 45000 }
    ]
  },
  { 
    id: 'prod-04', 
    name: "Bánh ngọt", 
    imageUrl: "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png", 
    isAvailable: true, 
    categoryId: 'cat-02',
    productSize: [
      { id: 'size-01', name: 'Cái', price: 20000 }
    ]
  },
  { 
    id: 'prod-05', 
    name: "Cà phê đen", 
    imageUrl: "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png", 
    isAvailable: true, 
    categoryId: 'cat-01',
    productSize: [
      { id: 'size-01', name: 'S', price: 20000 },
      { id: 'size-02', name: 'M', price: 25000 }
    ]
  },
  { 
    id: 'prod-06', 
    name: "Cappuccino", 
    imageUrl: "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png", 
    isAvailable: true, 
    categoryId: 'cat-01',
    productSize: [
      { id: 'size-01', name: 'M', price: 35000 },
      { id: 'size-02', name: 'L', price: 40000 }
    ]
  },
  { 
    id: 'prod-07', 
    name: "Espresso", 
    imageUrl: "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png", 
    isAvailable: true, 
    categoryId: 'cat-01',
    productSize: [
      { id: 'size-01', name: 'Shot', price: 30000 }
    ]
  },
  { 
    id: 'prod-08', 
    name: "Trà sữa", 
    imageUrl: "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png", 
    isAvailable: true, 
    categoryId: 'cat-01',
    productSize: [
      { id: 'size-01', name: 'M', price: 35000 },
      { id: 'size-02', name: 'L', price: 40000 }
    ]
  },
  { 
    id: 'prod-09', 
    name: "Bánh mì", 
    imageUrl: "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png", 
    isAvailable: true, 
    categoryId: 'cat-02',
    productSize: [
      { id: 'size-01', name: 'Cái', price: 25000 }
    ]
  },
];

const mockTables: Table[] = [
  { id: "1", name: "Bàn 1", status: "Available" },
  { id: "2", name: "Bàn 2", status: "Occupied" },
  { id: "3", name: "Bàn 3", status: "Available" },
  { id: "4", name: "Bàn 4", status: "Available" },
  { id: "5", name: "Bàn 5", status: "Cleaning" },
  { id: "6", name: "Bàn 6", status: "Available" },
];
const mockCategories: Category[] = [
  { id: "cat-01", name: "Đồ uống" },
  { id: "cat-02", name: "Món thêm" },
];

export default function OrderPage() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(mockCategories[0]?.id);
  const [activeMainTab, setActiveMainTab] = useState("tables");
  const [tableFilter, setTableFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      if (saved) setCart(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: Product, size: ProductSize) => {
    setCart((prev) => {
        const exist = prev.find((i) => i.product.id === product.id && i.size.id === size.id);
        if (exist) {
            return prev.map((i) => i.product.id === product.id && i.size.id === size.id ? { ...i, qty: i.qty + 1 } : i);
        }
        return [...prev, { id: Date.now().toString(), product, size, qty: 1 }];
    });
  };
  const handleUpdateQty = (id: string, delta: number) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter((i) => i.qty > 0));
  const handleRemoveItem = (id: string) => setCart((prev) => prev.filter((item) => item.id !== id));
  const handleClearCart = () => setCart([]);

  const handleSelectTable = (table: Table | null) => {
    if (table === null) {
    setSelectedTable(null);
    setOrderType("TAKEAWAY");
    } else if (table.status === "Available") {
    setSelectedTable(table);
    setOrderType("DINE_IN");
  }
    setActiveMainTab("menu");
    setSelectedCategoryId(mockCategories[0]?.id);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = (paymentMethod: string, customerPaid: number,paymentUrl?: string) => {
    const total = cart.reduce((sum, item) => sum + item.size.price * item.qty, 0);
    if (customerPaid < total) {
      alert("Số tiền khách trả chưa đủ!");
      return;
    }

    if (paymentMethod === "transfer" && paymentUrl) {
      window.open(paymentUrl, "_blank");
    }

    const change = customerPaid - total;
    
    console.log("Đơn hàng:", {
      table: selectedTable,
      items: cart,
      total: total,
      paymentMethod: paymentMethod,
      customerPaid: customerPaid,
      change: change,
      timestamp: new Date()
    });
    
    // Xử lý thanh toán (gọi API)
    alert(`Thanh toán thành công! Tiền thừa: ${change.toLocaleString('vi-VN')}đ`);
    
    setShowPaymentModal(false);
    setSelectedTable(null);
    setOrderType(null);
    handleClearCart();
    setActiveMainTab("tables");
  };

  const handleResetOrder = () => {
     if (confirm("Bạn có chắc chắn muốn tạo đơn hàng mới? Giỏ hàng hiện tại sẽ bị xóa.")) {
        setSelectedTable(null);
        setOrderType(null);
        handleClearCart();
        setActiveMainTab("tables");
    }
  }

  const filteredTables = mockTables.filter((table) => {
    if (tableFilter === "all") return true;
    if (tableFilter === "used") return table.status === "Occupied";
    if (tableFilter === "empty") return table.status === "Available";
    return true;
  });

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">
            {selectedTable ? `${selectedTable.name}` : "Mang về"}
          </h1>
          {selectedTable && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Đang phục vụ
            </span>
          )}
        </div>
        {selectedTable && (
          <Button 
            variant="outline" 
            onClick={handleResetOrder}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Đơn hàng mới
          </Button>
        )}
      </header>
      <div className="flex flex-1 w-full h-full overflow-hidden">
        <div className="w-1/2 flex-1 flex flex-col overflow-hidden">
          <div className="p-2 border-b flex flex-col justify-between shrink-0">
            <div className="flex items-center gap-1 rounded-xl p-1">
                <Button 
                    size="sm" 
                    variant={activeMainTab === 'tables' ? 'default' : 'ghost'} 
                    onClick={() => setActiveMainTab("tables")}
                    className="data-[state=active]:bg-blue-700 data-[state=active]:shadow-sm bg-white rounded-3xl"
                    data-state={activeMainTab === 'tables' ? 'active' : ''}
                >
                    <SquareDashedKanban className="mr-2 h-4 w-4" />Phòng bàn
                </Button>
                <Button 
                    size="sm" 
                    variant={activeMainTab === 'menu' ? 'default' : 'ghost'} 
                    onClick={() => setActiveMainTab("menu")}
                    className="data-[state=active]:bg-blue-700 data-[state=active]:shadow-sm bg-white rounded-3xl"
                    data-state={activeMainTab === 'menu' ? 'active' : ''}
                >
                    <ReceiptText className="mr-2 h-4 w-4" />Thực đơn
                </Button>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm món"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                  />
            </div>
            
            <div className="pt-3">
              {activeMainTab === 'tables' && (
                <RadioGroup defaultValue="all" value={tableFilter} onValueChange={setTableFilter} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="r1"/>
                    <Label htmlFor="r1">Tất cả ({mockTables.length})</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="used" id="r2" />
                    <Label htmlFor="r2">Sử dụng ({mockTables.filter(t => t.status === "Occupied").length})</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="empty" id="r3" />
                    <Label htmlFor="r3">Còn trống ({mockTables.filter(t => t.status === "Available").length})</Label>
                  </div>
                </RadioGroup>
              ) }

              {activeMainTab === 'menu' && (
              <div className="flex gap-2 flex-wrap">
                {mockCategories.map(cat => (
                  <Button
                    key={cat.id}
                    size="sm"
                    variant={selectedCategoryId === cat.id ? "default" : "outline"}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={selectedCategoryId === cat.id ? "bg-blue-600" : ""}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {activeMainTab === "tables" && (
              <TableSelectionView
                tables={filteredTables}
                onSelectTable={handleSelectTable}
              />
            )}
            {activeMainTab === "menu" && (
              <Menu
              selectedCategoryId={selectedCategoryId}
              onAddToCart={handleAddToCart}
              products={filteredProducts}
              />
            )}
          </div>
        </div>

        <div className="w-1/2 border-l flex flex-col shrink-0">
          <Cart
            items={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cart={cart}
        selectedTable={selectedTable}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
