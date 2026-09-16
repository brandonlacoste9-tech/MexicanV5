const SUPA = "https://oqaswdsyqyecufdmwmxs.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xYXN3ZHN5cXllY3VmZG13bXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTkxODIsImV4cCI6MjEwNTA3NTE4Mn0.CgBZFnuxnXFmEKMSuRyr8zOoBITB0MUMtbRsxw7rT2E";

export async function handler() {
  try {
    const res = await fetch(
      `${SUPA}/rest/v1/clips?select=id,username,display_name,caption,city,image,video,likes_count,tags,sound,series,country&order=created_at.desc&limit=120`,
      { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
    );
    if (!res.ok) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ ok: false, error: "Failed to get feed" }),
      };
    }
    const clips = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ ok: true, clips }),
    };
  } catch {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: false, error: "Failed to get feed" }),
    };
  }
}
