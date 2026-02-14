// import React from 'react';
// import { AppLayout } from '@/components/layout/AppLayout';
// import { useAuth } from '@/contexts/AuthContext';

// const ProductPromptPage = () => {
//   const { user } = useAuth();

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
//     <AppLayout title="Product Prompt">
//       <div className="p-6 max-w-3xl mx-auto">
//         <p className="mb-2">This section is for OrgAdmin to manage product prompts. (Add your prompt logic here.)</p>
//         {/* Add prompt management UI here */}
//       </div>
//     </AppLayout>
//   );
// };

// export default ProductPromptPage;


// import React from 'react';
// import { useAuth } from '@/contexts/AuthContext';

// const ProductPromptPage = () => {
//   const { user } = useAuth();

//   if (user?.role !== 'organisation') {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-lg font-semibold text-red-600">Access Denied</p>
//           <p className="text-gray-600 mt-2">
//             Only organisation admins can access this page
//           </p>
//           <a
//             href="/"
//             className="text-blue-600 hover:underline mt-4 inline-block"
//           >
//             Go to Dashboard
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold mb-2">Product Prompt</h1>
//       <p className="text-muted-foreground">
//         This section is for OrgAdmin to manage product prompts.
//       </p>

//       {/* Prompt management UI goes here */}
//     </div>
//   );
// };

// export default ProductPromptPage;


// import { useEffect, useState } from "react";

// type Product = {
//   id: number;
//   product_name: string;
// };

// const mockProducts: Product[] = [
//   { id: 1, product_name: "CRM Tool" },
//   { id: 2, product_name: "Analytics AI" },
//   { id: 3, product_name: "Chatbot Engine" },
// ];

// const ProductPromptPage = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [promptText, setPromptText] = useState("");

//   useEffect(() => {
//     // Later replace with API call
//     setProducts(mockProducts);
//   }, []);

//   const handleSave = () => {
//     if (!selectedProduct) return;
//     console.log("Saving prompt for:", selectedProduct.product_name);
//     console.log(promptText);
//   };

//   const handleClear = () => {
//     setPromptText("");
//   };

//   return (
//     <div className="flex h-[calc(100vh-64px)]">
//       {/* LEFT: PRODUCT LIST */}
//       <div className="w-1/4 border-r bg-white p-4">
//         <h2 className="font-semibold mb-4">Products</h2>

//         <ul className="space-y-2">
//           {products.map((product) => (
//             <li
//               key={product.id}
//               onClick={() => setSelectedProduct(product)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedProduct?.id === product.id
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               {product.product_name}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* RIGHT: PROMPT EDITOR */}
//       <div className="flex-1 p-6">
//         {!selectedProduct ? (
//           <div className="text-gray-500 text-center mt-20">
//             Select a product to add prompt
//           </div>
//         ) : (
//           <>
//             <h2 className="text-lg font-semibold mb-2">
//               Product: {selectedProduct.product_name}
//             </h2>

//             <textarea
//               value={promptText}
//               onChange={(e) => setPromptText(e.target.value)}
//               placeholder="Enter full product prompt here..."
//               className="w-full h-64 border rounded p-3 mt-4"
//             />

//             <div className="flex gap-3 mt-4">
//               <button
//                 onClick={handleSave}
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 Save
//               </button>

//               <button
//                 onClick={handleClear}
//                 className="border px-4 py-2 rounded"
//               >
//                 Clear
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductPromptPage;

// import React, { useState } from "react";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { cn } from "@/lib/utils";

// const mockProducts = [
//   { id: 1, name: "CRM Tool" },
//   { id: 2, name: "Analytics AI" },
//   { id: 3, name: "Chatbot Engine" },
// ];

// const mockVersions = [
//   { id: 3, label: "v3", text: "Latest prompt version..." },
//   { id: 2, label: "v2", text: "Older prompt version..." },
//   { id: 1, label: "v1", text: "Initial prompt version..." },
// ];

// export default function ProductPrompt() {
//   const [selectedProduct, setSelectedProduct] = useState<any>(mockProducts[0]);
//   const [promptText, setPromptText] = useState("");
//   const [versions, setVersions] = useState(mockVersions);
//   const [selectedVersion, setSelectedVersion] = useState<any>(null);

//   const handleSave = () => {
//     // later → call POST /prompt/:productId
//     alert("Save clicked (new version will be created)");
//   };

//   const handleClear = () => {
//     setPromptText("");
//     setSelectedVersion(null);
//   };

//   const handleVersionClick = (version: any) => {
//     setSelectedVersion(version);
//     setPromptText(version.text);
//   };

//   return (
//     <AppLayout title="Product Prompt">
//       <div className="grid grid-cols-12 gap-6 p-6">

//         {/* ---------------- LEFT: PRODUCTS ---------------- */}
//         <div className="col-span-3 border rounded-lg p-4">
//           <h3 className="font-semibold mb-4">Products</h3>

