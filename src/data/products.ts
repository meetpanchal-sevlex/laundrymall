export interface Product {
  id: string;
  variantId?: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
}

export const CATEGORIES = [
  "Hangers",
  "Chemicals",
  "Laundry Detergent",
  "Fabric Softener",
  "Stain Remover",
  "Irons",
  "Accessories",
  "Machinery"
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "1.9 mm Blue Notched Hanger",
    category: "Hangers",
    price: 3.98,
    image: "https://images.unsplash.com/photo-1596282869408-013063fefd03?w=500&q=80",
    description: "High quality 1.9 mm blue notched hanger suitable for various garments."
  },
  {
    id: "p2",
    name: "2.1 mm Golden Hanger",
    category: "Hangers",
    price: 4.30,
    image: "https://images.unsplash.com/photo-1596282869408-013063fefd03?w=500&q=80",
    description: "Premium 2.1 mm golden hanger for a touch of elegance."
  },
  {
    id: "p3",
    name: "Shoulder Guard",
    category: "Accessories",
    price: 4.98,
    image: "https://plus.unsplash.com/premium_photo-1678218683501-fde6d7675fcd?w=500&q=80",
    description: "Protect garments from shoulder bumps and creases with our shoulder guards."
  },
  {
    id: "p4",
    name: "Trouser Guard",
    category: "Accessories",
    price: 2.29,
    originalPrice: 2.44,
    image: "https://plus.unsplash.com/premium_photo-1678218683501-fde6d7675fcd?w=500&q=80",
    description: "Keep trousers perfectly creased and unwrinkled."
  },
  {
    id: "p5",
    name: "Laundry Marking Label",
    category: "Accessories",
    price: 979.44,
    originalPrice: 1399.20,
    image: "https://images.unsplash.com/photo-1598463133379-3ba340c21dc3?w=500&q=80",
    description: "Durable laundry marking labels for easy identification."
  },
  {
    id: "p6",
    name: "AZ 3118 (Laundry Cleaning Agent)",
    category: "Chemicals",
    price: 345.22,
    originalPrice: 371.20,
    image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=500&q=80",
    description: "High performance laundry cleaning agent for tough stains."
  },
  {
    id: "p7",
    name: "PG - 802 (TAR - OIL REMOVER)",
    category: "Stain Remover",
    price: 1170.00,
    originalPrice: 1800.00,
    image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=500&q=80",
    description: "Effectively removes tar and oil stains."
  },
  {
    id: "p8",
    name: "Stain Remover Kit",
    category: "Stain Remover",
    price: 780.00,
    image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=500&q=80",
    description: "Complete kit for removing all types of stains."
  },
  {
    id: "p9",
    name: "Lint Roller",
    category: "Accessories",
    price: 150.80,
    originalPrice: 301.60,
    image: "https://plus.unsplash.com/premium_photo-1678218683501-fde6d7675fcd?w=500&q=80",
    description: "Easily remove lint and pet hair from clothes."
  },
  {
    id: "p10",
    name: "Laundry Net Bag",
    category: "Accessories",
    price: 550.00,
    image: "https://images.unsplash.com/photo-1598463133379-3ba340c21dc3?w=500&q=80",
    description: "Protect delicate garments during washing."
  },
  {
    id: "p11",
    name: "Laundry Perfume",
    category: "Chemicals",
    price: 800.00,
    image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=500&q=80",
    description: "Give your laundry a long-lasting, fresh scent."
  },
  {
    id: "p12",
    name: "SOFTOUCH (SOFTENER)",
    category: "Fabric Softener",
    price: 152.00,
    image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=500&q=80",
    description: "Makes fabric extra soft and pleasant to touch."
  },
  {
    id: "p13",
    name: "Steam Iron",
    category: "Irons",
    price: 2750.00,
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500&q=80",
    description: "Professional grade steam iron for perfect pressing."
  },
  {
    id: "p14",
    name: "Tagging Gun",
    category: "Machinery",
    price: 415.00,
    image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=500&q=80",
    description: "High quality tagging gun for attaching price tags easily."
  }
];
