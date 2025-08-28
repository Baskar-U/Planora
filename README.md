# 🎉 Planora - Event Planning Platform

<div align="center">

![Planora Logo](https://img.shields.io/badge/Planora-Event%20Planning-blue?style=for-the-badge&logo=calendar)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-12.1.0-FFCA28?style=for-the-badge&logo=firebase)

**The #1 Event Planning Platform - Connect with 500+ Verified Vendors**

[Live Demo](https://planoraevents.com) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Contributing](#-contributing)

</div>

---

## 📖 About Planora

Planora is a comprehensive event planning platform that connects event organizers with verified vendors across Tamil Nadu, India. Whether you're planning a wedding, corporate event, birthday party, or any special celebration, Planora provides everything you need to make your event perfect.

### 🎯 What Makes Planora Special?

- **500+ Verified Vendors** - All vendors are thoroughly vetted and rated
- **Comprehensive Services** - From catering to photography, decoration to entertainment
- **Smart Search & Filtering** - Find vendors by location, service type, and budget
- **Real-time Booking** - Instant booking and payment processing
- **Mobile-First Design** - Beautiful, responsive interface that works on all devices
- **Trusted by 10,000+ Event Planners** - Join our growing community

---

## ✨ Features

### 🏠 For Event Organizers
- **Smart Vendor Discovery** - Search by service, location, and budget
- **Vendor Profiles** - Detailed information, reviews, and portfolios
- **Instant Booking** - Book vendors directly through the platform
- **Order Management** - Track all your bookings in one place
- **Real-time Messaging** - Communicate directly with vendors
- **Payment Processing** - Secure online payments
- **Order Tracking** - Monitor the progress of your events

### 🏢 For Vendors
- **Professional Profiles** - Showcase your services and portfolio
- **Lead Management** - Receive and manage booking requests
- **Availability Calendar** - Manage your schedule efficiently
- **Service Management** - Add and update your service offerings
- **Customer Communication** - Chat directly with clients
- **Analytics Dashboard** - Track your business performance

### 🎨 User Experience
- **Modern UI/UX** - Beautiful, intuitive interface
- **Mobile Responsive** - Works perfectly on all devices
- **Fast Performance** - Optimized for speed and efficiency
- **Accessibility** - Designed for all users
- **Real-time Updates** - Live notifications and updates

---

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.6.3** - Type-safe development
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **Wouter** - Lightweight routing solution

### Backend & Database
- **Node.js & Express** - Server-side runtime and framework
- **Firebase** - Authentication, real-time database, and hosting
- **Drizzle ORM** - Type-safe database operations
- **Neon Database** - Serverless PostgreSQL

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESBuild** - Ultra-fast JavaScript bundler
- **TypeScript** - Static type checking
- **PostCSS & Autoprefixer** - CSS processing

### Additional Libraries
- **React Query** - Server state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Lucide React** - Beautiful icons
- **Date-fns** - Date manipulation utilities

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Neon Database account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/planora.git
   cd planora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Database Configuration
   DATABASE_URL=your_neon_database_url

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## 📱 Key Features in Detail

### 🔍 Smart Search & Discovery
- **Service-based Search** - Find vendors by specific services
- **Location Filtering** - Search by city or district
- **Price Range Filtering** - Filter by budget requirements
- **Rating-based Sorting** - Find the best-rated vendors first

### 💬 Real-time Communication
- **Instant Messaging** - Chat with vendors in real-time
- **File Sharing** - Share images and documents
- **Notification System** - Get notified of new messages and updates

### 📊 Vendor Management
- **Service Portfolio** - Showcase previous work and testimonials
- **Availability Management** - Calendar-based scheduling
- **Pricing Management** - Flexible pricing options
- **Performance Analytics** - Track business metrics

### 🔐 Security & Trust
- **Verified Vendors** - All vendors undergo verification process
- **Secure Payments** - Encrypted payment processing
- **Data Protection** - GDPR compliant data handling
- **User Authentication** - Firebase-based secure authentication

---

## 🏗 Project Structure

```
planora/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
├── server/                # Backend Express server
│   ├── routes/            # API routes
│   └── storage/           # File storage utilities
├── shared/                # Shared schemas and utilities
└── dist/                  # Production build output
```

---

## 🎨 UI Components

Planora uses a comprehensive set of UI components built with Radix UI and Tailwind CSS:

- **Navigation** - Responsive navbar with mobile menu
- **Forms** - Accessible form components with validation
- **Modals** - Dialog and modal components
- **Cards** - Vendor and service cards
- **Charts** - Analytics and data visualization
- **Calendar** - Availability and booking calendar
- **Toast** - Notification system
- **Loading** - Skeleton loaders and spinners

---

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema changes

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Ensure mobile responsiveness

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Planora is developed by a passionate team dedicated to revolutionizing event planning:

- **Ananth** - Lead Developer
- **Baskar** - UI/UX Designer
- **Harish** - Backend Developer
- **Sanjay** - Product Manager

---

## 📞 Support

- **Email**: support@planora.com
- **Documentation**: [docs.planora.com](https://docs.planora.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/planora/issues)

---

<div align="center">

**Made with ❤️ for the event planning community**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/planora?style=social)](https://github.com/yourusername/planora)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/planora?style=social)](https://github.com/yourusername/planora)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/planora)](https://github.com/yourusername/planora/issues)

</div>
