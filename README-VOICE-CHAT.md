# 🎤 Discord Voice Chat Integration

## Quick Test in 2 Minutes

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:3000

3. **Add voice script to your main page:**
   Add this to your `app/layout.tsx` or main HTML:
   ```html
   <script src="/socket.io/socket.io.js"></script>
   <script src="/js/discord-voice-client.js"></script>
   ```

4. **Test with 2+ browser tabs:**
   - Open http://localhost:3000 in 2+ tabs
   - Click on the same server in both tabs
   - Click "Join Voice" in both tabs
   - Allow microphone permissions
   - You should hear each other!

## 🚀 Complete Setup Guide

### Backend Setup

The backend provides real-time voice and text chat for your Discord clone:

```bash
cd backend
npm install
npm run dev
```

**Environment Configuration:**
Copy `env.example` to `.env` and configure:

```env
PORT=3000
STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
# For production, add TURN servers:
# TURN_URL=turn:your-turn-server.com:3478
# TURN_USERNAME=your-username
# TURN_CREDENTIAL=your-password
```

### Frontend Integration

#### 1. Add Scripts to Your Layout

Add to `app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Your existing head content */}
      </head>
      <body>
        {children}
        
        {/* Voice Chat Scripts */}
        <script src="/socket.io/socket.io.js"></script>
        <script src="/js/discord-voice-client.js"></script>
      </body>
    </html>
  )
}
```

#### 2. Add Voice Integration Component

Import and use the VoiceIntegration component:

```tsx
import VoiceIntegration from '../components/VoiceIntegration';

// In your main Discord component:
<VoiceIntegration 
  currentServer={currentServerName}
  currentDM={currentDMId}
/>
```

#### 3. Integrate with Server Clicks

Update your server click handlers:

```tsx
const handleServerClick = (serverName: string) => {
  setCurrentServerName(serverName);
  
  // Integrate with voice chat
  if (typeof window !== 'undefined' && (window as any).discordVoice) {
    (window as any).discordVoice.joinServer(serverName);
  }
};
```

#### 4. Integrate with DM Clicks

```tsx
const handleDMClick = (username: string) => {
  setCurrentDM(username);
  
  // Integrate with voice chat
  if (typeof window !== 'undefined' && (window as any).discordVoice) {
    (window as any).discordVoice.joinDM(username);
  }
};
```

## 🎮 Testing Checklist

### Step 1: Basic Connection
- [ ] Backend starts without errors
- [ ] Browser console shows "Connected to Discord voice server"
- [ ] No connection errors in browser console

### Step 2: Multi-User Test
- [ ] Open 2+ browser tabs
- [ ] Each tab gets a different random username
- [ ] Users can see each other online

### Step 3: Server Chat Test
- [ ] Click same server in both tabs
- [ ] Both users join the server
- [ ] Can see "User joined server" messages

### Step 4: Voice Chat Test
- [ ] Click "Join Voice" in both tabs
- [ ] Allow microphone permissions
- [ ] See "Voice participants" in console
- [ ] Can hear each other speaking
- [ ] Audio quality is clear

### Step 5: Voice Controls Test
- [ ] Mute button works (stops sending audio)
- [ ] Deafen button works (stops receiving audio)
- [ ] Speaking indicator shows when talking
- [ ] Voice users list updates correctly

### Step 6: Disconnect Test
- [ ] Close one tab
- [ ] Other tab shows user left voice
- [ ] Audio connection properly cleaned up

### Step 7: Server Switching Test
- [ ] Switch between different servers
- [ ] Voice connections update correctly
- [ ] Can talk in different server voice channels

## 🔧 Architecture Overview

### WebRTC Mesh Network
```
User A ←→ User B
  ↑       ↗
  ↓     ↙
User C ←→ User D
```

- **Mesh Topology**: Each user connects directly to every other user
- **Scalability**: Works great for 2-6 users, CPU/bandwidth intensive beyond that
- **For 100+ users**: Recommend upgrading to SFU (Selective Forwarding Unit) like mediasoup

### Signaling Flow
```
1. User joins server/DM
2. User clicks "Join Voice"
3. Get microphone access
4. Server sends list of existing voice users
5. Create WebRTC offer to each existing user
6. Exchange SDP offers/answers via Socket.IO
7. Exchange ICE candidates for NAT traversal
8. Direct P2P audio streams established
```

### Socket.IO Events

