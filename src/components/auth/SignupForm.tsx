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

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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
    <div className="w-full flex items-center justify-center bg-white font-sans">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 mb-1" htmlFor="signup-email">Email</label>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="signup-email" placeholder="Email" {...field} className="rounded-md px-4 py-3 border border-gray-200 focus:border-timelingo-purple bg-white text-black placeholder-gray-400 w-full shadow-sm mb-4" style={{ fontFamily: 'DM Sans, Inter, sans-serif' }} />
                  </FormControl>
                  <FormMessage className="text-red-500 font-semibold text-base" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 mb-1" htmlFor="signup-password">Password</label>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="signup-password" type="password" placeholder="Password" {...field} className="rounded-md px-4 py-3 border border-gray-200 focus:border-timelingo-purple bg-white text-black placeholder-gray-400 w-full shadow-sm mb-4" style={{ fontFamily: 'DM Sans, Inter, sans-serif' }} />
                  </FormControl>
                  <div className="text-xs text-gray-400 mt-1">At least 6 characters</div>
                  <FormMessage className="text-red-500 font-semibold text-base" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 mb-1" htmlFor="signup-confirm">Confirm Password</label>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="signup-confirm" type="password" placeholder="Confirm Password" {...field} className="rounded-md px-4 py-3 border border-gray-200 focus:border-timelingo-purple bg-white text-black placeholder-gray-400 w-full shadow-sm mb-6" style={{ fontFamily: 'DM Sans, Inter, sans-serif' }} />
                  </FormControl>
                  <FormMessage className="text-red-500 font-semibold text-base" />
                </FormItem>
              )}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-br from-timelingo-purple via-purple-400 to-yellow-300 text-white font-bold rounded-full py-4 text-xl shadow-lg transition-all duration-150 mt-2 tracking-widest uppercase"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          <div className="flex flex-col items-center mt-4">
            <div className="w-full border-t border-gray-200 my-2" />
            <span className="text-gray-400 text-sm">Already have an account? <button type="button" className="underline hover:text-black" onClick={() => setActiveTab('login')}>Log in</button></span>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
