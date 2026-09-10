import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { CreateEventInput } from "@/types/event";

export async function GET() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateEventInput;

  if (!body.title || !body.starts_at) {
    return NextResponse.json(
      { error: "title and starts_at are required" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: body.title,
      description: body.description ?? null,
      location: body.location ?? null,
      starts_at: body.starts_at,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ event: data }, { status: 201 });
}
