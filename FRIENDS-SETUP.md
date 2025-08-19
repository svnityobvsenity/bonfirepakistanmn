# 🔥 How Your Friends Can Join

## Quick Setup (2 minutes)

### 1. **Create .env file**
```bash
cd backend
notepad .env
```

**Copy this EXACTLY:**
```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=https://svhbcxchtvpnbfwsfgms.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aGJjeGNodHZwbmJmd3NmZ21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mzk2NTMsImV4cCI6MjA3MTExNTY1M30.bcIb7Ejf5NaXk6-ot6gJwBwjKCH9CcDxKPmuKfTh0cw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aGJjeGNodHZwbmJmd3NmZ21zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUzOTY1MywiZXhwIjoyMDcxMTE1NjUzfQ.tQnCgAjEDC3NMfSH-S6HiO8ia0Eft7tHlGy4Ik4V1eQ
JWT_SECRET=99iyC3DFI3K8tOObMisms0jf3bIoBtaKinAlR3Z1+dcna2er0ZcTFwqmDPfQTA55laJrTQmCqAfOq/TtBkUWdg==
STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
CHAT_RATE_LIMIT_WINDOW_MS=5000
CHAT_RATE_LIMIT_MAX_REQUESTS=5
LOG_LEVEL=info
```

### 2. **Start Backend**
```bash
cd backend
npm install
npm run dev
```

### 3. **Start Frontend (new terminal)**
```bash
cd ..
npm run dev
```

### 4. **Share with Friends**

**Option A: Local Network (Same WiFi)**
- Find your IP: `ipconfig` (look for IPv4 Address)
- Friends go to: `http://YOUR_IP:3001`
- Example: `http://192.168.1.100:3001`

**Option B: Internet (ngrok)**
```bash
npm install -g ngrok
ngrok http 3001
```
- Share the ngrok URL with friends

## 🎮 **How Friends Join**

1. **Go to the URL** you shared
2. **Click "Sign Up"** and create account:
   - Email: any email
   - Username: their choice
   - Password: anything
3. **Login** with their account
4. **Join servers** and start chatting!

## 🎤 **Voice Chat**

1. **Click "Join Voice"** in any server
2. **Allow microphone** when browser asks
3. **Talk with friends** in real-time!

## 🚀 **Ready for 100 Users!**

- ✅ **No dummy data** - only real users
- ✅ **Real-time messaging** 
- ✅ **Voice chat** with mute/deafen
- ✅ **Server switching**
- ✅ **Live user presence**

**Just run the commands above and share the URL!** 🔥

