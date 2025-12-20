export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;

  // ✅ ADD THIS
  dealUrl?: string;        // primary/best merchant link
};
