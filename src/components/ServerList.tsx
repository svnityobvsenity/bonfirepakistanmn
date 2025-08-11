/* src/components/ServerList.tsx */
export default function ServerList() {
  const friends = [
    { name: "daFoxy", status: "Playing Bonfire", online: true },
    { name: "james", status: "Playing Bonfire", online: true },
    { name: "Ekmand", status: "Online", online: true },
    { name: "Sticks", status: "Online", online: true },
    { name: "FranzaGeek", status: "Online", online: true },
    { name: "NRD", status: "Online", online: true },
    { name: "Markella's", status: "Playing Bonfire", online: true },
    { name: "AY-Plays", status: "Online", online: true },
    { name: "LemonTiger", status: "Online", online: true },
    { name: "Bluemango", status: "Online", online: true },
  ];

  return (
    <div className="w-80 flex flex-col" style={{ backgroundColor: 'var(--bg-panel)', padding: '12px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-2">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Friends</h2>
        <button className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/5">
          <svg className="w-5 h-5" style={{ color: 'var(--icon)' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>

      {/* Pinned Messages Section */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 mr-2" style={{ color: 'var(--muted)' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v8H6l6 6 6-6h-2z"/>
          </svg>
          <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Pinned Messages</span>
        </div>
      </div>

      {/* Direct Messages Section */}
      <div className="mb-4">
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 mr-2" style={{ color: 'var(--muted)' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v8H6l6 6 6-6h-2z"/>
          </svg>
          <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Direct Messages</span>
        </div>
        
        <div className="space-y-1">
          {friends.map((friend, index) => (
            <div 
              key={index}
              className="flex items-center p-2 rounded-md cursor-pointer hover:bg-white/5 group"
            >
              <div className="relative">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white mr-3"
                  style={{ backgroundColor: 'var(--accent-purple)' }}
                >
                  {friend.name.charAt(0)}
                </div>
                {friend.online && (
                  <div 
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ 
                      backgroundColor: 'var(--accent-green)', 
                      borderColor: 'var(--bg-panel)' 
                    }}
                  ></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                  {friend.name}
                </div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                  {friend.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}