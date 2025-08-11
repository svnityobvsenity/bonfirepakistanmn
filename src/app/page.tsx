/* src/app/page.tsx */
import ServerList from "@/components/ServerList";
import ChannelList from "@/components/ChannelList";
import ChatWindow from "@/components/ChatWindow";
import "@/styles/globals.css";

export default function Page() {
  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <ServerList />
      <ChannelList />
      <ChatWindow />
    </div>
  );
}