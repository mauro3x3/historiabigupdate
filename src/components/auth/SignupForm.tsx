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
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-white font-inter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-7">
          <h2 className="text-3xl font-extrabold text-center text-black mb-1 tracking-tight">Create Account</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="signup-email"
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
                    id="signup-password"
                    type="password"
                    placeholder="Password"
                    {...field}
                    className="rounded-xl px-4 py-4 border border-gray-300 focus:border-black bg-white text-black placeholder-gray-300 w-full text-base font-normal focus:outline-none focus:ring-2 focus:ring-black h-14"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </FormControl>
                <div className="text-xs text-gray-400 mt-1">At least 6 characters</div>
                <FormMessage className="text-xs text-red-500 font-normal mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm Password"
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
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
          <button
            type="button"
            className="w-full bg-white text-black font-normal rounded-xl py-4 text-base border border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer h-14 mt-1"
            onClick={() => setActiveTab('login')}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Already have an account? Log in
          </button>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
