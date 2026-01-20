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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Search } from 'lucide-react';

export default function TenantManagement() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantBranding | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<TenantBranding | null>(null);

  // Fetch all tenants
  const { data: tenantsData, isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => tenantsAdminApi.getAll(),
  });

  const tenants = tenantsData?.data || [];

  // Filter tenants by search query
  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tenant.chatbotName && tenant.chatbotName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Create tenant mutation
  const createMutation = useMutation({
    mutationFn: (data) => tenantsAdminApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsCreateDialogOpen(false);
      toast.success('Organization created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create organization');
    },
  });

  // Update tenant mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      tenantsAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsEditDialogOpen(false);
      setEditingTenant(null);
      toast.success('Organization updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update organization');
    },
  });

  // Delete tenant mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => tenantsAdminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setDeletingTenant(null);
      toast.success('Organization deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete organization');
    },
  });

  const handleEdit = (tenant: TenantBranding) => {
    setEditingTenant(tenant);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (tenant: TenantBranding) => {
    setDeletingTenant(tenant);
  };

  const handleCreateSubmit = async (data: any) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateSubmit = async (data: any) => {
    if (editingTenant) {
      await updateMutation.mutateAsync({
        id: editingTenant.id,
        data,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deletingTenant) {
      deleteMutation.mutate(deletingTenant.id);
    }
  };

  if (error) {
    return (
      <AppLayout title="Tenants" subtitle="Manage all organizations and their branding">
        <div className="text-center py-12">
          <p className="text-lg font-semibold text-red-600 mb-2">Failed to load tenants</p>
          <p className="text-gray-600">{(error as any)?.message || 'Please try again'}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Tenants" subtitle="Manage all organizations and their branding">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tenants by name, ID, or chatbot name..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="ai" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Tenant
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Tenants</p>
          <p className="text-2xl font-semibold mt-1">{tenants.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">With Chatbot</p>
          <p className="text-2xl font-semibold mt-1 text-emerald-600">
            {tenants.filter((t) => t.chatbotName).length}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Search Results</p>
          <p className="text-2xl font-semibold mt-1 text-blue-600">{filteredTenants.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Custom Branding</p>
          <p className="text-2xl font-semibold mt-1 text-violet-600">
            {tenants.filter((t) => t.logo).length}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        /* Tenant List */
        <TenantList
          tenants={filteredTenants}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={{
            [deletingTenant?.id || '']: deleteMutation.isPending,
          }}
        />
      )}

      {/* Create Tenant Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Tenant</DialogTitle>
            <DialogDescription>
              Set up a new tenant with branding and chatbot configuration
            </DialogDescription>
          </DialogHeader>
          <TenantForm
            onSubmit={handleCreateSubmit}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Tenant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>Update tenant details and branding</DialogDescription>
          </DialogHeader>
          {editingTenant && (
            <TenantForm
              onSubmit={handleUpdateSubmit}
              isLoading={updateMutation.isPending}
              defaultValues={editingTenant}
              isEditMode
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTenant} onOpenChange={() => setDeletingTenant(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tenant?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{deletingTenant?.name}</span>?
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
