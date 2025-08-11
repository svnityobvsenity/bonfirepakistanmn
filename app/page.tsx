"use client";
import { useState } from "react";
import TopServerBar from "@/components/TopServerBar";
import DMsPage from "@/components/DMsPage";
import ServerPage from "@/components/ServerPage";

export default function Page() {
  const [activePage, setActivePage] = useState("dms"); // 'dms' or 'server'

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <TopServerBar setActivePage={setActivePage} activePage={activePage} />
      <div className="flex flex-1">
        {activePage === "dms" ? <DMsPage /> : <ServerPage />}
      </div>
    </div>
  );
}
