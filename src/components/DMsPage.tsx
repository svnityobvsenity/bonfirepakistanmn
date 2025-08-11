export default function DMsPage() {
  const friends = [
    { name: 'daFoxy', status: 'Playing Blender', online: true },
    { name: 'james', status: 'Playing Procrastination Simulator', online: true },
    { name: 'Ekmand', status: 'Online', online: true },
    { name: 'Sticks', status: 'Online', online: true },
    { name: 'FranzaGeek', status: 'Playing Powerpoint', online: true },
  ];

  const messages = [
    { user: 'daFoxy', time: 'Today at 9:41PM', text: 'I saw this really cool video the other day mind if I send it?' },
    { user: 'Concept Central', time: 'Today at 9:41PM', text: 'Sure thing! Want to start a Watch Party?' },
    { user: 'daFoxy', time: 'Today at 9:41PM', text: 'ooOOOoo what’s that?' },
    { user: 'Concept Central', time: 'Today at 9:41PM', text: 'It’s this new Discord feature. Have you heard of it?' },
    { user: 'daFoxy', time: 'Today at 9:41PM', text: 'No, how does it work?' },
    { user: 'Concept Central', time: 'Today at 9:41PM', text: 'Just paste a YouTube link into this DM and Discord will ask you if you want to start a Watch Party!' },
    { user: 'daFoxy', time: 'Today at 9:41PM', text: 'Woah! I’ll start one now!' },
    { user: 'Concept Central', time: 'Today at 9:44PM', text: 'Cool, can’t wait to see the video :D' },
    { user: 'daFoxy', time: 'Today at 9:44PM', text: 'Awesome, starting now…' },
    { user: 'Concept Central', time: 'Today at 9:44PM', text: 'Joined.' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Left friends column */}
      <aside className="w-80 border-r" style={{ backgroundColor: 'var(--panel-dark)', borderColor: 'var(--divider)' }}>
        {/* Filters */}
        <div className="p-3">
          <div className="h-9 rounded-md flex items-center px-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <span className="text-sm opacity-60">Friends</span>
          </div>
          <div className="h-9 mt-2 rounded-md flex items-center px-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <span className="text-sm opacity-60">Inbox</span>
          </div>
        </div>
        {/* Pinned */}
        <div className="px-3 text-xs uppercase tracking-wide opacity-60">Pinned Messages</div>
        <div className="px-3 mt-2 space-y-1">
          <div className="h-10 rounded-md flex items-center px-2 hover:bg-white/5 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white/10 mr-2" />
            <div>
              <div className="text-sm">daFoxy</div>
              <div className="text-xs opacity-60">Playing Blender</div>
            </div>
          </div>
        </div>
        {/* DMs */}
        <div className="px-3 mt-4 text-xs uppercase tracking-wide opacity-60">Direct Messages</div>
        <div className="px-3 mt-2 space-y-1">
          {friends.map((f) => (
            <div key={f.name} className="h-11 rounded-md flex items-center px-2 hover:bg-white/5 cursor-pointer">
              <div className="relative mr-2">
                <div className="w-9 h-9 rounded-full bg-white/10" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--accent-green)', border: '2px solid var(--panel-dark)' }} />
              </div>
              <div>
                <div className="text-sm">{f.name}</div>
                <div className="text-xs opacity-60">{f.status}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat column */}
      <main className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b" style={{ borderColor: 'var(--divider)' }}>
          <div className="font-semibold">daFoxy</div>
          <div className="flex items-center gap-4 opacity-80">
            <div className="w-5 h-5 rounded-full bg-white/20" />
            <div className="w-5 h-5 rounded-full bg-white/20" />
            <div className="w-5 h-5 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10" />
              <div>
                <div className="flex items-baseline gap-2">
                  <div className="font-medium text-sm">{m.user}</div>
                  <div className="text-xs opacity-60">{m.time}</div>
                </div>
                <div className="text-sm opacity-90">{m.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Message bar */}
        <div className="px-4 pb-4">
          <div className="h-12 rounded-md flex items-center px-3 gap-2" style={{ backgroundColor: 'var(--panel-mid)' }}>
            <div className="w-6 h-6 rounded-md bg-white/10" />
            <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Message daFoxy" disabled />
            <div className="w-6 h-6 rounded-md bg-white/10" />
            <div className="w-6 h-6 rounded-md bg-white/10" />
            <div className="w-6 h-6 rounded-md bg-white/10" />
          </div>
          <div className="text-xs opacity-60 mt-2">Preview mode — input disabled</div>
        </div>
      </main>
    </div>
  );
}
