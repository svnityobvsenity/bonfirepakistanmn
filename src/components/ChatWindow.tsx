/* src/components/ChatWindow.tsx */
import messages from "@/data/sampleMessages";

export default function ChatWindow() {
  return (
    <main className="bg-[#071018] rounded-xl p-4 h-[80vh] flex flex-col">
      <header className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
        <div>
          <h2 className="text-lg font-semibold"># general</h2>
          <p className="text-xs text-gray-400">Welcome to the server.</p>
        </div>
        <div className="text-sm text-gray-400">12 online</div>
      </header>

      <div className="flex-1 overflow-auto space-y-4 pr-2">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm">
              {m.user[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <strong>{m.user}</strong>
                <span className="text-xs text-gray-400">{m.time}</span>
              </div>
              <div className="text-sm text-gray-100">{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-4">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-md bg-[#0b1220] p-3 text-sm focus:outline-none"
            placeholder="Message #general"
            aria-label="Message input"
            disabled
          />
          <button className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm">Send</button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Preview mode — input disabled</p>
      </footer>
    </main>
  );
}
