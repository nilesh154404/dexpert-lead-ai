import { TenantBranding } from '@/lib/api/tenants-admin.api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Power, Globe, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { hslToHex } from '@/lib/color-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TenantListProps {
  tenants: TenantBranding[];
  onEdit: (tenant: TenantBranding) => void;
  onToggleStatus: (tenant: TenantBranding) => void;
  isUpdating?: { [key: string]: boolean };
}

export function TenantList({
  tenants,
  onEdit,
  onToggleStatus,
  isUpdating = {},
}: TenantListProps) {
  if (tenants.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No organizations yet</p>
        <p className="text-sm text-gray-500">Create your first organization to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead>Organization</TableHead>
            <TableHead>Branding</TableHead>
            <TableHead>Chatbot</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => {
            const primaryHex = hslToHex(...tenant.primaryColor.match(/\d+/g)!.map(Number));
            const accentHex = hslToHex(...tenant.accentColor.match(/\d+/g)!.map(Number));
            const createdDate = new Date(tenant.createdAt);
            const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

            return (
              <TableRow key={tenant.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {tenant.logo ? (
                      <img
                        src={tenant.logo}
                        alt={tenant.name}
                        className="h-9 w-9 rounded-full object-cover bg-secondary"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                        {tenant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">{tenant.id}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: primaryHex }}
                    />
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: accentHex }}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  {tenant.chatbotName ? (
                    <Badge variant="outline">{tenant.chatbotName}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {timeAgo}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(tenant)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onToggleStatus(tenant)}
                        disabled={isUpdating[tenant.id]}
                      >
                        <Power className="h-4 w-4 mr-2" />
                        {tenant.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
