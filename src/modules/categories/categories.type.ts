export interface categories {
  id: number;
  home_id: number | null;
  name: string;
  icon: string;
}

export interface CreatecategoriesInput {
  home_id: number | null;
  name: string;
  icon: string;
}

export interface UpdatecategoriesInput {
  home_id?: number | null;
  name?: string;
  icon?: string;
}
