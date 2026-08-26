export interface MedusaProductVariant {
  id: string;
  title: string;
  prices: {
    amount: number;
    currency_code: string;
  }[];
  calculated_price?: {
    calculated_amount: number;
  };
}

export interface MedusaProduct {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  collection_id?: string;
  variants: MedusaProductVariant[];
  images?: { url: string }[];
}

export interface MedusaCollection {
  id: string;
  title: string;
  handle: string;
}

export interface CheckoutForm {
  email: string;
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
}

export interface MedusaRegion {
  id: string;
  name: string;
  currency_code: string;
}
