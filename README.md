# Saint Community Church Pako-Obadiah Real-Time Reporting App

A comprehensive real-time church community reporting and management system built specifically for **Saint Community Church Pako-Obadiah PCF** with Next.js 15, WebSocket technology, and modern React patterns.

## 🏛️ Church Structure

### Pako-Obadiah PCF Organization
- **One PCF (Pentecostal Church Fellowship)**: Saint Community Church Pako-Obadiah
- **4 Total Admins**: 3 Regular Fellowship Leaders + 1 PCF Pastor (Super Admin)
- **PCF Pastor Role**: Acts as super admin, receives all data from other 3 admins + manages own users
- **Cell/Fellowship Based**: Each user selects their fellowship leader during sign-up

## 🚀 Features

### Real-Time Capabilities
- **Live Data Synchronization**: All data updates instantly across all connected clients
- **WebSocket Integration**: Real-time communication between users and admins
- **Auto-Save Functionality**: Forms auto-save every 30 seconds with real-time sync
- **Live Notifications**: Instant notifications for birthdays, events, and report submissions
- **Connection Status**: Real-time connection status indicator
- **Cross-Device Sync**: Forms and data synchronized across multiple devices

### Core Features
- **Role-Based Authentication**: Users, Admins (max 4), and PCF Pastor (Super Admin)
- **Comprehensive Reporting**: Daily, Weekly, and Monthly reports with real-time submission
- **Birthday Management**: Live birthday ticker with motion animations
- **Event Management**: Real-time event creation and notifications
- **Statistics Dashboard**: Live statistics with auto-updating progress bars
- **Study Group Management**: PDF upload with real-time notifications
- **Giving Tracking**: Real-time giving submissions and tracking
- **Member Management**: Live member activity monitoring

### Technical Features
- **Next.js 15**: Latest App Router with Server Components
- **TypeScript**: Full type safety throughout the application
- **WebSocket Server**: Custom WebSocket server for real-time communication
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Responsive design with modern styling
- **shadcn/ui**: Beautiful and accessible UI components

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd saint-community-pako-obadiah-reporting-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development servers**
   \`\`\`bash
   # Start both WebSocket server and Next.js app
   npm run dev-full
   
   # Or start them separately:
   # Terminal 1: WebSocket Server
   npm run ws-server
   
   # Terminal 2: Next.js App
   npm run dev
   \`\`\`

4. **Access the application**
   - Frontend: http://localhost:3000
   - WebSocket Server: ws://localhost:8080

## 🏗️ Architecture

### Frontend (Next.js 15)
- **App Router**: Modern routing with Server Components
- **Real-Time Context**: WebSocket and data management contexts
- **Component Structure**: Modular, reusable components
- **State Management**: React Context with real-time synchronization

### Backend (WebSocket Server)
- **Real-Time Communication**: WebSocket server for live updates
- **Message Handling**: Structured message types for different operations
- **Session Management**: User session tracking and data persistence
- **Broadcasting**: Targeted message broadcasting to users/admins

### Real-Time Features
- **Auto-Save**: Forms automatically save every 30 seconds
- **Live Sync**: Data synchronized across all connected clients
- **Instant Notifications**: Real-time alerts for important events
- **Connection Management**: Automatic reconnection on connection loss

## 📱 User Roles & Permissions

### General Users
- Submit daily, weekly, and monthly reports in real-time
- Upload study materials with instant admin notifications
- View live birthday announcements and events
- Access personal statistics with live updates
- Real-time form synchronization across devices
- **Must select one of 4 fellowship leaders during sign-up**

### Fellowship Leaders (3 Regular Admins)
- Real-time monitoring of assigned members
- Live report review and status updates
- Create fellowship-specific events with instant notifications
- Download study materials with real-time tracking
- Live member activity dashboard
- **Limited to 3 positions**

### PCF Pastor (Super Admin)
- **Receives all data from the other 3 fellowship leaders**
- **Manages own direct users as well**
- Access to all admin and user data in real-time
- Create global events visible to all users
- Comprehensive real-time statistics and analytics
- Live oversight of all fellowship activities
- **Only 1 PCF Pastor position available**

## 🔄 Real-Time Features Detail

### Live Data Synchronization
- All form inputs sync in real-time across devices
- Statistics update instantly when reports are submitted
- Member activity tracked and displayed live
- Event notifications broadcast immediately

### Auto-Save System
- Forms auto-save every 30 seconds
- Manual save option available
- Real-time save status indicators
- Cross-device form state synchronization

### Live Notifications
- Birthday announcements with motion animations
- Event notifications with instant delivery
- Report submission alerts for admins
- Member join notifications

### Connection Management
- Real-time connection status indicator
- Automatic reconnection on connection loss
- Graceful handling of network interruptions
- Connection quality monitoring

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Adaptive layouts

### Animations & Interactions
- Smooth page transitions with Framer Motion
- Loading states and micro-interactions
- Real-time data update animations
- Interactive progress indicators

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

## 📊 Data Management

### Real-Time Data Flow
1. User inputs data in forms
2. Data auto-saves every 30 seconds via WebSocket
3. Real-time synchronization across all connected clients
4. Instant notifications to relevant users/admins
5. Live statistics updates

### Data Persistence
- Auto-save functionality prevents data loss
- Session management for temporary data storage
- Real-time backup of form states
- Cross-device data synchronization

## 🚀 Deployment

### Production Setup
1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy Frontend**
   - Recommended: Vercel (seamless Next.js integration)
   - Alternative: Netlify, AWS Amplify

3. **Deploy WebSocket Server**
   - Recommended: Railway, Render, or Fly.io
   - Ensure WebSocket support is enabled
   - Configure environment variables

4. **Environment Variables**
   \`\`\`env
   NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com
   DATABASE_URL=your-database-connection-string
   \`\`\`

### Production Considerations
- Use WSS (secure WebSocket) in production
- Implement proper authentication and authorization
- Set up database for persistent data storage
- Configure CDN for static assets
- Implement proper error handling and logging

## 🔧 Development

### Project Structure
\`\`\`
├── app/                    # Next.js App Router pages
├── components/            # Reusable React components
├── lib/                   # Utility functions and contexts
├── server/               # WebSocket server
├── public/               # Static assets
└── README.md
\`\`\`

### Key Components
- **WebSocket Context**: Real-time communication management
- **Real-Time Data Context**: Data synchronization and state management
- **Dashboard Components**: User and admin dashboards with live updates
- **Form Components**: Real-time form handling with auto-save

### Development Commands
\`\`\`bash
npm run dev          # Start Next.js development server
npm run ws-server    # Start WebSocket server
npm run dev-full     # Start both servers concurrently
npm run build        # Build for production
npm run lint         # Run ESLint
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Test real-time functionality thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ for Saint Community Church Pako-Obadiah PCF**

*Real-time church community management made simple and efficient.*
