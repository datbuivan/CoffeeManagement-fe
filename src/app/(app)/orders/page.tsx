// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { CartItem } from "@/model/cart-item.model";
// import { Table } from "@/model/table.model";
// import { Category } from "@/model/category.model";
// import { Product } from "@/model/product.model";
// import {
//   Search,
//   SquareDashedKanban,
//   ReceiptText,
//   Trash2,
// } from "lucide-react";
// import TableSelectionView from "./table-selection-view";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import PaymentModal from "./payment-modal";
// import { productService } from "@/services/product.service";
// import { tableService } from "@/services/table.service";
// import { categoryService } from "@/services/category.service";
// import { toast } from "sonner";
// import { productSizeService } from "@/services/product-size.service";
// import { ProductSize } from "@/model/product-size.model";
// import Menu from "./menu";
// import Cart from "./cart";


// export default function OrderPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [tables, setTables] = useState<Table[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);

//   const [selectedTable, setSelectedTable] = useState<Table | null>(null);
//   const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | null>(null);
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
//   const [activeMainTab, setActiveMainTab] = useState("tables");
//   const [tableFilter, setTableFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [cart, setCart] = useState<CartItem[]>([]);

//   useEffect(() => {
//     let isMounted = true;
//     const fetchData = async () => {
//       try {
//         const [prodRes, tableRes, catRes] = await Promise.all([
//           productService.getAll(),
//           tableService.getAll(),
//           categoryService.getAll(),
//         ]);

//         if (!isMounted) return;

//         if(prodRes.statusCode === 200 && prodRes.data){
//           const productsWithSizes = await Promise.all(
//           prodRes.data.map(async (p) => {
//             const sizeRes = await productSizeService.getByProductId(p.id);
//             return {
//               ...p,
//               productSize:
//                 sizeRes.statusCode === 200 && sizeRes.data
//                   ? sizeRes.data
//                   : [],
//               } as Product
//             })
//           );
//           setProducts(productsWithSizes);
//         }
//         if(tableRes.statusCode === 200 && tableRes.data){
//         setTables(tableRes.data);
//         }
//         if(catRes.statusCode === 200 && catRes.data){
//           setCategories(catRes.data);
//           setSelectedCategoryId(catRes.data[0]?.id || null);
//         }else {
//         setCategories([]);
//         setSelectedCategoryId(null);
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Không thể tải dữ liệu!");
//       }
//     };
//     fetchData();
//     return () => {
//     isMounted = false; // cleanup
//   };
//   }, []);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("cart");
//       if (saved) setCart(JSON.parse(saved));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const handleAddToCart = (product: Product, size: ProductSize) => {
//     setCart((prev) => {
//         const exist = prev.find((i) => i.product.id === product.id && i.size.id === size.id);
//         if (exist) {
//             return prev.map((i) => i.product.id === product.id && i.size.id === size.id ? { ...i, qty: i.qty + 1 } : i);
//         }
//         return [...prev, { id: Date.now().toString(), product, size, qty: 1 }];
//     });
//   };

//   const handleUpdateQty = (id: string, delta: number) => 
//     setCart((prev) => 
//       prev.map((i) => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter((i) => i.qty > 0));

//   const handleRemoveItem = (id: string) => 
//     setCart((prev) => prev.filter((item) => item.id !== id));

//   const handleClearCart = () => 
//     setCart([]);

//   const handleSelectTable = (table: Table | null) => {
//     if (table === null) {
//       setSelectedTable(null);
//       setOrderType("TAKEAWAY");
//     } else if (table.status === "Available") {
//       setSelectedTable(table);
//       setOrderType("DINE_IN");
//     }
//     setActiveMainTab("menu");
//     setSelectedCategoryId(categories[0]?.id);
//   };

//   const handleCheckout = () => {
//     if (cart.length === 0) {
//       alert("Giỏ hàng trống!");
//       return;
//     }
//     setShowPaymentModal(true);
//   };

//   const handleConfirmPayment = () => {
//     setShowPaymentModal(false);
//     setSelectedTable(null);
//     setOrderType(null);
//     handleClearCart();
//     setActiveMainTab("tables");
//   };

//   const handleResetOrder = () => {
//      if (confirm("Bạn có chắc chắn muốn tạo đơn hàng mới? Giỏ hàng hiện tại sẽ bị xóa.")) {
//         setSelectedTable(null);
//         setOrderType(null);
//         handleClearCart();
//         setActiveMainTab("tables");
//     }
//   }

//   const filteredTables = tables.filter((table) => {
//     if (tableFilter === "all") return true;
//     if (tableFilter === "used") return table.status === "Occupied";
//     if (tableFilter === "empty") return table.status === "Available";
//     return true;
//   });

