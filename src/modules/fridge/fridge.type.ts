export interface Fridge {
  id: number;
  quantity: number;
  category: string;
  [key: string]: any;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  categories_name: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  status: string;
  [key: string]: any;
}