**Client → Server:**
- `user-connect` - Connect with username
- `join-server` - Join server chat
- `join-dm` - Join DM chat
- `server-message` - Send server message
- `dm-message` - Send DM message
- `join-server-voice` - Join server voice
- `join-dm-voice` - Join DM voice
- `webrtc-offer` - WebRTC offer
- `webrtc-answer` - WebRTC answer
- `webrtc-ice-candidate` - ICE candidate
- `voice-state-update` - Mute/deafen/speaking

**Server → Client:**
- `connection-success` - Connected successfully
- `server-joined` - Joined server
- `server-message` - New server message
- `dm-message` - New DM message
- `voice-participants` - Voice users list
- `user-joined-voice` - User joined voice
- `webrtc-offer` - WebRTC offer
- `webrtc-answer` - WebRTC answer
- `webrtc-ice-candidate` - ICE candidate
- `voice-state-updated` - Voice state changed

## 🌐 Production Deployment

### TURN Servers (Required for Production)

WebRTC needs TURN servers for users behind NAT/firewalls:

```env
TURN_URL=turn:your-turn-server.com:3478
TURN_USERNAME=your-username  
TURN_CREDENTIAL=your-password
```

**Recommended TURN Providers:**
- Twilio (easy setup)
- xirsys.com (WebRTC focused)
- Self-hosted coturn server

### HTTPS Required

Voice chat requires HTTPS in production:
- Use Let's Encrypt for free SSL
- Configure reverse proxy (nginx/Apache)
- Update CORS settings for your domain

### Scaling Considerations

**Current Setup (Mesh):**
- ✅ 2-6 users: Excellent
- ⚠️ 6-12 users: Acceptable
- ❌ 12+ users: Poor performance

**For Scaling:**
- Implement SFU (mediasoup, Janus, LiveKit)
- Use dedicated voice servers
- Consider WebRTC gateway services

## 🛠️ Customization

### Adding Voice to Custom Servers

```javascript
// When user clicks your server
window.discordVoice.joinServer('Your Server Name');

// Send messages
window.discordVoice.sendMessage('Hello everyone!');
```

### Custom Voice UI

```tsx
// Check if user is in voice
const isInVoice = window.discordVoice?.isInVoice;

// Get voice state
const voiceState = window.discordVoice?.voiceState;

// Custom mute button
<button onClick={() => window.discordVoice?.toggleMute()}>
  {voiceState?.muted ? 'Unmute' : 'Mute'}
</button>
```

### Database Integration

Currently uses in-memory storage. To add persistence:

1. **Replace in-memory Maps with database calls in `discord-signaling.js`:**
   ```javascript
   // Instead of: this.serverChats = new Map()
   // Use: await db.getServerChat(serverName)
   ```

2. **Add message persistence:**
   ```javascript
   // In handleServerMessage:
   await db.saveMessage(messageData);
   ```

3. **Add user session persistence:**
   ```javascript
   // In handleUserConnect:
   await db.updateUserSession(userInfo);
   ```

## 🐛 Troubleshooting

### Common Issues

**"Failed to access microphone"**
- Check browser permissions
- Ensure HTTPS in production
- Try different browser

**"No audio from other users"**
- Check deafen state
- Verify WebRTC connections in console
- Check firewall/NAT settings

**"Connection failed"**
- Add TURN servers for production
- Check network connectivity
- Verify Socket.IO connection

**High CPU usage**
- Normal for mesh topology with many users
- Consider upgrading to SFU architecture
- Limit voice channels to 6 users max

### Debug Commands

```javascript
// In browser console:
window.discordVoice.getStats()          // Get connection stats
window.discordVoice.peerConnections     // Check WebRTC connections
window.discordVoice.voiceState          // Check voice state
```

### Server Logs

```bash
# Check server logs
cd backend
npm run dev

# Look for:
# ✅ "Connected to Discord voice server"
# ✅ "User joined voice in server"  
# ✅ "WebRTC offer forwarded"
# ❌ Any error messages
```

## 📊 Performance Monitoring

Monitor these metrics:

- **Connected users**: `GET /api/stats`
- **Voice participants**: Check server logs
- **WebRTC connections**: Browser dev tools
- **CPU usage**: Server monitoring
- **Memory usage**: Node.js process

## 🔒 Security Notes

- Messages are sanitized for XSS prevention
- Rate limiting prevents spam (5 messages/5 seconds)
- WebRTC uses encrypted P2P connections
- No audio data stored on server
- CORS configured for your domain only

## 📝 License

This voice chat system is designed to integrate with your existing Discord clone. Modify as needed for your use case.

---

**Need Help?** Check the browser console for detailed logs and error messages. All WebRTC connections and signaling events are logged for debugging.

