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


import { apiClient } from '@/lib/api/api-client';

export interface Product {
  id: number;
  product_name: string;
  created_at: string;
}

export const productApi = {
  createProduct: (product_name: string) =>
    apiClient.post('/product/create', { product_name }),

  getMyProducts: () =>
    apiClient.get<Product[]>('/product/my-products'),
};
