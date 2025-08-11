/* src/components/ChannelList.tsx */
export default function ChannelList() {
  return (
    <div className="w-72 flex flex-col" style={{ backgroundColor: 'var(--bg-panel)' }}>
      {/* Server Banner */}
      <div className="h-24 relative overflow-hidden">
        <div 
          className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800"
          style={{ 
            backgroundImage: 'linear-gradient(45deg, #2a2a2a, #1a1a1a)',
          }}
        ></div>
      </div>

      {/* Server Info */}
      <div className="px-4 pb-4 relative">
        <div 
          className="w-20 h-20 rounded-full border-4 -mt-10 relative z-10 flex items-center justify-center text-2xl font-bold text-white"
          style={{ 
            backgroundColor: 'var(--accent-purple)',
            borderColor: 'var(--bg-panel)'
          }}
        >
          TS
        </div>
        <div className="mt-2">
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Type shi
          </h2>
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: 'var(--accent-green)' }}
            ></div>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>47</span>
            <span className="ml-2 text-sm" style={{ color: 'var(--muted)' }}>🇬🇧</span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>keyboard warriors</p>
        </div>
      </div>

      {/* Text Channels */}
      <div className="px-4 mb-4">
        <div className="flex items-center mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            Text Channels
          </span>
          <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>#</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center p-2 rounded-md cursor-pointer hover:bg-white/5">
            <span className="text-sm mr-2" style={{ color: 'var(--muted)' }}>#</span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>broadcast</span>
          </div>
          <div className="flex items-center p-2 rounded-md cursor-pointer hover:bg-white/5">
            <span className="text-sm mr-2" style={{ color: 'var(--muted)' }}>#</span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>giveaways</span>
          </div>
          <div className="flex items-center p-2 rounded-md cursor-pointer hover:bg-white/5">
            <span className="text-sm mr-2" style={{ color: 'var(--muted)' }}>#</span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>msg</span>
          </div>
          <div 
            className="flex items-center p-2 rounded-md cursor-pointer"
            style={{ backgroundColor: 'rgba(86, 64, 122, 0.14)' }}
          >
            <span className="text-sm mr-2" style={{ color: 'var(--muted)' }}>🖼️</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Media</span>
          </div>
        </div>
      </div>

      {/* Voice Chat */}
      <div className="px-4 flex-1">
        <div className="flex items-center mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            Voice Chat
          </span>
          <svg className="w-4 h-4 ml-auto" style={{ color: 'var(--muted)' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        </div>

        <div className="space-y-1 mb-4">
          <div className="flex items-center p-2 rounded-md cursor-pointer hover:bg-white/5">
            <svg className="w-4 h-4 mr-2" style={{ color: 'var(--muted)' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>GENERAL</span>
            <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>0 / 90</span>
          </div>
          <div className="flex items-center p-2 rounded-md cursor-pointer hover:bg-white/5">
            <svg className="w-4 h-4 mr-2" style={{ color: 'var(--muted)' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>CHILLING</span>
            <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>5 / 10</span>
          </div>
        </div>

        {/* Voice Chat Users Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "flawless", avatar: "F", speaking: false },
            { name: "space", avatar: "S", speaking: true },
            { name: "sobhing", avatar: "S", speaking: false },
            { name: "Luxury", avatar: "L", speaking: false },
            { name: "Kaif", avatar: "K", speaking: false },
          ].map((user, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg flex flex-col items-center cursor-pointer hover:bg-white/5 ${
                user.speaking ? 'ring-2' : ''
              }`}
              style={{ 
                backgroundColor: 'var(--bg-card)',
                ...(user.speaking && { 
                  ringColor: 'var(--accent-green)',
                  backgroundColor: 'rgba(67, 181, 129, 0.1)'
                })
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium mb-2"
                style={{ backgroundColor: 'var(--accent-purple)' }}
              >
                {user.avatar}
              </div>
              <span className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                {user.name}
              </span>
              {user.speaking && (
                <div className="flex space-x-1 mt-1">
                  <div 
                    className="w-1 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--accent-green)' }}
                  ></div>
                  <div 
                    className="w-1 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--accent-green)' }}
                  ></div>
                  <div 
                    className="w-1 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--accent-green)' }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}