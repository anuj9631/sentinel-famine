import React from "react";

function SignalCard({ region }) {
  const signals = [
    {
      label: "Crop Health (NDVI)",
      value: Math.abs(region.ndvi),
      display: `-${Math.abs(region.ndvi)}%`,
      max: 100,
      color: "#34C759",
      source: "NASA MODIS",
    },
    {
      label: "Rainfall Anomaly",
      value: Math.abs(region.rainfall),
      display: `-${Math.abs(region.rainfall)}%`,
      max: 100,
      color: "#007AFF",
      source: "CHIRPS / NOAA",
    },
    {
      label: "Food Price Surge",
      value: region.foodPrice,
      display: `+${region.foodPrice}%`,
      max: 250,
      color: "#FF9500",
      source: "FAO GIEWS",
    },
    {
      label: "Conflict Intensity",
      value: region.conflict,
      display: `${region.conflict}/100`,
      max: 100,
      color: "#FF3B30",
      source: "ACLED",
    },
  ];

  return (
    <div style={{ padding: "12px" }}>
      <div style={{
        fontSize: "10px",
        color: "#3a5a7a",
        letterSpacing: "0.1em",
        marginBottom: "12px",
      }}>
        DATA SIGNALS — {region.name.toUpperCase()}
      </div>

      {signals.map((signal) => (
        <div key={signal.label} style={{
          background: "#0d1520",
          border: "1px solid #1e2d3d",
          borderRadius: "6px",
          padding: "10px 14px",
          marginBottom: "8px",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}>
            <span style={{ fontSize: "12px", color: "#c8d8e8" }}>
              {signal.label}
            </span>
            <span style={{ fontSize: "11px", color: "#4a6a8a" }}>
              {signal.source}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              flex: 1,
              height: "6px",
              background: "#1a2a3a",
              borderRadius: "3px",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${Math.min((signal.value / signal.max) * 100, 100)}%`,
                height: "100%",
                background: signal.color,
                borderRadius: "3px",
              }} />
            </div>
            <span style={{
              fontSize: "13px",
              fontWeight: "700",
              color: signal.color,
              minWidth: "55px",
              textAlign: "right",
            }}>
              {signal.display}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SignalCard;