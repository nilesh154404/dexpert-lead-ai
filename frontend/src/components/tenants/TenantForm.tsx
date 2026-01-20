import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { CreateTenantDto, UpdateTenantDto, TenantBranding } from '@/lib/api/tenants-admin.api';
import { parseHSLString, toHSLString, hslToHex } from '@/lib/color-utils';

const tenantFormSchema = z.object({
  name: z.string().min(1, 'Organization name is required').min(3, 'Name must be at least 3 characters'),
  logo: z.string().optional().or(z.literal('')),
  logomark: z.string().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^\d+ \d+% \d+%$/, 'Invalid color format'),
  accentColor: z.string().regex(/^\d+ \d+% \d+%$/, 'Invalid color format'),
  fontFamily: z.string().optional().or(z.literal('')),
  welcomeMessage: z.string().optional().or(z.literal('')),
  chatbotName: z.string().optional().or(z.literal('')),
  chatbotAvatar: z.string().optional().or(z.literal('')),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

interface TenantFormProps {
  onSubmit: (data: CreateTenantDto | UpdateTenantDto) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: TenantBranding;
  isEditMode?: boolean;
}

const defaultColors = {
  primary: '240 60% 50%',
  accent: '280 80% 60%',
};

export function TenantForm({ onSubmit, isLoading = false, defaultValues, isEditMode = false }: TenantFormProps) {
  const [showColorPickers, setShowColorPickers] = useState(false);

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          logo: defaultValues.logo || '',
          logomark: defaultValues.logomark || '',
          primaryColor: defaultValues.primaryColor,
          accentColor: defaultValues.accentColor,
          fontFamily: defaultValues.fontFamily || '',
          welcomeMessage: defaultValues.welcomeMessage || '',
          chatbotName: defaultValues.chatbotName || '',
          chatbotAvatar: defaultValues.chatbotAvatar || '',
        }
      : {
          name: '',
          logo: '',
          logomark: '',
          primaryColor: defaultColors.primary,
          accentColor: defaultColors.accent,
          fontFamily: '',
          welcomeMessage: '',
          chatbotName: '',
          chatbotAvatar: '',
        },
  });

  const primaryColor = form.watch('primaryColor');
  const accentColor = form.watch('accentColor');
  const primaryHex = hslToHex(...primaryColor.match(/\d+/g)!.map(Number));
  const accentHex = hslToHex(...accentColor.match(/\d+/g)!.map(Number));

  const handleColorChange = (field: 'primaryColor' | 'accentColor', hex: string) => {
    // Parse hex and convert to HSL
    const hsl = require('@/lib/color-utils').hexToHSL(hex);
    form.setValue(field, toHSLString(hsl));
  };

  const handleSubmit = async (values: TenantFormValues) => {
    await onSubmit(values);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Organization details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TechCorp Solutions" {...field} />
                    </FormControl>
                    <FormDescription>The name of your organization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormDescription>Full logo image URL</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logomark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logomark URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logomark.png" {...field} />
                    </FormControl>
                    <FormDescription>Small icon/logomark URL</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Branding Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Customize your organization's theme colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Primary Color */}
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <div className="flex gap-2">
                        <div
                          className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer"
                          style={{ backgroundColor: primaryHex }}
                          onClick={() => setShowColorPickers(!showColorPickers)}
                          title="Click to pick color"
                        />
                        <FormControl>
                          <Input placeholder="240 60% 50%" {...field} className="flex-1" />
                        </FormControl>
                      </div>
                      <FormDescription>HSL format: "240 60% 50%"</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Accent Color */}
                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accent Color</FormLabel>
                      <div className="flex gap-2">
                        <div
                          className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer"
                          style={{ backgroundColor: accentHex }}
                          onClick={() => setShowColorPickers(!showColorPickers)}
                          title="Click to pick color"
                        />
                        <FormControl>
                          <Input placeholder="280 80% 60%" {...field} className="flex-1" />
                        </FormControl>
                      </div>
                      <FormDescription>HSL format: "280 80% 60%"</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="fontFamily"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Family</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Inter, Helvetica" {...field} />
                    </FormControl>
                    <FormDescription>Brand font name (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Chatbot Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Settings</CardTitle>
              <CardDescription>Configure your AI chatbot appearance and messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="chatbotName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chatbot Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TechBot, AI Assistant" {...field} />
                    </FormControl>
                    <FormDescription>Name displayed in chatbot interface</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chatbotAvatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chatbot Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.png" {...field} />
                    </FormControl>
                    <FormDescription>Profile picture for chatbot</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="welcomeMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Hi! How can I help you today?" {...field} rows={3} />
                    </FormControl>
                    <FormDescription>Message shown when chatbot starts a conversation</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="reset">
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Update Organization' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
