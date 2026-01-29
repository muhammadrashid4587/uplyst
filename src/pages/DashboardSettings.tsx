import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Lock, 
  Eye, 
  Mail, 
  Smartphone, 
  Globe, 
  Moon,
  Trash2,
  Save
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DashboardSettings = () => {
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Notifications */}
        <GlassPanel className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="email-notif">Email Notifications</Label>
              </div>
              <Switch id="email-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="push-notif">Push Notifications</Label>
              </div>
              <Switch id="push-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="job-alerts">Job Alerts</Label>
              </div>
              <Switch id="job-alerts" defaultChecked />
            </div>
          </div>
        </GlassPanel>

        {/* Privacy */}
        <GlassPanel className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Privacy</h2>
              <p className="text-sm text-muted-foreground">Control your privacy settings</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="profile-visible">Profile Visible to Recruiters</Label>
              </div>
              <Switch id="profile-visible" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="public-profile">Public Profile</Label>
              </div>
              <Switch id="public-profile" />
            </div>
          </div>
        </GlassPanel>

        {/* Appearance */}
        <GlassPanel className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Moon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch id="dark-mode" defaultChecked />
            </div>
          </div>
        </GlassPanel>

        {/* Danger Zone */}
        <GlassPanel className="p-6 mb-6 border-destructive/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">Irreversible actions</p>
            </div>
          </div>
          <SignalButton variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
            Delete Account
          </SignalButton>
        </GlassPanel>

        {/* Save Button */}
        <div className="flex justify-end">
          <SignalButton variant="primary" className="gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save Settings
          </SignalButton>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSettings;
