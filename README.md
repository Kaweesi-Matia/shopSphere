# ShopSphere - Multi-Vendor E-Commerce Platform

A modern, scalable multi-vendor e-commerce web application built with React, Redux, and Supabase.

## Features

### Customer Features
- Browse products from multiple vendors
- View detailed product information
- Add products to cart
- Manage shopping cart (update quantities, remove items)
- Complete checkout with shipping address
- View order history
- Product search and filtering by category

### Vendor Features
- Vendor registration and approval system
- Product management (create, update, delete)
- Inventory tracking
- Product categorization
- Featured product promotion
- Sales pricing (compare at price)
- Draft/Active/Archived product status

### Admin Features
- Vendor approval and management
- Vendor status control (approve, suspend, reactivate)
- Platform-wide vendor oversight
- Commission rate management

## Tech Stack

### Frontend
- **React 18** - UI library with functional components
- **Redux** - State management using classic Redux pattern
  - Actions
  - Reducers
  - Store with combineReducers
  - Redux Thunk middleware for async operations
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool and dev server

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication
  - Real-time subscriptions

## Architecture

### Redux Store Structure
```
store/
├── auth       - User authentication and profile
├── products   - Product listings and categories
├── cart       - Shopping cart management
├── orders     - Order processing and history
└── vendor     - Vendor profile and product management
```

### Database Schema
- **profiles** - User profiles with role-based access (customer, vendor, admin)
- **vendors** - Vendor business information
- **categories** - Product categories
- **products** - Product catalog
- **cart_items** - Shopping cart storage
- **orders** - Order headers
- **order_items** - Order line items
- **reviews** - Product reviews

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## User Roles

### Customer
- Browse and purchase products
- Manage shopping cart
- Complete orders
- View order history

### Vendor
- Manage product catalog
- Track inventory
- View vendor-specific orders
- Update business information

### Admin
- Approve/reject vendor applications
- Suspend vendor accounts
- Manage platform-wide settings
- Oversee all vendors and products

## Key Features Explained

### Multi-Vendor Support
Each vendor operates independently with their own:
- Product catalog
- Inventory management
- Business profile
- Commission rate

### Role-Based Access Control
Implemented using Supabase RLS policies:
- Customers can only view active products and manage their own cart/orders
- Vendors can only manage their own products
- Admins have full platform access

### Shopping Cart
- Persistent cart storage in database
- Real-time quantity updates
- Automatic calculation of totals, tax, and shipping

### Order Processing
- Complete checkout flow
- Order confirmation
- Multiple payment methods support
- Shipping address management

## Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for protected actions
- Ownership verification for all user actions
- Secure API key management through environment variables

## Development

### Code Structure
- **src/components/** - React components organized by feature
  - auth/ - Authentication components
  - customer/ - Customer-facing components
  - vendor/ - Vendor dashboard components
  - admin/ - Admin dashboard components
  - layout/ - Shared layout components
- **src/redux/** - Redux state management
  - actions/ - Action creators
  - reducers/ - Reducers
  - actionTypes.ts - Action type constants
  - store.ts - Store configuration
- **src/lib/** - Utility libraries and configurations

### Best Practices
- Functional components with hooks
- TypeScript for type safety
- Modular component architecture
- Centralized state management with Redux
- Responsive design with Tailwind CSS

## Future Enhancements
- Product image upload
- Advanced search and filtering
- Product reviews and ratings
- Wishlist functionality
- Vendor analytics dashboard
- Email notifications
- Payment gateway integration
- Multi-language support
- Dark mode

## License
MIT
