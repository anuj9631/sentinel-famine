import React from "react";
import { getRiskColor, getRiskLabel } from "../services/api";

function Map({ regions, selected, onSelect }) {

  const positions = {
    som: { cx: 415, cy: 238 },
    yem: { cx: 430, cy: 188 },
    eth: { cx: 390, cy: 215 },
    afg: { cx: 470, cy: 175 },
    ssd: { cx: 368, cy: 228 },
    hti: { cx: 218, cy: 200 },
    drc: { cx: 348, cy: 248 },
    mli: { cx: 300, cy: 198 },
  };

  return (
    <div style={{ padding: "12px" }}>

      {/* Map SVG */}
      <svg
        viewBox="60 130 500 230"
        width="100%"
        style={{
          background: "#0a1118",
          borderRadius: "6px",
          border: "1px solid #1a2a3a",
        }}
      >
        {/* Grid lines horizontal */}
        {[140,160,180,200,220,240,260,280,300,320,340].map((y) => (
          <line
            key={y}
            x1="60" y1={y}
            x2="560" y2={y}
            stroke="#1a2a3a"
            strokeWidth="0.3"
          />
        ))}

        {/* Grid lines vertical */}
        {[80,120,160,200,240,280,320,360,400,440,480,520].map((x) => (
          <line
            key={x}
            x1={x} y1="130"
            x2={x} y2="360"
            stroke="#1a2a3a"
            strokeWidth="0.3"
          />
        ))}

        {/* Continent shapes */}
        <path
          d="M280,145 Q295,140 310,148 Q325,155 330,165
             Q335,175 328,190 Q320,205 305,220
             Q295,230 285,225 Q270,218 260,205
             Q250,190 255,175 Q260,160 270,150 Z"
          fill="#0d1820"
          stroke="#1e3050"
          strokeWidth="0.8"
        />
        <path
          d="M305,145 Q340,138 370,145 Q400,152 420,165
             Q440,178 445,200 Q450,220 438,238
             Q425,255 405,262 Q380,268 355,258
             Q330,248 315,230 Q300,212 298,190
             Q296,168 305,145 Z"
          fill="#0d1820"
          stroke="#1e3050"
          strokeWidth="0.8"
        />
        <path
          d="M420,160 Q435,155 450,162 Q462,170 465,185
             Q468,200 458,215 Q448,228 432,232
             Q418,235 408,224 Q398,212 400,195
             Q402,178 412,168 Z"
          fill="#0d1820"
          stroke="#1e3050"
          strokeWidth="0.8"
        />
        <path
          d="M190,165 Q215,158 235,168 Q250,178 252,195
             Q254,212 242,225 Q228,237 210,238
             Q192,238 180,225 Q168,212 170,195
             Q172,178 185,168 Z"
          fill="#0d1820"
          stroke="#1e3050"
          strokeWidth="0.8"
        />

        {/* Glow circles behind dots */}
        {regions.map((r) => (
          <circle
            key={r.id + "-glow"}
            cx={positions[r.id]?.cx}
            cy={positions[r.id]?.cy}
            r="18"
            fill={getRiskColor(r.risk)}
            opacity="0.08"
          />
        ))}

        {/* Region dots */}
        {regions.map((r) => (
          <g
            key={r.id}
            onClick={() => onSelect(r)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={positions[r.id]?.cx}
              cy={positions[r.id]?.cy}
              r={selected.id === r.id ? 10 : 7}
              fill={getRiskColor(r.risk)}
              opacity={selected.id === r.id ? 1 : 0.8}
              stroke={selected.id === r.id ? "#ffffff" : "transparent"}
              strokeWidth="1.5"
            />
            <text
              x={positions[r.id]?.cx}
              y={positions[r.id]?.cy + 18}
              textAnchor="middle"
              fill="#8aaac8"
              fontSize="7"
              fontFamily="Courier New"
            >
              {r.name}
            </text>
          </g>
        ))}

        {/* Selected region label */}
        {selected && positions[selected.id] && (
          <g>
            <line
              x1={positions[selected.id].cx}
              y1={positions[selected.id].cy - 10}
              x2={positions[selected.id].cx}
              y2={positions[selected.id].cy - 30}
              stroke={getRiskColor(selected.risk)}
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />
            <rect
              x={positions[selected.id].cx - 45}
              y={positions[selected.id].cy - 52}
              width="90"
              height="20"
              rx="3"
              fill="#0a1520"
              stroke={getRiskColor(selected.risk)}
              strokeWidth="0.8"
            />
            <text
              x={positions[selected.id].cx}
              y={positions[selected.id].cy - 39}
              textAnchor="middle"
              fill={getRiskColor(selected.risk)}
              fontSize="8"
              fontFamily="Courier New"
              fontWeight="600"
            >
              {getRiskLabel(selected.risk)} · {selected.risk}/100
            </text>
          </g>
        )}

        {/* Legend */}
        {[
          ["#FF3B30", "CRITICAL 85+"],
          ["#FF9500", "HIGH 70+"],
          ["#FFCC00", "ELEVATED 55+"],
          ["#34C759", "MODERATE"],
        ].map(([color, label], i) => (
          <g key={label}>
            <circle cx="78" cy={145 + i * 12} r="4" fill={color} />
            <text
              x="86"
              y={149 + i * 12}
              fill="#4a6a8a"
              fontSize="7"
              fontFamily="Courier New"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>

      {/* Selected region info */}
      <div style={{
        marginTop: "10px",
        background: "#0a1118",
        border: `1px solid ${getRiskColor(selected.risk)}40`,
        borderRadius: "6px",
        padding: "12px 16px",
      }}>
        {/* Name and score */}
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
              {selected.name}
            </div>
            <div style={{
              fontSize: "11px",
              color: "#4a6a8a",
              marginTop: "2px",
            }}>
              {selected.ipc} · {selected.pop}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: "28px",
              fontWeight: "700",
              color: getRiskColor(selected.risk),
              lineHeight: 1,
            }}>
              {selected.risk}
            </div>
            <div style={{
              fontSize: "10px",
              color: getRiskColor(selected.risk),
              letterSpacing: "0.1em",
            }}>
              {getRiskLabel(selected.risk)}
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
        {selected.drivers.map((driver, i) => (
          <div key={i} style={{
            display: "flex",
            gap: "8px",
            marginBottom: "3px",
          }}>
            <span style={{ color: "#FF9500" }}>›</span>
            <span style={{ fontSize: "12px", color: "#8aaac8" }}>
              {driver}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Map;