//           <ul className="space-y-2">
//             {mockProducts.map((product) => (
//               <li
//                 key={product.id}
//                 className={cn(
//                   "cursor-pointer rounded px-3 py-2",
//                   selectedProduct.id === product.id
//                     ? "bg-blue-600 text-white"
//                     : "hover:bg-gray-100"
//                 )}
//                 onClick={() => {
//                   setSelectedProduct(product);
//                   setPromptText("");
//                   setSelectedVersion(null);
//                 }}
//               >
//                 {product.name}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* ---------------- RIGHT: PROMPT + VERSIONS ---------------- */}
//         <div className="col-span-9 space-y-6">

//           {/* PROMPT EDITOR */}
//           <div>
//             <h3 className="font-semibold mb-2">
//               Product: {selectedProduct.name}
//             </h3>

//             <Textarea
//               placeholder="Enter full product prompt here..."
//               className="min-h-[180px]"
//               value={promptText}
//               onChange={(e) => setPromptText(e.target.value)}
//             />

//             <div className="mt-4 flex gap-3">
//               <Button onClick={handleSave}>Save</Button>
//               <Button variant="outline" onClick={handleClear}>
//                 Clear
//               </Button>
//             </div>
//           </div>

//           {/* VERSIONS */}
//           <div className="border rounded-lg p-4">
//             <h3 className="font-semibold mb-3">Versions</h3>

//             {versions.length === 0 ? (
//               <p className="text-sm text-muted-foreground">
//                 No versions available
//               </p>
//             ) : (
//               <ul className="space-y-2">
//                 {versions.map((version) => (
//                   <li
//                     key={version.id}
//                     onClick={() => handleVersionClick(version)}
//                     className={cn(
//                       "cursor-pointer rounded px-3 py-2 border",
//                       selectedVersion?.id === version.id
//                         ? "bg-blue-50 border-blue-500"
//                         : "hover:bg-gray-50"
//                     )}
//                   >
//                     {version.label}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//         </div>
//       </div>
//     </AppLayout>
//   );
// }


// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";

// type Product = {
//   id: number;
//   product_name: string;
// };

// export default function ProductPrompt() {
//   const { user } = useAuth();

//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [promptText, setPromptText] = useState("");

//   // 🔹 TEMP: static data (replace with API later)
//   useEffect(() => {
//     setProducts([
//       { id: 1, product_name: "CRM Tool" },
//       { id: 2, product_name: "Analytics AI" },
//       { id: 3, product_name: "Chatbot Engine" },
//     ]);
//   }, []);

//   if (user?.role !== "organisation") {
//     return (
//       <div className="min-h-[80vh] flex items-center justify-center">
//         <p className="text-red-600 font-semibold">Access Denied</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[80vh] p-6">
//       <div className="grid grid-cols-12 gap-6">
        
//         {/* LEFT PANEL */}
//         <div className="col-span-3 bg-white rounded-lg border p-4">
//           <h3 className="font-semibold mb-4">Products</h3>

//           <ul className="space-y-2">
//             {products.map((p) => (
//               <li
//                 key={p.id}
//                 onClick={() => {
//                   setSelectedProduct(p);
//                   setPromptText("");
//                 }}
//                 className={`cursor-pointer p-2 rounded ${
//                   selectedProduct?.id === p.id
//                     ? "bg-blue-600 text-white"
//                     : "hover:bg-gray-100"
//                 }`}
//               >
//                 {p.product_name}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="col-span-9 bg-white rounded-lg border p-6">
//           {!selectedProduct ? (
//             <p className="text-gray-500">
//               Select a product to add prompt
//             </p>
//           ) : (
//             <>
//               <h2 className="font-semibold mb-4">
//                 Product: {selectedProduct.product_name}
//               </h2>

//               <textarea
//                 value={promptText}
//                 onChange={(e) => setPromptText(e.target.value)}
//                 placeholder="Enter full product prompt here..."
//                 className="w-full h-40 border rounded p-3"
//               />

//               <div className="flex gap-3 mt-4">
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded">
//                   Save
//                 </button>
//                 <button
//                   className="px-4 py-2 border rounded"
//                   onClick={() => setPromptText("")}
//                 >
//                   Clear
//                 </button>
//               </div>

//               {/* VERSION SECTION */}
//               <div className="mt-6">
//                 <h3 className="font-semibold mb-2">Versions</h3>
//                 <div className="space-y-2">
//                   <div className="border rounded p-2">v3</div>
//                   <div className="border rounded p-2">v2</div>
//                   <div className="border rounded p-2">v1</div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { promptApi, Product, PromptVersion } from "@/lib/api/prompt.api";



