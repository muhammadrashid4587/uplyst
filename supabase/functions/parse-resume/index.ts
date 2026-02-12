import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
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

    const { resumeText } = await req.json();
    
    if (!resumeText || typeof resumeText !== "string") {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Parsing resume, text length:", resumeText.length);

    const systemPrompt = `You are an expert resume parser. Extract structured information from the resume text provided.

Return a JSON object with these exact fields:
- display_name: Full name of the candidate
- title: Current or most recent job title
- bio: A 2-3 sentence professional summary based on their experience
- location: City, State/Country if mentioned
- skills: Array of technical and professional skills (max 15 most relevant)
- previous_companies: Array of company names they've worked at (max 10)
- seniority_level: One of "IC", "Manager", "Director", "VP", "C-Level" based on their roles
- leadership_team_size: Estimated team size managed (e.g., "10", "50+", "120+") or null if not mentioned
- leadership_org_level: One of "IC", "Manager", "Director", "VP", "C-Level" based on highest role
- impact_highlights: Array of 3-5 quantified achievements or key accomplishments
- education: Array of objects with { institution, degree, field, year }
- experience: Array of objects with { company, title, startDate, endDate, description }
- linkedin_url: LinkedIn URL if found in the resume
- github_url: GitHub URL if found
- portfolio_url: Portfolio/website URL if found

Be thorough but concise. Focus on extracting real information from the resume text.
If information is not present, use null for optional fields or empty arrays for list fields.`;

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
          { role: "user", content: `Parse this resume and extract structured data:\n\n${resumeText}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_resume_data",
              description: "Extract structured data from a resume",
              parameters: {
                type: "object",
                properties: {
                  display_name: { type: "string", description: "Full name of the candidate" },
                  title: { type: "string", description: "Current or most recent job title" },
                  bio: { type: "string", description: "2-3 sentence professional summary" },
                  location: { type: "string", description: "City, State/Country" },
                  skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Technical and professional skills",
                  },
                  previous_companies: {
                    type: "array",
                    items: { type: "string" },
                    description: "Company names worked at",
                  },
                  seniority_level: {
                    type: "string",
                    enum: ["IC", "Manager", "Director", "VP", "C-Level"],
                    description: "Seniority level based on roles",
                  },
                  leadership_team_size: {
                    type: "string",
                    description: "Team size managed",
                  },
                  leadership_org_level: {
                    type: "string",
                    enum: ["IC", "Manager", "Director", "VP", "C-Level"],
                    description: "Highest role level",
                  },
                  impact_highlights: {
                    type: "array",
                    items: { type: "string" },
                    description: "Quantified achievements",
                  },
                  education: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        institution: { type: "string" },
                        degree: { type: "string" },
                        field: { type: "string" },
                        year: { type: "string" },
                      },
                    },
                    description: "Education history",
                  },
                  experience: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        company: { type: "string" },
                        title: { type: "string" },
                        startDate: { type: "string" },
                        endDate: { type: "string" },
                        description: { type: "string" },
                      },
                    },
                    description: "Work experience",
                  },
                  linkedin_url: { type: "string", description: "LinkedIn URL" },
                  github_url: { type: "string", description: "GitHub URL" },
                  portfolio_url: { type: "string", description: "Portfolio URL" },
                },
                required: ["display_name", "title", "skills"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_resume_data" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
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
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the tool call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_resume_data") {
      console.error("Unexpected response format:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Failed to parse resume data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    console.log("Successfully extracted resume data for:", extractedData.display_name);

    return new Response(JSON.stringify({ data: extractedData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Resume parsing error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
