import React, { useState } from "react";
import { generateBriefing, getRiskColor } from "../services/api";

function Briefing({ region }) {
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setBriefing("");
    const result = await generateBriefing(region);
    setBriefing(result);
    setLoading(false);
  }

  return (
    <div style={{ padding: "12px" }}>

      {/* Header */}
      <div style={{
        fontSize: "10px",
        color: "#3a5a7a",
        letterSpacing: "0.1em",
        marginBottom: "12px",
      }}>
        AI INTELLIGENCE BRIEFING — {region.name.toUpperCase()}
      </div>

      {/* Region summary */}
      <div style={{
        background: "#0d1520",
        border: `1px solid ${getRiskColor(region.risk)}40`,
        borderRadius: "6px",
        padding: "12px",
        marginBottom: "12px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}>
          <div>
            <div style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#e8f4ff",
            }}>
              {region.name}
            </div>
            <div style={{
              fontSize: "11px",
              color: "#4a6a8a",
              marginTop: "2px",
            }}>
              {region.ipc} · {region.pop}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: "28px",
              fontWeight: "700",
              color: getRiskColor(region.risk),
              lineHeight: 1,
            }}>
              {region.risk}
            </div>
            <div style={{
              fontSize: "10px",
              color: getRiskColor(region.risk),
              letterSpacing: "0.1em",
            }}>
              / 100
            </div>
          </div>
        </div>

        {/* Drivers */}
        <div style={{
          fontSize: "10px",
          color: "#3a5a7a",
          marginBottom: "6px",
          letterSpacing: "0.08em",
        }}>
          PRIMARY DRIVERS
        </div>
        {region.drivers.map((driver, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <span style={{ color: "#FF9500" }}>›</span>
            <span style={{ fontSize: "12px", color: "#8aaac8" }}>
              {driver}
            </span>
          </div>
        ))}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          background: "transparent",
          border: "1px solid #1e6a3e",
          borderRadius: "4px",
          color: "#3dd68c",
          fontSize: "11px",
          letterSpacing: "0.06em",
          cursor: loading ? "default" : "pointer",
          opacity: loading ? 0.6 : 1,
          marginBottom: "12px",
          fontFamily: "'Courier New', monospace",
        }}
      >
        {loading
          ? "SENTINEL AI ANALYZING..."
          : briefing
          ? "↺ REGENERATE BRIEFING"
          : "GENERATE AI BRIEFING ↗"}
      </button>

      {/* Loading state */}
      {loading && (
        <div style={{
          background: "#0a1118",
          border: "1px solid #1a2a3a",
          borderRadius: "6px",
          padding: "16px",
        }}>
          {[
            "Ingesting NASA MODIS crop data...",
            "Cross referencing ACLED conflicts...",
            "Analyzing FAO price trends...",
            "Computing risk assessment...",
            "Generating briefing...",
          ].map((step, i) => (
            <div
              key={i}
              style={{
                fontSize: "11px",
                color: "#2a4a6a",
                marginBottom: "4px",
                paddingLeft: "12px",
              }}
            >
              › {step}
            </div>
          ))}
        </div>
      )}

      {/* Briefing result */}
      {briefing && !loading && (
        <div style={{
          background: "#0a1118",
          border: "1px solid #1a3050",
          borderRadius: "6px",
          padding: "16px",
        }}>
          {/* Briefing header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
            paddingBottom: "8px",
            borderBottom: "1px solid #1a2a3a",
          }}>
            <span style={{
              color: "#007AFF",
              fontSize: "11px",
              letterSpacing: "0.1em",
            }}>
              SENTINEL // AI BRIEFING
            </span>
            <span style={{
              color: "#3a5a7a",
              fontSize: "11px",
            }}>
              {region.name} · {region.risk}/100
            </span>
          </div>

          {/* Briefing text */}
          <div style={{
            color: "#c8d8e8",
            fontSize: "13px",
            lineHeight: "1.75",
            whiteSpace: "pre-wrap",
          }}>
            {briefing}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: "12px",
            paddingTop: "8px",
            borderTop: "1px solid #1a2a3a",
            fontSize: "10px",
            color: "#2a4a6a",
          }}>
            Sources: NASA MODIS · CHIRPS · FAO GIEWS · ACLED · NOAA
          </div>
        </div>
      )}

      {/* Empty state */}
      {!briefing && !loading && (
        <div style={{
          background: "#0a1118",
          border: "1px solid #1a2a3a",
          borderRadius: "6px",
          padding: "20px",
          textAlign: "center",
          color: "#3a5a7a",
          fontSize: "12px",
        }}>
          Click the button above to generate
          an AI briefing for {region.name}
        </div>
      )}

    </div>
  );
}

export default Briefing;