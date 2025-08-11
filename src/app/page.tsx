/* src/app/page.tsx */
"use client";
import { useState } from 'react';
import TopServerBar from "@/components/TopServerBar";
import DMsPage from "@/components/DMsPage";
import ServerPage from "@/components/ServerPage";
import "@/styles/globals.css";

export default function Page() {
  const [currentView, setCurrentView] = useState<'dms' | 'server'>('dms');

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      <TopServerBar currentView={currentView} onViewChange={setCurrentView} />
      {currentView === 'dms' ? <DMsPage /> : <ServerPage />}
    </div>
  );
}