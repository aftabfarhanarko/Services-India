"use client";

import React from "react";
import { Image as ImageIcon, ExternalLink, Edit2, Trash2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import { formatImageUrl } from "@/lib/utils";
import { Hero } from "@/redux/features/admin/hero";

interface HeroTableProps {
  heroes: Hero[];
  openEditModal: (hero: Hero) => void;
  openDeleteModal: (hero: Hero) => void;
}

export default function HeroTable({ heroes, openEditModal, openDeleteModal }: HeroTableProps) {
  const columns = [
    {
      key: "images",
      header: "Slides / Images",
      render: (hero: Hero) => {
        const imgs = Array.isArray(hero.images)
          ? hero.images
          : typeof hero.images === 'string'
          ? (hero.images as string).split(',').filter(Boolean)
          : [];
        
        if (imgs.length === 0) {
          return (
            <div className="flex items-center gap-2">
              <div className="w-12 h-9 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center border border-slate-200/60">
                <ImageIcon size={16} />
              </div>
              <span className="text-[11px] text-slate-400 font-bold">No images</span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3 overflow-hidden">
              {imgs.slice(0, 3).map((img, i) => (
                <div key={i} className="inline-block h-9 w-12 rounded-lg ring-2 ring-white overflow-hidden shadow-sm border border-slate-200/50 shrink-0">
                  <img src={formatImageUrl(img)} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
              {imgs.length > 3 && (
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-900/85 text-white text-[10px] font-black ring-2 ring-white shadow-sm border border-slate-700 shrink-0">
                  +{imgs.length - 3}
                </div>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-bold bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded-lg">
              {imgs.length} slide{imgs.length !== 1 ? 's' : ''}
            </span>
          </div>
        );
      },
    },
    {
      key: "text",
      header: "Main Title",
      render: (hero: Hero) => (
        <div className="max-w-[220px] py-1">
          <p className="font-extrabold text-slate-800 text-[13px] leading-snug">
            {hero.text || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "subtext",
      header: "Subtext Description",
      render: (hero: Hero) => (
        <p className="text-slate-500 text-xs font-semibold max-w-[280px] leading-relaxed break-words line-clamp-2">
          {hero.subtext || "—"}
        </p>
      ),
    },
    {
      key: "link",
      header: "Redirect Link",
      render: (hero: Hero) => (
        <div className="flex items-center">
          {hero.link ? (
            <a
              href={hero.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#FF6014] font-bold text-[11px] px-3 py-1.5 rounded-xl border border-slate-200/80 transition-all shadow-sm active:scale-[0.97]"
            >
              <span>Visit Link</span>
              <ExternalLink size={11} />
            </a>
          ) : (
            <span className="text-slate-400 text-xs font-medium">—</span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      render: (hero: Hero) => (
        <span className="text-slate-500 font-bold text-xs bg-slate-50 border border-slate-200/30 px-2 py-1 rounded-lg">
          {hero.createdAt ? new Date(hero.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (hero: Hero) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEditModal(hero)}
            className="bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-slate-200/80 transition-all active:scale-[0.97]"
          >
            <Edit2 size={12} className="text-slate-400" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => openDeleteModal(hero)}
            className="bg-[#FFF8F4] hover:bg-[#FFF0EB] text-[#E0530A] text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-[#FF6014]/15 transition-all active:scale-[0.97]"
          >
            <Trash2 size={12} className="text-[#FF6014]" />
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={heroes}
      searchKey="text"
      searchPlaceholder="Search heroes by title..."
      pageSize={10}
    />
  );
}
