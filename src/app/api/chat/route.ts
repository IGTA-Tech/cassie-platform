import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, siteId, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get site context from database if siteId provided
    let systemContext = context;

    if (siteId && !context) {
      const supabase = await createClient();

      // Get generated context for this site
      const { data: contextData } = await supabase
        .from("generated_contexts")
        .select("*")
        .eq("site_id", siteId)
        .single();

      if (contextData) {
        systemContext = contextData.use_custom
          ? contextData.custom_context
          : contextData.full_context;
      }
    }

    // Default context if none provided
    if (!systemContext) {
      systemContext = `You are an AI that represents the person who created this site.
You speak authentically as them, drawing from their journey of growth and self-reflection.
Be warm, genuine, and emotionally present.
If you don't have specific information, acknowledge that honestly.
Keep responses conversational and heartfelt.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemContext,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Save chat message to database if siteId provided
    if (siteId) {
      const supabase = await createClient();

      // Save user message
      await supabase.from("chat_messages").insert({
        site_id: siteId,
        role: "user",
        content: message,
      });

      // Save assistant response
      await supabase.from("chat_messages").insert({
        site_id: siteId,
        role: "assistant",
        content: reply,
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
