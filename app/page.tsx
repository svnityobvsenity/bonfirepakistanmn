"use client";
import { useState } from "react";
import TopServerBar from "@/components/TopServerBar";
import DMLayout from "@/components/DMLayout";
import ServerLayout from "@/components/ServerLayout";

export default function Page() {
  const [activePage, setActivePage] = useState("dms"); // 'dms' or 'server'

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <TopServerBar setActivePage={setActivePage} activePage={activePage} />
      <div className="flex flex-1 overflow-hidden">
        {activePage === "dms" ? <DMLayout /> : <ServerLayout />}
      </div>
    </div>
  );
}
