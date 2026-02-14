// import { apiClient } from './api-client';

// export const productApi = {
//   createProduct: (product_name: string) =>
//     apiClient.post('/product/create', { product_name }),

//   getMyProducts: () =>
//     apiClient.get('/product/my-products'),
// };
// import { apiClient } from './api-client';

// export interface Product {
//   id: number;
//   product_name: string;
//   tenant_id: string;
//   created_at: string;
// }

// export const productApi = {
//   createProduct: (product_name: string) =>
//     apiClient.post('/product/create', { product_name }),

//   getMyProducts: () =>
//     apiClient.get<Product[]>('/product/my-products'),
// };


// import { apiClient } from '@/lib/api/api-client';

// export interface Product {
//   id: number;
//   product_name: string;
//   created_at: string;
// }

// export const productApi = {
//   createProduct: (product_name: string) =>
//     apiClient.post('/product/create', { product_name }),

//   getMyProducts: () =>
//     apiClient.get<Product[]>('/product/my-products'),
// };

import { apiClient } from "./api-client";

export type Product = {
  id: number;
  product_name: string;
  description?:string;
  created_at: string;
  is_active:boolean;
};

export const productApi = {
  getMyProducts: async (): Promise<Product[]> => {
    const res = await apiClient.get("/product/my-products");
    return res.data;
  },

  createProduct: async (product_name: string, description?:string) => {
    const res = await apiClient.post("/product/create", { product_name,description });
    return res.data;
  },

  // updateProduct: async (id: number, product_name: string, description?:string,is_active?:boolean) => {
  //   const res = await apiClient.patch(`/product/${id}`, {
  //     product_name,
  //   });
  //   return res.data;
  // },

  updateProduct: async (
  id: number,
  data: {
    product_name?: string;
    description?: string;
    is_active?: boolean;
  }
) => {
  const res = await apiClient.patch(`/product/${id}`, data);
  return res.data;
},


  deleteProduct: async (id: number) => {
    const res = await apiClient.delete(`/product/${id}`);
    return res.data;
  },
};
