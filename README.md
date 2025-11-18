# E-Commerce Platform

A modern full-stack e-commerce application with a React frontend and Node.js/Express backend.

🔗 **Live Demo:** [https://e-commerce-seeq.onrender.com](https://e-commerce-seeq.onrender.com)

## 🚀 Features

- **User Authentication**: JWT-based authentication system
- **Product Management**: Full CRUD operations for products
- **Shopping Cart**: Add/remove items with quantity management
- **Coupon System**: Apply discount coupons to orders
- **Payment Integration**: Secure payment processing
- **Analytics Dashboard**: Track sales and performance metrics
- **Responsive UI**: Built with TailwindCSS for all device sizes

## 🛠 Tech Stack

### Frontend
- ⚛️ React 19 with Vite
- 🛣️ React Router v7 for navigation
- 🎨 TailwindCSS for styling
- 🔄 Framer Motion for animations
- 📊 Recharts for data visualization
- 🔔 React Hot Toast for notifications
- 🛒 Shopping cart functionality
- 💳 Stripe integration for payments

### Backend
- 🚀 Node.js with Express
- 🍪 JWT for authentication
- 🗄️ MongoDB with Mongoose
- 🔄 RESTful API architecture
- 🔐 Secure cookie handling
- 📈 Analytics endpoints

## 📦 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Stripe account for payment processing

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce.git
   cd ecommerce
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB and JWT configuration
   npm run dev  # Starts backend server on port 5000
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Update VITE_API_URL to point to your backend (default: http://localhost:5000/api)
   npm run dev
   ```

4. **Access the application**
   - Development:
     - Frontend: http://localhost:5173
     - Backend API: http://localhost:5000

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```



## 📂 Project Structure

```
ecommerce/
├── backend/                # Backend server
│   ├── controllers/       # Route controllers
│   ├── lib/               # Core utilities
│   ├── middlewares/       # Express middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   └── server.js          # Entry point
│
└── frontend/              # Frontend React app
    ├── public/            # Static assets
    └── src/               # Source code
        ├── assets/        # Images, fonts, etc.
        ├── components/    # Reusable UI components
        ├── lib/           # Utility functions
        ├── pages/         # Page components
        └── App.jsx        # Root component
```


### Development Scripts

**Backend**
```bash
npm run dev    # Start development server
npm test       # Run tests
```

**Frontend**
```bash
npm run dev    # Start Vite dev server
npm run build  # Create production build
npm run lint   # Run ESLint
```



Made with ❤️ by Mostafa
