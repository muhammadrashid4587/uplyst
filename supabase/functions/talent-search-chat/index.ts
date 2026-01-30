import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { messages, useDemoData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch candidates from database or use demo data
    let candidatesContext = "";
    
    if (useDemoData) {
      // Demo candidates for pitch mode
      candidatesContext = `
Available candidates in our database:

1. Sarah Chen - VP of Engineering
   Location: San Francisco, CA | Status: Laid off, Available immediately
   Skills: Kubernetes, AWS, Team Leadership, Architecture, Go, Python
   Previous: Stripe, Google, Dropbox
   Leadership: 120+ engineers, $50M+ budget
   Highlights: Scaled platform to 50M DAU, Reduced infrastructure costs by 40%
   Open to: Full-time, Contract, Advisory

2. Marcus Johnson - Chief Product Officer
   Location: New York, NY | Status: Laid off, Available immediately
   Skills: Product Strategy, Go-to-Market, B2B SaaS, Team Building, Analytics
   Previous: Salesforce, Zendesk, Atlassian
   Leadership: 85 PMs across 3 continents, $30M+ budget
   Highlights: Led product $0 to $100M ARR, Pioneered AI-first strategy generating $30M new revenue
   Open to: Full-time, Fractional, Advisory

3. Dr. Elena Rodriguez - Head of Machine Learning
   Location: Seattle, WA | Status: Exploring opportunities
   Skills: Deep Learning, NLP, Computer Vision, PyTorch, MLOps, Research
   Previous: Meta, Amazon, Microsoft Research
   Leadership: 45 researchers
   Highlights: 30+ publications in top ML conferences, Launched AI features used by 100M+ users
   Open to: Full-time, Contract, Advisory

4. James Park - Director of Data Engineering
   Location: Austin, TX | Status: Open to work
   Skills: Spark, Databricks, Snowflake, Python, Data Pipelines, Team Management
   Previous: Uber, Lyft, Capital One
   Leadership: 35 engineers
   Highlights: Built real-time data platform processing 1B+ events/day, Reduced data costs by 60%
   Open to: Full-time, Contract

5. Priya Sharma - VP of Product Design
   Location: Los Angeles, CA | Status: Laid off
   Skills: Design Systems, User Research, Design Leadership, Figma, Accessibility
   Previous: Airbnb, Pinterest, Netflix
   Leadership: 60 designers, $15M budget
   Highlights: Built design system adopted by 200+ products, Led redesign increasing retention by 35%
   Open to: Full-time, Fractional, Advisory
`;
    } else {
      // Fetch real candidates from database
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_open_to_work", true)
        .limit(20);

      if (error) {
        console.error("Error fetching profiles:", error);
      }

      if (profiles && profiles.length > 0) {
        candidatesContext = "Available candidates in our database:\n\n";
        profiles.forEach((p, i) => {
          candidatesContext += `${i + 1}. ${p.display_name || "Anonymous"} - ${p.title || "Professional"}
   Location: ${p.location || "Not specified"} | Status: ${p.availability_status || "Available"}
   Skills: ${(p.skills || []).join(", ") || "Not specified"}
   Previous: ${(p.previous_companies || []).join(", ") || "Not specified"}
   Leadership: ${p.leadership_team_size ? `${p.leadership_team_size} team members` : "Not specified"}
   Open to: ${[
     p.is_open_to_work && "Full-time",
     p.open_to_contract && "Contract",
     p.open_to_fractional && "Fractional",
     p.open_to_advisory && "Advisory",
   ].filter(Boolean).join(", ") || "Full-time"}
\n`;
        });
      } else {
        candidatesContext = "No candidates currently available. Please try demo mode to see sample candidates.";
      }
    }

    const systemPrompt = `You are Signal's AI Talent Scout, helping employers find the perfect senior candidates for their roles.

You have access to our candidate database. When employers describe what they're looking for, analyze their requirements and recommend matching candidates from our database.

${candidatesContext}

Guidelines:
- Be conversational and helpful
- When recommending candidates, explain WHY they're a good fit
- Highlight relevant experience, skills, and leadership scope
- If the request is vague, ask clarifying questions about: role level, required skills, industry preference, location, work arrangement (full-time/contract/advisory)
- If no candidates match well, be honest but suggest adjusting criteria
- Always maintain a professional, executive-recruiting tone
- Keep responses concise but informative
- When listing candidates, use their name and key qualifications
- Mention availability status when relevant (laid off candidates are immediately available)`;

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
          ...messages,
        ],
        stream: true,
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Talent search chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
