export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;

  // ✅ BUY button ke liye (abhi single merchant)
  dealUrl?: string;

  description?: string;
};
