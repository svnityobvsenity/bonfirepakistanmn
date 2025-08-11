/* src/components/ServerList.tsx */
export default function ServerList() {
  const servers = ["F", "G", "A"];
  return (
    <aside className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-xl font-bold">B</div>
      <div className="w-full mt-2 flex flex-col gap-2">
        {servers.map((s, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-2xl bg-[#121217] flex items-center justify-center mx-auto cursor-pointer hover:ring-2 ring-white/10"
            aria-hidden
          >
            {s}
          </div>
        ))}
      </div>
    </aside>
  );
}
