# 🚀 **Comprehensive Frontend Development Prompt for Adunni Foods**

## 🎯 **Project Overview**
Create a world-class, production-ready frontend for Adunni Foods - a premium plantain chips business. This should be the most beautiful, modern, and user-friendly food ordering website ever built, incorporating cutting-edge design systems, smooth animations, and exceptional user experience.

## 🏗️ **Technical Requirements**

### **Framework & Tools**
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Framer Motion** for smooth animations
- **Lottie** for premium animations
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Lucide React** for icons
- **React Hot Toast** for notifications

### **Design System Requirements**
- **Color Palette**: Premium, food-inspired colors with proper contrast
- **Typography**: Modern, readable fonts (Inter + display font)
- **Spacing**: 8px grid system with consistent spacing
- **Shadows**: Subtle, layered shadows for depth
- **Borders**: Rounded corners with consistent radius
- **Transitions**: 300ms ease-in-out for all interactions

## 🎨 **Design Philosophy**

### **Visual Identity**
- **Premium & Trustworthy**: Clean, professional design that builds customer confidence
- **Food-Focused**: Warm, appetizing colors and imagery
- **Mobile-First**: Responsive design that works perfectly on all devices
- **Accessibility**: WCAG 2.1 AA compliance with proper contrast ratios
- **Performance**: Optimized for speed and smooth interactions

### **Animation Principles**
- **Purposeful**: Every animation serves a functional purpose
- **Smooth**: 60fps animations with proper easing curves
- **Delightful**: Micro-interactions that surprise and delight users
- **Performance**: Hardware-accelerated animations using transform/opacity

## 🏠 **Page Structure & Features**

### **1. Landing Page (Hero Section)**
```
- Full-screen hero with Lottie animation (plantain chips being made)
- Floating product cards with 3D hover effects
- Smooth scroll-triggered animations
- Interactive background elements
- Call-to-action buttons with hover animations
```

### **2. Products Showcase**
```
- Grid layout with masonry-style product cards
- Hover effects with product details overlay
- Image lazy loading with skeleton screens
- Filter and search functionality
- Smooth transitions between filter states
```

### **3. Product Detail Page**
```
- Large product images with zoom functionality
- Smooth image gallery transitions
- Add to cart animation
- Related products carousel
- Review and rating system
```

### **4. Shopping Cart**
```
- Slide-in cart panel with smooth animations
- Item quantity adjustments with micro-animations
- Cart item removal with exit animations
- Progress bar for checkout completion
```

### **5. Checkout Process**
```
- Multi-step form with progress indicator
- Smooth transitions between steps
- Form validation with real-time feedback
- Payment method selection with animations
```

### **6. Order Tracking**
```
- Timeline component with smooth animations
- Real-time status updates
- Interactive order map
- WhatsApp integration button
```

### **7. Admin Dashboard**
```
- Modern dashboard with data visualization
- Interactive charts and graphs
- Product management interface
- Order management system
- Analytics and reporting
```

## 🎭 **Animation Specifications**

### **Lottie Animations**
```
- Hero section: Plantain chips production process
- Loading states: Custom branded loaders
- Success states: Celebration animations
- Error states: Friendly error illustrations
- Empty states: Engaging empty state animations
```

### **Micro-Interactions**
```
- Button hover effects with scale and shadow changes
- Form input focus states with smooth transitions
- Card hover effects with 3D transforms
- Menu item hover with underline animations
- Scroll-triggered reveal animations
```

### **Page Transitions**
```
- Smooth page-to-page transitions
- Loading states with skeleton screens
- Error boundaries with friendly messages
- Success confirmations with celebration
```

## 🔧 **API Integration Requirements**

### **Authentication System**
```
- JWT token management
- Protected route handling
- Admin role-based access control
- Secure token storage
- Auto-refresh token functionality
```

### **Data Fetching**
```
- Optimistic updates for better UX
- Real-time data synchronization
- Error handling with retry mechanisms
- Loading states for all async operations
- Offline support with service workers
```

### **Form Handling**
```
- Real-time validation feedback
- Progressive form completion
- Auto-save functionality
- Multi-step form navigation
- File upload with progress indicators
```

## 📱 **Responsive Design Requirements**

### **Breakpoints**
```
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large Desktop: 1440px+
```

