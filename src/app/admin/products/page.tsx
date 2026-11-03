import { createAdminClient as createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import Image from "next/image";
import CSVUpload from "./CSVUpload";
import ProductRowActions from "./ProductRowActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-[#0D1B2A]">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#2ECC71] hover:bg-[#27AE60] text-[#0D1B2A] font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <CSVUpload />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100 bg-[#F9FAFB]">
                <th className="px-5 py-3.5 font-semibold">Product</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Price</th>
                <th className="px-5 py-3.5 font-semibold">Stock</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(products as Product[])?.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F4F6F8] flex-shrink-0">
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#0D1B2A] line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{product.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{product.category?.name ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className="font-semibold text-[#0D1B2A]">
                      {formatPrice(product.sale_price ?? product.price)}
                    </span>
                    {product.sale_price && (
                      <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(product.price)}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={product.stock <= 5 ? "text-red-500 font-semibold" : "text-gray-500"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {product.active ? "Active" : "Hidden"}
                    </span>
                    {product.featured && (
                      <span className="ml-1.5 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Featured</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <ProductRowActions id={product.id} name={product.name} active={product.active} />
                  </td>
                </tr>
              ))}
              {!products?.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    No products yet.{" "}
                    <Link href="/admin/products/new" className="text-[#2ECC71] font-semibold hover:underline">
                      Add your first product
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
