# Ethos Metrotown

A luxury residential property website built with Next.js, TypeScript, Tailwind CSS, and GSAP.

## Architecture

### Component Structure
- **UI Components**: Reusable components in `/components/ui`
- **Section Components**: Content sections like Hero, Evolution
- **Layout Components**: Structure components
- **Page Components**: Top-level page containers

### Technology Stack
- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Animation**: GSAP with ScrollTrigger
- **Media**: Optimized images (WebP/AVIF), compressed videos

## Styling Approach

We use a tiered approach to styling:

1. **Tailwind CSS** for most UI styling
2. **CSS Modules** for component-specific styles and keyframe animations
3. **GSAP** for complex animations

### When to Use Each
- **Use Tailwind** for most styling needs
- **Create CSS Modules** for custom animations, complex selectors, and reusable component styles
- **Use GSAP** for scroll-based animations, timelines, and interactive sequences
- **Use inline styles** only for dynamic values from state/props

## Animation Strategy

GSAP drives our animation system:

- **Component-based**: Each component manages its own animations
- **Modular utilities**: `utils/animations.ts` provides reusable animation functions
- **Performance optimized**: Hardware acceleration, will-change, debounced handlers
- **Accessibility-conscious**: Respects reduced motion preferences, manages focus

## Development

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

## Key Features

- Responsive design with mobile-first approach
- Advanced animations with GSAP ScrollTrigger
- Performance optimized (code splitting, lazy loading)
- Accessibility compliant (ARIA, keyboard nav, screen readers)

## Project Structure
```
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── ...           # Section components
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
└── ...config files
```

## License
MIT
