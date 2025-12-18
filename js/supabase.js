// 🔥 Supabase credentials
const SUPABASE_URL = "https://ccqldccmikwdjkbxmcsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcWxkY2NtaWt3ZGprYnhtY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzIxODEsImV4cCI6MjA4MDcwODE4MX0.ce7CPoACHTU6ryGjoELPywa1rpGmDKG5TIZxPFbleuA";

// ✅ Защита: проверяем, загрузился ли Supabase SDK
if (!window.supabase) {
  console.error("Supabase SDK not loaded");
} else {
  window.db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
  console.log("Supabase connected");
}