import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Building2, MapPin, DollarSign, FileText, Plus, X, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCreateJob, jobSchema } from "@/hooks/useJobs";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"] as const;

const PostJob = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>();
  
  // Form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<typeof jobTypes[number]>("Full-time");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createJob = useCreateJob();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/auth");
        return;
      }
      setUserId(data.user.id);
    });
  }, [navigate]);

  const addRequirement = () => {
    if (requirements.length < 20) {
      setRequirements([...requirements, ""]);
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to post a job.",
        variant: "destructive",
      });
      return;
    }

    try {
      const jobData = {
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        type,
        salary_min: salaryMin ? parseInt(salaryMin) : null,
        salary_max: salaryMax ? parseInt(salaryMax) : null,
        description: description.trim() || undefined,
        requirements: requirements.filter(r => r.trim()),
      };

      // Validate
      const result = jobSchema.safeParse(jobData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      await createJob.mutateAsync({ userId, job: result.data });

      toast({
        title: "Job Posted!",
        description: "Your job listing is now live and visible to candidates.",
      });

      navigate("/dashboard/jobs");
    } catch (error: any) {
      console.error("Failed to post job:", error);
      toast({
        title: "Failed to post job",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Post a Job
          </h1>
          <p className="text-muted-foreground">Create a new job listing to find the perfect candidate</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <GlassPanel className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Basic Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className={cn("pl-10 bg-muted/30 border-border/30", errors.title && "border-destructive")}
                    maxLength={100}
                  />
                </div>
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className={cn("pl-10 bg-muted/30 border-border/30", errors.company && "border-destructive")}
                    maxLength={100}
                  />
                </div>
                {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA or Remote"
                    className={cn("pl-10 bg-muted/30 border-border/30", errors.location && "border-destructive")}
                    maxLength={100}
                  />
                </div>
                {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select value={type} onValueChange={(value: typeof jobTypes[number]) => setType(value)}>
                  <SelectTrigger className="bg-muted/30 border-border/30">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassPanel>

          {/* Salary */}
          <GlassPanel className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Salary Range (Optional)
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary (USD/year)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="salaryMin"
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="e.g. 80000"
                    className="pl-10 bg-muted/30 border-border/30"
                    min={0}
                    max={10000000}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary (USD/year)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="salaryMax"
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="e.g. 120000"
                    className="pl-10 bg-muted/30 border-border/30"
                    min={0}
                    max={10000000}
                  />
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Description */}
          <GlassPanel className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Job Description
            </h2>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                className="bg-muted/30 border-border/30 min-h-[150px]"
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground text-right">{description.length}/5000</p>
            </div>
          </GlassPanel>

          {/* Requirements */}
          <GlassPanel className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Requirements (Optional)
            </h2>
            <div className="space-y-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    className="bg-muted/30 border-border/30"
                    maxLength={200}
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              {requirements.length < 20 && (
                <button
                  type="button"
                  onClick={addRequirement}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Requirement
                </button>
              )}
            </div>
          </GlassPanel>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <SignalButton
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={createJob.isPending}
            >
              Cancel
            </SignalButton>
            <SignalButton
              type="submit"
              variant="primary"
              disabled={createJob.isPending}
              className="gap-2"
            >
              {createJob.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Briefcase className="w-4 h-4" />
              )}
              {createJob.isPending ? "Posting..." : "Post Job"}
            </SignalButton>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
