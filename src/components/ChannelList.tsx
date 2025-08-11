/* src/components/ChannelList.tsx */
const channels = [
  { id: "1", name: "general" },
  { id: "2", name: "announcements" },
  { id: "3", name: "random" },
];

export default function ChannelList() {
  return (
    <nav className="bg-[#0f1115] rounded-xl p-3 h-[80vh] overflow-auto">
      <h3 className="text-xs uppercase text-gray-400 px-2 pb-2">Channels</h3>
      <ul className="space-y-2">
        {channels.map((c) => (
          <li key={c.id} className="px-3 py-2 rounded-md hover:bg-white/5 cursor-pointer">
            #{c.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}
