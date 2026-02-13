// import React, { useEffect, useState } from 'react';
// import { AppLayout } from '@/components/layout/AppLayout';
// import { useAuth } from '@/contexts/AuthContext';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api/v1',
// });
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// interface Product {
//   id: number;
//   organisation_id: string;
//   product_name: string;
//   create_date: string;
// }

// const MyProductsPage = () => {
//   const { user } = useAuth();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (user?.role !== 'organisation') return;
//     setLoading(true);
//     api.get('/product/list')
//       .then(res => setProducts(res.data))
//       .catch(() => setError('Failed to fetch products'))
//       .finally(() => setLoading(false));
//   }, [user]);

//   if (user?.role !== 'organisation') {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-lg font-semibold text-red-600">Access Denied</p>
//           <p className="text-gray-600 mt-2">Only organisation admins can access this page</p>
//           <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">Go to Dashboard</a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <AppLayout title="My Products">
//       <div className="p-6 max-w-3xl mx-auto">
//         <h2 className="text-xl font-bold mb-4">My Products</h2>
//         {loading && <div>Loading...</div>}
//         {error && <div className="text-red-600">{error}</div>}
//         <ul className="divide-y">
//           {products.map((product) => (
//             <li key={product.id} className="py-2">
//               <span className="font-medium">{product.product_name}</span>
//               <span className="ml-2 text-xs text-gray-500">Created: {new Date(product.create_date).toLocaleDateString()}</span>
//             </li>
//           ))}
//         </ul>
//         {products.length === 0 && !loading && <div>No products found.</div>}
//       </div>
//     </AppLayout>
//   );
// };

// export default MyProductsPage;


import { useEffect, useState } from 'react';
import { productApi, Product } from '@/lib/api/product.api';


export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getMyProducts();
        setProducts(res.data);
      } catch (err: any) {
        console.error('Fetch products error:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="text-center mt-10">No products found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Products</h1>

      <ul className="space-y-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="border rounded-md p-4 bg-white shadow-sm"
          >
            <p className="font-medium">{p.product_name}</p>
            <p className="text-sm text-gray-500">
              Created at: {new Date(p.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
