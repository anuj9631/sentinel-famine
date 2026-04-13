import React from "react";
import { getRiskColor, getRiskLabel } from "../services/api";

function RegionList({ regions, selected, onSelect }) {
  return (
    <div style={{
      width: "260px",
      background: "#080c10",
      borderRight: "1px solid #1a2a3a",
      overflowY: "auto",
      height: "100vh",
    }}>

      {/* Header */}
      <div style={{
        padding: "10px 12px",
        borderBottom: "1px solid #1a2a3a",
        fontSize: "10px",
        color: "#3a5a7a",
        letterSpacing: "0.1em",
      }}>
        REGIONS — SORTED BY RISK
      </div>

      {/* Region rows */}
      {[...regions]
        .sort((a, b) => b.risk - a.risk)
        .map((region) => (
          <div
            key={region.id}
            onClick={() => onSelect(region)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderBottom: "1px solid #0e1a24",
              cursor: "pointer",
              background: selected.id === region.id
                ? "#112030"
                : "transparent",
            }}
          >
            {/* Color dot */}
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: getRiskColor(region.risk),
              flexShrink: 0,
            }} />

            {/* Name and IPC */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "13px",
                color: "#c8d8e8",
                fontWeight: "500",
              }}>
                {region.name}
              </div>
              <div style={{
                fontSize: "10px",
                color: "#4a6a8a",
                marginTop: "2px",
              }}>
                {region.ipc}
              </div>
            </div>

            {/* Risk score */}
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: "16px",
                fontWeight: "700",
                color: getRiskColor(region.risk),
              }}>
                {region.risk}
              </div>
              <div style={{
                fontSize: "9px",
                color: getRiskColor(region.risk),
                letterSpacing: "0.08em",
              }}>
                {getRiskLabel(region.risk)}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default RegionList;