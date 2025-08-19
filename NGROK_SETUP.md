# Ngrok Setup for Testing with Friends

## Quick Setup

### 1. Get Ngrok Auth Token

1. Go to [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
2. Sign up or sign in to ngrok
3. Copy your auth token

### 2. Add Token to Environment

Add this line to your `.env.local` file:

```env
NGROK_AUTHTOKEN=your_ngrok_auth_token_here
```

### 3. Start Development Server with Ngrok

```bash
npm run dev:ngrok
```

This will:
- Start your Next.js development server on port 3000
- Create an ngrok tunnel to make it publicly accessible
- Display the public URL in the console

### 4. Share with Friends

The console will show something like:
```
🚀 Ngrok tunnel started successfully!
🌐 Public URL: https://abc123.ngrok.io
📤 Share this URL with your friends to test the app
```

Share this URL with your friends!

## Commands

- `npm run dev:ngrok` - Start development server with ngrok tunnel
- `npm run ngrok` - Start only ngrok tunnel (if server is already running)

## Troubleshooting

### "NGROK_AUTHTOKEN not found"
- Make sure you've added the token to `.env.local`
- Check that the token is valid

### "Failed to start ngrok"
- Verify your auth token is correct
- Check your internet connection
- Make sure port 3000 is available

### Friends can't access the app
- Check that ngrok tunnel is running
- Verify the URL is correct
- Make sure your firewall allows the connection

## Security Note

⚠️ **Important**: The ngrok URL is publicly accessible. Only share it with trusted friends for testing purposes. Don't use this for production deployment.

## Stopping the Tunnel

Press `Ctrl+C` in the terminal to stop both the development server and ngrok tunnel.
