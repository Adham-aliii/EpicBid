# EpicBid

A modern e-commerce platform with auction capabilities built using React, TypeScript, and Vite.

## Features

- 🛍️ E-commerce functionality
- 🔨 Auction system
- 💬 Real-time chat
- 👤 User profiles and authentication
- 🛒 Shopping cart
- 📱 Responsive design
- 🌙 Dark mode support

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/epicbid.git
   cd epicbid
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── assets/         # Static assets
├── Components/     # React components
├── Context/        # React context providers
├── hooks/          # Custom React hooks
├── Routes/         # Route configurations
└── types/          # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
