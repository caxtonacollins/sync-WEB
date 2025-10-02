# Sync Frontend Application

A modern, responsive sync frontend built with Next.js 15, React, TypeScript, and Tailwind CSS featuring a dark theme.

## Features

- **Authentication System**: Login/Register with JWT token management
- **Dashboard**: Overview of transactions, swap orders, fiat accounts, and crypto wallets
- **Profile Management**: Update user information and change passwords
- **2FA Security**: Two-factor authentication with QR code setup
- **Admin Panel**: User management with KYC verification (admin only)
- **Dark Theme**: Modern dark color scheme with purple accents
- **Responsive Design**: Mobile-first approach with responsive tables and navigation
- **Toast Notifications**: Real-time feedback for user actions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Package Manager**: Yarn
- **Icons**: Heroicons
- **State Management**: React Context API

## Installation

1. **Clone the repository**
   ~~~ bash
   git clone <repository-url>
   cd financial-services-app
   ~~~ 

2. **Install dependencies using Yarn**
   ~~~ bash
   yarn install
   ~~~ 

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ~~~ env
   BACKEND_URL=http://localhost:3000
   ~~~ 

4. **Run the development server**
   ~~~ bash
   yarn dev
   ~~~ 

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Tailwind CSS
The application uses a custom Tailwind configuration with:
- Dark theme colors
- Custom component classes
- Responsive breakpoints
- Animation utilities

### Next.js
- App Router for modern routing
- TypeScript for type safety
- API routes for backend integration
- Image optimization

## Deployment

1. **Build the application**
   ~~~ bash
   yarn build
   ~~~ 

2. **Start the production server**
   ~~~ bash
   yarn start
   ~~~ 

## Security Features

- JWT token authentication
- Protected routes with role-based access
- 2FA implementation
- Secure password handling
- Input validation and sanitization

## Mock Data

The application includes comprehensive mock data for demonstration:
- Sample transactions with different types and statuses
- Swap orders with currency pairs and rates
- Fiat accounts with balances and account numbers
- Crypto wallets with addresses and networks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
# sync-WEB
