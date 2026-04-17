import React, { useState, useEffect } from "react";
import { fetchRegions, fetchRiskScores, getRiskColor } from "../services/api";
import RegionList from "../components/RegionList";
import AlertPanel from "../components/AlertPanel";
import Map from "../components/Map";
import SignalCard from "../components/SignalCard";
import Briefing from "../components/Briefing";

function Dashboard() {
  const [regions, setRegions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("map");
  const [loading, setLoading] = useState(true);

  // load data from supabase on start
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const regionsData = await fetchRegions();
      const scoresData = await fetchRiskScores();

      // merge region info with latest risk scores
      const merged = regionsData.map((region) => {
        const score = scoresData.find(
          (s) => s.region_id === region.id
        );
        return {
          ...region,
          risk_score: score?.risk_score || 0,
          ndvi: score?.ndvi || 0,
          rainfall: score?.rainfall || 0,
          food_price: score?.food_price || 0,
          conflict: score?.conflict || 0,
          // keep old keys working too
          risk: score?.risk_score || 0,
          foodPrice: score?.food_price || 0,
          pop: region.population,
          drivers: [],
          alert: (score?.risk_score || 0) >= 70,
        };
      });

      const sorted = merged.sort((a, b) => b.risk_score - a.risk_score);
      setRegions(sorted);
      setSelected(sorted[0]);
      setLoading(false);
    }

    loadData();
  }, []);

  const tabs = [
    { id: "map", label: "RISK MAP" },
    { id: "signals", label: "DATA SIGNALS" },
    { id: "briefing", label: "AI BRIEFING" },
  ];

  const alertCount = regions.filter((r) => r.risk_score >= 70).length;
  const criticalCount = regions.filter((r) => r.risk_score >= 85).length;

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080c10",
        color: "#3a5a7a",
        fontSize: "13px",
        letterSpacing: "0.1em",
      }}>
        SENTINEL LOADING DATA FROM DATABASE...
      </div>
    );
  }

  if (!selected) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

      {/* Header */}
      <div style={{
        background: "#060a0e",
        borderBottom: "1px solid #1a2a3a",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
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
          <span style={{ fontSize: "11px", color: "#3a5a7a" }}>
            // Predictive Famine Intelligence Platform
          </span>
        </div>
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
          { label: "REGIONS MONITORED", value: regions.length },
          { label: "CRITICAL RISK", value: criticalCount, color: "#FF3B30" },
          { label: "HIGH RISK", value: alertCount - criticalCount, color: "#FF9500" },
          { label: "PEOPLE AT RISK", value: "96.2M", color: "#FFCC00" },
          { label: "DATA SOURCES", value: "7 APIs" },
          { label: "MODEL ACCURACY", value: "84.3%", color: "#34C759" },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: "8px 20px",
            borderRight: "1px solid #1a2a3a",
            textAlign: "center",
            flexShrink: 0,
          }}>
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
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left */}
        <RegionList
          regions={regions}
          selected={selected}
          onSelect={setSelected}
        />

        {/* Center */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          background: "#080c10",
        }}>
          {/* Tabs */}
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
                regions={regions}
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

        {/* Right */}
        <AlertPanel
          regions={regions}
          selected={selected}
          onSelect={setSelected}
        />
      </div>
    </div>
  );
}

export default Dashboard;

//final commit