export default function ProductPrompt() {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [promptText, setPromptText] = useState("");
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD PRODUCTS ---------------- */
  useEffect(() => {
    promptApi.getProducts().then(setProducts);
  }, []);

  /* ---------------- LOAD PROMPT + VERSIONS ---------------- */
  const selectProduct = async (product: Product) => {
    setSelectedProduct(product);
    setLoading(true);

    const [latest, allVersions] = await Promise.all([
      promptApi.getLatest(product.id),
      promptApi.getVersions(product.id),
    ]);

    setPromptText(latest?.prompt_text || "");
    setVersions(allVersions);
    setLoading(false);
  };

  /* ---------------- SAVE PROMPT ---------------- */
  const savePrompt = async () => {
    if (!selectedProduct) return;

    const nextVersion = `v${versions.length + 1}`;

    await promptApi.savePrompt(
      selectedProduct.id,
      promptText,
      nextVersion
    );

    /* ---------------- DEPLOY VERSION ---------------- */
const deployVersion = async (promptId: number) => {
  if (!selectedProduct) return;

  const confirmDeploy = window.confirm(
    "Are you sure you want to make this version PRODUCTION?\nThis will replace the current production version."
  );

  if (!confirmDeploy) return;

  await promptApi.deployPrompt(selectedProduct.id, promptId);

  // Reload versions + latest
  const updatedVersions = await promptApi.getVersions(selectedProduct.id);
  const latest = await promptApi.getLatest(selectedProduct.id);

  setVersions(updatedVersions);
  setPromptText(latest?.prompt_text || "");
};


    // Reload versions + latest
    const updatedVersions = await promptApi.getVersions(selectedProduct.id);
    const latest = await promptApi.getLatest(selectedProduct.id);

    setVersions(updatedVersions);
    setPromptText(latest?.prompt_text || "");
  };

  if (user?.role !== "organisation") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-red-600 font-semibold">Access Denied</p>
      </div>
    );
  }

//   const deployVersion = async (promptId: number) => {
//   if (!selectedProduct) return;

//   const confirmDeploy = window.confirm(
//     "Are you sure you want to make this version production? This will replace the current production version."
//   );

//   if (!confirmDeploy) return;

//   try {
//     await promptApi.deployPrompt(selectedProduct.id, promptId);

//     // Reload versions after deploy
//     const updatedVersions = await promptApi.getVersions(selectedProduct.id);
//     setVersions(updatedVersions);

//     alert("Version deployed successfully 🚀");
//   } catch (err) {
//     console.error(err);
//     alert("Failed to deploy version");
//   }
// };

const deployVersion = async (promptId: number) => {
  if (!selectedProduct?.id) {
    alert("Product not selected");
    return;
  }

  const confirmDeploy = window.confirm(
    "Are you sure you want to make this version production?"
  );

  if (!confirmDeploy) return;

  try {
    await promptApi.deployVersion(
      Number(selectedProduct.id),
      Number(promptId)
    );

    // 🔥 VERY IMPORTANT: reload fresh state from backend
    const updatedVersions = await promptApi.getVersions(
      selectedProduct.id
    );

    setVersions(updatedVersions);

    alert("Version deployed successfully");
  } catch (error) {
    console.error("Deploy error:", error);
    alert("Failed to deploy version");
  }
};



  return (
    <div className="min-h-[80vh] p-6">
      <div className="grid grid-cols-12 gap-6">

        {/* ---------------- LEFT PANEL ---------------- */}
        <div className="col-span-3 bg-white rounded-lg border p-4">
          <h3 className="font-semibold mb-4">Products</h3>

          <ul className="space-y-2">
            {products.map((p) => (
              <li
                key={p.id}
                onClick={() => selectProduct(p)}
                className={`cursor-pointer p-2 rounded ${
                  selectedProduct?.id === p.id
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {p.product_name}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- RIGHT PANEL ---------------- */}
        <div className="col-span-9 bg-white rounded-lg border p-6">
          {!selectedProduct ? (
            <p className="text-gray-500">
              Select a product to add prompt
            </p>
          ) : loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2 className="font-semibold mb-4">
                Product: {selectedProduct.product_name}
              </h2>
              
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter full product prompt here..."
                className="w-full h-40 border rounded p-3"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={savePrompt}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setPromptText("")}
                >
                  Clear
                </button>
              </div>

              {/* ---------------- VERSIONS ---------------- */}
              <div className="mt-6">
  <h3 className="font-semibold mb-2">Versions</h3>

  <div className="space-y-2">
    {versions.map((v) => (
      <div
        key={v.prompt_id}
        className={`flex items-center justify-between border rounded p-2 ${
          v.is_production ? "border-green-500 bg-green-50" : ""
        }`}
      >
        {/* LEFT: Version info */}
        <div
          onClick={() => setPromptText(v.prompt_text)}
          className="cursor-pointer"
        >
          <span className="font-medium">{v.version}</span>

          {v.is_production && (
            <span className="ml-3 text-green-600 font-semibold">
              ● PRODUCTION
            </span>
          )}
        </div>

        {/* RIGHT: Deploy button */}
        {!v.is_production && (
          <button
            onClick={() => deployVersion(v.prompt_id)}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Production
          </button>
        )}
      </div>
    ))}
  </div>
</div>

            </>
          )}
        </div>

      </div>
    </div>
  );
}
