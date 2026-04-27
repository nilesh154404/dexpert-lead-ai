import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { authApi, User } from "@/lib/api/auth.api";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.login(data),
    onSuccess: async (response) => {
      // Store token and user data directly from response
      localStorage.setItem('access_token', response.access_token);
      const userData: User = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role as User['role'],
        tenantId: response.tenantId,
        status: response.status as User['status'],
        department: response.department,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update auth context by reloading from localStorage
      // This ensures AuthContext picks up the new token
      window.location.href = '/';
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Invalid email or password";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Validation error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-ai/10 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-ai" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              variant="ai"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>
          </form>

          {/* <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Super Admin: superadmin@kindred.com / superadmin123</p>
              <p>Org Admin: john@techcorp.com / admin123</p>
              <p>Staff: jane@techcorp.com / staff123</p>
            </div> */}
          {/* </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
