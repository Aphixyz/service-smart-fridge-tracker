import { Request } from "express";

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
interface fridgeParams {
  fridgeId: number;
}

interface RequestProduct {
  category_id: number;
  name: string;
  expiry_date: string;
  quantity: number;
  unit: string;
  status: 'Active' | 'Expired' | 'Consumed';
}

export type RequestFridgeProduct = Request<fridgeParams, any, RequestProduct>