### **Mobile-First Approach**
```
- Touch-friendly interface elements
- Swipe gestures for mobile interactions
- Optimized navigation for small screens
- Fast loading on mobile networks
```

## 🎨 **Component Architecture**

### **Atomic Design System**
```
- Atoms: Buttons, inputs, icons, badges
- Molecules: Form fields, product cards, navigation items
- Organisms: Product grids, forms, navigation bars
- Templates: Page layouts and structures
- Pages: Complete page implementations
```

### **Reusable Components**
```
- Button variants (primary, secondary, outline, ghost)
- Input components with validation states
- Modal and dialog components
- Toast notification system
- Loading and skeleton components
```

## 🚀 **Performance Requirements**

### **Core Web Vitals**
```
- LCP: < 2.5 seconds
- FID: < 100 milliseconds
- CLS: < 0.1
- TTFB: < 600 milliseconds
```

### **Optimization Techniques**
```
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Bundle size optimization
- Critical CSS inlining
- Service worker for offline support
```

## 🔒 **Security & Accessibility**

### **Security Measures**
```
- XSS protection
- CSRF protection
- Input sanitization
- Secure HTTP headers
- Content Security Policy
```

### **Accessibility Features**
```
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- ARIA labels and roles
```

## 🎯 **State Management**

### **Global State**
```
- User authentication state
- Shopping cart data
- Theme preferences
- Language settings
- Notification preferences
```

### **Local State**
```
- Form input states
- UI component states
- Animation states
- Loading states
- Error states
```

## 🎯 **User Experience Goals**

### **Primary Objectives**
```
- Reduce cart abandonment rate
- Increase conversion rate
- Improve user engagement
- Enhance brand perception
- Optimize for mobile users
```

### **Success Metrics**
```
- Page load speed
- User interaction rates
- Conversion funnel completion
- Mobile usability scores
- Accessibility compliance
```

## 🚀 **Implementation Guidelines**

### **Code Quality**
```
- TypeScript strict mode
- ESLint with strict rules
- Prettier for code formatting
- Husky for pre-commit hooks
- Comprehensive error handling
```

### **Testing Strategy**
```
- Unit tests for components
- Integration tests for API calls
- E2E tests for user flows
- Visual regression testing
- Performance testing
```

## 📋 **Specific Features to Implement**

### **Landing Page**
```
- Hero section with Lottie animation
- Product showcase with 3D effects
- Customer testimonials carousel
- Newsletter signup with animations
- Social proof section
```

### **Product Management**
```
- Product catalog with filters
- Product search with suggestions
- Product comparison tool
- Wishlist functionality
- Product recommendations
```

### **Order Management**
```
- Shopping cart with animations
- Checkout process with validation
- Order confirmation with celebration
- Order tracking with timeline
- Order history with search
```

### **Admin Features**
```
- Dashboard with analytics
- Product CRUD operations
- Order management interface
- Customer management
- Sales reporting
```

## 🎨 **Visual Design Requirements**

### **Color Scheme**
```
- Primary: Warm, food-inspired colors
- Secondary: Complementary accent colors
- Neutral: Professional grays and whites
- Success: Green for positive actions
- Error: Red for error states
- Warning: Orange for caution
```

### **Typography Hierarchy**
```
- H1: Large, bold display text
- H2: Section headings
- H3: Subsection headings
- Body: Readable body text
- Caption: Small, secondary text
```

### **Spacing System**
```
- 4px: Extra small spacing
- 8px: Small spacing
- 16px: Medium spacing
- 24px: Large spacing
- 32px: Extra large spacing
- 48px: Section spacing
```

## ⚡ **Animation Timing & Easing**

### **Standard Transitions**
```
- Fast: 150ms ease-out
- Normal: 300ms ease-in-out
- Slow: 500ms ease-in-out
- Page: 600ms ease-in-out
```

### **Easing Curves**
```
- Ease-out: For entering elements
- Ease-in: For exiting elements
- Ease-in-out: For state changes
- Custom: For special effects
```

## 📱 **Mobile-Specific Features**

### **Touch Interactions**
```
- Swipe gestures for navigation
- Pull-to-refresh functionality
- Touch-friendly button sizes
- Optimized form inputs
- Mobile-optimized images
```

### **Performance**
```
- Lazy loading for images
- Optimized bundle sizes
- Fast navigation between pages
- Smooth scrolling performance
- Efficient memory usage
```

