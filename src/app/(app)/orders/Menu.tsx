"use client";

import { useState } from "react";
import ProductItem from "../products/ProductItem";
import { CartItem } from "./page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["Cà phê", "Trà", "Sinh tố", "Bánh"];

const items = [
 { id: 1, name: "Cà phê sữa", price: 25000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 2, name: "Trà đào", price: 30000, category: "Trà", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 3, name: "Sinh tố xoài", price: 35000, category: "Sinh tố", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 4, name: "Bánh ngọt", price: 20000, category: "Bánh", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 5, name: "Cà phê đen", price: 20000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 6, name: "Cappuccino", price: 40000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 7, name: "Espresso", price: 35000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 8, name: "Trà sữa", price: 32000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 9, name: "Trà gừng", price: 28000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 10, name: "Trà chanh", price: 25000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 11, name: "Trà chanh", price: 25000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 12, name: "Trà chanh", price: 25000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 13, name: "Trà chanh", price: 25000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 14, name: "Trà chanh", price: 25000, category: "Cà phê", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },

];

export default function Menu({ onAddToCart }: { onAddToCart: (item: Omit<CartItem, "qty">) => void }) {
  const [activeCat, setActiveCat] = useState("Cà phê");

  const filteredItems = items.filter((i) => i.category === activeCat);

  return (
    <Tabs defaultValue={activeCat} onValueChange={setActiveCat} className="w-full h-full bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] botder rounded-lg">
      <TabsList className="mb-4 flex flex-wrap">
        {categories.map((cat) => (
          <TabsTrigger key={cat} value={cat} className="px-4 py-2">
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={activeCat} className="flex-grow overflow-y-auto space-y-3 scroll-thin">
       <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 px-6">
          {filteredItems.map((item) => (
            <ProductItem
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              onAdd={() => onAddToCart(item)}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
