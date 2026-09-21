import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import { sendPasswordResetEmail } from '../utils/sendEmail.js';

const cookieName = process.env.COOKIE_NAME || 'jwt';

export const validateRegister = [
  body('username').trim().isLength({ min: 2 }).withMessage('Tên quá ngắn'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')
];

export const validateLogin = [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Thiếu mật khẩu')
];

function setTokenCookie(res, userId) {
  const token = signToken({ id: userId });
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { username, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email đã tồn tại' });
  const user = await User.create({ username, email, password });
  setTokenCookie(res, user._id);
  res.status(201).json({ id: user._id, username: user.username, email: user.email, role: user.role });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
  setTokenCookie(res, user._id);
  res.json({ id: user._id, username: user.username, email: user.email, role: user.role });
}

export async function logout(req, res) {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
  res.json({ message: 'Đã đăng xuất' });
}

export async function me(req, res) {
  res.json(req.user);
}

export async function updateProfile(req, res) {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;
  if (req.body.address) user.address = { ...user.address?.toObject?.(), ...req.body.address };
  await user.save();
  res.json({ id: user._id, username: user.username, email: user.email, role: user.role, address: user.address });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Vui lòng nhập email' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before saving to database
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    // Send email
    const emailResult = await sendPasswordResetEmail(email, resetUrl, user.username);

    if (emailResult.success) {
      console.log('✓ Password reset email sent to:', email);
      res.json({ 
        message: '✓ Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư (và cả thư spam).'
      });
    } else {
      // Email failed but still show success to user (security)
      console.error('✗ Failed to send email:', emailResult.error);
      
      // In dev mode, return the link
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔐 Password Reset Link (dev mode):', resetUrl);
        res.json({ 
          message: 'Link đặt lại mật khẩu đã được tạo (gửi email thất bại - kiểm tra console)',
          resetUrl: resetUrl
        });
      } else {
        res.json({ 
          message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi.'
        });
      }
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
  }
}

export async function resetPassword(req, res) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Thiếu token hoặc mật khẩu' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
  }

  try {
    // Hash the token from URL to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' });
    }

    // Set new password (will be hashed by User model pre-save hook)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.json({ message: 'Đặt lại mật khẩu thành công!' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
  }
}
