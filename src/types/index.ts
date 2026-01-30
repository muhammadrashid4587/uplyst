// Core type definitions for Signal platform

export interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

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

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface NotableProject {
  id: string;
  title: string;
  description: string;
  url?: string;
  impact?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  description: string | null;
  requirements: string[] | null;
  salary_min: number | null;
  salary_max: number | null;
  posted_by: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStatus;
  resume_url: string | null;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
  job?: Job;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  messages?: Message[];
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  profile?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

// Enums
export type AvailabilityStatus = 'laid_off' | 'exploring' | 'employed_looking' | 'not_looking';
export type WorkStyle = 'remote' | 'hybrid' | 'onsite';
export type LeadershipLevel = 'IC' | 'Manager' | 'Director' | 'VP' | 'C-Level';
export type SeniorityLevel = 'Principal' | 'Director' | 'Senior Manager' | 'VP' | 'C-Suite';
export type UserRole = 'candidate' | 'employer';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Fractional' | 'Advisory';
export type ApplicationStatus = 'draft' | 'pending' | 'reviewed' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'application' | 'message';

// Demo mode types
export interface DemoSettings {
  enabled: boolean;
  showDemoBanner: boolean;
}
