"use client";

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaSnowflake, FaBroom, FaBolt, FaFaucet, FaPaintRoller } from "react-icons/fa";
import { TbTruck, TbScissors } from "react-icons/tb";
import { MdOutlineSecurity } from "react-icons/md";
import { LayoutGrid } from "lucide-react";
import { Expert } from "./types";
import "./leaflet-custom.css";
import VendorCategoryTags from "./VendorCategoryTags";
import VendorLocationInfo from "./VendorLocationInfo";

const KOLKATA_CENTER: [number, number] = [22.5726, 88.3639];
const DEFAULT_ZOOM = 7;

interface KolkataMapProps {
  filteredExperts: Expert[];
  selectedExpertId: string;
  setSelectedExpertId: (id: string) => void;
  onViewDetails?: (expert: Expert) => void;
}

function MapController({
  selectedExpert,
}: {
  selectedExpert: Expert | undefined;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedExpert) {
      map.flyTo([selectedExpert.lat, selectedExpert.lng], 12, { duration: 0.8 });
    }
  }, [selectedExpert, map]);

  return null;
}

function MapInvalidator() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => map.invalidateSize();
    const timers = [0, 100, 300, 600].map((delay) => window.setTimeout(invalidate, delay));
    window.addEventListener("resize", invalidate);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("resize", invalidate);
    };
  }, [map]);

  return null;
}

