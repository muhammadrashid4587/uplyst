import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResumeParser } from "@/components/ResumeParser";
import { 
  User as UserIcon, Camera, MapPin, Briefcase, Link as LinkIcon, 
  Save, Loader2, Trash2, Plus, X, Calendar, Building2, GraduationCap, FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProfile, profileSchema, Experience } from "@/hooks/useProfile";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";

const DashboardProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState<Experience[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { profile, isLoading, updateProfile } = useProfile(user?.id);
  const { uploadAvatar, deleteAvatar, isUploading, progress } = useAvatarUpload(user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });
  }, []);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setTitle(profile.title || "");
      setWebsite(profile.website || "");
      setSkills(profile.skills || []);
      setExperience(profile.experience || []);
    }
  }, [profile]);

  const userName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const avatarUrl = await uploadAvatar(file);
    if (avatarUrl) {
      // Update profile with new avatar URL
      await updateProfile.mutateAsync({ avatar_url: avatarUrl });
      toast({
        title: "Photo Updated",
        description: "Your profile photo has been updated.",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    const success = await deleteAvatar();
    if (success) {
      await updateProfile.mutateAsync({ avatar_url: null });
      toast({
        title: "Photo Removed",
        description: "Your profile photo has been removed.",
      });
    }
  };

  // Skills management
  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && skills.length < 20 && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Experience management
  const addExperience = () => {
    if (experience.length >= 10) return;
    const newExp: Experience = {
      id: crypto.randomUUID(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setExperience([...experience, newExp]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperience(experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  // Handle resume data extraction
  const handleResumeDataExtracted = (data: any) => {
    if (data.display_name) setDisplayName(data.display_name);
    if (data.title) setTitle(data.title);
    if (data.bio) setBio(data.bio);
    if (data.location) setLocation(data.location);
    if (data.skills && data.skills.length > 0) {
      setSkills(prev => {
        const combined = [...new Set([...prev, ...data.skills])];
        return combined.slice(0, 20);
      });
    }
    if (data.experience && data.experience.length > 0) {
      const newExperiences: Experience[] = data.experience.slice(0, 10).map((exp: any) => ({
        id: crypto.randomUUID(),
        title: exp.title || "",
        company: exp.company || "",
        location: "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: !exp.endDate || exp.endDate.toLowerCase() === "present",
        description: exp.description || "",
      }));
      setExperience(prev => {
        const combined = [...prev, ...newExperiences];
        return combined.slice(0, 10);
      });
    }
    if (data.website || data.portfolio_url) {
      setWebsite(data.website || data.portfolio_url || "");
    }
  };

  const handleSave = async () => {
    try {
      // Validate with zod
      const validated = profileSchema.parse({
        display_name: displayName || undefined,
        bio: bio || undefined,
        location: location || undefined,
        title: title || undefined,
        website: website || undefined,
        skills: skills.length > 0 ? skills : undefined,
        experience: experience.filter(exp => exp.title && exp.company),
      });

      await updateProfile.mutateAsync(validated);
      
      toast({
        title: "Profile Updated",
        description: "Your profile changes have been saved.",
      });
    } catch (error: any) {
      console.error("Failed to save profile:", error);
      toast({
        title: "Error",
        description: error.errors?.[0]?.message || error.message || "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        {/* Profile Photo */}
        <GlassPanel className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              {isLoading ? (
                <Skeleton className="w-24 h-24 rounded-full" />
              ) : userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userName}
                  className="w-24 h-24 rounded-full border-2 border-primary/30 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                  <UserIcon className="w-10 h-10 text-primary" />
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </>
              ) : (
                <>
                  <p className="text-foreground font-medium">{userName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </>
              )}
              {isUploading && (
                <div className="mt-2 w-48">
                  <Progress value={progress} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-1">Uploading...</p>
                </div>
              )}
              {!isUploading && (
                <div className="flex gap-2 mt-2">
                  <SignalButton 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {userAvatar ? "Change Photo" : "Upload Photo"}
                  </SignalButton>
                  {userAvatar && (
                    <SignalButton 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRemovePhoto}
                      disabled={isUploading}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </SignalButton>
                  )}
                </div>
              )}
            </div>
          </div>
        </GlassPanel>

        {/* Resume Parser */}
        <GlassPanel className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Quick Import from Resume
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your resume and our AI will automatically extract your information to fill out your profile.
          </p>
          <ResumeParser onDataExtracted={handleResumeDataExtracted} />
        </GlassPanel>

        {/* Basic Information */}
        <GlassPanel className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <div className="space-y-2 sm:col-span-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your full name"
                    className="pl-10 bg-muted/30 border-border/30"
                    maxLength={100}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Developer"
                    className="pl-10 bg-muted/30 border-border/30"
                    maxLength={100}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="pl-10 bg-muted/30 border-border/30"
                    maxLength={100}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="pl-10 bg-muted/30 border-border/30"
                    maxLength={255}
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="bg-muted/30 border-border/30 min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">{bio.length}/500</p>
              </div>
            </div>
          )}
        </GlassPanel>

        {/* Skills Section */}
        <GlassPanel className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Skills
          </h2>
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="px-3 py-1 text-sm flex items-center gap-1.5"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {skills.length < 20 && (
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Add a skill (e.g. React, Python, Design)"
                    className="bg-muted/30 border-border/30 max-w-xs"
                    maxLength={50}
                  />
                  <SignalButton 
                    variant="outline" 
                    size="sm" 
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </SignalButton>
                </div>
              )}
              <p className="text-xs text-muted-foreground">{skills.length}/20 skills</p>
            </div>
          )}
        </GlassPanel>

        {/* Experience Section */}
        <GlassPanel className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Experience
            </h2>
            {experience.length < 10 && (
              <SignalButton variant="outline" size="sm" onClick={addExperience} className="gap-1">
                <Plus className="w-4 h-4" />
                Add Experience
              </SignalButton>
            )}
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 border border-border/30 rounded-lg space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : experience.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No experience added yet</p>
              <p className="text-sm">Add your work history to showcase your background</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border border-border/30 rounded-lg space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title *</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                          placeholder="e.g. Senior Developer"
                          className="bg-muted/30 border-border/30"
                          maxLength={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company *</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="Company name"
                            className="pl-10 bg-muted/30 border-border/30"
                            maxLength={100}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={exp.location || ""}
                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                            placeholder="City, Country"
                            className="pl-10 bg-muted/30 border-border/30"
                            maxLength={100}
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="space-y-2 flex-1">
                          <Label>Start Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                              className="pl-10 bg-muted/30 border-border/30"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 flex-1">
                          <Label>End Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="month"
                              value={exp.current ? "" : exp.endDate || ""}
                              onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                              className="pl-10 bg-muted/30 border-border/30"
                              disabled={exp.current}
                              placeholder={exp.current ? "Present" : ""}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                          className="rounded border-border"
                        />
                        <Label htmlFor={`current-${exp.id}`} className="text-sm cursor-pointer">
                          I currently work here
                        </Label>
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description || ""}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          className="bg-muted/30 border-border/30 min-h-[80px]"
                          maxLength={500}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        {/* Save Button */}
        <div className="flex justify-end">
          <SignalButton 
            variant="primary" 
            className="gap-2" 
            onClick={handleSave}
            disabled={updateProfile.isPending || isLoading}
          >
            {updateProfile.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </SignalButton>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardProfile;
