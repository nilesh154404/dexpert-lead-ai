import React from 'react';
import PlanSelection from '@/components/dashboard/PlanSelection';
import PlanManagement from '@/components/dashboard/PlanManagement';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  // Assume user.role is 'admin' or 'superadmin'
  return (
    <AppLayout title="Subscription" subtitle="Manage your subscription plans here.">
      {/* Show plan selection for admin, plan management for superadmin */}
      {user?.role && user.role.toLowerCase().replace(/\s|_/g, '').includes('superadmin') ? (
        <PlanManagement />
      ) : (
        <PlanSelection />
      )}
    </AppLayout>
  );
};

export default SubscriptionPage;
