import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface WaitlistSignup {
  full_name: string;
  email: string;
  role?: string;
  seniority?: string;
  target_roles?: string;
  referred_by?: string;
}

export interface WaitlistResult {
  success: boolean;
  ref_code?: string;
  position?: number;
  error?: string;
}

export const useWaitlist = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (data: WaitlistSignup): Promise<WaitlistResult> => {
    setIsLoading(true);
    try {
      // Insert the signup
      const { data: inserted, error: insertError } = await supabase
        .from("waitlist_signups")
        .insert({
          full_name: data.full_name,
          email: data.email.toLowerCase().trim(),
          role: data.role || null,
          seniority: data.seniority || null,
          target_roles: data.target_roles || null,
          referred_by: data.referred_by || null,
        })
        .select("ref_code, created_at")
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          // Unique constraint violation
          return {
            success: false,
            error: "This email is already on the waitlist!",
          };
        }
        throw insertError;
      }

      return {
        success: true,
        ref_code: inserted.ref_code,
        position: 1, // Position not available due to privacy restrictions
      };
    } catch (error: any) {
      console.error("Waitlist signup error:", error);
      return {
        success: false,
        error: error.message || "Something went wrong. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getPosition = async (_email: string): Promise<number | null> => {
    // Position lookup not available due to privacy restrictions
    return null;
  };

  const getTotalSignups = async (): Promise<number> => {
    // Total count not available due to privacy restrictions
    return 0;
  };

  return {
    signup,
    getPosition,
    getTotalSignups,
    isLoading,
  };
};

export default useWaitlist;
