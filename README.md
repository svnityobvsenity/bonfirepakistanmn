# Bonfire - Discord Clone

A modern Discord-style chat application built with Next.js 14, TypeScript, and Tailwind CSS.

![Bonfire Chat App](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Features

- **Pixel-perfect Discord UI**: Faithful recreation of Discord's dark theme and layout
- **Fully Responsive**: Seamless desktop and mobile experience
- **Modern Tech Stack**: Built with Next.js 14 App Router, TypeScript, and Tailwind CSS
- **Interactive Components**: Server list, channel navigation, and chat interface
- **Mock Data**: Sample messages and user interactions for demonstration

## 🏗️ Project Structure

```
bonfire/
├── apps/web/                    # Next.js application
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   ├── design/                  # Design system tokens
│   ├── data/                    # Mock data
│   └── styles/                  # Global styles
└── README.md
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Package Manager**: npm

## 📱 Components

- **ServerList**: Left sidebar with server navigation
- **ChannelList**: Channel browser with text/voice channels
- **ChatWindow**: Main chat interface with messages and input
- **Responsive Layout**: Mobile-first design with drawer navigation

## 🚀 Getting Started

### Prerequisites

- Node.js 18-20 (see `.nvmrc`)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/svnityobvsenity/bonfirepakistanmn.git
cd bonfirepakistanmn
```

2. Navigate to the web app:
```bash
cd apps/web
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

In the `apps/web` directory:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## 🎨 Design System

The app uses a custom design system with Discord-inspired tokens:

- **Colors**: Dark theme with Discord's signature colors
- **Typography**: Whitney font family with proper hierarchy
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components with hover states

## 📱 Responsive Design

- **Desktop**: 3-column layout (servers → channels → chat)
- **Mobile**: Stacked layout with collapsible channel drawer

## 🔮 Future Stages

This is Stage 1 of the project. Future stages will include:

- Real-time messaging with WebSockets
- User authentication and profiles
- Database integration with Supabase
- Voice/video calling features
- File uploads and media sharing

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and Tailwind CSS
