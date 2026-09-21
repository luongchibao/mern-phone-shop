import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable trust proxy for Render / Cloudflare reverse proxy (HTTPS & rate-limiter)
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false, // hoặc { policy: 'cross-origin' }
  })
);
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = clientUrl
  .split(',')
  .map((u) => u.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(cleanOrigin) ||
        allowedOrigins.includes('*') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

import Product from './models/Product.js';
import User from './models/User.js';
import { phonesData } from './data/phones-data.js';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Endpoint tự động nạp dữ liệu sản phẩm & tài khoản admin lên MongoDB Atlas
app.get('/api/seed', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    let imported = 0;
    if (count === 0 || req.query.force === 'true') {
      await Product.deleteMany({});
      await Product.insertMany(phonesData);
      imported = phonesData.length;
    }

    let admin = await User.findOne({ email: 'admin@phoneshop.com' });
    if (!admin) {
      admin = await User.create({
        username: 'Admin',
        email: 'admin@phoneshop.com',
        password: 'admin123',
        role: 'admin',
      });
    } else {
      admin.role = 'admin';
      admin.password = 'admin123';
      await admin.save();
    }

    res.json({
      success: true,
      message: `Database đã nạp ${imported || count} sản phẩm và tạo tài khoản Admin thành công!`,
      productsCount: imported || count,
      admin: {
        email: 'admin@phoneshop.com',
        password: 'admin123',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api', reviewRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
