import { useState, useCallback } from "react";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/SignalBadge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ParsedResumeData {
  display_name?: string;
  title?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  previous_companies?: string[];
  seniority_level?: string;
  leadership_team_size?: string;
  leadership_org_level?: string;
  impact_highlights?: string[];
  education?: Array<{
    institution?: string;
    degree?: string;
    field?: string;
    year?: string;
  }>;
  experience?: Array<{
    company?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

interface ResumeParserProps {
  onDataExtracted: (data: ParsedResumeData) => void;
}

export const ResumeParser = ({ onDataExtracted }: ResumeParserProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type;
    
    if (fileType === "text/plain" || file.name.endsWith(".txt")) {
      return await file.text();
    }
    
    // For PDF and DOCX, we'll read the raw text content
    // This is a simplified approach - for complex documents, the backend could use a proper parser
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Try to extract text from PDF
    if (fileType === "application/pdf" || file.name.endsWith(".pdf")) {
      // Simple PDF text extraction - look for text streams
      let text = "";
      const decoder = new TextDecoder("utf-8", { fatal: false });
      const content = decoder.decode(uint8Array);
      
      // Extract text between BT and ET markers (basic PDF text extraction)
      const textMatches = content.match(/\(([^)]+)\)/g);
      if (textMatches) {
        text = textMatches
          .map((match) => match.slice(1, -1))
          .filter((t) => t.length > 2 && /[a-zA-Z]/.test(t))
          .join(" ");
      }
      
      // Also look for readable strings
      const readableStrings = content.match(/[A-Za-z][A-Za-z0-9\s,.\-@()]+[A-Za-z0-9]/g);
      if (readableStrings) {
        text += " " + readableStrings.join(" ");
      }
      
      if (text.length < 100) {
        throw new Error("Could not extract sufficient text from PDF. Please try a text file or copy-paste your resume content.");
      }
      
      return text;
    }
    
    // For DOCX, try to extract text from the document.xml
    if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
      const decoder = new TextDecoder("utf-8", { fatal: false });
      const content = decoder.decode(uint8Array);
      
      // Extract text from XML tags
      const textMatches = content.match(/>([^<>]{3,})</g);
      if (textMatches) {
        const text = textMatches
          .map((match) => match.slice(1, -1).trim())
          .filter((t) => t.length > 2 && /[a-zA-Z]/.test(t))
          .join(" ");
        
        if (text.length >= 100) {
          return text;
        }
      }
      
      throw new Error("Could not extract text from DOCX. Please try a PDF or text file.");
    }
    
    throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
  };

  const parseResume = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const resumeText = await extractTextFromFile(file);
      console.log("Extracted text length:", resumeText.length);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-resume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ resumeText }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to parse resume (${response.status})`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setParsedData(result.data);
      setShowPreview(true);
      
      toast({
        title: "Resume parsed successfully!",
        description: "Review the extracted data and apply it to your profile.",
      });
    } catch (err) {
      console.error("Resume parsing error:", err);
      const message = err instanceof Error ? err.message : "Failed to parse resume";
      setError(message);
      toast({
        title: "Parsing failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      parseResume(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseResume(file);
    }
  };

  const applyToProfile = () => {
    if (parsedData) {
      onDataExtracted(parsedData);
      setShowPreview(false);
      toast({
        title: "Profile updated!",
        description: "Resume data has been applied to your profile fields.",
      });
    }
  };

  return (
    <>
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border/50 hover:border-primary/50 hover:bg-muted/30",
          isLoading && "pointer-events-none opacity-60"
        )}
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div>
              <p className="font-medium text-foreground">Parsing your resume...</p>
              <p className="text-sm text-muted-foreground">AI is extracting your information</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Parsing failed</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setError(null)}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Drop your resume here or click to upload
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports PDF, DOCX, and TXT files
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                AI-powered extraction
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Resume Parsed Successfully
            </DialogTitle>
            <DialogDescription>
              Review the extracted data before applying it to your profile.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            {parsedData && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Name</label>
                      <p className="font-medium">{parsedData.display_name || "—"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Title</label>
                      <p className="font-medium">{parsedData.title || "—"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Location</label>
                      <p className="font-medium">{parsedData.location || "—"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Seniority</label>
                      <p className="font-medium">{parsedData.seniority_level || "—"}</p>
                    </div>
                  </div>
                  {parsedData.bio && (
                    <div>
                      <label className="text-xs text-muted-foreground">Bio</label>
                      <p className="text-sm mt-1">{parsedData.bio}</p>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {parsedData.skills && parsedData.skills.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Skills ({parsedData.skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.map((skill, i) => (
                        <Badge key={i} variant="primary" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Companies */}
                {parsedData.previous_companies && parsedData.previous_companies.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Companies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.previous_companies.map((company, i) => (
                        <Badge key={i} variant="muted" size="sm">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact Highlights */}
                {parsedData.impact_highlights && parsedData.impact_highlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Key Achievements
                    </h4>
                    <ul className="space-y-1">
                      {parsedData.impact_highlights.map((highlight, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Experience */}
                {parsedData.experience && parsedData.experience.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Experience ({parsedData.experience.length} roles)
                    </h4>
                    <div className="space-y-3">
                      {parsedData.experience.slice(0, 3).map((exp, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-lg">
                          <p className="font-medium">{exp.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {exp.company} • {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                        </div>
                      ))}
                      {parsedData.experience.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{parsedData.experience.length - 3} more roles
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Education */}
                {parsedData.education && parsedData.education.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Education
                    </h4>
                    <div className="space-y-2">
                      {parsedData.education.map((edu, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-lg">
                          <p className="font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                          <p className="text-sm text-muted-foreground">
                            {edu.institution} {edu.year && `• ${edu.year}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {(parsedData.linkedin_url || parsedData.github_url || parsedData.portfolio_url) && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Links
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.linkedin_url && (
                        <Badge variant="primary" size="sm">LinkedIn</Badge>
                      )}
                      {parsedData.github_url && (
                        <Badge variant="primary" size="sm">GitHub</Badge>
                      )}
                      {parsedData.portfolio_url && (
                        <Badge variant="primary" size="sm">Portfolio</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button onClick={applyToProfile}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply to Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResumeParser;
