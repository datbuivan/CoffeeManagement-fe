"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddProductDialog } from "@/app/(app)/products/ProductFormDialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Product } from "@/model/product.model";



export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Cà phê sữa đá",
      categoryName: "Cà phê",
      sizes: [
        { id: 1, name: "S", price: 25000 },
        { id: 2, name: "M", price: 30000 },
      ],
    },
    {
      id: 2,
      name: "Trà đào",
      categoryName: "Trà",
      sizes: [{ id: 1, name: "M", price: 28000 }],
    },
    {
      id: 3,
      name: "Sinh tố xoài",
      categoryName: "Sinh tố",
      sizes: [{ id: 1, name: "M", price: 35000 }],
    },
  ]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const pageSize = 5;

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEdit = (id: number) => {
    alert("Chức năng sửa chưa implement. Product ID: " + id);
  };

    const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "all" || p.categoryName === categoryFilter;
    return matchName && matchCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(products.length / pageSize);

  const categories = Array.from(new Set(products.map((p) => p.categoryName)));

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />
          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              setCategoryFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AddProductDialog onAdd={handleAddProduct} />
      </div>

      <Card className="flex-1 flex flex-col bg-white shadow-md rounded-xl">
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-100 z-10">
                <TableRow>
                  <TableHead className="w-[60px] text-center">STT</TableHead>
                  <TableHead className="w-[250px]">Tên</TableHead>
                  <TableHead className="w-[200px]">Danh mục</TableHead>
                  <TableHead className="w-[200px]">Size</TableHead>
                  <TableHead className="text-center w-[120px]">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((p, index) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-center">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.categoryName}</TableCell>
                    <TableCell>
                      {p.sizes.map((s) => (
                        <span
                          key={s.id}
                          className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-2"
                        >
                          {s.name}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(p.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t py-3 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setPage(Math.max(1, page - 1))}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
