"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface ProductSize {
  id: number;
  name: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  categoryName: string;
  image?: string;
  sizes: ProductSize[];
}

interface AddProductDialogProps {
  onAdd: (product: Product) => void;
}

// Fake data cho danh mục
const fakeCategories = [
  { id: 1, name: "Cà phê" },
  { id: 2, name: "Trà" },
  { id: 3, name: "Nước ép" },
  { id: 4, name: "Sinh tố" },
  { id: 5, name: "Đồ uống khác" },
];

export function AddProductDialog({ onAdd }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: "",
    categoryName: "",
    sizes: [],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: url });
    }
  };

  const handleAddSize = () => {
    setNewProduct({
      ...newProduct,
      sizes: [...newProduct.sizes, { id: Date.now(), name: "", price: 0 }],
    });
  };

  const handleRemoveSize = (id: number) => {
    setNewProduct({
      ...newProduct,
      sizes: newProduct.sizes.filter((s) => s.id !== id),
    });
  };

  const handleUpdateSize = (id: number, key: "name" | "price", value: string) => {
    setNewProduct({
      ...newProduct,
      sizes: newProduct.sizes.map((s) =>
        s.id === id ? { ...s, [key]: key === "price" ? parseInt(value) || 0 : value } : s
      ),
    });
  };

  const handleSave = () => {
    if (!newProduct.name || !newProduct.categoryName) return;
    onAdd({ ...newProduct, id: Date.now() });
    setNewProduct({ id: 0, name: "", categoryName: "", sizes: [], image: undefined });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + Thêm sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full max-h-[82vh] overflow-y-auto scroll-thin  h-auto rounded-xl bg-white shadow-lg ">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Thêm sản phẩm mới
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-6">
          <div className="grid gap-1">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Tên sản phẩm
            </Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              placeholder="Nhập tên sản phẩm"
            />
          </div>
          <div className="grid gap-1">
            <Label className="text-sm font-medium text-gray-700">Danh mục</Label>
            <Select
                onValueChange={(val) =>
                setNewProduct({ ...newProduct, categoryName: val })
                }
            >
                <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md">
                <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                {fakeCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                    {category.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="image" className="text-sm font-medium text-gray-700">
              Ảnh sản phẩm
            </Label>
            <Input
              id="image"
              type="file"
              onChange={handleImageUpload}
              className="border-gray-300 rounded-md"
            />
            {newProduct.image && (
              <div className="mt-2 lex flex-col items-center gap-2">
                <Image
                  src={newProduct.image}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="rounded-md object-cover border border-gray-200"
                />
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setNewProduct({ ...newProduct, image: undefined })}
                    className="h-8 w-8"
                    title="Xóa ảnh"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="text-sm font-medium text-gray-700">Size & Giá</Label>
            {newProduct.sizes.map((size) => (
              <div key={size.id} className="grid grid-cols-12 gap-4 items-center justify-items-end">
                <div className="col-span-5">
                  <Input
                    placeholder="Tên size (VD: S, M, L)"
                    value={size.name}
                    onChange={(e) =>
                      handleUpdateSize(size.id, "name", e.target.value)
                    }
                    className="border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-5">
                  <Input
                    type="number"
                    placeholder="Giá (VNĐ)"
                    value={size.price || ""}
                    onChange={(e) =>
                      handleUpdateSize(size.id, "price", e.target.value)
                    }
                    className="border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveSize(size.id)}
                    className="h-8 w-8"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-1 border-gray-300 text-blue-600 hover:bg-blue-50"
              onClick={handleAddSize}
            >
              + Thêm size
            </Button>
          </div>
        </div>
        <DialogFooter className="border-t pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-300 text-gray-70 hover:bg-gray-100"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!newProduct.name || !newProduct.categoryName}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}