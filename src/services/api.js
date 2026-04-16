import supabase from "../supabase";

const CLAUDE_KEY = process.env.REACT_APP_CLAUDE_API_KEY;

// ── fetch all regions from database ──
export async function fetchRegions() {
  const { data, error } = await supabase
    .from("regions")
    .select("*");

  if (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
  return data;
}

// ── fetch latest risk scores from database ──
export async function fetchRiskScores() {
  const { data, error } = await supabase
    .from("risk_scores")
    .select("*")
    .order("recorded_at", { ascending: false });

  if (error) {
    console.error("Error fetching risk scores:", error);
    return [];
  }
  return data;
}

// ── save briefing to database ──
export async function saveBriefing(regionId, content) {
  const { error } = await supabase
    .from("briefings")
    .insert({ region_id: regionId, content });

  if (error) {
    console.error("Error saving briefing:", error);
  }
}

// ── save alert to database ──
export async function saveAlert(regionId, riskScore, level, message) {
  const { error } = await supabase
    .from("alerts")
    .insert({
      region_id: regionId,
      risk_score: riskScore,
      alert_level: level,
      message,
    });

  if (error) {
    console.error("Error saving alert:", error);
  }
}

// ── generate AI briefing using Claude ──
export async function generateBriefing(region) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are SENTINEL — an AI analyst for a 
Predictive Famine Intelligence Platform. 
Write short, clear humanitarian risk briefings.
Use this format:
SITUATION: (2 sentences)
KEY DRIVERS: (3 bullet points)
RECOMMENDED ACTIONS: (3 bullet points)
30-DAY OUTLOOK: (1 sentence)`,
        messages: [
          {
            role: "user",
            content: `Write a famine risk briefing for ${region.name}.
Risk Score: ${region.risk_score}/100
Crop Health: ${region.ndvi}% deficit
Rainfall: ${region.rainfall}% below average
Food Price Surge: +${region.food_price}%
Conflict Index: ${region.conflict}/100
Population at Risk: ${region.population}
IPC Level: ${region.ipc}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return "API Error: " + data.error.message;
    }

    const briefingText = data.content[0].text;

    // save to database
    await saveBriefing(region.id, briefingText);

    return briefingText;

  } catch (error) {
    return "Connection error. Check your API key in .env file.";
  }
}

// ── risk color helper ──
export function getRiskColor(score) {
  if (score >= 85) return "#FF3B30";
  if (score >= 70) return "#FF9500";
  if (score >= 55) return "#FFCC00";
  return "#34C759";
}

// ── risk label helper ──
export function getRiskLabel(score) {
  if (score >= 85) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 55) return "ELEVATED";
  return "MODERATE";
}