function BoundsController({ experts }: { experts: Expert[] }) {
  const map = useMap();

  useEffect(() => {
    if (experts.length === 0) return;
    const bounds = L.latLngBounds(experts.map((expert) => [expert.lat, expert.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [experts, map]);

  return null;
}
function ResetController({ resetToken }: { resetToken: number }) {
  const map = useMap();

  useEffect(() => {
    if (resetToken > 0) {
      map.flyTo(KOLKATA_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
    }
  }, [resetToken, map]);

  return null;
}

const renderCategoryIcon = (iconName: string, className = "w-4 h-4") => {
  if (iconName === "ac") return <FaSnowflake className={className} />;
  if (iconName === "cleaning") return <FaBroom className={className} />;
  if (iconName === "plumbing") return <FaFaucet className={className} />;
  if (iconName === "shifting") return <TbTruck className={className} />;
  if (iconName === "painting") return <FaPaintRoller className={className} />;
  if (iconName === "cctv") return <MdOutlineSecurity className={className} />;
  if (iconName === "salon") return <TbScissors className={className} />;
  if (iconName === "electric") return <FaBolt className={className} />;
  return <LayoutGrid className={className} />;
};

function getMarkerLocationLabel(expert: Expert) {
  const lines: string[] = [];
  if (expert.district) lines.push(`District: ${expert.district}`);
  if (expert.division) lines.push(`Division: ${expert.division}`);
  return lines.join("<br/>");
}

function getMarkerShortLabel(expert: Expert) {
  if (expert.district && expert.division && expert.district !== expert.division) {
    return `${expert.district}, ${expert.division}`;
  }
  return expert.district || expert.division || expert.location.split(",")[0] || "Kolkata, India";
}

function createMarkerIcon(expert: Expert, isSelected: boolean) {
  const locationLabel = getMarkerLocationLabel(expert);
  const shortLabel = getMarkerShortLabel(expert);
  const safeName = expert.name.replace(/"/g, "'");
  const safeShortLabel = shortLabel.replace(/"/g, "'");
  const showFullLabel = isSelected && locationLabel;

  return L.divIcon({
    className: "custom-vendor-marker",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid ${isSelected ? "#ffffff" : "rgba(255,124,113,0.25)"};
          background: ${isSelected ? "#FF6014" : "#ffffff"};
          color: ${isSelected ? "#ffffff" : "#FF6014"};
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.18);
          transform: scale(${isSelected ? 1.15 : 1});
          transition: transform 0.2s ease;
        ">
          <span style="font-size: 16px; font-weight: 800;">${safeName.charAt(0).toUpperCase()}</span>
        </div>
        <div style="
          max-width: 160px;
          padding: ${showFullLabel ? "6px 10px" : "4px 8px"};
          border-radius: 12px;
          background: rgba(255,255,255,0.96);
          border: 1px solid ${isSelected ? "rgba(255,124,113,0.45)" : "rgba(148,163,184,0.35)"};
          color: #334155;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.35;
          text-align: center;
          box-shadow: 0 4px 12px rgba(15,23,42,0.12);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        ">${showFullLabel ? locationLabel : safeShortLabel}</div>
      </div>
    `,
    iconSize: [44, 78],
    iconAnchor: [22, 22],
    popupAnchor: [0, -40],
  });
}

function VendorMarker({
  expert,
  isSelected,
  onSelect,
  onViewDetails,
}: {
  expert: Expert;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isSelected) {
      markerRef.current?.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[expert.lat, expert.lng]}
      icon={createMarkerIcon(expert, isSelected)}
      eventHandlers={{ click: onSelect }}
    >
      <Popup>
        <div className="min-w-[220px] space-y-2.5">
          <div className="flex items-center gap-2">
            {expert.avatar ? (
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
            ) : null}
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">{expert.name}</p>
            </div>
          </div>

          <VendorLocationInfo expert={expert} compact />

          <VendorCategoryTags categories={expert.categories} max={3} />

          <p className="text-sm font-black text-[#FF6014]">
            ₹{expert.price.toLocaleString()}+
          </p>

          <button
            type="button"
            onClick={onViewDetails}
            className="w-full rounded-lg bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-bold py-2 transition-colors cursor-pointer"
          >
            View Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export default function KolkataMap({
  filteredExperts,
  selectedExpertId,
  setSelectedExpertId,
  onViewDetails,
}: KolkataMapProps) {
  const [resetToken, setResetToken] = React.useState(0);
  const selectedExpert = filteredExperts.find((expert) => expert.id === selectedExpertId);

  return (
    <div className="flex-1 min-h-[400px] md:min-h-[600px] h-[400px] md:h-full rounded-3xl border border-slate-200 shadow-md relative overflow-hidden z-0">
      <div className="absolute inset-0">
        <MapContainer
          center={KOLKATA_CENTER}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full"
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapInvalidator />
          <BoundsController experts={filteredExperts} />
          <MapController selectedExpert={selectedExpert} />
          <ResetController resetToken={resetToken} />

          {filteredExperts.map((expert) => {
            const isSelected = selectedExpertId === expert.id;
            return (
              <VendorMarker
                key={expert.id}
                expert={expert}
                isSelected={isSelected}
                onSelect={() => setSelectedExpertId(expert.id)}
                onViewDetails={() => onViewDetails?.(expert)}
              />
            );
          })}
        </MapContainer>
      </div>

      <div className="absolute bottom-6 right-6 z-[500]">
        <Button
          variant="ghost"
          onClick={() => {
            setResetToken((prev) => prev + 1);
            if (filteredExperts[0]) setSelectedExpertId(filteredExperts[0].id);
          }}
          className="w-12 h-12 p-0 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-700 hover:text-[#FF6014] shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer hover:bg-slate-50"
          title="Reset Map View"
        >
          <Compass className="w-5 h-5" />
        </Button>
      </div>

      {selectedExpert && (
        <button
          type="button"
          onClick={() => onViewDetails?.(selectedExpert)}
          className="absolute top-4 left-4 z-[500] bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl px-4 py-3 shadow-md max-w-[280px] text-left hover:border-[#FF6014]/30 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-2">
            <div className="w-9 h-9 rounded-full bg-[#FFF8F4] text-[#FF6014] flex items-center justify-center shrink-0">
              {renderCategoryIcon(selectedExpert.icon, "w-4 h-4")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-slate-900 truncate">{selectedExpert.name}</p>
              <div className="mt-1">
                <VendorLocationInfo expert={selectedExpert} compact />
              </div>
              <p className="text-[10px] font-bold text-[#FF6014] mt-2 uppercase tracking-wide">
                Tap for vendor details
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
