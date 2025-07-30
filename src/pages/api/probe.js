// src/pages/api/probe.js

export async function GET(request) {
  const timestamp = new Date().toISOString();
  console.log(`[PROBE HIT] /api/probe was successfully accessed at ${timestamp}`);
  
  return new Response(JSON.stringify({ 
    status: "ok", 
    message: "Probe is alive and logging.",
    timestamp: timestamp
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}