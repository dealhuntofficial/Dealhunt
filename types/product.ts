export type Product = {
  id: string;

  // 🔹 BASIC INFO
  name: string;          // product title
  price: number;
  image: string;

  // 🔹 OPTIONAL
  category?: string;
  description?: string;

  // 🔹 DEAL / MERCHANT INFO
  dealUrl?: string;      // buy link
  merchant?: string;     // amazon / flipkart
  brand?: string;

  // 🔹 PRICING
  originalPrice?: number;
  discountPercent?: number;
};
