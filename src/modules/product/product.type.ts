export interface Product {
    id: number;
    name: string;
    category_id: number;
    quantity: number;
    unit: string;
    expiry_date: Date;
    [key: string]: any;
}



export interface UpdateProductInput {
    name?: string;
    category_id?: number;
    quantity?: number;
    unit?: string;
    expiry_date?: Date;
}
