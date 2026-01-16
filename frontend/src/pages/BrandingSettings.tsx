import { useState, useEffect } from "react";
import { 
  Palette, 
  Type, 
  Image, 
  MessageSquare, 
  Save, 
  RefreshCw,
  Eye,
  Sparkles
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTenant } from "@/contexts/TenantContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const colorPresets = [
  { name: "Teal", primary: "222 47% 20%", accent: "173 80% 40%" },
  { name: "Purple", primary: "240 60% 50%", accent: "280 80% 60%" },
  { name: "Green", primary: "152 60% 35%", accent: "152 80% 45%" },
  { name: "Blue", primary: "220 70% 25%", accent: "210 90% 50%" },
  { name: "Orange", primary: "20 70% 30%", accent: "38 92% 50%" },
  { name: "Pink", primary: "340 60% 40%", accent: "340 80% 60%" },
];

export default function BrandingSettings() {
  const { tenant, updateTenant, isLoading } = useTenant();
  const [localBranding, setLocalBranding] = useState(tenant);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Update local state when tenant changes
  useEffect(() => {
    setLocalBranding(tenant);
    setHasChanges(false);
  }, [tenant]);

  const handleChange = (key: keyof typeof localBranding, value: string) => {
    setLocalBranding(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTenant({
        name: localBranding.name,
        logo: localBranding.logo,
        logomark: localBranding.logomark,
        primaryColor: localBranding.primaryColor,
        accentColor: localBranding.accentColor,
        fontFamily: localBranding.fontFamily,
        welcomeMessage: localBranding.welcomeMessage,
        chatbotName: localBranding.chatbotName,
        chatbotAvatar: localBranding.chatbotAvatar,
      });
      setHasChanges(false);
      toast({
        title: "Branding updated",
        description: "Your branding settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save branding settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalBranding(tenant);
    setHasChanges(false);
  };

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    setLocalBranding(prev => ({
      ...prev,
      primaryColor: preset.primary,
      accentColor: preset.accent,
    }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <AppLayout title="Branding Settings" subtitle="Customize your organization's appearance">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading branding settings...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Branding Settings" subtitle="Customize your organization's appearance">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList>
              <TabsTrigger value="colors" className="gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="identity" className="gap-2">
                <Image className="h-4 w-4" />
                Identity
              </TabsTrigger>
              <TabsTrigger value="chatbot" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chatbot
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-6 mt-6">
              {/* Color Presets */}
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-medium mb-4">Color Presets</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset)}
                      className={cn(
                        "group relative p-3 rounded-xl border transition-all hover:scale-105",
                        localBranding.accentColor === preset.accent && "ring-2 ring-ai"
                      )}
                    >
                      <div className="flex gap-1.5 mb-2">
                        <div 
                          className="h-6 w-6 rounded-full"
                          style={{ backgroundColor: `hsl(${preset.primary})` }}
                        />
                        <div 
                          className="h-6 w-6 rounded-full"
                          style={{ backgroundColor: `hsl(${preset.accent})` }}
                        />
                      </div>
                      <p className="text-xs font-medium">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="rounded-xl border bg-card p-5 space-y-4">
                <h3 className="font-medium">Custom Colors</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary Color (HSL)</Label>
                    <div className="flex gap-2">
                      <div 
                        className="h-10 w-10 rounded-lg border shrink-0"
                        style={{ backgroundColor: `hsl(${localBranding.primaryColor})` }}
                      />
                      <Input
                        value={localBranding.primaryColor}
                        onChange={(e) => handleChange("primaryColor", e.target.value)}
                        placeholder="222 47% 20%"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Accent Color (HSL)</Label>
                    <div className="flex gap-2">
                      <div 
                        className="h-10 w-10 rounded-lg border shrink-0"
                        style={{ backgroundColor: `hsl(${localBranding.accentColor})` }}
                      />
                      <Input
                        value={localBranding.accentColor}
                        onChange={(e) => handleChange("accentColor", e.target.value)}
                        placeholder="173 80% 40%"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="identity" className="space-y-6 mt-6">
              <div className="rounded-xl border bg-card p-5 space-y-4">
                <h3 className="font-medium">Organization Identity</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input
                      value={localBranding.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={localBranding.logo || ""}
                      onChange={(e) => handleChange("logo", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 200x50px PNG or SVG
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Input
                      value={localBranding.fontFamily || ""}
                      onChange={(e) => handleChange("fontFamily", e.target.value)}
                      placeholder="Inter, system-ui, sans-serif"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chatbot" className="space-y-6 mt-6">
              <div className="rounded-xl border bg-card p-5 space-y-4">
                <h3 className="font-medium">Chatbot Customization</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Chatbot Name</Label>
                    <Input
                      value={localBranding.chatbotName || ""}
                      onChange={(e) => handleChange("chatbotName", e.target.value)}
                      placeholder="AI Assistant"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Welcome Message</Label>
                    <Input
                      value={localBranding.welcomeMessage || ""}
                      onChange={(e) => handleChange("welcomeMessage", e.target.value)}
                      placeholder="Hi! How can I help you today?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Chatbot Avatar URL</Label>
                    <Input
                      value={localBranding.chatbotAvatar || ""}
                      onChange={(e) => handleChange("chatbotAvatar", e.target.value)}
                      placeholder="https://example.com/avatar.png"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || saving}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
            <Button
              variant="ai"
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Branding"}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Live Preview</h3>
            </div>
            
            {/* Mini Preview */}
            <div 
              className="rounded-xl border p-4 space-y-4"
              style={{ 
                fontFamily: localBranding.fontFamily || "inherit",
              }}
            >
              {/* Header Preview */}
              <div className="flex items-center gap-3">
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: `hsl(${localBranding.accentColor})` }}
                >
                  {localBranding.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{localBranding.name}</p>
                  <p className="text-xs text-muted-foreground">AI Platform</p>
                </div>
              </div>
              
              {/* Button Preview */}
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg text-sm text-white font-medium"
                  style={{ backgroundColor: `hsl(${localBranding.primaryColor})` }}
                >
                  Primary
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-sm text-white font-medium flex items-center gap-2"
                  style={{ backgroundColor: `hsl(${localBranding.accentColor})` }}
                >
                  <Sparkles className="h-4 w-4" />
                  AI Action
                </button>
              </div>
              
              {/* Chat Preview */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Chat Widget Preview</p>
                <div className="bg-secondary/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-6 w-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `hsl(${localBranding.accentColor} / 0.2)` }}
                    >
                      <Sparkles 
                        className="h-3 w-3" 
                        style={{ color: `hsl(${localBranding.accentColor})` }}
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {localBranding.chatbotName || "AI Assistant"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-8">
                    {localBranding.welcomeMessage || "Hi! How can I help you today?"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette Display */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-medium mb-4">Active Palette</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="h-10 w-10 rounded-lg border"
                  style={{ backgroundColor: `hsl(${localBranding.primaryColor})` }}
                />
                <div>
                  <p className="text-sm font-medium">Primary</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    hsl({localBranding.primaryColor})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="h-10 w-10 rounded-lg border"
                  style={{ backgroundColor: `hsl(${localBranding.accentColor})` }}
                />
                <div>
                  <p className="text-sm font-medium">Accent / AI</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    hsl({localBranding.accentColor})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
