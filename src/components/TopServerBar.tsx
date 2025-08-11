/* src/components/TopServerBar.tsx */
interface TopServerBarProps {
  currentView: 'dms' | 'server';
  onViewChange: (view: 'dms' | 'server') => void;
}

export default function TopServerBar({ currentView, onViewChange }: TopServerBarProps) {
  const icons = [
    { key: 'home', label: 'Home', bg: 'bg-gradient-to-b from-[#3c3c3c] to-[#191919]', on: () => onViewChange('dms') },
    { key: 'divider', label: 'divider' },
    { key: 'club', label: 'The Club', bg: 'bg-[#0b1220]', on: () => onViewChange('server') },
    { key: 'files', label: 'Files', bg: 'bg-white', ring: true },
    { key: 'instagram', label: 'Instagram', bg: 'bg-gradient-to-br from-pink-500 to-orange-400' },
    { key: 'code', label: 'Code', bg: 'bg-black' },
    { key: 'github', label: 'GitHub', bg: 'bg-gradient-to-b from-[#3b3b3b] to-[#222]' },
    { key: 'gpt', label: 'ChatGPT', bg: 'bg-[#0FA47E]' },
    { key: 'google', label: 'Google', bg: 'bg-white', ring: true },
    { key: 'firebase', label: 'Firebase', bg: 'bg-white', ring: true },
    { key: 'ms', label: 'Microsoft', bg: 'bg-black' },
    { key: 'yt', label: 'YouTube', bg: 'bg-red-600' },
  ];

  return (
    <div className="h-[56px] flex items-center px-4 gap-2 select-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.35))' }}>
      {/* left orb with underline */}
      <div className="relative mr-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#4a4a4a] to-[#1e1e1e] flex items-center justify-center shadow" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-white/85 rounded" />
      </div>

      {/* icons */}
      <div className="flex items-center gap-3 overflow-x-auto pr-3">
        {icons.map((item, idx) => (
          item.key === 'divider' ? (
            <div key={`div-${idx}`} className="w-px h-8 bg-white/20" />
          ) : (
            <button
              key={item.key}
              onClick={item.on}
              className={`shrink-0 w-11 h-11 rounded-full ${item.bg} ${item.ring ? 'ring-1 ring-black/10' : ''} flex items-center justify-center shadow-md hover:scale-[1.02] transition-transform`}
              aria-label={item.label}
              title={item.label}
            />
          )
        ))}
      </div>

      {/* right side */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden md:flex items-center h-8 px-3 rounded-md bg-white/5 backdrop-blur text-sm text-white/80 gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-70"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input placeholder="Search" className="bg-transparent outline-none placeholder-white/40 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10" />
          <div className="text-sm">Kaif#001</div>
          <div className="w-8 h-8 rounded-full grid place-items-center bg-white/5">•••</div>
        </div>
      </div>
    </div>
  );
}
