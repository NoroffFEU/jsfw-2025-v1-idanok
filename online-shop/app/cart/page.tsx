// app/cart/page.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalCost = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-coral-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-teal-800 mb-4">Your Cart</h1>

        {cartItems.length === 0 && <p>Your cart is empty.</p>}

        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 bg-gray-200 rounded"
                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="px-2 py-1 black-200 rounded"
                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
              >
                +
              </button>
              <button
                className="ml-4 px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {cartItems.length > 0 && (
          <>
            <div className="border-t mt-4 pt-4 font-semibold flex justify-between">
              <span>Total:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout/success"
              className="mt-4 block text-center bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