## 🔌 **API Endpoints Integration**

### **Public Endpoints**
```
- GET /api/ - Health check
- GET /api/products - Product listing
- GET /api/products/:id - Product details
- POST /api/orders - Create order
```

### **Protected Endpoints (Admin)**
```
- POST /api/auth/register - Admin registration
- POST /api/auth/login - Admin login
- POST /api/products - Create product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product
- GET /api/orders - List orders
- PUT /api/orders/:id - Update order status
- GET /api/orders/export/csv - Export orders
- POST /api/upload - Upload images
```

### **Integration Requirements**
```
- Real-time data synchronization
- Optimistic updates for better UX
- Error handling with retry mechanisms
- Loading states for all operations
- Offline support with local storage
```

## 🎨 **Design System Components**

### **Button System**
```
- Primary: Solid, high-contrast buttons
- Secondary: Outlined buttons
- Ghost: Transparent buttons
- Danger: Red buttons for destructive actions
- Success: Green buttons for positive actions
- Loading: Buttons with spinner states
- Disabled: Inactive button states
```

### **Form Components**
```
- Text inputs with floating labels
- Select dropdowns with custom styling
- Checkboxes and radio buttons
- File upload with drag & drop
- Form validation with real-time feedback
- Error states with helpful messages
```

### **Navigation Components**
```
- Sticky header with smooth transitions
- Mobile hamburger menu with animations
- Breadcrumb navigation
- Pagination with smooth transitions
- Search bar with suggestions
```

### **Card Components**
```
- Product cards with hover effects
- Information cards with icons
- Testimonial cards with avatars
- Feature cards with animations
- Pricing cards with comparisons
```

## 🌟 **Special Effects & Animations**

### **3D Effects**
```
- Card hover with 3D transforms
- Parallax scrolling effects
- Depth-based shadows
- Perspective transforms
- Interactive 3D elements
```

### **Particle Effects**
```
- Floating background particles
- Confetti for celebrations
- Sparkle effects for interactions
- Smoke effects for transitions
- Fireworks for achievements
```

### **Loading Animations**
```
- Skeleton screens with shimmer
- Progress bars with animations
- Spinner variations
- Loading dots with timing
- Custom branded loaders
```

## 📊 **Data Visualization**

### **Charts & Graphs**
```
- Sales analytics with interactive charts
- Order status distribution
- Revenue trends over time
- Customer demographics
- Product performance metrics
```

### **Interactive Elements**
```
- Hover tooltips with data
- Click interactions for details
- Zoom and pan capabilities
- Real-time data updates
- Animated data transitions
```

## 🔄 **State Transitions**

### **Page Transitions**
```
- Fade in/out between pages
- Slide transitions for navigation
- Scale transitions for modals
- Morphing transitions for forms
- Staggered element animations
```

### **Component States**
```
- Loading to loaded transitions
- Error to success states
- Empty to populated states
- Hover to active states
- Focus to blur states
```

## 📱 **Progressive Web App Features**

### **Offline Support**
```
- Service worker for caching
- Offline-first design approach
- Local storage for data
- Background sync capabilities
- Push notifications
```

### **Installation**
```
- Add to home screen prompt
- App-like experience
- Native app feel
- Fast loading times
- Smooth animations
```

---

## 🎯 **Final Implementation Instructions**

Use this comprehensive prompt with v0.dev to create the most beautiful, modern, and user-friendly frontend for Adunni Foods. Ensure every detail is implemented with the highest quality standards, incorporating all the specified animations, design systems, and user experience principles.

The final result should be a website that:
- **Wows users** with its beauty and smoothness
- **Functions perfectly** with all API endpoints integrated
- **Performs excellently** on all devices and networks
- **Accessible to everyone** with proper compliance
- **Sets new standards** for food ordering websites

Make this the **best frontend ever built** for a food business! 🚀✨

---

## 📝 **Usage Instructions**

1. **Copy this entire prompt** into v0.dev
2. **Follow each section** meticulously
3. **Implement all features** as specified
4. **Test thoroughly** on all devices
5. **Optimize performance** for production
6. **Ensure accessibility** compliance
7. **Create something extraordinary** that exceeds expectations

**Remember**: This is not just a website - this is a masterpiece that will set new standards for food business frontends! 🎨🚀
