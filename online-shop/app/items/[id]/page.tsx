"use client"; // Runs in the browser

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image"; // Next.js optimized image component

// Product structure
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

export default function ProductPage() {
  // Fix: properly type the route parameter
  const { id } = useParams<{ id: string }>();

  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverCart, setHoverCart] = useState(false);
  const router = useRouter();

  // Fetch product details
  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      if (!id) return;

      try {
        const data = await fetchProductById(id);
        if (isMounted) setProduct(data);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to load product.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Cart totals
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const totalCost = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  if (loading) return <p className="p-6 text-center">Loading product…</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!product) return <p className="p-6 text-center">Product not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Site title */}
          <h1
            className="text-3xl font-bold text-[#0B3D91] cursor-pointer"
            onClick={() => router.push("/")}
          >
            Online Shop
          </h1>

          {/* Navigation */}
          <nav className="flex items-center gap-6 relative">
            <Link href="/" className="font-medium text-[#0B3D91] hover:text-[#062A61]">
              Home
            </Link>

            <Link href="/contact" className="font-medium text-[#0B3D91] hover:text-[#062A61]">
              Contact
            </Link>

            {/* Cart dropdown */}
            <div
              onMouseEnter={() => setHoverCart(true)}
              onMouseLeave={() => setHoverCart(false)}
              className="relative cursor-pointer font-medium text-[#0B3D91] hover:text-[#062A61]"
            >
              Cart ({totalQuantity})

              {hoverCart && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">

                  {cartItems.length === 0 && (
                    <p className="text-center text-gray-500">
                      Your cart is empty
                    </p>
                  )}

                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between mb-2">
                      <span>{item.title} x {item.quantity || 1}</span>
                      <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}

                  {cartItems.length > 0 && (
                    <>
                      <div className="border-t mt-2 pt-2 font-semibold flex justify-between">
                        <span>Total:</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>

                      <Link
                        href="/cart"
                        className="block mt-2 text-center bg-[#0B3D91] text-white py-1 rounded hover:bg-[#062A61]"
                      >
                        View Cart
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* PRODUCT DETAILS */}
      <main className="max-w-6xl mx-auto p-6">

        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6">

          {/* Product Image */}
          <div className="md:w-1/2 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden p-4">

            {/* Fix: Next.js optimized image */}
            <Image
              src={product.image?.url || "/placeholder.png"}
              alt={product.image?.alt || product.title}
              width={400}
              height={400}
              className="max-h-64 w-auto object-contain"
            />

          </div>

          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col justify-between">

            <h2 className="text-2xl font-bold text-[#0B3D91] mb-4">
              {product.title}
            </h2>

            <p className="text-gray-700 mb-4">
              {product.description}
            </p>

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-[#0B3D91]/10 text-[#0B3D91] rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <p className="text-xl font-semibold mb-4">

              {product.discountedPrice ? (
                <>
                  <span className="line-through text-gray-400 mr-2">
                    ${product.price}
                  </span>

                  <span className="text-[#0B3D91]">
                    ${product.discountedPrice}
                  </span>
                </>
              ) : (
                <span>${product.price}</span>
              )}

            </p>

            {/* Rating */}
            <p className="text-sm text-gray-500 mb-6">
              Rating: {product.rating}
            </p>

            {/* Add to cart */}
            <button
              onClick={() => {
                addToCart(product);
                toast.success(`${product.title} added to cart!`);
              }}
              className="px-6 py-3 bg-[#0B3D91] text-white rounded-lg hover:bg-[#062A61] transition w-full md:w-auto"
            >
              Add to Cart
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}