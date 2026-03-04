"use client"; // Runs on the client (browser)

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/api";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

// Define product structure
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

export default function Home() {
  // State for all products
  const [products, setProducts] = useState<Product[]>([]);
  // State for search input
  const [search, setSearch] = useState("");
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Cart hover dropdown visibility
  const [hoverCart, setHoverCart] = useState(false);

  const { addToCart, cartItems } = useCart();

  // Fetch products on component mount
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter products based on search input
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate cart totals
  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalCost = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // Show loading or error messages
  if (loading) return <p className="p-6 text-center">Loading products…</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Site title */}
          <h1 className="text-3xl font-bold text-[#0B3D91]">Online Shop</h1>

          {/* Navigation & Cart */}
          <nav className="flex items-center gap-6 relative">
            <Link href="/" className="font-medium text-[#0B3D91] hover:text-[#062A61]">Home</Link>
            <Link href="/contact" className="font-medium text-[#0B3D91] hover:text-[#062A61]">Contact</Link>

            {/* Cart dropdown */}
            <div
              onMouseEnter={() => setHoverCart(true)}
              onMouseLeave={() => setHoverCart(false)}
              className="relative cursor-pointer font-medium text-[#0B3D91] hover:text-[#062A61]"
            >
              Cart ({totalQuantity})

              {hoverCart && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">
                  {cartItems.length === 0 && <p className="text-center text-gray-500">Your cart is empty</p>}
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

          {/* Search input */}
          <input
            type="text"
            placeholder="Search products…"
            className="px-3 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto p-6">
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-10">No products found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg p-4 flex flex-col hover:scale-[1.02] transition"
            >
              {/* Clicking the product image/title navigates to product page */}
              <Link href={`/items/${product.id}`} className="flex flex-col flex-1">
                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image.url}
                    alt={product.image.alt}
                    className="h-full object-contain"
                  />
                </div>

                <h3 className="text-lg font-semibold text-[#0B3D91] mb-1">{product.title}</h3>

                <p className="text-gray-700 mb-2">
                  {product.discountedPrice !== undefined ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">${product.price}</span>
                      <span className="text-[#0B3D91] font-semibold">${product.discountedPrice}</span>
                    </>
                  ) : (
                    <span className="font-semibold">${product.price}</span>
                  )}
                </p>

                <p className="text-sm text-gray-500 mb-4">Rating: {product.rating}</p>
              </Link>

              {/* Add to cart button */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // prevent navigation when clicking
                  addToCart(product);
                  toast.success(`${product.title} added to cart!`);
                }}
                className="mt-auto px-4 py-2 bg-[#0B3D91] text-white rounded-lg hover:bg-[#062A61] transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}