
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Users, ShoppingBag, Star, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const { toast } = useToast();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/store'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userType: 'admin' | 'store_member') => {
    if (userType === 'admin') {
      setEmail('admin@example.com');
    } else {
      setEmail('john@store1.com');
    }
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-20 w-60 h-60 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Hero content */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              <span>Trusted by 1000+ stores</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Welcome to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                Store Manager
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Streamline your store operations with our powerful management platform. 
              Track orders, manage inventory, and grow your business effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Order Management</h3>
              <p className="text-sm text-gray-600">Track and process orders efficiently</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Team Collaboration</h3>
              <p className="text-sm text-gray-600">Work seamlessly with your team</p>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-600 mt-2">Access your dashboard and manage your store</p>
          </div>

          <Card className="shadow-2xl backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-medium">Demo Accounts</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 border-2 hover:bg-indigo-50 hover:border-indigo-200"
                  onClick={() => fillDemoCredentials('admin')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Admin Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 border-2 hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => fillDemoCredentials('store_member')}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Store Demo
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center bg-gray-50 rounded-lg p-3">
                💡 <strong>Demo Password:</strong> password (for all demo accounts)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
