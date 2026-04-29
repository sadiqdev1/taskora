# Taskora - Task & Campaign Platform

**A modern task and campaign marketplace platform where users complete tasks to earn rewards.**

Taskora connects businesses and content creators with users who complete micro-tasks like social media engagement, app downloads, surveys, and more. Built with React 19, Tailwind CSS, and Framer Motion for a seamless, responsive experience across all devices.

## ✨ Key Features

- 🎯 **Task Marketplace** - Browse and complete tasks to earn money
- 💰 **Wallet System** - Track earnings and manage withdrawals
- 📊 **Dashboard** - Real-time stats and activity tracking
- 🌓 **Dark Mode** - Full dark/light theme support
- 📱 **Responsive** - Mobile-first design that works everywhere
- 🎨 **Modern UI** - Clean, professional interface with smooth animations

## 🛠️ Tech Stack

- **React 19.2.5** - UI library
- **Vite 8.0.10** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **Axios** - HTTP client
- **Recharts** - Charts (ready to use)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Demo Credentials

The app uses mock authentication. Use these credentials to login:

- **User Account**
  - Email: `user@taskora.com`
  - Password: `Password123`

- **Creator Account**
  - Email: `creator@taskora.com`
  - Password: `Password123`

- **Admin Account**
  - Email: `admin@taskora.com`
  - Password: `Password123`

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components (Sidebar, Navbar)
│   └── features/        # Feature-specific components
├── contexts/            # React Context providers
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── ToastContext.jsx
├── hooks/               # Custom React hooks
├── layouts/             # Page layouts
├── pages/               # Page components
│   ├── public/          # Public pages (Login, Register)
│   ├── user/            # User pages (Dashboard, Tasks, etc.)
│   ├── creator/         # Creator pages (Campaigns)
│   └── admin/           # Admin pages
├── routes/              # Route guards and configuration
├── services/            # API services
├── utils/               # Utility functions
├── data/                # Mock data
└── App.jsx              # Root component
```

## 🎨 Available Components

### Common Components
- **Button** - Multiple variants (primary, secondary, danger, outline, ghost)
- **Input** - Form input with validation states
- **Card** - Container with shadow and hover effects
- **Modal** - Animated modal with backdrop
- **Badge** - Status badges with color variants
- **Toast** - Toast notifications
- **Loader** - Loading spinner
- **EmptyState** - Empty state placeholder
- **Pagination** - Pagination controls
- **Select** - Dropdown select

### Layout Components
- **Sidebar** - Responsive navigation sidebar
- **Navbar** - Top navigation bar with search and user menu
- **AuthenticatedLayout** - Layout wrapper for authenticated pages

## 🎯 Current Implementation Status

### ✅ Completed
- Project setup and configuration
- Tailwind CSS custom theme
- Context providers (Auth, Theme, Toast)
- Common UI components library
- Layout components (Sidebar, Navbar)
- Routing structure with protected routes
- Login page with authentication
- Dashboard page with stats
- Mock API services
- Dark mode support
- Responsive design

### 🚧 Coming Soon
- Task Marketplace page
- Task Details page
- My Tasks page
- Wallet page
- Transactions page
- Notifications page
- Profile page
- Settings page
- Create Campaign page (Creator)
- My Campaigns page (Creator)
- Campaign Details page (Creator)
- Admin Dashboard
- Landing page
- Register page
- Forgot Password page

## 🎨 Theme Customization

The app uses a custom Tailwind theme defined in `tailwind.config.js`:

- **Primary Colors**: Purple/Blue gradient (#6366f1)
- **Success**: Green (#22c55e)
- **Danger**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)
- **Font**: Inter
- **Dark Mode**: Class-based dark mode

## 🔄 State Management

The app uses React Context API for global state:

- **AuthContext**: User authentication and session management
- **ThemeContext**: Light/dark mode theme management
- **ToastContext**: Toast notification management

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: ≥ 1024px

## 🚀 Next Steps

1. Implement remaining pages (Tasks, Wallet, Campaigns, etc.)
2. Add real API integration
3. Implement form validation for all forms
4. Add more animations and transitions
5. Implement search functionality
6. Add filters and sorting
7. Implement file upload for task submissions
8. Add charts and analytics
9. Implement notifications system
10. Add accessibility improvements

## 📄 License

This project is part of the Taskora platform.

## 🤝 Contributing

This is a demo project. For production use, replace mock API services with real backend integration.
