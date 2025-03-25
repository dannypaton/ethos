# Ethos Metrotown

A luxury residential property website built with Next.js, TypeScript, Tailwind CSS, and GSAP.

## Architecture

### Component Structure
- **UI Components**: Reusable components in `/components/ui`
- **Section Components**: Content sections like Hero, Evolution, ManyOne
- **Layout Components**: Structure components
- **Page Components**: Top-level page containers

### Technology Stack
- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Animation**: GSAP with ScrollTrigger
- **Media**: Optimized images (WebP/AVIF), compressed videos

## Core Features

### Accessibility
- **Semantic Structure**:
  - Proper HTML5 elements and landmarks
  - Logical heading hierarchy
  - ARIA attributes and labels
- **Interactive Elements**:
  - Keyboard navigation
  - Focus management
  - Screen reader support
- **Visual Considerations**:
  - High contrast ratios
  - Reduced motion support
  - Clear visual hierarchy

### Performance
- **Code Optimization**:
  - Component-level code splitting
  - Memoized callbacks
  - Efficient event handling
- **Asset Optimization**:
  - Next.js image optimization
  - Responsive image loading
  - Video compression
- **Animation Performance**:
  - GSAP ScrollTrigger cleanup
  - Hardware acceleration
  - Debounced handlers

## Development Guidelines

### Styling Approach
1. **Tailwind CSS** for most UI styling
2. **CSS Modules** for component-specific styles and animations
3. **GSAP** for complex animations
4. **CSS Custom Properties** for dynamic values

### Animation Best Practices
- Check `prefers-reduced-motion` before animations
- Use `useCallback` for animation handlers
- Proper GSAP and ScrollTrigger cleanup
- CSS transitions for simple interactions
- Modal focus trapping and management

### Motion Components
- **Navigation**: Uses Framer Motion for menu transitions, including:
  - Fullscreen menu overlay animations
  - Staggered menu item reveals
  - Video background transitions
  - Triangle shape clip-path animations
- **Video Components**: Implements motion for:
  - Modal open/close transitions
  - Background video effects
  - Smooth video playback controls

### Getting Started
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Building
```bash
npm run build
npm run start
```

## Project Structure
```
├── public/               # Static assets
│   ├── images/          # Optimized images
│   └── video/           # Compressed videos
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── ...          # Section components
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Global styles & CSS modules
│   └── utils/           # Utility functions
└── ...config files
```

## License
MIT
