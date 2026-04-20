# Setup Guide

## Quick Start

If you encounter dependency resolution errors during installation, use one of these methods:

### Method 1: Legacy Peer Dependencies (Recommended)
```bash
npm install --legacy-peer-deps
```

### Method 2: Use the npm script
```bash
npm run install:legacy
```

### Method 3: Force installation
```bash
npm install --force
```

## Why This Happens

The project uses React 19, but some dependencies may not have updated their peer dependency requirements yet. The `--legacy-peer-deps` flag tells npm to use the legacy (npm v6) peer dependency resolution algorithm, which is more permissive.

## Development

After successful installation:

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Type checking
npm run lint

# Clean build artifacts
npm run clean
```

## Dependencies

- **React 19**: Latest React version with improved performance
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lottie**: Animation player for interactive graphics

## Troubleshooting

If you still encounter issues:

1. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

3. Install with legacy peer deps:
   ```bash
   npm install --legacy-peer-deps
   ```

4. If using yarn, try:
   ```bash
   yarn install --ignore-engines
   ```