export type Product = {
  id: string;

  // BASIC INFO
  name: string;        // product title
  price: number;
  image: string;

  // OPTIONAL INFO
  category?: string;
  description?: string;

  // DEAL / MERCHANT
  dealUrl?: string;    // buy link
  merchant?: string;
  brand?: string;

  // PRICING (optional)
  originalPrice?: number;
  discountPercent?: number;
};
