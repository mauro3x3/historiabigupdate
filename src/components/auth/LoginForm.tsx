import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Chrome } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the schema for the login form
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  setActiveTab: (tab: string) => void;
};

const LoginForm = ({ setActiveTab }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInWithGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error("Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle login form submission
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    setPendingEmail(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        // If error is due to non-existent user, show a custom message
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          setLoginError("No account found for this email. You have to sign up first!");
          setPendingEmail(values.email);
        } else {
          setLoginError(error.message);
        }
        toast.error(error.message);
      } else {
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent! Check your inbox.');
        setShowForgot(false);
        setForgotEmail('');
      }
    } catch (err) {
      toast.error('Failed to send reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} className="rounded-md px-4 py-3 border border-gray-200 focus:border-timelingo-purple bg-white text-black placeholder-gray-400 w-full shadow-sm mb-4" style={{ fontFamily: 'DM Sans, Inter, sans-serif' }} />
                </FormControl>
                <FormMessage className="text-red-500 font-semibold" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} className="rounded-md px-4 py-3 border border-gray-200 focus:border-timelingo-purple bg-white text-black placeholder-gray-400 w-full shadow-sm mb-6" style={{ fontFamily: 'DM Sans, Inter, sans-serif' }} />
                </FormControl>
                <FormMessage className="text-red-500 font-semibold" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-br from-timelingo-purple via-purple-400 to-yellow-300 text-white font-bold rounded-full py-3 text-lg shadow-lg transition-all duration-150 mt-2 tracking-widest uppercase"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
          {/* Prominent Sign Up button */}
          <Button
            type="button"
            className="w-full bg-gradient-to-br from-yellow-300 via-purple-400 to-timelingo-purple text-white font-bold rounded-full py-3 text-lg shadow-lg transition-all duration-150 mt-2 tracking-widest uppercase border-2 border-timelingo-purple"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            onClick={() => setActiveTab('signup')}
          >
            Sign up
          </Button>
          {/* Prominent Forgot Password button */}
          <Button
            type="button"
            className="w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-black font-bold rounded-full py-3 text-lg shadow-lg transition-all duration-150 mt-2 tracking-widest uppercase border-2 border-gray-400"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            onClick={() => setShowForgot(true)}
          >
            Forgot password?
          </Button>
          {/* Error message for non-existent user */}
          {loginError && (
            <div className="mt-4 text-center text-red-600 font-semibold">
              {loginError}
              {loginError.includes('No account found') && (
                <div className="mt-2">
                  <Button
                    type="button"
                    className="w-full bg-yellow-400 text-white font-bold rounded-full py-2 text-base shadow"
                    onClick={() => {
                      setActiveTab('signup');
                    }}
                  >
                    Go to Sign Up
                  </Button>
                </div>
              )}
            </div>
          )}
          {/* Forgot password form modal */}
          {showForgot && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative flex flex-col items-center">
                <button className="absolute top-4 right-4 text-gray-500 text-2xl font-bold" onClick={() => setShowForgot(false)}>✕</button>
                <h2 className="text-xl font-bold mb-4">Reset your password</h2>
                <form onSubmit={handleForgotPassword} className="space-y-6 w-full flex flex-col items-center">
                  <div className="w-full">
                    <label htmlFor="forgot-email" className="block text-gray-700 font-bold mb-2 text-base">Enter your email</label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="rounded-md px-4 py-3 border border-gray-300 focus:border-black w-full bg-white text-base"
                      required
                    />
                  </div>
                  <div className="flex gap-4 w-full">
                    <Button type="button" variant="outline" className="w-1/2 rounded-full py-3 text-base" onClick={() => setShowForgot(false)} disabled={forgotLoading}>Cancel</Button>
                    <Button type="submit" className="w-1/2 bg-black text-white rounded-full py-3 text-base shadow" disabled={forgotLoading}>
                      {forgotLoading ? 'Sending...' : 'Send Reset Email'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
