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
import { User as UserIcon, Camera, MapPin, Briefcase, Link as LinkIcon, Save, Loader2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProfile, profileSchema } from "@/hooks/useProfile";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";

const DashboardProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");
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

  const handleSave = async () => {
    try {
      // Validate with zod
      const validated = profileSchema.parse({
        display_name: displayName || undefined,
        bio: bio || undefined,
        location: location || undefined,
        title: title || undefined,
        website: website || undefined,
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
