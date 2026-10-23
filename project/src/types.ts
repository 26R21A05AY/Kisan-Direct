export interface Product {
  id: string;
  name: string;
  category: 'vegetable' | 'fruit';
  price: number;
  unit: string;
  image_url: string;
  description: string | null;
  farmer_name: string;
  farmer_location: string;
  in_stock: boolean;
  is_organic: boolean;
  rating: number;
  stock_quantity: number;
  seller_id: string | null;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
}
