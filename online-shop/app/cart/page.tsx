// app/cart/page.tsx

"use client"; // This tells Next.js this page runs on the client (browser)

import Link from "next/link"; // Used for navigation between pages
import { useCart } from "@/context/CartContext"; // Custom hook for accessing cart data

export default function CartPage() {
  // Get cart data and functions from CartContext
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Calculate total cost of all items in the cart
  const totalCost = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Page title */}
        <h1 className="text-2xl font-bold text-[#0B3D91] mb-4">Your Cart</h1>

        {/* Show message if cart is empty */}
        {cartItems.length === 0 && <p>Your cart is empty.</p>}

        {/* Loop through all cart items */}
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            {/* Product info */}
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>

            {/* Quantity controls + remove button */}
            <div className="flex items-center gap-2">
              {/* Decrease quantity */}
              <button
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick={() =>
                  updateQuantity(item.id, (item.quantity || 1) - 1)
                }
              >
                -
              </button>

              {/* Show current quantity */}
              <span>{item.quantity}</span>

              {/* Increase quantity */}
              <button
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick={() =>
                  updateQuantity(item.id, (item.quantity || 1) + 1)
                }
              >
                +
              </button>

              {/* Remove item from cart */}
              <button
                className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Show total and checkout only if cart has items */}
        {cartItems.length > 0 && (
          <>
            {/* Total price */}
            <div className="border-t mt-4 pt-4 font-semibold flex justify-between">
              <span>Total:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>

            {/* Checkout button */}
            <Link
              href="/checkout/success"
              className="mt-4 block text-center bg-[#0B3D91] text-white py-2 rounded-lg hover:bg-[#062A61] transition"
            >
              Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
