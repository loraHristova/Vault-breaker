# Vault-breaker
A web-based vault opening game built with PIXI.js, GSAP, and TypeScript.

## About

This project is an interactive vault opening game that runs in the browser. It features smooth animations powered by GSAP and high-performance graphics rendering using PIXI.js.

## Tech Stack

- **PIXI.js** - 2D WebGL renderer for graphics and animations
- **GSAP** - Professional animation library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js) or [yarn](https://yarnpkg.com/)

## Installation

1. **Clone the repository** (or navigate to your project folder)
   ```bash
   git clone <your-repository-url>
   cd vault-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   Or if you prefer yarn:
   ```bash
   yarn install
   ```

## Development

To start the development server:

```bash
npx vite
```

This will start the Vite development server, typically at `http://localhost:5173`. The page will automatically reload when you make changes to the source files.

## Building for Production

To create a production build:

```bash
npx vite build
```

This will:
- Compile TypeScript to JavaScript
- Bundle all assets
- Optimize the code for production
- Generate the build files in the `dist` folder

## Preview Production Build

To preview the production build locally:

```bash
npx vite preview
```

## Project Structure

```
vault-project/
├── node_modules/           # Dependencies
├── public/                 # Public assets
│   ├── config/
│   │   └── config.json     # Game configuration
│   └── images/             # Game images
│       ├── bg.png
│       ├── blink.png
│       ├── door.png
│       ├── doorOpen.png
│       ├── doorOpenShadow.png
│       ├── handle.png
│       └── handleShadow.png
├── src/                    # Source code
│   ├── assets.ts           # Asset management
│   ├── codeManager.ts      # Win three-digit code logic
│   ├── configLoader.ts     # Configuration loader
│   ├── configTypes.ts      # Configuration interfaces
│   ├── eventBus.ts         # Event system
│   ├── game.ts             # Main game logic
│   ├── safeDoor.ts         # Safe door component
│   ├── safeHandle.ts       # Safe handle component
│   └── timer.ts            # Timer functionality
├── .gitignore              # Git ignore file
├── index.html              # Main HTML file
├── package-lock.json       # Locked dependencies
├── package.json            # Project dependencies
└── README.md               # This file
```

## How to Play

Open the game in your browser
Your job is to figure out the three digit code and to steal the gold inside!
There is a timer timing you so be fast!

The code for the safe is following this model:

digit-digit-digit

, where every digit is between 1-9 and is equivalent to the rotation times of the handle on the correct direction, the directions being:

clockwise-counterclockwise-clockwise

if you want to turn the handle clockwise, click on the right side of the handle, and if you want to turn it left - on the left side!

But watch your fingers! When getting the code wrong, the handle starts spinning like crazy!

And be fast if you open the safe, because the door closes only after 5 seconds!

Good luck!

## Available Commands

- `npx vite` - Start development server
- `npx vite build` - Build for production
- `npx vite preview` - Preview production build

> **Note:** Since the project doesn't have npm scripts configured, we use `npx` to run Vite commands directly.

---