//   const filteredProducts = products.filter(p => 
//     p.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col h-full w-full overflow-hidden p-6">
//       <div className="flex items-center justify-between px-4 pb-2 border-b shrink-0">
//         <div className="flex items-center gap-4">
//           <h1 className="text-xl font-bold text-gray-800">
//             {selectedTable ? `${selectedTable.name}` : "Mang về"}
//           </h1>
//           {selectedTable && (
//             <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
//               Đang phục vụ
//             </span>
//           )}
//         </div>
//         {selectedTable && (
//           <Button 
//             variant="outline" 
//             onClick={handleResetOrder}
//             className="border-red-300 text-red-600 hover:bg-red-50"
//           >
//             <Trash2 className="mr-2 h-4 w-4" />
//             Đơn hàng mới
//           </Button>
//         )}
//       </div>
//       <div className="flex flex-1 w-full h-full overflow-hidden">
//         <div className="w-3/5 flex-1 flex flex-col overflow-hidden">
//           <div className="p-2 border-b flex flex-col justify-between shrink-0">
//             <div className="flex items-center gap-1 rounded-xl p-1">
//                 <Button 
//                     size="sm" 
//                     variant={activeMainTab === 'tables' ? 'default' : 'ghost'} 
//                     onClick={() => setActiveMainTab("tables")}
//                     className="data-[state=active]:bg-blue-700 data-[state=active]:shadow-sm bg-white rounded-3xl"
//                     data-state={activeMainTab === 'tables' ? 'active' : ''}
//                 >
//                     <SquareDashedKanban className="mr-2 h-4 w-4" />Phòng bàn
//                 </Button>
//                 <Button 
//                     size="sm" 
//                     variant={activeMainTab === 'menu' ? 'default' : 'ghost'} 
//                     onClick={() => setActiveMainTab("menu")}
//                     className="data-[state=active]:bg-blue-700 data-[state=active]:shadow-sm bg-white rounded-3xl"
//                     data-state={activeMainTab === 'menu' ? 'active' : ''}
//                 >
//                     <ReceiptText className="mr-2 h-4 w-4" />Thực đơn
//                 </Button>
//                 <div className="flex items-center gap-1 rounded-xl p-1 relative"> {/* thêm relative */}
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
//                   <input
//                     type="text"
//                     placeholder="Tìm món"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10 pr-3 py-2 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
//                   />
//                 </div>
//             </div>
            
//             <div className="pt-3">
//               {activeMainTab === 'tables' && (
//                 <RadioGroup defaultValue="all" value={tableFilter} onValueChange={setTableFilter} className="flex items-center space-x-2">
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="all" id="r1"/>
//                     <Label htmlFor="r1">Tất cả ({tables.length})</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="used" id="r2" />
//                     <Label htmlFor="r2">Sử dụng ({tables.filter(t => t.status === "Occupied").length})</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="empty" id="r3" />
//                     <Label htmlFor="r3">Còn trống ({tables.filter(t => t.status === "Available").length})</Label>
//                   </div>
//                 </RadioGroup>
//               ) }

//               {activeMainTab === 'menu' && (
//               <div className="flex gap-2 flex-wrap">
//                 {categories.map(cat => (
//                   <Button
//                     key={cat.id}
//                     size="sm"
//                     variant={selectedCategoryId === cat.id ? "default" : "outline"}
//                     onClick={() => setSelectedCategoryId(cat.id)}
//                     className={selectedCategoryId === cat.id ? "bg-blue-600" : ""}
//                   >
//                     {cat.name}
//                   </Button>
//                 ))}
//               </div>
//             )}
//             </div>
//           </div>
          
//           <div className="flex-1 overflow-y-auto">
//             {activeMainTab === "tables" && (
//               <TableSelectionView
//                 tables={filteredTables}
//                 onSelectTable={handleSelectTable}
//               />
//             )}
//             {activeMainTab === "menu" && (
//               <Menu
//               selectedCategoryId={selectedCategoryId}
//               onAddToCart={handleAddToCart}
//               products={filteredProducts}
//               />
//             )}
//           </div>
//         </div>

//         <div className="w-2/5 border-l flex flex-col shrink-0">
//           <Cart
//             items={cart}
//             onUpdateQty={handleUpdateQty}
//             onRemoveItem={handleRemoveItem}
//             onClearCart={handleClearCart}
//             onCheckout={handleCheckout}
//           />
//         </div>
//       </div>
//       <PaymentModal
//         isOpen={showPaymentModal}
//         onClose={() => setShowPaymentModal(false)}
//         cart={cart}
//         selectedTable={selectedTable}
//         onConfirmPayment={handleConfirmPayment}
//       />
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemReturnView from "./item-return-view";
import OrderViewPage from "./order-page";
export default function OrderPage() {
  const [activeTab, setActiveTab] = useState("order");

  return (
    <div className="p-4 h-full w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="mb-2">
          <TabsTrigger value="order">Tạo đơn</TabsTrigger>
          <TabsTrigger value="return">Trả món</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="order" className="h-full">
            <OrderViewPage />
          </TabsContent>

          <TabsContent value="return" className="h-full">
            <ItemReturnView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
