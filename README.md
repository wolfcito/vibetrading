# Trading Vibe

A Next.js application for trading visualization and analysis.

## Tech Stack

- [Next.js](https://nextjs.org/) 15.3.3 - React framework
- [React](https://react.dev/) 19.1.0 - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Turbopack](https://turbo.build/pack) - Development bundler

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run development server
pnpm dev
```

The development server will start at [http://localhost:3000](http://localhost:3000) using Turbopack for fast refresh.

### Build

```bash
# Create production build
pnpm build
```

### Production

```bash
# Start production server
pnpm start
```

## Project Structure

```text
├── public/          # Static assets
├── src/
│   ├── app/        # App router pages
│   ├── components/ # React components
│   └── lib/        # Shared utilities
├── .next/          # Next.js build output
└── components.json  # UI component config
```

## Development Tools

- ESLint - Linting
- PostCSS - CSS processing
- Class Variants Authority (cva) - Component variants

## License

This project is licensed under the MIT License - see the LICENSE file for details.
