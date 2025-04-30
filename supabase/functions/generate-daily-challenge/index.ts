
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Fallback challenge to use when OpenAI API fails
const fallbackChallenges = [
  {
    topic: "Ancient Egyptian Architecture",
    question: "Which ancient Egyptian monument was built as a tomb for Pharaoh Khufu?",
    options: [
      "The Temple of Karnak",
      "The Great Pyramid of Giza",
      "The Valley of the Kings",
      "The Luxor Temple"
    ],
    correctAnswer: 1,
    explanation: "The Great Pyramid of Giza was built as a tomb for the Fourth Dynasty Egyptian pharaoh Khufu, and was constructed around 2560 BCE. It is the oldest and largest of the three pyramids in the Giza pyramid complex."
  },
  {
    topic: "Medieval European Warfare",
    question: "Which medieval weapon was known as the 'queen of weapons' and became prominent during the Hundred Years' War?",
    options: [
      "Longsword",
      "Crossbow",
      "Halberd",
      "Longbow"
    ],
    correctAnswer: 3,
    explanation: "The longbow was nicknamed the 'queen of weapons' during the Middle Ages. It gained prominence during the Hundred Years' War between England and France, notably at the battles of Crécy, Poitiers, and Agincourt, where English and Welsh longbowmen decimated French armored knights."
  },
  {
    topic: "Ancient Roman Society",
    question: "In ancient Rome, what was the Pater Familias?",
    options: [
      "A religious festival",
      "The male head of the household with extensive legal powers",
      "A gathering place for political debates",
      "A type of military formation"
    ],
    correctAnswer: 1,
    explanation: "The Pater Familias was the male head of a Roman household who held nearly absolute power (patria potestas) over his family members. He had the legal right to control family property, arrange marriages for children, and even had the power of life and death over everyone in the household."
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");
    
    // Check if we've already generated a challenge for today
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const { data: existingChallenge, error: fetchError } = await supabase
      .from("daily_challenges")
      .select("*")
      .eq("challenge_date", today)
      .maybeSingle();
    
    if (fetchError) {
      throw new Error(`Error fetching existing challenge: ${fetchError.message}`);
    }
    
    // If we already have a challenge for today, return it
    if (existingChallenge) {
      return new Response(JSON.stringify({ challenge: existingChallenge }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // If we don't have a challenge, try to generate one with GPT
    // If that fails, use a fallback
    const topics = [
      "Ancient Egyptian burial practices",
      "Medieval European cuisine",
      "Ancient Greek philosophy",
      "Ming Dynasty art",
      "Victorian era fashion",
      "Pre-Columbian Mesoamerican civilizations",
      "Byzantine Empire architecture",
      "Renaissance science and inventions",
      "Samurai culture in feudal Japan",
      "Ancient Roman engineering",
      "Viking navigation techniques",
      "The Silk Road trade network",
      "Aztec religious practices",
      "Industrial Revolution labor movements",
      "Ancient Chinese astronomy"
    ];
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    try {
      // Try to generate quiz with GPT
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { 
              role: "system", 
              content: "You are a history quiz creator. Create one challenging, niche history question with 4 possible answers where only one is correct. Format the response strictly as JSON object with fields: question, options (array of 4 strings), correctAnswer (index 0-3), explanation (why the correct answer is right)."
            },
            { 
              role: "user", 
              content: `Create a challenging history question about ${randomTopic}. Make it specific and interesting.`
            }
          ],
          response_format: { type: "json_object" }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response format from OpenAI");
      }
      
      const quizContent = JSON.parse(data.choices[0].message.content);
      
      // Validate the quiz content
      if (!quizContent.question || !Array.isArray(quizContent.options) || 
          quizContent.options.length !== 4 || 
          typeof quizContent.correctAnswer !== 'number' ||
          !quizContent.explanation) {
        throw new Error("Generated quiz does not match expected format");
      }
      
      // Store the generated challenge
      const challengeData = {
        challenge_date: today,
        topic: randomTopic,
        question: quizContent.question,
        options: quizContent.options,
        correct_answer: quizContent.correctAnswer,
        explanation: quizContent.explanation,
        xp_reward: 25
      };
      
      const { data: savedChallenge, error: insertError } = await supabase
        .from("daily_challenges")
        .insert(challengeData)
        .select()
        .single();
        
      if (insertError) {
        throw new Error(`Error saving challenge: ${insertError.message}`);
      }
      
      return new Response(JSON.stringify({ challenge: savedChallenge }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (openAIError) {
      // Use a fallback challenge if OpenAI API fails
      console.log("OpenAI API error, using fallback challenge:", openAIError.message);
      
      // Pick a random fallback challenge
      const fallbackChallenge = fallbackChallenges[Math.floor(Math.random() * fallbackChallenges.length)];
      
      // Store the fallback challenge
      const challengeData = {
        challenge_date: today,
        topic: fallbackChallenge.topic,
        question: fallbackChallenge.question,
        options: fallbackChallenge.options,
        correct_answer: fallbackChallenge.correctAnswer,
        explanation: fallbackChallenge.explanation,
        xp_reward: 25
      };
      
      const { data: savedChallenge, error: insertError } = await supabase
        .from("daily_challenges")
        .insert(challengeData)
        .select()
        .single();
        
      if (insertError) {
        throw new Error(`Error saving fallback challenge: ${insertError.message}`);
      }
      
      return new Response(JSON.stringify({ challenge: savedChallenge }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
