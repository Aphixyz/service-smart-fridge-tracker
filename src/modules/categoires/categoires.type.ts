export interface Categoires {
  id: number;
  home_id: number | null;
  name: string;
  icon: string;
}

export interface CreateCategoiresInput {
  home_id: number | null;
  name: string;
  icon: string;
}

export interface UpdateCategoiresInput {
  home_id?: number | null;
  name?: string;
  icon?: string;
}
