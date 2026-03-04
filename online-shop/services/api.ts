// services/api.ts
export const API_BASE_URL = "https://v2.api.noroff.dev/online-shop";

// Fetch all products
export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  const json = await res.json();
  return json.data; // Adjust based on your API response
}

// Fetch a single product by ID
export async function fetchProductById(id: string) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  const json = await res.json();
  return json.data; // Adjust based on your API response
}