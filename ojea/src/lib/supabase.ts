import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Public MexicoV5 project. Anon key is designed to ship in the client; RLS enforces access. */
export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  "https://oqaswdsyqyecufdmwmxs.supabase.co";
export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xYXN3ZHN5cXllY3VmZG13bXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTkxODIsImV4cCI6MjEwNTA3NTE4Mn0.CgBZFnuxnXFmEKMSuRyr8zOoBITB0MUMtbRsxw7rT2E";

const isBrowser = typeof window !== "undefined";

/** SSR/Node 20 has no native WebSocket. Realtime is browser-only. */
class ClosedSocket {
  binaryType = "blob";
  bufferedAmount = 0;
  extensions = "";
  protocol = "";
  readyState = 3;
  url = "";
  onclose: ((ev: CloseEvent) => void) | null = null;
  onerror: ((ev: Event) => void) | null = null;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onopen: ((ev: Event) => void) | null = null;
  close() {}
  send() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return false;
  }
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  CONNECTING = 0;
  OPEN = 1;
  CLOSING = 2;
  CLOSED = 3;
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
    detectSessionInUrl: isBrowser,
  },
  ...(isBrowser
    ? {}
    : {
        realtime: {
          transport: ClosedSocket as unknown as typeof WebSocket,
        },
      }),
});
