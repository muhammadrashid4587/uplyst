import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  company: z.string().trim().min(2, "Company name must be at least 2 characters").max(100, "Company must be less than 100 characters"),
  location: z.string().trim().min(2, "Location must be at least 2 characters").max(100, "Location must be less than 100 characters"),
  type: z.enum(["Full-time", "Part-time", "Contract", "Freelance", "Internship"]),
  salary_min: z.number().min(0).max(10000000).optional().nullable(),
  salary_max: z.number().min(0).max(10000000).optional().nullable(),
  description: z.string().trim().max(5000, "Description must be less than 5000 characters").optional(),
  requirements: z.array(z.string().trim().max(200)).max(20, "Maximum 20 requirements").optional(),
});

export type JobInput = z.infer<typeof jobSchema>;

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, job }: { userId: string; job: JobInput }) => {
      const validated = jobSchema.parse(job);

      // Validate salary range
      if (validated.salary_min && validated.salary_max && validated.salary_min > validated.salary_max) {
        throw new Error("Minimum salary cannot be greater than maximum salary");
      }

      const insertData = {
        title: validated.title,
        company: validated.company,
        location: validated.location,
        type: validated.type,
        salary_min: validated.salary_min,
        salary_max: validated.salary_max,
        description: validated.description,
        requirements: validated.requirements?.filter(r => r.trim()) || null,
        posted_by: userId,
      };

      const { data, error } = await supabase
        .from("jobs")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
  });
}

export function useMyJobs(userId: string | undefined) {
  const queryClient = useQueryClient();

  return {
    queryKey: ["my-jobs", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("posted_by", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  };
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, updates }: { jobId: string; updates: Partial<JobInput> & { is_active?: boolean } }) => {
      const { data, error } = await supabase
        .from("jobs")
        .update(updates)
        .eq("id", jobId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
  });
}
