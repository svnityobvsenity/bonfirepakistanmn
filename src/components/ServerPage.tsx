/* src/components/ServerPage.tsx */
export default function ServerPage() {
  const messages = [
    { id: '1', user: 'tnuvv', time: '3:45 PM', text: 'How does this make you feel?', type: 'image' },
    { id: '2', user: 'crazy', time: '3:45 PM', text: "Bro, I can't with these keyboard warriors. Like, this one dude just came for me in the comments for liking pineapple on pizza.", type: 'text' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left column: server details & channels */}
      <aside className="w-80 overflow-auto" style={{ backgroundColor: 'var(--panel-dark)' }}>
        <div className="h-24 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]" />
        <div className="px-4 -mt-10">
          <div className="w-20 h-20 rounded-full border-4 border-[var(--panel-dark)] bg-[var(--accent-purple)]" />
          <div className="mt-2">
            <div className="text-xl font-semibold">Type shi</div>
            <div className="text-sm opacity-60">keyboard warriors</div>
          </div>
        </div>

        <div className="px-4 mt-4">
          <div className="text-xs uppercase tracking-wide opacity-60 mb-2">Text Channels</div>
          <div className="space-y-1">
            {['broadcast', 'giveaways', 'msg', 'Media'].map((c) => (
              <div key={c} className={`h-10 flex items-center px-3 rounded-md cursor-pointer ${c==='Media' ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                <span className="text-sm">{c==='Media' ? '🖼️ Media' : `# ${c}`}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mt-4">
          <div className="text-xs uppercase tracking-wide opacity-60 mb-2">Voice Chat</div>
          <div className="space-y-1">
            <div className="h-10 flex items-center px-3 rounded-md hover:bg-white/5 cursor-pointer">
              <span className="text-sm">GENERAL</span>
              <span className="ml-auto text-xs opacity-60">0 / 90</span>
            </div>
            <div className="h-10 flex items-center px-3 rounded-md hover:bg-white/5 cursor-pointer">
              <span className="text-sm">CHILLING</span>
              <span className="ml-auto text-xs opacity-60">5 / 10</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 pb-6">
            {['flawless','space','sobhing','Luxury','Kaif'].map((u,i)=> (
              <div key={i} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
                <div className="w-12 h-12 rounded-full bg-[var(--accent-purple)] mb-2" />
                <div className="text-xs">{u}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Right column: media channel content */}
      <main className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="h-12 flex items-center justify-between px-4 border-b" style={{ borderColor: 'var(--divider)' }}>
          <div>
            <div className="font-semibold"># Media</div>
            <div className="text-xs opacity-60">Welcome to the Media channel</div>
          </div>
          <div className="flex items-center gap-3 opacity-80">
            <div className="w-5 h-5 rounded bg-white/10" />
            <div className="w-5 h-5 rounded bg-white/10" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          {messages.map((m)=> (
            <div key={m.id} className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-purple)]" />
              <div>
                <div className="flex items-baseline gap-2">
                  <div className="text-sm font-medium">{m.user}</div>
                  <div className="text-xs opacity-60">{m.time}</div>
                </div>
                {m.type==='image' ? (
                  <div>
                    <div className="mb-2">How does this make you feel?</div>
                    <div className="bg-white rounded-lg p-2 shadow" style={{ boxShadow: '0 6px 22px rgba(0,0,0,0.55)' }}>
                      <div className="w-[360px] h-[220px] rounded-md bg-yellow-300 grid place-items-center text-4xl">🍍🍕</div>
                    </div>
                    <div className="mt-2 inline-flex items-center text-xs px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--accent-orange)', color: '#111' }}>😍 23</div>
                  </div>
                ) : (
                  <div className="max-w-xl bg-white/5 rounded-lg p-3 shadow" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.65)' }}>
                    <div className="text-sm">{m.text}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-5">
          <div className="h-12 rounded-lg flex items-center px-3 gap-2" style={{ backgroundColor: 'var(--input-bg)' }}>
            <div className="w-6 h-6 rounded-md bg-white/10" />
            <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Message to Tedy…" disabled />
            <div className="w-6 h-6 rounded-md bg-white/10" />
            <div className="w-6 h-6 rounded-md bg-white/10" />
          </div>
          <div className="flex gap-3 mt-3">
            {[1,2,3,4].map((i)=> (
              <div key={i} className="w-12 h-12 rounded-full grid place-items-center text-white" style={{ backgroundColor: 'var(--accent-blue)' }}>✓</div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
