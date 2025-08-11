/* src/app/page.tsx */
import ServerList from "@/components/ServerList";
import ChannelList from "@/components/ChannelList";
import ChatWindow from "@/components/ChatWindow";
import "@/styles/globals.css";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="max-w-[1400px] mx-auto grid grid-cols-[72px_240px_1fr] gap-4 p-4">
        <ServerList />
        <ChannelList />
        <ChatWindow />
      </div>
    </div>
  );
}