import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// import Routes Admin
import authAdminRoutes from './admin/routes/authRoutes.js'
import dashboard from './admin/routes/dashboardRoutes.js'
import filmAdminRoutes from './admin/routes/filmRoutes.js'
import cinemaAdminRoutes from './admin/routes/cinema.Routes.js'
import orderRoutes from './admin/routes/orderRoutes.js'
import getUser from './admin/routes/userRoutes.js'
import notification from './admin/routes/notificationRoutes.js'

// import Routes User
import filmRoutes from './user/routes/filmRoutes.js';
import authRoutes from './user/routes/authRoutes.js';
import kursiRoutes from './user/routes/kursiRoutes.js';
import pembayaranRoutes from './user/routes/pembayaranRoutes.js'
import pesananRoutes from './user/routes/pesananRoutes.js'

config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "https://cinemain-admin.up.railway.app",
    "https://cinemain.up.railway.app",
  ],
  credentials: true
}));

app.use(cookieParser());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes Admin
app.use('/admin', authAdminRoutes)
app.use('/admin/dashboard', dashboard)
app.use('/admin/film', filmAdminRoutes)
app.use('/admin/cinema', cinemaAdminRoutes)
app.use('/admin/order', orderRoutes)
app.use('/admin/user', getUser)
app.use('/admin/notification', notification)

// API Routes User
app.use('/film', filmRoutes);
app.use('/auth', authRoutes);
app.use('/kursi', kursiRoutes);
app.use('/pembayaran', pembayaranRoutes)
app.use('/pesanan', pesananRoutes)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection:', err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('uncaught Exception:', err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
