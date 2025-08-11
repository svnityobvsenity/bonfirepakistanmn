/* src/components/ChatWindow.tsx */
import messages from "@/data/sampleMessages";

export default function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col bg-[#36393f]">
      {/* Chat Header */}
      <div className="h-12 px-4 flex items-center border-b border-[#40444b] shadow-sm">
        <div className="flex items-center">
          <span className="text-[#8e9297] mr-2">#</span>
          <span className="font-semibold text-white mr-2">general</span>
          <div className="w-px h-6 bg-[#40444b] mx-2"></div>
          <span className="text-sm text-[#8e9297]">General discussion</span>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <button className="text-[#b9bbbe] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="text-[#b9bbbe] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          <button className="text-[#b9bbbe] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Welcome Message */}
        <div className="p-4 border-b border-[#40444b]">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#40444b] rounded-full flex items-center justify-center">
              <span className="text-[#8e9297] text-2xl">#</span>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to #general!</h2>
            <p className="text-[#8e9297]">This is the start of the #general channel.</p>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-4 hover:bg-[#32353b] px-4 py-2 rounded group">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-white font-medium">
                  {message.user.charAt(0)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[#36393f]"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="font-medium text-white hover:underline cursor-pointer">
                    {message.user}
                  </span>
                  <span className="text-xs text-[#72767d]">
                    {message.time}
                  </span>
                </div>
                <div className="text-[#dcddde] leading-relaxed">
                  {message.text}
                </div>
              </div>
              
              {/* Message Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button className="p-1 text-[#b9bbbe] hover:text-white hover:bg-[#40444b] rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Message Input */}
      <div className="p-4">
        <div className="bg-[#40444b] rounded-lg px-4 py-3">
          <div className="flex items-center">
            <button className="text-[#b9bbbe] hover:text-white mr-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H13V4a1 1 0 0 0-2 0v7H4a1 1 0 0 0 0 2h7v7a1 1 0 0 0 2 0v-7h7a1 1 0 0 0 0-2z"/>
              </svg>
            </button>
            
            <input
              type="text"
              placeholder="Message #general"
              className="flex-1 bg-transparent text-white placeholder-[#72767d] focus:outline-none"
              disabled
            />
            
            <div className="flex items-center space-x-2 ml-4">
              <button className="text-[#b9bbbe] hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
              <button className="text-[#b9bbbe] hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-[#72767d] mt-2">Preview mode — input disabled</p>
      </div>
    </div>
  );
}