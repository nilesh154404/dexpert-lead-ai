import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';

const ProductPromptPage = () => {
  const { user } = useAuth();

  if (user?.role !== 'organisation') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Access Denied</p>
          <p className="text-gray-600 mt-2">Only organisation admins can access this page</p>
          <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <AppLayout title="Product Prompt">
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Product Prompt</h2>
        <p className="mb-2">This section is for OrgAdmin to manage product prompts. (Add your prompt logic here.)</p>
        {/* Add prompt management UI here */}
      </div>
    </AppLayout>
  );
};

export default ProductPromptPage;
