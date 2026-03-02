"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProducts } from "@/services/api"; // we will fetch all products or you can implement GET /online-shop/<id>
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  image: { url: string; alt: string };
  rating: number;
  tags?: string[];
}

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const params = useParams(); // get id from URL
  const { id } = params as { id: string };

  useEffect(() => {
    async function loadProduct() {
      try {
        // Example: fetch all products then filter by id
        const products = await fetchProducts(); 
        const found = products.find((p: Product) => p.id === id);
        if (!found) throw new Error("Product not found");
        setProduct(found);
      } catch {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading product…</p>;
  if (error || !product) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-coral-50 font-sans p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-6 flex flex-col md:flex-row gap-6">
        
        {/* Product Image */}
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src={product.image.url}
            alt={product.image.alt}
            className="rounded-2xl object-contain max-h-96"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-teal-900">{product.title}</h1>
          <p className="text-gray-700">{product.description}</p>

          {/* Price */}
          <div className="text-lg">
            {product.discountedPrice ? (
              <>
                <span className="line-through text-gray-400 mr-2">${product.price}</span>
                <span className="text-coral-500 font-semibold">${product.discountedPrice}</span>
              </>
            ) : (
              <span className="font-semibold">${product.price}</span>
            )}
          </div>

          {/* Rating */}
          <p className="text-sm text-gray-500">Rating: {product.rating}</p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {product.tags.map((tag) => (
                <span key={tag} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={() => {
              addToCart(product);
              toast.success(`${product.title} added to cart!`);
            }}
            className="mt-auto px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
