import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const applicationSchema = z.object({
  job_id: z.string().uuid(),
  cover_letter: z.string().trim().max(2000, "Cover letter must be less than 2000 characters").optional(),
  resume_url: z.string().url().optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: "pending" | "reviewed" | "interview" | "offered" | "rejected" | "withdrawn";
  cover_letter: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
  job?: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
  };
}

export function useMyApplications(userId: string | undefined) {
  return useQuery({
    queryKey: ["my-applications", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          job:jobs(id, title, company, location, type)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as JobApplication[];
    },
    enabled: !!userId,
  });
}

export function useApplicationStatus(jobId: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ["application-status", jobId, userId],
    queryFn: async () => {
      if (!jobId || !userId) return null;

      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("job_id", jobId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data as JobApplication | null;
    },
    enabled: !!jobId && !!userId,
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      jobId,
      coverLetter,
    }: {
      userId: string;
      jobId: string;
      coverLetter?: string;
    }) => {
      const validated = applicationSchema.parse({
        job_id: jobId,
        cover_letter: coverLetter,
      });

      const { data, error } = await supabase
        .from("job_applications")
        .insert({
          job_id: validated.job_id,
          user_id: userId,
          cover_letter: validated.cover_letter || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-status", variables.jobId] });
    },
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { data, error } = await supabase
        .from("job_applications")
        .update({ status: "withdrawn" })
        .eq("id", applicationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-status"] });
    },
  });
}

export const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  reviewed: { bg: "bg-blue-500/20", text: "text-blue-400" },
  interview: { bg: "bg-purple-500/20", text: "text-purple-400" },
  offered: { bg: "bg-green-500/20", text: "text-green-400" },
  rejected: { bg: "bg-red-500/20", text: "text-red-400" },
  withdrawn: { bg: "bg-muted/50", text: "text-muted-foreground" },
};

export const statusLabels: Record<string, string> = {
  pending: "Pending Review",
  reviewed: "Under Review",
  interview: "Interview Scheduled",
  offered: "Offer Extended",
  rejected: "Not Selected",
  withdrawn: "Withdrawn",
};
