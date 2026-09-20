import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './utils/db.js';
import User from './models/User.js';

await connectDB();

const adminEmail = 'admin@phoneshop.com';
const adminPassword = 'admin123';
const adminUsername = 'Admin';

console.log('🔍 Checking for existing admin...');
let admin = await User.findOne({ email: adminEmail });

if (admin) {
  admin.role = 'admin';
  admin.password = adminPassword; // Pre-save hook will hash it
  await admin.save();
  console.log(`✅ Admin account updated successfully!`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
} else {
  admin = await User.create({
    username: adminUsername,
    email: adminEmail,
    password: adminPassword,
    role: 'admin'
  });
  console.log(`✅ Admin account created successfully!`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
}

process.exit(0);
