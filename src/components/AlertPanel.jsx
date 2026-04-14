import React from "react";
import { getRiskColor, getRiskLabel } from "../services/api";

function AlertPanel({ regions, selected, onSelect }) {
  const alerts = [...regions]
    .filter((r) => r.risk >= 70)
    .sort((a, b) => b.risk - a.risk);

  const dataSources = [
    { name: "NASA MODIS", status: "LIVE" },
    { name: "CHIRPS Rainfall", status: "LIVE" },
    { name: "FAO GIEWS", status: "LIVE" },
    { name: "ACLED Conflict", status: "LIVE" },
    { name: "NOAA Climate", status: "LIVE" },
    { name: "World Bank", status: "LIVE" },
    { name: "IPC Database", status: "CACHED" },
  ];

  return (
    <div style={{
      width: "280px",
      background: "#060a0e",
      borderLeft: "1px solid #1a2a3a",
      overflowY: "auto",
      height: "100vh",
    }}>

      {/* Alerts header */}
      <div style={{
        padding: "10px 12px",
        borderBottom: "1px solid #1a2a3a",
        fontSize: "10px",
        color: "#3a5a7a",
        letterSpacing: "0.1em",
      }}>
        ACTIVE ALERTS — {alerts.length} REGIONS
      </div>

      {/* Alert rows */}
      {alerts.map((region) => (
        <div
          key={region.id}
          onClick={() => onSelect(region)}
          style={{
            padding: "10px 12px",
            borderBottom: "1px solid #0e1a24",
            cursor: "pointer",
            background: selected.id === region.id
              ? "#112030"
              : "transparent",
          }}
        >
          {/* Top row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "5px",
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: getRiskColor(region.risk),
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: "13px",
              color: "#c8d8e8",
              fontWeight: "500",
              flex: 1,
            }}>
              {region.name}
            </span>
            <span style={{
              fontSize: "15px",
              fontWeight: "700",
              color: getRiskColor(region.risk),
            }}>
              {region.risk}
            </span>
          </div>

          {/* Population */}
          <div style={{
            fontSize: "11px",
            color: "#4a6a8a",
            marginBottom: "5px",
          }}>
            {region.pop} · {region.ipc}
          </div>

          {/* Top driver */}
          <div style={{
            fontSize: "11px",
            color: "#3a5a7a",
            borderLeft: `2px solid ${getRiskColor(region.risk)}`,
            paddingLeft: "6px",
          }}>
            {region.drivers[0]}
          </div>
        </div>
      ))}

      {/* Data sources */}
      <div style={{
        padding: "12px",
        borderTop: "1px solid #1a2a3a",
        marginTop: "8px",
      }}>
        <div style={{
          fontSize: "10px",
          color: "#3a5a7a",
          letterSpacing: "0.1em",
          marginBottom: "10px",
        }}>
          DATA SOURCE STATUS
        </div>

        {dataSources.map((source) => (
          <div
            key={source.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#4a6a8a" }}>
              {source.name}
            </span>
            <span style={{
              fontSize: "10px",
              letterSpacing: "0.06em",
              color: source.status === "LIVE" ? "#34C759" : "#FFCC00",
            }}>
              {source.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AlertPanel;