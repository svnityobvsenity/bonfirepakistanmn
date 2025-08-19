# Netlify Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Connect Repository to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: (leave empty)

### 2. Set Environment Variables

In Netlify dashboard → Site settings → Environment variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Optional (for voice chat):
```
NEXT_PUBLIC_TURN_URL=your_turn_server_url
NEXT_PUBLIC_TURN_USER=your_turn_username
NEXT_PUBLIC_TURN_PASS=your_turn_password
NEXT_PUBLIC_SIGNALING_SERVER_URL=your_signaling_server_url
```

### 3. Deploy

Click "Deploy site" and wait for the build to complete!

## 📋 Build Configuration

The project is already configured for Netlify with:

- `netlify.toml` - Netlify configuration
- `@netlify/plugin-nextjs` - Next.js plugin for serverless functions
- Optimized Next.js config for Netlify deployment

## 🔧 Troubleshooting

### Build Fails with Environment Variable Errors

✅ **Fixed!** The project now handles missing environment variables gracefully during build time.

### API Routes Not Working

✅ **Fixed!** Using `@netlify/plugin-nextjs` ensures API routes work as serverless functions.

### Static Assets Not Loading

✅ **Fixed!** Configured proper asset handling in `next.config.js`.

## 🎯 Post-Deployment Steps

1. **Set up Supabase**:
   - Create your Supabase project
   - Run database migrations
   - Configure RLS policies
   - Set up authentication

2. **Test the deployment**:
   - Visit your Netlify URL
   - Test user registration/login
   - Test messaging functionality
   - Test real-time features

3. **Configure custom domain** (optional):
   - Add your custom domain in Netlify
   - Update Supabase redirect URLs

## 🌐 Netlify Configuration Details

### Build Settings
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Next.js Configuration
```javascript
const nextConfig = {
  images: {
    unoptimized: true
  },
  assetPrefix: '',
  experimental: {},
}
```

## 🚀 Automatic Deployments

- **Main branch**: Automatically deploys to production
- **Feature branches**: Create deploy previews
- **Pull requests**: Generate preview deployments

## 📊 Performance

The app is optimized for Netlify with:
- Static page generation where possible
- Serverless API routes
- Optimized asset loading
- Proper caching headers

## 🔒 Security

Security headers are configured in `netlify.toml`:
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 📱 Testing with Friends

After deployment, you can share your Netlify URL with friends for testing:
1. Share the production URL (e.g., `https://your-app.netlify.app`)
2. Friends can register and test all features
3. Real-time messaging and voice chat will work across different networks

No need for ngrok when deployed to Netlify!
