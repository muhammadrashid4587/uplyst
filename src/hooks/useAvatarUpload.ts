import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function useAvatarUpload(userId: string | undefined) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to upload an avatar",
        variant: "destructive",
      });
      return null;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, WebP, or GIF image",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

      // Delete existing avatar if any
      const { data: existingFiles } = await supabase.storage
        .from("avatars")
        .list(userId);

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map((f) => `${userId}/${f.name}`);
        await supabase.storage.from("avatars").remove(filesToDelete);
      }

      setProgress(30);

      // Upload new avatar
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      setProgress(70);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.path);

      setProgress(100);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const deleteAvatar = async (): Promise<boolean> => {
    if (!userId) return false;

    setIsUploading(true);

    try {
      const { data: existingFiles } = await supabase.storage
        .from("avatars")
        .list(userId);

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map((f) => `${userId}/${f.name}`);
        await supabase.storage.from("avatars").remove(filesToDelete);
      }

      return true;
    } catch (error: any) {
      console.error("Avatar delete error:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete avatar",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadAvatar, deleteAvatar, isUploading, progress };
}
