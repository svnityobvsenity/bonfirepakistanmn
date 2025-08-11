/* src/components/TopServerBar.tsx */
interface TopServerBarProps {
  currentView: 'dms' | 'server';
  onViewChange: (view: 'dms' | 'server') => void;
}

export default function TopServerBar({ currentView, onViewChange }: TopServerBarProps) {
  return (
    <div 
      className="h-12 flex items-center px-4 border-b"
      style={{ 
        backgroundColor: 'var(--panel-mid)',
        borderColor: 'rgba(255,255,255,0.03)'
      }}
    >
      {/* DMs Button */}
      <button
        onClick={() => onViewChange('dms')}
        className={`w-12 h-8 rounded-xl flex items-center justify-center mr-2 transition-all ${
          currentView === 'dms' ? 'bg-white/10' : 'hover:bg-white/5'
        }`}
      >
        <svg className="w-5 h-5" style={{ color: 'var(--icon)' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1h.5c.2 0 .5-.1.6-.2l3.9-3.8H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>

      {/* Server Button - Type shi */}
      <button
        onClick={() => onViewChange('server')}
        className={`w-12 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-all ${
          currentView === 'server' ? 'bg-white/10' : 'hover:bg-white/5'
        }`}
        style={{ backgroundColor: currentView === 'server' ? 'var(--accent-purple)' : 'var(--accent-purple)' }}
      >
        TS
      </button>

      {/* Search Bar */}
      <div className="ml-auto flex items-center">
        <div 
          className="flex items-center px-3 py-1.5 rounded-md"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
        >
          <svg className="w-4 h-4 mr-2" style={{ color: 'rgba(255,255,255,0.6)' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm focus:outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>
    </div>
  );
}
