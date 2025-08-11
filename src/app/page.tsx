/* src/app/page.tsx */
import ServerList from "@/components/ServerList";
import ChannelList from "@/components/ChannelList";
import ChatWindow from "@/components/ChatWindow";
import "@/styles/globals.css";

export default function Page() {
  return (
    <div className="h-screen flex bg-[#36393f] text-white overflow-hidden">
      <ServerList />
      <ChannelList />
      <ChatWindow />
    </div>
  );
}