// import apiClient from './api-client';

// export interface Product {
//   id: number;
//   product_name: string;
// }

// export const promptApi = {
//   getProducts: async (): Promise<Product[]> => {
//     const res = await apiClient.get('/prompt/products');
//     return res.data;
//   },
// };


// import apiClient from "./api-client";

// /* ---------------- TYPES ---------------- */

// export interface Product {
//   id: number;
//   product_name: string;
//   tenant_id: string;
//   created_at: string;
// }

// export interface PromptVersion {
//   prompt_id: number;
//   product_id: number;
//   tenant_id: string;
//   prompt_text: string;
//   version: string;
//   created_at: string;
//   created_by: string;
// }

// /* ---------------- API FUNCTIONS ---------------- */

// // 1️⃣ Get all products for tenant
// export const getPromptProducts = async (): Promise<Product[]> => {
//   const res = await apiClient.get("/prompt/products");
//   return res.data;
// };

// // 2️⃣ Get latest prompt for a product
// export const getLatestPrompt = async (
//   productId: number,
// ): Promise<PromptVersion | null> => {
//   const res = await apiClient.get(`/prompt/${productId}/latest`);
//   return res.data;
// };

// // 3️⃣ Get all prompt versions for a product
// export const getPromptVersions = async (
//   productId: number,
// ): Promise<PromptVersion[]> => {
//   const res = await apiClient.get(`/prompt/${productId}/versions`);
//   return res.data;
// };

// // 4️⃣ Save prompt (creates NEW version always)
// export const createPrompt = async (
//   productId: number,
//   promptText: string,
//   version: string,
// ): Promise<PromptVersion> => {
//   const res = await apiClient.post(`/prompt/${productId}`, {
//     prompt_text: promptText,
//     version,
//   });
//   return res.data;
// };


import { apiClient } from "./api-client";

export type Product = {
  id: number;
  product_name: string;
};

export type PromptVersion = {
  prompt_id: number;
  version: string;
  prompt_text: string;
  created_at: string;
    is_production: boolean;

};

export const promptApi = {
  // Get all products for org
  getProducts: async (): Promise<Product[]> => {
    const res = await apiClient.get("/prompt/products");
    return res.data;
  },

  // Get all versions for a product
  getVersions: async (productId: number): Promise<PromptVersion[]> => {
    const res = await apiClient.get(`/prompt/${productId}/versions`);
    return res.data;
  },

  // Get latest prompt
  getLatest: async (productId: number): Promise<PromptVersion | null> => {
    const res = await apiClient.get(`/prompt/${productId}/latest`);
    return res.data;
  },

  // Save new prompt version
  savePrompt: async (
    productId: number,
    prompt_text: string,
    version: string
  ) => {
    const res = await apiClient.post(`/prompt/${productId}`, {
      prompt_text,
      version,
    });
    return res.data;
  },

//    deployPrompt(productId: number, promptId: number) {
//   return apiClient.post(
//     `/api/v1/prompt/${productId}/prompts/${promptId}/deploy`
//   );
// }
deployVersion(productId: number, promptId: number) {
  return apiClient.post(
    `/prompt/${productId}/prompts/${promptId}/deploy`
  );
}

};
