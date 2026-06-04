"use client";

import React from "react";
import templates from "@/data/templates.json";
import FavoritesManager from "@/components/FavoritesManager";
import RecentTemplates from "@/components/RecentTemplates";

export default function TemplateLibraryPage() {
  const templateList = templates as Array<any>;

  const openTemplate = (t: any) => {
    // For MVP: record in recents via RecentTemplates hook when Open clicked —
    // the RecentTemplates component's record is invoked by its own Open buttons.
    // Here we could open the editor or navigate to template details.
    console.log("Open template", t.id);
    // Optionally: integrate router push to editor in future.
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="space-y-4 md:col-span-1">
          <FavoritesManager templates={templateList} onOpen={openTemplate} />
          <RecentTemplates templates={templateList} onOpen={openTemplate} />
        </aside>

        <section className="md:col-span-3">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Contract Template Library</h2>
            <p className="text-sm text-slate-400">Browse and favorite contract templates for quick access.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templateList.map((t) => (
              <div key={t.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-[12px] text-slate-400">{t.description}</div>
                  <div className="text-[11px] text-slate-500 mt-2">{t.category}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => {
                      // Record to recents by dispatching a storage event for components to pick up
                      try {
                        const raw = localStorage.getItem("tpl_recents");
                        const arr = raw ? JSON.parse(raw) : [];
                        const filtered = arr.filter((r: any) => r.id !== t.id);
                        const next = [{ id: t.id, at: Date.now() }, ...filtered].slice(0, 20);
                        localStorage.setItem("tpl_recents", JSON.stringify(next));
                      } catch {}
                      openTemplate(t);
                    }}
                    className="px-3 py-1 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => {
                      try {
                        const raw = localStorage.getItem("tpl_favorites");
                        const arr = raw ? JSON.parse(raw) : [];
                        const next = arr.includes(t.id) ? arr.filter((x: string) => x !== t.id) : [t.id, ...arr];
                        localStorage.setItem("tpl_favorites", JSON.stringify(next));
                        // dispatch simple storage event to notify other components in same tab
                        window.dispatchEvent(new Event('storage'));
                      } catch {}
                    }}
                    className="text-amber-400 hover:text-amber-300"
                    title="Toggle favorite"
                  >
                    ★
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
