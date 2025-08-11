/* src/components/ChatWindow.tsx */
import messages from "@/data/sampleMessages";

export default function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg-dark)' }}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--divider)' }}>
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            # Media
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Media channel for sharing images and videos
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-md hover:bg-white/5">
            <svg className="w-5 h-5" style={{ color: 'var(--icon)' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          <button className="p-2 rounded-md hover:bg-white/5">
            <svg className="w-5 h-5" style={{ color: 'var(--icon)' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-purple)' }}
            >
              {message.user.charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {message.user}
                </span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {message.time}
                </span>
              </div>
              
              {message.type === 'image' ? (
                <div className="max-w-md">
                  <p className="mb-2" style={{ color: 'var(--text-primary)' }}>
                    {message.text}
                  </p>
                  <div 
                    className="bg-white rounded-lg p-2 shadow-lg"
                    style={{ boxShadow: '0 6px 22px rgba(0,0,0,0.55)' }}
                  >
                    <div 
                      className="w-full h-48 rounded-md bg-yellow-200 flex items-center justify-center"
                      style={{ 
                        backgroundImage: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                        backgroundSize: 'cover'
                      }}
                    >
                      <span className="text-4xl">🍕</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 space-x-2">
                    <div 
                      className="flex items-center px-2 py-1 rounded-md text-xs font-medium"
                      style={{ 
                        backgroundColor: 'var(--accent-green)',
                        color: '#000'
                      }}
                    >
                      <span>😍</span>
                      <span className="ml-1">23</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="max-w-2xl p-4 rounded-lg shadow-lg"
                  style={{ 
                    backgroundColor: 'rgba(21, 23, 25, 0.92)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.65)'
                  }}
                >
                  <p style={{ color: 'var(--text-primary)' }}>
                    {message.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-5">
        <div 
          className="flex items-center rounded-lg px-4 py-3"
          style={{ backgroundColor: 'var(--input-bg)' }}
        >
          <button className="mr-3 p-1 rounded-md hover:bg-white/10">
            <svg className="w-5 h-5" style={{ color: 'var(--icon)' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
          
          <input
            type="text"
            placeholder="Message to Testy..."
            className="flex-1 bg-transparent text-white placeholder-opacity-50 focus:outline-none"
            style={{ 
              color: 'var(--text-primary)'
            }}
            disabled
          />
          
          <div className="flex items-center space-x-2 ml-3">
            <button className="p-2 rounded-full hover:bg-white/10">
              <svg className="w-5 h-5" style={{ color: 'var(--icon)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-white/10">
              <svg className="w-5 h-5" style={{ color: 'var(--icon)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Bottom Action Buttons */}
        <div className="flex items-center space-x-3 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <button 
              key={i}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:transform hover:-translate-y-0.5 transition-transform"
              style={{ backgroundColor: 'var(--accent-blue)' }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}