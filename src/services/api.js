const CLAUDE_KEY = process.env.REACT_APP_CLAUDE_API_KEY;

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
Risk Score: ${region.risk}/100
Crop Health: ${region.ndvi}% deficit
Rainfall: ${region.rainfall}% below average
Food Price Surge: +${region.foodPrice}%
Conflict Index: ${region.conflict}/100
Population at Risk: ${region.pop}
IPC Level: ${region.ipc}
Main Problems: ${region.drivers.join(", ")}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return "API Error: " + data.error.message;
    }

    return data.content[0].text;

  } catch (error) {
    return "Connection error. Check your API key in .env file.";
  }
}

export function getRiskColor(score) {
  if (score >= 85) return "#FF3B30";
  if (score >= 70) return "#FF9500";
  if (score >= 55) return "#FFCC00";
  return "#34C759";
}

export function getRiskLabel(score) {
  if (score >= 85) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 55) return "ELEVATED";
  return "MODERATE";
}