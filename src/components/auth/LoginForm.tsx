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
    <div className="space-y-6 w-full">
      {/* Mascot encouragement */}
      <div className="flex flex-col items-center mb-2">
        <img src="/images/avatars/goldfish_3.png" alt="Mascot" className="w-14 h-14 object-contain drop-shadow mb-1 animate-bounce-slow" />
        <div className="text-timelingo-purple font-bold text-lg text-center">Welcome back, King! 💪</div>
        <div className="text-gray-500 text-sm text-center">Log in to continue your journey.</div>
      </div>
      <div className="bg-purple-50/60 border-2 border-purple-100 rounded-2xl shadow-lg p-6 w-full flex flex-col gap-6">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full font-bold rounded-full border-timelingo-purple hover:bg-purple-100 transition-all duration-150"
          onClick={signInWithGoogle}
          disabled={isGoogleLoading}
        >
          <Chrome className="mr-2 h-4 w-4" />
          {isGoogleLoading ? "Signing in..." : "Continue with Google"}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
        {!showForgot ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} className="rounded-full px-4 py-2 border-timelingo-purple focus:border-timelingo-purple" />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} className="rounded-full px-4 py-2 border-timelingo-purple focus:border-timelingo-purple" />
                    </FormControl>
                    <FormMessage className="text-red-500 font-semibold" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-timelingo-purple text-sm font-semibold hover:underline focus:outline-none"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-timelingo-purple hover:bg-yellow-400 hover:text-timelingo-navy text-white font-bold rounded-full py-3 text-lg shadow-lg transition-all duration-150 transform hover:scale-105 active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 w-full flex flex-col items-center">
            <div className="w-full">
              <label htmlFor="forgot-email" className="block text-timelingo-purple font-semibold mb-1">Enter your email</label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="your.email@example.com"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                className="rounded-full px-4 py-2 border-timelingo-purple focus:border-timelingo-purple w-full"
                required
              />
            </div>
            <div className="flex gap-2 w-full">
              <Button
                type="submit"
                className="flex-1 bg-timelingo-purple hover:bg-yellow-400 hover:text-timelingo-navy text-white font-bold rounded-full py-2 text-md shadow-lg transition-all duration-150"
                disabled={forgotLoading}
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Email'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full border-timelingo-purple"
                onClick={() => setShowForgot(false)}
              >
                Back
              </Button>
            </div>
          </form>
        )}
      </div>
      <style>{`
        @keyframes bounce { 0%{transform:translateY(0);} 50%{transform:translateY(-15px);} 100%{transform:translateY(0);} }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
      `}</style>
    </div>
  );
};

export default LoginForm;
