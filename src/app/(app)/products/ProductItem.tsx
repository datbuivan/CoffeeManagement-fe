"use client";

import Image from "next/image";

interface ProductItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  onAdd?: (id: number) => void;
  imageHeight?: string;
}

export default function ProductItem({
  id,
  name,
  price,
  image,
  onAdd,
  imageHeight = "h-32 md:h-40 lg:h-48",
}: ProductItemProps) {
  return (
    <div
      className="bg-white border rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition"
      onClick={() => onAdd && onAdd(id)}
    >
      <div className={`relative w-full ${imageHeight}`}>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex justify-between items-center px-3 py-2 bg-white">
        <h3 className="font-semibold text-base md:text-lg truncate">{name}</h3>
        <p className="text-sm md:text-base font-bold text-green-600">
          {price.toLocaleString()} đ
        </p>
      </div>
    </div>
  );
}
