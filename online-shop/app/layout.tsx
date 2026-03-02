import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}
