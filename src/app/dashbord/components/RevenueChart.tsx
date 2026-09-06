"use client";

import React, { useState, useEffect, useRef } from "react";

const chartData = [
  { month: "Jan", value: 48000 },
  { month: "Feb", value: 66000 },
  { month: "Mar", value: 54000 },
  { month: "Apr", value: 90000 },
  { month: "May", value: 102000 },
  { month: "Jun", value: 114000 },
];

export default function RevenueChart({ data }: { data?: { month: string; value: number }[] }) {
  const chartDataToUse = data && data.length > 0 ? data : chartData;
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; month: string; pct: number } | null>(null);
  const [animatedHeights, setAnimatedHeights] = useState<number[]>(chartDataToUse.map(() => 0));
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 560;
  const H = 240;
  const PADDING = { top: 28, right: 24, bottom: 40, left: 60 };
  const chartW = W - PADDING.left - PADDING.right;
  const chartH = H - PADDING.top - PADDING.bottom;

  const maxVal = Math.max(...chartDataToUse.map((d) => d.value), 1);
  const yMax = Math.ceil(maxVal / 30000) * 30000 || 30000;
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  const barWidth = (chartW / chartDataToUse.length) * 0.8;
  const barGap = chartW / chartDataToUse.length;

  const getBarX = (i: number) => PADDING.left + i * barGap + (barGap - barWidth) / 2;
  const getBarH = (val: number) => (val / yMax) * chartH;

  useEffect(() => {
    setAnimatedHeights(chartDataToUse.map(() => 0));
    chartDataToUse.forEach((d, i) => {
      setTimeout(() => {
        setAnimatedHeights((prev) => {
          const next = [...prev];
          next[i] = getBarH(d.value);
          return next;
        });
      }, 60 + i * 80);
    });
  }, [chartDataToUse]);

  const formatVal = (v: number) =>
    v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`;

  const prevVal = (i: number) => (i === 0 ? chartDataToUse[0].value : chartDataToUse[i - 1].value);
  const pctChange = (i: number) => {
    if (i === 0) return 0;
    return Math.round(((chartDataToUse[i].value - prevVal(i)) / prevVal(i)) * 100) || 0;
  };

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => { setTooltip(null); setHoveredIdx(null); }}
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6014" />
            <stop offset="100%" stopColor="#FFBAB4" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E05A50" />
            <stop offset="60%" stopColor="#FF6014" />
            <stop offset="100%" stopColor="#FFB3AD" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="barGloss" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="50%" stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="barGlow" x="-30%" y="-10%" width="160%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#FF6014" floodOpacity="0.28" />
          </filter>
          <filter id="trackShadow" x="-5%" y="-2%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#cbd5e1" floodOpacity="0.4" />
          </filter>
        </defs>

        <pattern id="dotGrid" x={PADDING.left} y={PADDING.top} width="40" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="#e2e8f0" />
        </pattern>
        <rect x={PADDING.left} y={PADDING.top} width={chartW} height={chartH} fill="url(#dotGrid)" opacity="0.5" />

        {yTicks.map((tick, i) => {
          const y = PADDING.top + chartH - (tick / yMax) * chartH;
          const isZero = tick === 0;
          return (
            <g key={i}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={W - PADDING.right}
                y2={y}
                stroke={isZero ? "#e2e8f0" : "#f1f5f9"}
                strokeWidth={isZero ? 1.5 : 1}
                strokeDasharray={isZero ? "none" : "4 4"}
              />
              <text
                x={PADDING.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="#94a3b8"
                fontFamily="Inter, ui-sans-serif, sans-serif"
                fontWeight={500}
                letterSpacing="-0.3"
              >
                {formatVal(tick)}
              </text>
            </g>
          );
        })}

        {chartDataToUse.map((d, i) => {
          const bx = getBarX(i);
          const animH = animatedHeights[i] ?? 0;
          const by = PADDING.top + chartH - animH;
          const isHov = hoveredIdx === i;
          const r = 9;

          return (
            <g key={d.month}>
              <rect
                x={bx}
                y={PADDING.top}
                width={barWidth}
                height={chartH}
                rx={r}
                fill="#f8fafc"
                filter="url(#trackShadow)"
              />

              <rect
                x={bx}
                y={by}
                width={barWidth}
                height={animH}
                rx={r}
                fill={isHov ? "url(#barGradHover)" : "url(#barGrad)"}
                filter={isHov ? "url(#barGlow)" : undefined}
                style={{
                  transition: "y 0.6s cubic-bezier(.34,1.4,.64,1), height 0.6s cubic-bezier(.34,1.4,.64,1), filter 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => {
                  setHoveredIdx(i);
                  const svgEl = svgRef.current;
                  if (!svgEl) return;
                  const rect = svgEl.getBoundingClientRect();
                  const scaleX = rect.width / W;
                  const scaleY = rect.height / H;
                  setTooltip({
                    x: bx * scaleX + (barWidth / 2) * scaleX,
                    y: (by - 14) * scaleY,
                    value: d.value,
                    month: d.month,
                    pct: pctChange(i),
                  });
                }}
                onMouseLeave={() => { setHoveredIdx(null); setTooltip(null); }}
              />

              {animH > 4 && (
                <rect
                  x={bx}
                  y={by}
                  width={barWidth * 0.55}
                  height={animH}
                  rx={r}
                  fill="url(#barGloss)"
                  style={{ pointerEvents: "none", transition: "y 0.6s cubic-bezier(.34,1.4,.64,1), height 0.6s cubic-bezier(.34,1.4,.64,1)" }}
                />
              )}

              {isHov && animH > 8 && (
                <text
                  x={bx + barWidth / 2}
                  y={by - 5}
                  textAnchor="middle"
                  fontSize={9.5}
                  fill="#FF6014"
                  fontFamily="Inter, ui-sans-serif, sans-serif"
                  fontWeight={700}
                  letterSpacing="-0.2"
                >
                  {formatVal(d.value)}
                </text>
              )}

              <text
                x={bx + barWidth / 2}
                y={H - 8}
                textAnchor="middle"
                fontSize={11}
                fill={isHov ? "#64748b" : "#94a3b8"}
                fontFamily="Inter, ui-sans-serif, sans-serif"
                fontWeight={isHov ? 700 : 600}
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="absolute pointer-events-none z-20 whitespace-nowrap -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-4 py-3 min-w-[120px]">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{tooltip.month} 2026</div>
            <div className="text-base font-bold leading-tight">₹{tooltip.value.toLocaleString()}</div>
            {tooltip.pct !== 0 && (
              <div className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${tooltip.pct > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {tooltip.pct > 0 ? "▲" : "▼"} {Math.abs(tooltip.pct)}% vs prev
              </div>
            )}
          </div>
          <div className="w-0 h-0 mx-auto border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
