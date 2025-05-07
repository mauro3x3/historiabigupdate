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

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormProps = {
  setActiveTab: (tab: string) => void;
};

const SignupForm = ({ setActiveTab }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
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
      console.error('Google signup error:', error);
      toast.error("Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email, future historian! 📬");
        setActiveTab("login");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 font-sans" style={{ fontFamily: "'Poppins', 'Nunito', 'Inter', Arial, sans-serif" }}>
      <div className="w-full flex flex-col gap-4">
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-100 transition-all duration-150 font-bold text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          aria-label="Continue with Google"
        >
          {/* Google G SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M23.04 12.2615C23.04 11.4448 22.9655 10.6615 22.8273 9.90918H12V14.3532H18.3073C18.0273 15.8015 17.1682 17.0115 15.9227 17.8015V20.2615H19.36C21.36 18.4415 23.04 15.6615 23.04 12.2615Z" fill="#4285F4"/>
              <path d="M12 23.0002C15.24 23.0002 17.96 21.9285 19.36 20.2618L15.9227 17.8018C15.16 18.3218 14.16 18.6618 12 18.6618C8.88 18.6618 6.27 16.5218 5.32 13.6618H1.76V16.2018C3.16 19.8018 7.24 23.0002 12 23.0002Z" fill="#34A853"/>
              <path d="M5.32 13.6615C5.08 13.1415 4.96 12.5815 4.96 12.0002C4.96 11.4188 5.08 10.8588 5.32 10.3388V7.79883H1.76C1.08 9.19883 0.72 10.5615 0.72 12.0002C0.72 13.4388 1.08 14.8015 1.76 16.2015L5.32 13.6615Z" fill="#FBBC05"/>
              <path d="M12 5.3385C14.04 5.3385 15.48 6.12183 16.32 6.90183L19.44 3.78183C17.96 2.40183 15.24 1.00016 12 1.00016C7.24 1.00016 3.16 4.1985 1.76 7.7985L5.32 10.3385C6.27 7.4785 8.88 5.3385 12 5.3385Z" fill="#EA4335"/>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          {isGoogleLoading ? "Signing in..." : "Continue with Google"}
        </button>
        <div className="relative flex items-center my-2">
          <span className="flex-grow border-t border-gray-200"></span>
          <span className="mx-2 text-xs text-gray-400">or</span>
          <span className="flex-grow border-t border-gray-200"></span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} className="rounded-full px-6 py-4 border-2 border-timelingo-purple focus:border-yellow-400 bg-white/90 text-xl shadow-lg" />
                  </FormControl>
                  <FormMessage className="text-red-500 font-semibold text-base" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} className="rounded-full px-6 py-4 border-2 border-timelingo-purple focus:border-yellow-400 bg-white/90 text-xl shadow-lg" />
                  </FormControl>
                  <div className="text-sm text-timelingo-purple mt-2 mb-1">Make it strong, like a Roman legion! 🛡️</div>
                  <FormMessage className="text-red-500 font-semibold text-base" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} className="rounded-full px-6 py-4 border-2 border-timelingo-purple focus:border-yellow-400 bg-white/90 text-xl shadow-lg" />
                  </FormControl>
                  <FormMessage className="text-red-500 font-semibold text-base" />
                </FormItem>
              )}
            />
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-br from-timelingo-purple via-purple-400 to-yellow-300 hover:from-yellow-400 hover:via-timelingo-purple hover:to-purple-400 hover:text-timelingo-navy text-white font-bold rounded-full py-5 text-2xl shadow-2xl transition-all duration-150 transform hover:scale-105 active:scale-95 border-0"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
