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



// import { useEffect, useState } from "react";
// import { productApi, Product } from "@/lib/api/product.api";
// import { Pencil, Trash2 } from "lucide-react";

// export default function MyProducts() {
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newProductName, setNewProductName] = useState("");
//   const [newProductDescription, setNewProductDescription] = useState("");
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   // edit state
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [newName, setNewName] = useState("");

//   const loadProducts = async () => {
//     try {
//       setLoading(true);
//       const data = await productApi.getMyProducts();
//       setProducts(data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   /* ---------------- UPDATE ---------------- */
//   const handleUpdate = async () => {
//     if (!editingProduct) return;

//     await productApi.updateProduct(editingProduct.id, newName);
//     setEditingProduct(null);
//     setNewName("");
//     loadProducts();
//   };

//   /* ---------------- DELETE ---------------- */
//   const handleDelete = async (id: number) => {
//     const ok = window.confirm(
//       "Are you sure you want to delete this product?\nAll prompts will also be deleted.",
//     );
//     if (!ok) return;

//     await productApi.deleteProduct(id);
//     loadProducts();
//   };

//   if (loading) {
//     return <p className="p-6">Loading products...</p>;
//   }


//   /* ---------------- CREATE ---------------- */
// const handleCreate = async () => {
//   if (!newProductName.trim()) {
//     alert("Product name is required");
//     return;
//   }

//   await productApi.createProduct(
//     newProductName,
//     // newProductDescription
//   );

//   setShowAddModal(false);
//   setNewProductName("");
//   setNewProductDescription("");

//   loadProducts();
// };


  // return (
  //   <div className="p-6 max-w-4xl mx-auto">
  //     <h1 className="text-xl font-semibold mb-6">My Products</h1>

  //     <div className="space-y-4">
  //       {products.map((p) => (
  //         <div
  //           key={p.id}
  //           className="flex justify-between items-center border rounded-lg p-4 bg-white"
  //         >
  //           <div>
  //             <p className="font-medium">{p.product_name}</p>
  //             <p className="text-sm text-gray-500">
  //               Created at: {new Date(p.created_at).toLocaleString()}
  //             </p>
  //           </div>

  //           <div className="flex gap-3">
  //             <button
  //               onClick={() => {
  //                 setEditingProduct(p);
  //                 setNewName(p.product_name);
  //               }}
  //               className="text-blue-600 hover:text-blue-800"
  //               title="Edit Product"
  //             >
  //               <Pencil size={18} />
  //             </button>

  //             <button
  //               onClick={() => handleDelete(p.id)}
  //               className="text-red-600 hover:text-red-800"
  //               title="Delete Product"
  //             >
  //               <Trash2 size={18} />
  //             </button>
  //           </div>
  //         </div>
  //       ))}
  //     </div>

  //     {/* ---------------- EDIT MODAL ---------------- */}
  //     {editingProduct && (
  //       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  //         <div className="bg-white rounded-lg p-6 w-96">
  //           <h3 className="font-semibold mb-4">Edit Product</h3>

  //           <input
  //             value={newName}
  //             onChange={(e) => setNewName(e.target.value)}
  //             className="w-full border rounded px-3 py-2"
  //             placeholder="Product name"
  //           />

  //           <div className="flex justify-end gap-3 mt-4">
  //             <button
  //               onClick={() => setEditingProduct(null)}
  //               className="px-4 py-2 border rounded"
  //             >
  //               Cancel
  //             </button>

  //             <button
  //               onClick={handleUpdate}
  //               className="px-4 py-2 bg-blue-600 text-white rounded"
  //             >
  //               Save
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );


//   return (
//   <div className="p-6">
//     {/* HEADER */}
//     <div className="flex justify-between items-center mb-6">
//       <h1 className="text-xl font-semibold">Products</h1>

//       <button
//       //   onClick={() => alert("Add Product modal later")}
//       //   className="bg-black text-white px-4 py-2 rounded"
//       // >
//       //   + Add Product

//       onClick={() => setShowAddModal(true)}
//   className="bg-black text-white px-4 py-2 rounded"
// >
//   + Add Product
//       </button>
//     </div>

//     {/* TABLE */}
//     <div className="bg-white border rounded-lg overflow-hidden">
//       <table className="w-full text-sm">
//         <thead className="bg-gray-50 border-b">
//           <tr>
//             <th className="text-left p-4">Name</th>
//             <th className="text-left p-4">Description</th>
//             <th className="text-left p-4">Status</th>
//             <th className="text-right p-4">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {products.map((p) => (
//             <tr key={p.id} className="border-b">
//               <td className="p-4 font-medium">
//                 {p.product_name}
//               </td>

//               <td className="p-4 text-gray-500">
//                 {p.description || "—"}
//               </td>

//               {/* STATIC STATUS */}
//               <td className="p-4">
//                 <div className="flex items-center gap-2">
//                   <div className="w-10 h-5 bg-black rounded-full relative">
//                     <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
//                   </div>
//                   <span className="text-xs font-medium">Active</span>
//                 </div>
//               </td>

//               {/* ACTIONS */}
//               <td className="p-4 text-right flex justify-end gap-3">
//                 <button
//                   onClick={() => {
//                     setEditingProduct(p);
//                     setNewName(p.product_name);
//                   }}
//                   className="text-gray-600 hover:text-black"
//                   title="Edit"
//                 >
//                   <Pencil size={18} />
//                 </button>

//                 <button
//                   onClick={() => handleDelete(p.id)}
//                   className="text-gray-600 hover:text-red-600"
//                   title="Delete"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </td>
//             </tr>
//           ))}

