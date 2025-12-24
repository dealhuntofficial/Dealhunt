export type Product = {
  id: string;

  // 🔹 BASIC INFO
  name: string;          // product title (use this everywhere)
  price: number;
  image: string;

  // 🔹 OPTIONAL BUT USED IN UI
  category?: string;
  description?: string;

  // 🔹 DEAL / MERCHANT INFO
  dealUrl?: string;      // buy link
  merchant?: string;     // amazon / flipkart etc
  brand?: string;

  // 🔹 PRICING (optional but useful)
  originalPrice?: number;
  discountPercent?: number;
};
