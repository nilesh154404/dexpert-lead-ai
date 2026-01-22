import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsAdminApi, TenantBranding } from '@/lib/api/tenants-admin.api';
import { TenantForm } from '@/components/tenants/TenantForm';
import { TenantList } from '@/components/tenants/TenantList';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Search } from 'lucide-react';

export default function TenantManagement() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] =
    useState<TenantBranding | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsAdminApi.getAll,
  });

  const tenants = data?.data || [];

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: tenantsAdminApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsCreateDialogOpen(false);
      toast.success('Organization created successfully!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) =>
      tenantsAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsEditDialogOpen(false);
      setEditingTenant(null);
      toast.success('Organization updated successfully!');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (tenant: TenantBranding) =>
      tenant.isActive
        ? tenantsAdminApi.deactivate(tenant.id)
        : tenantsAdminApi.activate(tenant.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant status updated successfully!');
    },
  });

  const handleToggleStatus = (tenant: TenantBranding) => {
    toggleStatusMutation.mutate(tenant);
  };

  if (error) {
    return (
      <AppLayout title="Tenants" subtitle="Manage organizations">
        Failed to load tenants
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Tenants" subtitle="Manage all organizations">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            placeholder="Search tenants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Tenant
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="animate-spin mx-auto" />
      ) : (
        <TenantList
          tenants={filteredTenants}
          onEdit={(t) => {
            setEditingTenant(t);
            setIsEditDialogOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          isUpdating={{
            [toggleStatusMutation.variables?.id || '']:
              toggleStatusMutation.isPending,
          }}
        />
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Tenant</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <TenantForm
            onSubmit={createMutation.mutateAsync}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {editingTenant && (
            <TenantForm
              defaultValues={editingTenant}
              isEditMode
              onSubmit={(data) =>
                updateMutation.mutateAsync({
                  id: editingTenant.id,
                  data,
                })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
