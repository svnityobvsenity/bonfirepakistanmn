/* src/components/TopServerBar.tsx */
interface TopServerBarProps {
  currentView: 'dms' | 'server';
  onViewChange: (view: 'dms' | 'server') => void;
}

export default function TopServerBar({ currentView, onViewChange }: TopServerBarProps) {
  const icons = [
    { key: 'home', label: 'Home', bg: 'bg-[#1a1a1a]', action: () => onViewChange('dms') },
    { key: 'club', label: 'The Club', bg: 'bg-[#0d0d0d]' },
    { key: 'files', label: 'Files', bg: 'bg-white', ring: true },
    { key: 'instagram', label: 'Instagram', bg: 'bg-gradient-to-br from-pink-500 to-orange-400' },
    { key: 'code', label: 'Code', bg: 'bg-black' },
    { key: 'github', label: 'GitHub', bg: 'bg-gradient-to-b from-[#3b3b3b] to-[#222]' },
    { key: 'gpt', label: 'ChatGPT', bg: 'bg-[#0FA47E]' },
    { key: 'google', label: 'Google', bg: 'bg-white', ring: true },
    { key: 'firebase', label: 'Firebase', bg: 'bg-white', ring: true },
    { key: 'microsoft', label: 'Microsoft', bg: 'bg-black' },
    { key: 'youtube', label: 'YouTube', bg: 'bg-red-600' },
  ];

  return (
    <div className="h-16 flex items-center px-4 gap-3 select-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.35))' }}>
      {/* left orb with underline */}
      <div className="relative mr-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#484848] to-[#1f1f1f] flex items-center justify-center shadow" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/85 rounded" />
      </div>
      {/* divider */}
      <div className="w-px h-8 bg-white/20 mr-2" />

      {/* icons */}
      <div className="flex items-center gap-3 overflow-x-auto">
        {icons.map((item, idx) => (
          <button
            key={item.key}
            onClick={item.key === 'home' ? () => onViewChange('dms') : item.key === 'club' ? () => onViewChange('server') : undefined}
            className={`shrink-0 w-11 h-11 rounded-full ${item.bg} ${item.ring ? 'ring-1 ring-black/10' : ''} flex items-center justify-center shadow-md hover:scale-[1.02] transition-transform`}
            aria-label={item.label}
            title={item.label}
          />
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3 pr-2">
        <div className="h-8 px-3 rounded-md bg-white/5 backdrop-blur text-sm text-white/80 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-70"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input placeholder="Search" className="bg-transparent outline-none placeholder-white/40 w-40" />
        </div>
      </div>
    </div>
  );
}
