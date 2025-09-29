"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useClientAuth } from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";

function ClientLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { signIn, signOut, user, client, updatePassword, loading } =
    useClientAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    // Don't do anything while auth is still loading
    if (loading) return;

    if (user && client) {
      // Only redirect if we have both user AND client data
      router.push("/portal/projects"); // Changed from /portal/dashboard
    } else if (user && !client) {
      // Give it a bit more time in case client data is still loading
      const timeoutId = setTimeout(() => {
        if (user && !client) {
          // User authenticated but no client record found after timeout
          setError(
            "Access denied. This portal is for clients only. Use the admin portal for administrative access."
          );
          signOut();
        }
      }, 2000); // Wait 2 seconds for client data to load

      return () => clearTimeout(timeoutId);
    }
  }, [user, client, loading, router, signOut]);

  // In your handleLogin function in portal/login/page.tsx, add logging:
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn(formData.email, formData.password);

      if (result.success) {
        setIsFirstLogin(true);
        setShowPasswordUpdate(true);
      } else {
        setError(
          result.error || "Login failed. Please check your credentials."
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const result = await updatePassword(formData.newPassword);

      if (result.success) {
        // Clear temp password flag in database
        // This would require an additional API call
        router.push("/portal/projects"); // Changed from /portal/dashboard
      } else {
        setError(result.error || "Failed to update password");
      }
    } catch (error: any) {
      setError("Failed to update password. Please try again.");
      console.error("Password update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const skipPasswordUpdate = () => {
    router.push("/portal/projects"); // Changed from /portal/dashboard
  };

  // Show password update form for first-time login
  if (showPasswordUpdate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-deep via-indigo-deep/95 to-terracotta/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/images/amart-logo.png"
                alt="Amart Consult"
                width={150}
                height={50}
                className="mx-auto mb-4"
              />
            </Link>
            <h1 className="text-2xl font-serif font-bold text-white mb-2">
              Update Your Password
            </h1>
            <p className="text-indigo-100">
              Set a new password for your account
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-serif text-center text-indigo-deep">
                Welcome {client?.first_name}!
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Please set a new password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-indigo-deep focus:ring-indigo-deep"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      suppressHydrationWarning
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="pl-10 h-12 border-gray-200 focus:border-indigo-deep focus:ring-indigo-deep"
                      required
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside mt-1 text-xs">
                    <li>At least 8 characters long</li>
                    <li>Mix of letters and numbers recommended</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={skipPasswordUpdate}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Skip for Now
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-indigo-deep to-indigo-deep/90 hover:from-indigo-deep/90 hover:to-indigo-deep text-white font-medium transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Regular login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-deep via-indigo-deep/95 to-terracotta/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/amart-logo.png"
              alt="Amart Consult"
              width={150}
              height={50}
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">
            Client Portal
          </h1>
          <p className="text-indigo-100">Access your project dashboard</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-serif text-center text-indigo-deep">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign in to track your project progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-12 border-gray-200 focus:border-indigo-deep focus:ring-indigo-deep"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-indigo-deep focus:ring-indigo-deep"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                    suppressHydrationWarning
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/portal/forgot-password"
                  className="text-sm text-indigo-deep hover:text-terracotta transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-indigo-deep to-indigo-deep/90 hover:from-indigo-deep/90 hover:to-indigo-deep text-white font-medium transition-all duration-200 group"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            {/* Help Section */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Need help accessing your account?
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <p>• Check your email for login credentials</p>
                <p>• Contact us if you haven't received your account details</p>
              </div>
              <Link
                href="/contact"
                className="inline-block mt-3 text-sm text-indigo-deep hover:text-terracotta font-medium transition-colors"
              >
                Contact Support
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">
                  Administrator Access
                </p>
                <Link href="/admin/login">
                  <Button
                    variant="outline"
                    className="w-full h-10 border-indigo-deep/20 text-indigo-deep hover:bg-indigo-deep hover:text-white transition-all duration-200 group bg-transparent"
                  >
                    <Lock className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Admin Portal
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-indigo-100 hover:text-white transition-colors"
          >
            ← Back to main website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ClientLoginPages() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Updating...
        </div>
      }
    >
      <ClientLoginPage />
    </Suspense>
  );
}
