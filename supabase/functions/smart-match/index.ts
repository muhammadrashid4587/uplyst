import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { profile, useDemoData } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch active jobs
    let jobs: any[] = [];
    
    if (useDemoData) {
      // Demo jobs for demonstration
      jobs = [
        {
          id: "demo-1",
          title: "VP of Engineering",
          company: "TechCorp",
          location: "San Francisco, CA",
          type: "Full-time",
          description: "Lead engineering teams, drive technical strategy, and scale our platform.",
          requirements: ["Engineering leadership", "Cloud infrastructure", "Team building", "Strategic planning"],
          salary_min: 350000,
          salary_max: 450000,
        },
        {
          id: "demo-2",
          title: "Chief Technology Officer",
          company: "InnovateTech",
          location: "Remote",
          type: "Full-time",
          description: "Define technology vision and lead R&D for next-gen AI products.",
          requirements: ["C-level experience", "AI/ML expertise", "Product strategy", "Board presentation"],
          salary_min: 400000,
          salary_max: 550000,
        },
        {
          id: "demo-3",
          title: "Director of Machine Learning",
          company: "DataDriven Inc",
          location: "New York, NY",
          type: "Full-time",
          description: "Build and lead ML team, develop predictive models for enterprise clients.",
          requirements: ["ML/AI", "Team leadership", "Python", "Deep learning", "MLOps"],
          salary_min: 280000,
          salary_max: 380000,
        },
        {
          id: "demo-4",
          title: "Fractional CTO",
          company: "StartupAccelerator",
          location: "Remote",
          type: "Fractional",
          description: "Provide strategic technology guidance to portfolio startups.",
          requirements: ["Startup experience", "Technical architecture", "Mentorship", "Due diligence"],
          salary_min: 150000,
          salary_max: 250000,
        },
        {
          id: "demo-5",
          title: "Senior Engineering Manager",
          company: "ScaleUp Corp",
          location: "Austin, TX",
          type: "Full-time",
          description: "Manage multiple engineering teams and deliver platform improvements.",
          requirements: ["Engineering management", "Agile", "Cross-functional collaboration", "Hiring"],
          salary_min: 220000,
          salary_max: 300000,
        },
      ];
    } else {
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .limit(20);

      if (jobsError) {
        console.error("Error fetching jobs:", jobsError);
      }
      jobs = jobsData || [];
    }

    if (jobs.length === 0) {
      return new Response(
        JSON.stringify({ matches: [], message: "No active jobs available" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build profile context
    const profileContext = `
Candidate Profile:
- Name: ${profile.display_name || "Not specified"}
- Title: ${profile.title || "Not specified"}
- Location: ${profile.location || "Not specified"}
- Skills: ${profile.skills?.join(", ") || "Not specified"}
- Seniority Level: ${profile.seniority_level || "Not specified"}
- Leadership Experience: ${profile.leadership_org_level || "Not specified"}, Team size: ${profile.leadership_team_size || "Not specified"}
- Work Style Preference: ${profile.work_style || "Not specified"}
- Open to Work: ${profile.is_open_to_work ? "Yes" : "No"}
- Open to Contract: ${profile.open_to_contract ? "Yes" : "No"}
- Open to Fractional: ${profile.open_to_fractional ? "Yes" : "No"}
- Open to Advisory: ${profile.open_to_advisory ? "Yes" : "No"}
- Bio: ${profile.bio || "Not specified"}
- Impact Highlights: ${profile.impact_highlights?.join("; ") || "Not specified"}
- Previous Companies: ${profile.previous_companies?.join(", ") || "Not specified"}
`;

    const jobsContext = jobs.map((job, i) => `
Job ${i + 1}:
- ID: ${job.id}
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
- Type: ${job.type}
- Description: ${job.description || "Not provided"}
- Requirements: ${job.requirements?.join(", ") || "Not specified"}
- Salary Range: ${job.salary_min && job.salary_max ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : "Not specified"}
`).join("\n");

    const systemPrompt = `You are an expert talent matching AI for Signal, a platform connecting senior tech talent with opportunities.

Your task is to analyze a candidate's profile and match them with the most suitable job opportunities. Consider:
1. Skills alignment - how well do the candidate's skills match job requirements
2. Seniority fit - does the job level match the candidate's experience
3. Location/work style - remote vs onsite preferences
4. Role type preferences - full-time, contract, fractional, advisory
5. Career trajectory - does this role align with their career goals

Return a JSON object with this exact structure:
{
  "matches": [
    {
      "job_id": "the job's id",
      "match_score": 95,
      "match_reasons": ["Reason 1", "Reason 2", "Reason 3"],
      "potential_concerns": ["Concern 1"],
      "recommendation": "A brief personalized recommendation"
    }
  ]
}

Rules:
- Return the top 5 best matches, sorted by match_score (highest first)
- match_score should be 0-100 based on overall fit
- Provide 2-4 specific match_reasons highlighting why this is a good fit
- Include 0-2 potential_concerns if any (location mismatch, skill gaps, etc.)
- Keep recommendation to 1-2 sentences
- Be specific and reference actual profile/job details
- Only return valid JSON, no markdown`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `${profileContext}\n\nAvailable Jobs:\n${jobsContext}\n\nAnalyze this candidate's profile and return the best job matches as JSON.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";
    
    console.log("AI response content:", content);

    // Parse the JSON response
    let matchResults;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        matchResults = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return new Response(
        JSON.stringify({ 
          matches: [],
          error: "Failed to parse matching results" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Enrich matches with full job data
    const enrichedMatches = matchResults.matches.map((match: any) => {
      const job = jobs.find(j => j.id === match.job_id);
      return {
        ...match,
        job: job || null
      };
    }).filter((match: any) => match.job !== null);

    return new Response(
      JSON.stringify({ matches: enrichedMatches }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Smart match error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
