"use client";

import React from "react";
import { Image as ImageIcon, Edit2, Trash2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import { formatImageUrl } from "@/lib/utils";
import { Blog } from "@/redux/features/admin/blog";

interface BlogTableProps {
  blogs: Blog[];
  openEditModal: (blog: Blog) => void;
  openDeleteModal: (blog: Blog) => void;
}

export default function BlogTable({ blogs, openEditModal, openDeleteModal }: BlogTableProps) {
  const columns = [
    {
      key: "images",
      header: "Images",
      render: (blog: Blog) => {
        const imgs = Array.isArray(blog.images)
          ? blog.images
          : typeof blog.images === 'string'
          ? (blog.images as string).split(',').filter(Boolean)
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formatImageUrl(img)} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-bold bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded-lg">
              {imgs.length} img{imgs.length !== 1 ? 's' : ''}
            </span>
          </div>
        );
      },
    },
    {
      key: "title",
      header: "Title",
      render: (blog: Blog) => (
        <div className="max-w-[200px] py-1">
          <p className="font-extrabold text-slate-800 text-[13px] leading-snug">
            {blog.title || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "overview",
      header: "Overview",
      render: (blog: Blog) => (
        <p className="text-slate-500 text-xs font-semibold max-w-[200px] leading-relaxed break-words line-clamp-2">
          {blog.overview ? blog.overview.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "—"}
        </p>
      ),
    },
    {
      key: "description",
      header: "Content Body",
      render: (blog: Blog) => (
        <p className="text-slate-400 text-xs font-medium max-w-[280px] leading-relaxed break-words line-clamp-2">
          {blog.description ? blog.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "—"}
        </p>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      render: (blog: Blog) => (
        <span className="text-slate-500 font-bold text-xs bg-slate-50 border border-slate-200/30 px-2 py-1 rounded-lg">
          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (blog: Blog) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEditModal(blog)}
            className="bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-slate-200/80 transition-all active:scale-[0.97]"
          >
            <Edit2 size={12} className="text-slate-400" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => openDeleteModal(blog)}
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
      data={blogs}
      searchKey="title"
      searchPlaceholder="Search blogs by title..."
      pageSize={10}
    />
  );
}
