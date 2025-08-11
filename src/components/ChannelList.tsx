/* src/components/ChannelList.tsx */
export default function ChannelList() {
  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center border-b border-[#202225] shadow-sm cursor-pointer hover:bg-[#34373c]">
        <h1 className="text-white font-semibold">daFoxy</h1>
        <div className="ml-1 w-3 h-3 rounded-full bg-green-500"></div>
        <svg className="w-4 h-4 ml-auto text-[#b9bbbe]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>
      
      {/* Channel List */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Text Channels */}
        <div className="mb-4">
          <div className="flex items-center px-2 py-1 text-xs font-semibold text-[#8e9297] uppercase tracking-wide hover:text-[#dcddde] cursor-pointer">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
            Text Channels
          </div>
          
          <div className="px-2 py-1 mx-2 rounded text-[#dcddde] bg-[#42464d] flex items-center cursor-pointer">
            <span className="text-[#8e9297] mr-1.5">#</span>
            <span className="text-sm">general</span>
          </div>
          
          <div className="px-2 py-1 mx-2 rounded text-[#8e9297] hover:bg-[#42464d] hover:text-[#dcddde] flex items-center cursor-pointer">
            <span className="mr-1.5">#</span>
            <span className="text-sm">random</span>
          </div>
        </div>
        
        {/* Voice Channels */}
        <div>
          <div className="flex items-center px-2 py-1 text-xs font-semibold text-[#8e9297] uppercase tracking-wide hover:text-[#dcddde] cursor-pointer">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
            Voice Channels
          </div>
          
          <div className="px-2 py-1 mx-2 rounded text-[#8e9297] hover:bg-[#42464d] hover:text-[#dcddde] flex items-center cursor-pointer">
            <svg className="w-4 h-4 mr-1.5 text-[#8e9297]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-sm">General</span>
          </div>
        </div>
      </div>
      
      {/* User Panel */}
      <div className="h-14 bg-[#292b2f] px-2 flex items-center">
        <div className="flex items-center flex-1">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-medium">
              K
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[#292b2f]"></div>
          </div>
          <div className="ml-2 flex-1">
            <div className="text-sm font-medium text-white">Kaif#001</div>
            <div className="text-xs text-[#b9bbbe]">#0001</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-1 text-[#b9bbbe] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="p-1 text-[#b9bbbe] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}