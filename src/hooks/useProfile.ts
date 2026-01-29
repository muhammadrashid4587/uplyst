import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().trim().max(100, "Name must be less than 100 characters").optional(),
  title: z.string().trim().max(100, "Title must be less than 100 characters").optional(),
  location: z.string().trim().max(100, "Location must be less than 100 characters").optional(),
  bio: z.string().trim().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().trim().max(255, "Website must be less than 255 characters")
    .refine(
      (val) => !val || val.startsWith("http://") || val.startsWith("https://"),
      "Website must start with http:// or https://"
    )
    .optional(),
  avatar_url: z.string().url().optional().nullable(),
});

export type ProfileData = z.infer<typeof profileSchema>;

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  title: string | null;
  location: string | null;
  bio: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      
      // If no profile exists, create one
      if (!data) {
        const { data: user } = await supabase.auth.getUser();
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            user_id: userId,
            display_name: user.user?.user_metadata?.full_name || user.user?.email?.split("@")[0] || null,
            avatar_url: user.user?.user_metadata?.avatar_url || null,
          })
          .select()
          .single();

        if (createError) throw createError;
        return newProfile as Profile;
      }

      return data as Profile;
    },
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: ProfileData) => {
      if (!userId) throw new Error("No user ID");

      // Validate input
      const validated = profileSchema.parse(updates);

      const { data, error } = await supabase
        .from("profiles")
        .update(validated)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return { profile, isLoading, error, updateProfile };
}
