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
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      console.error('Login error:', error);
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
          <div className="flex justify-between items-center mt-2 text-sm">
            <button
              type="button"
              className="text-gray-600 hover:underline focus:outline-none"
              onClick={() => setShowForgot(true)}
            >
              Reset password
            </button>
            <span className="text-gray-400">New user? <button type="button" className="underline hover:text-black" onClick={() => setActiveTab('signup')}>Sign up</button></span>
          </div>
          {showForgot && (
            <form onSubmit={handleForgotPassword} className="space-y-6 w-full flex flex-col items-center mt-4">
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
          )}
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
