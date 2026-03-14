// import axios, { AxiosInstance, AxiosError } from 'axios';

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// class ApiClient {
//   private client: AxiosInstance;

//   constructor() {
//     this.client = axios.create({
//       baseURL: API_BASE_URL,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     // ✅ Attach JWT token
//     this.client.interceptors.request.use(
//       (config) => {
//         const isPublicEndpoint =
//           config.url?.includes('/leads/chatbot') ||
//           config.url?.includes('/auth/');

//         if (!isPublicEndpoint) {
//           const token = localStorage.getItem('auth_token'); // ✅ FIX
//           if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//           }
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Response interceptor
//     this.client.interceptors.response.use(
//       (response) => response,
//       (error: AxiosError) => {
//         if (error.response?.status === 401) {
//           localStorage.removeItem('access_token');
//           localStorage.removeItem('user');
//           // window.location.href = '/login'; // optional during dev
//         }
//         return Promise.reject(error);
//       }
//     );
//   }

//   get instance(): AxiosInstance {
//     return this.client;
//   }

//   async get<T>(url: string, config?: any): Promise<T> {
//     const response = await this.client.get<T>(url, config);
//     return response.data;
//   }

//   async post<T>(url: string, data?: any, config?: any): Promise<T> {
//     const response = await this.client.post<T>(url, data, config);
//     return response.data;
//   }

//   async patch<T>(url: string, data?: any, config?: any): Promise<T> {
//     const response = await this.client.patch<T>(url, data, config);
//     return response.data;
//   }

//   async delete<T>(url: string, config?: any): Promise<T> {
//     const response = await this.client.delete<T>(url, config);
//     return response.data;
//   }
// }

// export const apiClient = new ApiClient();



import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = 'https://lead-ai-backend.dexpertsystems.com/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // ✅ Attach JWT token automatically
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // ✅ Handle 401 globally
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config?: any): Promise<T> {
    return this.client.get(url, config).then((res) => res.data);
  }

  post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.post(url, data, config).then((res) => res.data);
  }
}

export const apiClient = new ApiClient();