//           {products.length === 0 && (
//             <tr>
//               <td
//                 colSpan={4}
//                 className="p-6 text-center text-gray-500"
//               >
//                 No products found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>

//     {/* EDIT MODAL (UNCHANGED) */}
//     {editingProduct && (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 w-96">
//           <h3 className="font-semibold mb-4">Edit Product</h3>

//           <input
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             className="w-full border rounded px-3 py-2"
//             placeholder="Product name"
//           />

//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               onClick={() => setEditingProduct(null)}
//               className="px-4 py-2 border rounded"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleUpdate}
//               className="px-4 py-2 bg-black text-white rounded"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     )}


//   {/* ---------------- ADD PRODUCT MODAL ---------------- */}
// {showAddModal && (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//     <div className="bg-white rounded-lg p-6 w-96">
//       <h3 className="font-semibold mb-4">Add Product</h3>

//       <div className="space-y-3">
//         <input
//           value={newProductName}
//           onChange={(e) => setNewProductName(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//           placeholder="Product name"
//         />

//         <textarea
//           value={newProductDescription}
//           onChange={(e) => setNewProductDescription(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//           placeholder="Product description (optional)"
//         />
//       </div>

//       <div className="flex justify-end gap-3 mt-4">
//         <button
//           onClick={() => setShowAddModal(false)}
//           className="px-4 py-2 border rounded"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleCreate}
//           className="px-4 py-2 bg-black text-white rounded"
//         >
//           Add
//         </button>
//       </div>
//     </div>
//   </div>
// )}






//   </div>
// );

// }


import { useEffect, useState } from "react";
import { productApi, Product } from "@/lib/api/product.api";
import { Pencil, Plus, Package, CalendarDays } from "lucide-react";

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- ADD MODAL ---------- */
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newOrder, setNewOrder] = useState(0);

  /* ---------- EDIT MODAL ---------- */
  const [editing, setEditing] = useState<Product | null>(null);

  /* ---------- LOAD ---------- */
  const loadProducts = async () => {
    setLoading(true);
    const data = await productApi.getMyProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ---------- ADD ---------- */
  const handleAdd = async () => {
    if (!newName.trim()) return alert("Product name required");

    await productApi.createProduct(newName, newDesc, newOrder);
    setNewName("");
    setNewDesc("");
    setNewOrder(0);
    setShowAdd(false);
    loadProducts();
  };

  /* ---------- UPDATE ---------- */
  const handleUpdate = async () => {
    if (!editing) return;

    await productApi.updateProduct(editing.id, {
      product_name: editing.product_name,
      description: editing.description,
      is_active: editing.is_active,
      display_order: editing.display_order,
    });

    setEditing(null);
    loadProducts();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and view all products within your organization.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-md hover:bg-gray-800 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* PRODUCT CARDS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-xl border border-gray-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 px-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            You haven't added any products yet. Click the "Add Product" button above to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-100 transition-colors">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1" title={p.product_name}>
                      {p.product_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <button
                  onClick={async () => {
                    const next = !p.is_active;
                    if (
                      !window.confirm(
                        next
                          ? "Are you sure you want to ACTIVATE this product?"
                          : "Are you sure you want to DEACTIVATE this product?"
                      )
                    )
                      return;

                    try {
                      await productApi.updateProduct(p.id, {
                        product_name: p.product_name,
                        description: p.description ?? null,
                        is_active: next,
                      });
                      await loadProducts();
                    } catch (err) {
                      alert("Failed to update product status");
                      console.error(err);
                    }
                  }}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-2 ${
                    p.is_active ? "bg-green-500" : "bg-gray-300"
                  }`}
                  title={p.is_active ? "Active" : "Inactive"}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      p.is_active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Card Body */}
              <div className="flex-grow mb-5">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {p.description || <span className="text-gray-400 italic">No description provided.</span>}
                </p>
                <p className="text-xs font-semibold text-gray-400 mt-2">Order: {p.display_order}</p>
              </div>

              {/* Card Footer (Actions) */}
              <div className="flex justify-end pt-4 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => setEditing({ ...p })}
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  <Pencil size={15} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- ADD MODAL ---------- */}
      {showAdd && (
        <Modal title="Create New Product" onClose={() => setShowAdd(false)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Lead Generation AI"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Product description (optional)"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Order (e.g., 1, 2, 3)</label>
            <input
              type="number"
              value={newOrder}
              onChange={(e) => setNewOrder(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <ModalActions onCancel={() => setShowAdd(false)} onConfirm={handleAdd} />
        </Modal>
      )}

      {/* ---------- EDIT MODAL ---------- */}
      {editing && (
        <Modal title="Edit Product" onClose={() => setEditing(null)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <input
              value={editing.product_name}
              onChange={(e) => setEditing({ ...editing, product_name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={editing.description || ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={3}
              placeholder="Product description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Order (e.g., 1, 2, 3)</label>
            <input
              type="number"
              value={editing.display_order}
              onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <button
              type="button"
              onClick={() =>
                setEditing({
                  ...editing,
                  is_active: !editing.is_active,
                })
              }
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                editing.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
              }`}
            >
              {editing.is_active ? "Active" : "Inactive"}
            </button>
          </div>

          <ModalActions onCancel={() => setEditing(null)} onConfirm={handleUpdate} />
        </Modal>
      )}
    </div>
  );
}

/* ---------------- SHARED UI ---------------- */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold mb-5 text-gray-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="flex justify-end gap-3 mt-6 pt-2">
      <button
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700 font-medium"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
      >
        Save
      </button>
    </div>
  );
}