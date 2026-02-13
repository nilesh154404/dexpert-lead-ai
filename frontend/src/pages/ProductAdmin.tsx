// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { AppLayout } from '@/components/layout/AppLayout';
// import { useAuth } from '@/contexts/AuthContext';
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
// } from '@/components/ui/dialog';

// // ✅ Create axios instance with baseURL + token
// const api = axios.create({
//   baseURL: 'http://localhost:3000/api/v1',
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });


// interface Product {
//   id: number;
//   organisation_id: string;
//   product_name: string;
//   create_date: string;
// }

// const ProductAdminPage = () => {
//   const { user } = useAuth();
//   const [productName, setProductName] = useState('');
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [open, setOpen] = useState(false);

//   // ✅ Fetch products using JWT tenant
//   const fetchProducts = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await api.get('/product/list');
//       setProducts(res.data);
//     } catch (err) {
//       setError('Failed to fetch products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Defensive check: Only allow organisation role
//   if (user?.role !== 'organisation') {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-lg font-semibold text-red-600">Access Denied</p>
//           <p className="text-gray-600 mt-2">Only organisation admins can access this page</p>
//           <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
//             Go to Dashboard
//           </a>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Create product (NO organisation_id)
//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     try {
//       await api.post('/product/create', {
//         product_name: productName,
//       });

//       setProductName('');
//       setOpen(false);
//       fetchProducts();
//     } catch (err) {
//       setError('Failed to create product');
//     }
//   };

//   return (
//     <AppLayout title="Products">
//       <div className="p-6 max-w-3xl mx-auto flex justify-center items-center min-h-60vh">
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">
//               Add Product
//             </button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <h3 className="text-lg font-semibold mb-2">Enter Product Name</h3>
//             </DialogHeader>

//             <form onSubmit={handleCreate}>
//               <div className="mb-4">
//                 <input
//                   type="text"
//                   value={productName}
//                   onChange={(e) => setProductName(e.target.value)}
//                   className="border px-2 py-1 w-full"
//                   placeholder="Product Name"
//                   required
//                 />
//               </div>

//               <DialogFooter>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded"
//                 >
//                   Save
//                 </button>
//               </DialogFooter>
//             </form>

//             {error && <div className="text-red-600 mt-2">{error}</div>}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </AppLayout>
//   );
// };

// export default ProductAdminPage;


import { useEffect, useState } from 'react';
import { productApi, Product } from '@/lib/api/product.api';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';

export default function ProductAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getMyProducts();
      setProducts(data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ Create product
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await productApi.createProduct(productName);
      setProductName('');
      setOpen(false);
      loadProducts();
    } catch {
      setError('Failed to create product');
    }
  };

  return (
    <AppLayout title="Products">
      <div className="p-6 max-w-3xl mx-auto">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Product
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <h3 className="text-lg font-semibold">Enter Product Name</h3>
            </DialogHeader>

            <form onSubmit={handleCreate}>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="border px-3 py-2 w-full"
                placeholder="Product name"
                required
              />

              <DialogFooter className="mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </DialogFooter>
            </form>

            {error && <p className="text-red-600 mt-2">{error}</p>}
          </DialogContent>
        </Dialog>

        {/* PRODUCT LIST */}
        <div className="mt-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-2">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="border p-3 rounded flex justify-between"
                >
                  <span>{p.product_name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
