import 'dotenv/config';
import dns from 'dns';
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
import mongoose from 'mongoose';
import Product from './models/Product.js';
import { phonesData } from './data/phones-data.js';

const importData = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Xóa toàn bộ sản phẩm cũ
    await Product.deleteMany({});
    console.log('🗑️  Đã xóa toàn bộ sản phẩm cũ');

    // Import dữ liệu mới
    await Product.insertMany(phonesData);
    console.log(`✅ Đã import thành công ${phonesData.length} sản phẩm mới!`);

    console.log('🎉 Hoàn tất! Database đã được cập nhật.');
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

importData();
