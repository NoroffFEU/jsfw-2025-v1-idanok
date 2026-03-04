"use client";

import Link from "next/link"; // Next.js navigation
import { useCart } from "@/context/CartContext"; // Access cart state and functions

export default function CheckoutSuccessPage() {
  // Destructure cartItems and clearCart function from cart context
  const { cartItems, clearCart } = useCart();

  // Calculate total price of all items in the cart
  const totalCost = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  /**
   * Handles the "Back to Home" button click
   * Clears the cart before navigating to the homepage
   */
  const handleBackHome = () => {
    clearCart(); // Clear all items from cart state
  };

  return (
    // Page container with full height and gradient background
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-6 font-sans">

      {/* Card container for the success message and order summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">

        {/* Main success heading */}
        <h1 className="text-3xl font-bold text-[#0B3D91] mb-4">
          🎉 Checkout Successful!
        </h1>

        {/* Short thank-you message */}
        <p className="text-gray-700 mb-6">
          Thank you for your purchase. Here is a summary of your order:
        </p>

        {/* Display order summary only if there are items in the cart */}
        {cartItems.length > 0 && (
          <div className="mb-4 text-left">

            {/* Loop through each cart item */}
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                {/* Item title and quantity */}
                <span>{item.title} x {item.quantity || 1}</span>
                {/* Total price for this item */}
                <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}

            {/* Total cost of all items */}
            <div className="border-t mt-2 pt-2 font-semibold flex justify-between">
              <span>Total:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* "Back to Home" button */}
        <Link
          href="/"                   // Navigate back to homepage
          onClick={handleBackHome}   // Clear the cart before navigation
          className="mt-4 inline-block w-full bg-[#0B3D91] text-white py-2 rounded-lg hover:bg-[#062A61] transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}