export interface House {
  id: number;
  address: string;
  homeowner: string;
  price: number;
  photoURL: string;
}

export interface ApiResponse {
  houses: House[];
  ok: boolean;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}