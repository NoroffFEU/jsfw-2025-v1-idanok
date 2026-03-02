// services/api.ts

export const API_BASE_URL = "https://v2.api.noroff.dev/online-shop";

// Fetch all products
export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = await res.json();
  return json.data;
}

// Fetch a single product by ID
export async function fetchProduct(id: string) {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  return json.data;
}
