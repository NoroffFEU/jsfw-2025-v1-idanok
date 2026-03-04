"use client"; // Runs on the client (browser)

import Link from "next/link"; // Used for navigation
import { useCart } from "@/context/CartContext"; // Access cart data

export default function CheckoutSuccessPage() {
  // Get cart items from global cart state
  const { cartItems } = useCart();

  // Calculate total price of all items
  const totalCost = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-coral-50 p-6 font-sans">

      {/* Main card container */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">

        {/* Success message */}
        <h1 className="text-3xl font-bold text-teal-800 mb-4">
          🎉 Checkout Successful!
        </h1>

        {/* Short description */}
        <p className="text-gray-700 mb-6">
          Thank you for your purchase. Here is a summary of your order:
        </p>

        {/* Show order summary only if there are items */}
        {cartItems.length > 0 && (
          <div className="mb-4 text-left">

            {/* Loop through each item */}
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">

                {/* Item name and quantity */}
                <span>
                  {item.title} x {item.quantity || 1}
                </span>

                {/* Item total price */}
                <span>
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}

            {/* Total cost */}
            <div className="border-t mt-2 pt-2 font-semibold flex justify-between">
              <span>Total:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Button to go back to homepage */}
        <Link
          href="/"
          className="mt-4 inline-block w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}