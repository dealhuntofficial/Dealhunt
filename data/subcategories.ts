// data/subcategories.ts

export const subCategories: Record<string, { name: string; slug: string; icon: string }[]> = {

  /* -----------------------------------------------
     1️⃣ WATCHES SUBCATEGORIES (General + Brand Mix)
  ------------------------------------------------*/
  watches: [
    { name: "Smartwatches", slug: "smartwatches", icon: "⌚" },
    { name: "Analog Watches", slug: "analog-watches", icon: "🕰️" },
    { name: "Digital Watches", slug: "digital-watches", icon: "⏱️" },
    { name: "Luxury Watches", slug: "luxury-watches", icon: "💎" },
    { name: "Sports Watches", slug: "sports-watches", icon: "🏃‍♂️" },

    // ⭐ Brand subcategories
    { name: "Rolex", slug: "rolex", icon: "👑" },
    { name: "Fossil", slug: "fossil", icon: "🪨" },
    { name: "Casio", slug: "casio", icon: "🎛️" },
    { name: "Titan", slug: "titan", icon: "🛡️" },
    { name: "Boat Smartwatch", slug: "boat-smartwatch", icon: "🚤" },
  ],

  /* -----------------------------------------------
     2️⃣ SMARTPHONES SUBCATEGORIES
  ------------------------------------------------*/
  smartphones: [
    { name: "Android Phones", slug: "android", icon: "🤖" },
    { name: "iPhones", slug: "iphone", icon: "📱" },
    { name: "5G Smartphones", slug: "5g-phones", icon: "📡" },
    { name: "Gaming Phones", slug: "gaming-phones", icon: "🎮" },
    { name: "Camera Phones", slug: "camera-phones", icon: "📸" },

    // ⭐ Brand subcategories
    { name: "Samsung", slug: "samsung", icon: "🌌" },
    { name: "Apple", slug: "apple", icon: "🍎" },
    { name: "Xiaomi", slug: "xiaomi", icon: "🔥" },
    { name: "OnePlus", slug: "oneplus", icon: "➕" },
    { name: "Realme", slug: "realme", icon: "✨" },
  ],

  /* -----------------------------------------------
     3️⃣ BAGS SUBCATEGORIES
  ------------------------------------------------*/
  bags: [
    { name: "Handbags", slug: "handbags", icon: "👜" },
    { name: "Backpacks", slug: "backpacks", icon: "🎒" },
    { name: "Travel Bags", slug: "travel-bags", icon: "🧳" },
    { name: "Laptop Bags", slug: "laptop-bags", icon: "💼" },
    { name: "Tote Bags", slug: "tote-bags", icon: "🛍️" },

    // ⭐ Brand subcategories
    { name: "Nike Bags", slug: "nike-bags", icon: "✔️" },
    { name: "Adidas Bags", slug: "adidas-bags", icon: "🏅" },
    { name: "Wildcraft", slug: "wildcraft", icon: "🌲" },
    { name: "Skybags", slug: "skybags", icon: "☁️" },
    { name: "American Tourister", slug: "american-tourister", icon: "🇺🇸" },
  ],

};
