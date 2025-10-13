"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductSize } from "@/model/product-size.model";
import { Product } from "@/model/product.model";
import { useState } from "react";

interface ProductItemProps {
  product: Product;
  onAdd: (product: Product, size: ProductSize) => void;
}

export default function ProductItem({ product, onAdd }: ProductItemProps) {
  const [open, setOpen] = useState(false);

  const handleAdd = (size: ProductSize) => {
    onAdd(product, size);
    setOpen(false);
  };

  if (!product.productSize || product.productSize.length === 0) {
    // Không có size → disable button
    return (
      <div className="border rounded-lg shadow-sm p-4 flex flex-col items-center">
        <img
          src={product.imageUrl || "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png"}
          alt={product.name}
          className="rounded-md object-cover mb-3"
        />
        <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
        <Button disabled className="bg-gray-300 text-gray-600">Hết size</Button>
      </div>
    );
  }

  if (product.productSize.length === 1) {
    const singleSize = product.productSize[0];
    // Chỉ 1 size → nhấn button tự add vào cart luôn
    return (
      <div className="border rounded-lg shadow-sm p-4 flex flex-col items-center">
        <img
          src={product.imageUrl || "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png"}
          alt={product.name}
          className="rounded-md object-cover mb-3"
        />
        <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => handleAdd(singleSize)}
        >
          Thêm vào giỏ ({product.productSize[0].size} - {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.productSize[0].price)})
        </Button>
      </div>
    );
  }

  // Nhiều size → show dialog
  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col items-center">
      <img
        src={product.imageUrl || "https://res.cloudinary.com/docff5snu/image/upload/v1758164880/coffee/products/l8kuktoxj8e94ibeabmp.png"}
        alt={product.name}
        className="rounded-md object-cover mb-3"
      />
      <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Thêm vào giỏ</Button>
        </DialogTrigger>
        <DialogContent className="rounded-xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Chọn size cho {product.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            {product.productSize.map((size) => (
              <Button
                key={size.id}
                variant="outline"
                onClick={() => handleAdd(size)}
              >
                {size.size} -{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(size.price)}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
