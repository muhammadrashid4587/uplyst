import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { 
  AvailabilityStatus, WorkStyle, LeadershipLevel, SeniorityLevel, UserRole 
} from "@/types";

export const experienceSchema = z.object({
  id: z.string(),
  title: z.string().trim().max(100, "Title must be less than 100 characters"),
  company: z.string().trim().max(100, "Company must be less than 100 characters"),
  location: z.string().trim().max(100, "Location must be less than 100 characters").optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().trim().max(500, "Description must be less than 500 characters").optional(),
});

export type Experience = z.infer<typeof experienceSchema>;

export const notableProjectSchema = z.object({
  id: z.string(),
  title: z.string().trim().max(100),
  description: z.string().trim().max(500),
  url: z.string().url().optional().or(z.literal("")),
  impact: z.string().trim().max(200).optional(),
});

export type NotableProject = z.infer<typeof notableProjectSchema>;

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
  skills: z.array(z.string().trim().max(50)).max(20, "Maximum 20 skills").optional(),
  experience: z.array(experienceSchema).max(10, "Maximum 10 experiences").optional(),
  // Senior-first fields
  impact_highlights: z.array(z.string().trim().max(200)).max(3).optional(),
  availability_status: z.enum(["laid_off", "exploring", "employed_looking", "not_looking"]).optional().nullable(),
  availability_date: z.string().optional().nullable(),
  work_style: z.enum(["remote", "hybrid", "onsite"]).optional().nullable(),
  preferred_timezone: z.string().max(50).optional().nullable(),
  leadership_team_size: z.string().max(50).optional().nullable(),
  leadership_budget: z.string().max(50).optional().nullable(),
  leadership_org_level: z.enum(["IC", "Manager", "Director", "VP", "C-Level"]).optional().nullable(),
  is_open_to_work: z.boolean().optional(),
  open_to_contract: z.boolean().optional(),
  open_to_fractional: z.boolean().optional(),
  open_to_advisory: z.boolean().optional(),
  portfolio_url: z.string().url().optional().nullable().or(z.literal("")),
  github_url: z.string().url().optional().nullable().or(z.literal("")),
  linkedin_url: z.string().url().optional().nullable().or(z.literal("")),
  notable_projects: z.array(notableProjectSchema).max(5).optional(),
  seniority_level: z.enum(["Principal", "Director", "Senior Manager", "VP", "C-Suite"]).optional().nullable(),
  previous_companies: z.array(z.string().trim().max(100)).max(10).optional(),
  is_verified: z.boolean().optional(),
  user_role: z.enum(["candidate", "employer"]).optional(),
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
  skills: string[] | null;
  experience: Experience[] | null;
  // Senior-first fields
  impact_highlights: string[] | null;
  availability_status: AvailabilityStatus | null;
  availability_date: string | null;
  work_style: WorkStyle | null;
  preferred_timezone: string | null;
  leadership_team_size: string | null;
  leadership_budget: string | null;
  leadership_org_level: LeadershipLevel | null;
  is_open_to_work: boolean;
  open_to_contract: boolean;
  open_to_fractional: boolean;
  open_to_advisory: boolean;
  portfolio_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  notable_projects: NotableProject[] | null;
  seniority_level: SeniorityLevel | null;
  previous_companies: string[] | null;
  is_verified: boolean;
  user_role: UserRole;
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
