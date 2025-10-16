# SyncWeb

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## Overview

SyncWeb is the web frontend for the Sync decentralized payment system, providing a seamless interface for instant fiat-to-crypto transactions on the StarkNet ecosystem. Built with Next.js and React, it offers a modern, responsive user experience for managing wallets, processing payments, and interacting with the hybrid payment protocol.

This application enables users to:
- Access their Local Currency and Crypto Wallets through an intuitive dashboard.
- Initiate and manage payments, including QR code scanning for merchants.
- Handle automated liquidity bridging when fiat balances are insufficient.
- View transaction history and real-time balance updates.

## Features

- **Hybrid Payment Dashboard**: Real-time overview of fiat and crypto balances with automated fund management.
- **Payment Processing**: Support for direct payments, swaps, and merchant integrations via QR codes.
- **Wallet Management**: Secure handling of local currency (e.g., Naira, USD) and crypto assets (STRK, ETH, USDC).
- **Authentication**: Integrated with NextAuth for secure user sessions and JWT management.
- **Responsive UI**: Built with Tailwind CSS and Radix UI components for a polished, accessible interface.
- **Real-time Updates**: Utilizes React Query for efficient data fetching and state management with Zustand.
- **Security**: Client-side encryption and secure communication with the Sync Backend API.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with NativeWind compatibility
- **UI Components**: Radix UI primitives for accessibility
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack React Query
- **Authentication**: NextAuth.js
- **Icons**: Lucide React and Heroicons
- **Charts & Visualization**: Recharts for transaction analytics
- **QR Code Generation**: qrcode.react for payment codes

## Installation

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager (v4.9.1 or compatible)
- Access to Sync Backend API

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sync/SyncWeb
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory with necessary variables:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000

   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000  # Sync Backend URL

   # Optional: Other configurations like analytics, etc.
   ```

4. **Run the Development Server**
   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

### Development

- **Start Development Server**: `yarn dev` - Runs the app in development mode with hot-reload.
- **Build for Production**: `yarn build` - Builds the application for production.
- **Start Production Server**: `yarn start` - Starts the production server.
- **Lint Code**: `yarn lint` - Runs ESLint to check for issues.

### Key Components

- **HybridPaymentDashboard**: Main dashboard for wallet overview and payment initiation.
- **PaymentModal**: Handles payment processing, including transaction confirmations and hash display.
- **Wallet Components**: Modules for managing fiat and crypto balances.
- **Authentication Pages**: Login, registration, and profile management.

### Integration with Backend

SyncWeb communicates with the Sync Backend API for:
- User authentication and session management.
- Wallet balance queries and updates.
- Transaction processing and blockchain interactions.
- Merchant payment handling.

## Project Structure

```
SyncWeb/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin panel
│   └── ...
├── components/            # Reusable UI components
│   ├── modals/           # PaymentModal, etc.
│   ├── ui/               # Shadcn/Radix components
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── styles/               # Global styles
├── types/                # TypeScript type definitions
└── ...
```

## Security & Best Practices

- **Client-Side Security**: Sensitive operations are handled server-side via the backend API.
- **Input Validation**: Uses React Hook Form with Zod for form validation.
- **State Management**: Zustand ensures predictable state updates.
- **Error Handling**: Comprehensive error boundaries and user feedback.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

Ensure all new features include TypeScript types and are tested.

## License

This project is part of the Sync ecosystem and follows the same licensing as the backend.

## Support

For issues or questions, please refer to the main Sync project documentation or contact the development team.

---

*Built with Next.js and React for a modern, secure web experience in the Sync payment ecosystem.*
