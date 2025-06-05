import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
    <div className="w-full flex items-center justify-center bg-white font-inter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-7">
          <h2 className="text-3xl font-extrabold text-center text-black mb-1 tracking-tight">Log In</h2>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 border border-black rounded-xl py-0 px-6 text-base font-medium text-black bg-white hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-black cursor-pointer h-14 mb-3"
            disabled={isGoogleLoading}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
            </span>
            <span className="flex-1 text-center">{isGoogleLoading ? 'Loading...' : 'Continue with Google'}</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-black rounded-xl py-0 px-6 text-base font-medium text-black bg-white hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-black cursor-pointer h-14 mb-6"
            style={{ fontFamily: 'Inter, sans-serif' }}
            disabled
          >
            <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
            </span>
            <span className="flex-1 text-center">Continue with Apple</span>
          </button>
          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className="rounded-xl px-4 py-4 border border-gray-300 focus:border-black bg-white text-black placeholder-gray-300 w-full text-base font-normal focus:outline-none focus:ring-2 focus:ring-black h-14"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500 font-normal mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                    className="rounded-xl px-4 py-4 border border-gray-300 focus:border-black bg-white text-black placeholder-gray-300 w-full text-base font-normal focus:outline-none focus:ring-2 focus:ring-black h-14"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500 font-normal mt-1" />
              </FormItem>
            )}
          />
          <button
            type="submit"
            className="w-full bg-black text-white font-bold rounded-xl py-4 text-base transition-all duration-150 text-center hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer h-14"
            disabled={isLoading}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
          <button
            type="button"
            className="w-full bg-white text-black font-normal rounded-xl py-4 text-base border border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer h-14"
            onClick={() => setActiveTab('signup')}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Sign up
          </button>
          <button
            type="button"
            className="w-full text-gray-400 font-normal rounded-xl py-2 text-xs hover:underline text-center mt-1 focus:outline-none cursor-pointer"
            onClick={() => setShowForgot(true)}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Forgot password?
          </button>
          {loginError && (
            <div className="mt-1 text-center text-red-500 text-xs font-normal">
              {loginError}
              {loginError.includes('No account found') && (
                <div className="mt-2">
                  <button
                    type="button"
                    className="w-full bg-white text-black font-normal rounded-xl py-3 text-base border border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer h-14"
                    onClick={() => setActiveTab('signup')}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Go to Sign Up
                  </button>
                </div>
              )}
            </div>
          )}
          {showForgot && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative flex flex-col items-center border border-gray-200">
                <button className="absolute top-4 right-4 text-gray-400 text-2xl font-bold focus:outline-none cursor-pointer" onClick={() => setShowForgot(false)} style={{ fontFamily: 'Inter, sans-serif' }}>✕</button>
                <h2 className="text-xl font-bold mb-4 text-black text-center" style={{ fontFamily: 'Inter, sans-serif' }}>Reset your password</h2>
                <form onSubmit={handleForgotPassword} className="w-full flex flex-col gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="rounded-xl px-4 py-4 border border-gray-300 focus:border-black bg-white text-black placeholder-gray-300 w-full text-base font-normal focus:outline-none focus:ring-2 focus:ring-black h-14"
                    required
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white font-bold rounded-xl py-4 text-base mt-2 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer h-14"
                    disabled={forgotLoading}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {forgotLoading ? 'Sending...' : 'Send reset email'}
                  </button>
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
