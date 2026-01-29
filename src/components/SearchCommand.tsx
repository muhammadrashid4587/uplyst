import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  User as UserIcon,
  Briefcase,
  MessageSquare,
  Bell,
  Settings,
  Star,
  Search,
  LogOut,
  FileText,
  Building2,
  MapPin,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, group: "Navigation" },
  { title: "Browse Jobs", url: "/dashboard/jobs", icon: Briefcase, group: "Navigation" },
  { title: "Saved Items", url: "/dashboard/saved", icon: Star, group: "Navigation" },
  { title: "Messages", url: "/dashboard/messages", icon: MessageSquare, group: "Navigation" },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell, group: "Navigation" },
  { title: "Profile", url: "/dashboard/profile", icon: UserIcon, group: "Account" },
  { title: "Settings", url: "/dashboard/settings", icon: Settings, group: "Account" },
];

const quickActions = [
  { title: "Edit Profile", action: "profile", icon: UserIcon },
  { title: "Search Jobs", action: "jobs", icon: Search },
  { title: "View Applications", action: "applications", icon: FileText },
];

// Sample job data for search (would come from database in real app)
const sampleJobs = [
  { title: "Senior Frontend Developer", company: "TechCorp", location: "Remote", type: "Full-time" },
  { title: "Product Designer", company: "DesignCo", location: "New York", type: "Full-time" },
  { title: "Backend Engineer", company: "StartupXYZ", location: "San Francisco", type: "Contract" },
  { title: "DevOps Engineer", company: "CloudInc", location: "Remote", type: "Full-time" },
  { title: "UX Researcher", company: "UserFirst", location: "London", type: "Part-time" },
];

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = useCallback((url: string) => {
    onOpenChange(false);
    navigate(url);
  }, [navigate, onOpenChange]);

  const handleAction = useCallback((action: string) => {
    onOpenChange(false);
    switch (action) {
      case "profile":
        navigate("/dashboard/profile");
        break;
      case "jobs":
        navigate("/dashboard/jobs");
        break;
      case "applications":
        navigate("/dashboard");
        break;
    }
  }, [navigate, onOpenChange]);

  const handleSignOut = async () => {
    onOpenChange(false);
    await supabase.auth.signOut();
    navigate("/");
  };

  const filteredJobs = sampleJobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search for pages, jobs, actions..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No results found.</p>
            <p className="text-sm text-muted-foreground/70">Try searching for something else.</p>
          </div>
        </CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.action}
              onSelect={() => handleAction(action.action)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <action.icon className="w-4 h-4 text-primary" />
              </div>
              <span>{action.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          {navigationItems.filter(item => item.group === "Navigation").map((item) => (
            <CommandItem
              key={item.url}
              onSelect={() => handleSelect(item.url)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Jobs (shown when searching) */}
        {searchQuery && filteredJobs.length > 0 && (
          <>
            <CommandGroup heading="Jobs">
              {filteredJobs.slice(0, 5).map((job, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleSelect("/dashboard/jobs")}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{job.company}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {job.type}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Account */}
        <CommandGroup heading="Account">
          {navigationItems.filter(item => item.group === "Account").map((item) => (
            <CommandItem
              key={item.url}
              onSelect={() => handleSelect(item.url)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
          <CommandItem
            onSelect={handleSignOut}
            className="flex items-center gap-3 cursor-pointer text-destructive"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useSearchCommand() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return { open, setOpen };
}
