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


// import { useEffect, useState } from 'react';
// import { productApi, Product } from '@/lib/api/product.api';


// export default function MyProducts() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await productApi.getMyProducts();
//         setProducts(res.data);
//       } catch (err: any) {
//         console.error('Fetch products error:', err);
//         setError('Failed to fetch products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-10">Loading...</p>;
//   }

//   if (error) {
//     return <p className="text-center mt-10 text-red-600">{error}</p>;
//   }

//   if (products.length === 0) {
//     return <p className="text-center mt-10">No products found.</p>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">My Products</h1>

//       <ul className="space-y-3">
//         {products.map((p) => (
//           <li
//             key={p.id}
//             className="border rounded-md p-4 bg-white shadow-sm"
//           >
//             <p className="font-medium">{p.product_name}</p>
//             <p className="text-sm text-gray-500">
//               Created at: {new Date(p.created_at).toLocaleString()}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { productApi, Product } from "@/lib/api/product.api";
import { Pencil, Trash2 } from "lucide-react";

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newName, setNewName] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getMyProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    if (!editingProduct) return;

    await productApi.updateProduct(editingProduct.id, newName);
    setEditingProduct(null);
    setNewName("");
    loadProducts();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: number) => {
    const ok = window.confirm(
      "Are you sure you want to delete this product?\nAll prompts will also be deleted.",
    );
    if (!ok) return;

    await productApi.deleteProduct(id);
    loadProducts();
  };

  if (loading) {
    return <p className="p-6">Loading products...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">My Products</h1>

      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center border rounded-lg p-4 bg-white"
          >
            <div>
              <p className="font-medium">{p.product_name}</p>
              <p className="text-sm text-gray-500">
                Created at: {new Date(p.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingProduct(p);
                  setNewName(p.product_name);
                }}
                className="text-blue-600 hover:text-blue-800"
                title="Edit Product"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600 hover:text-red-800"
                title="Delete Product"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- EDIT MODAL ---------------- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="font-semibold mb-4">Edit Product</h3>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Product name"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

