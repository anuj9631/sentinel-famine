import React, { useState } from "react";
import REGIONS from "../data/regions";
import RegionList from "../components/RegionList";
import AlertPanel from "../components/AlertPanel";
import Map from "../components/Map";
import SignalCard from "../components/SignalCard";
import Briefing from "../components/Briefing";

function Dashboard() {
  const [selected, setSelected] = useState(REGIONS[0]);
  const [activeTab, setActiveTab] = useState("map");

  const tabs = [
    { id: "map", label: "RISK MAP" },
    { id: "signals", label: "DATA SIGNALS" },
    { id: "briefing", label: "AI BRIEFING" },
  ];

  const alertCount = REGIONS.filter((r) => r.risk >= 70).length;
  const criticalCount = REGIONS.filter((r) => r.risk >= 85).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

      {/* Top header */}
      <div style={{
        background: "#060a0e",
        borderBottom: "1px solid #1a2a3a",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#FF3B30",
          }} />
          <span style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#e8f4ff",
            letterSpacing: "0.15em",
          }}>
            SENTINEL
          </span>
          <span style={{
            fontSize: "11px",
            color: "#3a5a7a",
          }}>
            // Predictive Famine Intelligence Platform
          </span>
        </div>

        {/* Status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          fontSize: "11px",
        }}>
          <span style={{ color: "#4a6a8a" }}>
            LIVE · {new Date().toISOString().slice(0, 10)}
          </span>
          <span style={{ color: "#FF9500" }}>
            ⚠ {alertCount} ACTIVE ALERTS
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        background: "#090d12",
        borderBottom: "1px solid #1a2a3a",
        display: "flex",
        flexShrink: 0,
        overflowX: "auto",
      }}>
        {[
          { label: "REGIONS MONITORED", value: "8", color: null },
          { label: "CRITICAL RISK", value: criticalCount, color: "#FF3B30" },
          { label: "HIGH RISK", value: alertCount - criticalCount, color: "#FF9500" },
          { label: "PEOPLE AT RISK", value: "96.2M", color: "#FFCC00" },
          { label: "DATA SOURCES", value: "7 APIs", color: null },
          { label: "MODEL ACCURACY", value: "84.3%", color: "#34C759" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              padding: "8px 20px",
              borderRight: "1px solid #1a2a3a",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <div style={{
              fontSize: "10px",
              color: "#3a5a7a",
              letterSpacing: "0.08em",
              marginBottom: "2px",
            }}>
              {stat.label}
            </div>
            <div style={{
              fontSize: "16px",
              fontWeight: "700",
              color: stat.color || "#c8d8e8",
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
      }}>

        {/* Left — region list */}
        <RegionList
          regions={REGIONS}
          selected={selected}
          onSelect={setSelected}
        />

        {/* Center — tabs + content */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          background: "#080c10",
        }}>

          {/* Tab buttons */}
          <div style={{
            display: "flex",
            borderBottom: "1px solid #1a2a3a",
            background: "#060a0e",
            flexShrink: 0,
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab.id
                    ? "2px solid #007AFF"
                    : "2px solid transparent",
                  padding: "10px 20px",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  color: activeTab === tab.id ? "#e8f4ff" : "#3a5a7a",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1 }}>
            {activeTab === "map" && (
              <Map
                regions={REGIONS}
                selected={selected}
                onSelect={setSelected}
              />
            )}
            {activeTab === "signals" && (
              <SignalCard region={selected} />
            )}
            {activeTab === "briefing" && (
              <Briefing region={selected} />
            )}
          </div>
        </div>

        {/* Right — alerts */}
        <AlertPanel
          regions={REGIONS}
          selected={selected}
          onSelect={setSelected}
        />
      </div>
    </div>
  );
}

export default Dashboard;