"use client";

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/api";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

// Define the structure of a product
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
  // State for storing products from API
  const [products, setProducts] = useState<Product[]>([]);

  // State for search input
  const [search, setSearch] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to control cart hover dropdown visibility
  const [hoverCart, setHoverCart] = useState(false);

  // Access cart context functions and data
  const { addToCart, cartItems } = useCart();

  // Fetch products when component mounts
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

  // Calculate total quantity of items in cart
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // Calculate total cost of items in cart
  const totalCost = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // Show loading message while fetching data
  if (loading) return <p className="p-6 text-center">Loading products…</p>;

  // Show error message if fetch fails
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-coral-50 font-sans">
      
      {/* Header section with navigation and search */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Site title */}
          <h1 className="text-3xl font-bold text-teal-800">Online Shop</h1>

          {/* Navigation links and cart */}
          <nav className="flex items-center gap-6 relative">
            <Link href="/" className="font-medium text-teal-700 hover:text-teal-900">
              Home
            </Link>
            <Link href="/contact" className="font-medium text-teal-700 hover:text-teal-900">
              Contact
            </Link>

            {/* Cart with hover dropdown */}
            <div
              onMouseEnter={() => setHoverCart(true)}
              onMouseLeave={() => setHoverCart(false)}
              className="relative cursor-pointer font-medium text-teal-700 hover:text-teal-900"
            >
              Cart ({totalQuantity})

              {/* Cart dropdown */}
              {hoverCart && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">
                  
                  {/* Empty cart message */}
                  {cartItems.length === 0 && (
                    <p className="text-center text-gray-500">Your cart is empty</p>
                  )}

                  {/* List cart items */}
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between mb-2">
                      <span>
                        {item.title} x {item.quantity || 1}
                      </span>
                      <span>
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {/* Show total and link to cart page */}
                  {cartItems.length > 0 && (
                    <>
                      <div className="border-t mt-2 pt-2 font-semibold flex justify-between">
                        <span>Total:</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>

                      <Link
                        href="/cart"
                        className="block mt-2 text-center bg-teal-600 text-white py-1 rounded hover:bg-teal-700"
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
            className="px-3 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Main content displaying products */}
      <main className="max-w-6xl mx-auto p-6">
        
        {/* Message if no products match search */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-10">No products found.</p>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg p-4 flex flex-col hover:scale-[1.02] transition"
            >
              
              {/* Link to product details page */}
              <Link href={`/items/${product.id}`} className="flex flex-col flex-1">
                
                {/* Product image */}
                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image.url}
                    alt={product.image.alt}
                    className="h-full object-contain"
                  />
                </div>

                {/* Product title */}
                <h3 className="text-lg font-semibold text-teal-900 mb-1">
                  {product.title}
                </h3>

                {/* Product price (with optional discount) */}
                <p className="text-gray-700 mb-2">
                  {product.discountedPrice !== undefined ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">
                        ${product.price}
                      </span>
                      <span className="text-coral-500 font-semibold">
                        ${product.discountedPrice}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold">${product.price}</span>
                  )}
                </p>

                {/* Product rating */}
                <p className="text-sm text-gray-500 mb-4">
                  Rating: {product.rating}
                </p>
              </Link>

              {/* Add to cart button */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation when clicking button
                  addToCart(product);
                  toast.success(`${product.title} added to cart!`);
                }}
                className="mt-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
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