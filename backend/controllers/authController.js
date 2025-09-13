import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createDB from '../config/connection.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE, WELCOME_TEMPLATE,PASSWORD_RESET_SUCCESSFULLY_TEMPLATE } from '../config/emailTemplates.js';

// Register User 
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Check if user already exists
        const [existingUserRows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUserRows.length > 0) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // Get the inserted user
        const [userRows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = userRows[0];

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Sending Welcome Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome To Authentication App',
            html: WELCOME_TEMPLATE.replace("{{email}}", user.email)
        };
        await transporter.sendMail(mailOptions);

        return res.json({ success: true,message: 'User registered successfully' });

    } catch (error) {
        console.error('Error in registerUser controller:', error);
        res.json({ success: false, message: error.message });
    }
}

// Login User
export const loginUser = async (req,res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and Password are required' });
    }

    try {
        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Find student by email
        const [userRows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        const user = userRows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Password' });
        }

        const token = jwt.sign({ id: user.id,role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true,message: 'Logged in successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Logout User
export const logoutUser = async (req, res) => {
    try{
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success:true,message:"Logged Out"});
    } catch (error) {
        return res.json({ success:false,message:error.message });
    }
}

// Send OTP to Email
export const sendVerifyOtp = async (req,res) => {
    // Send Verification OTP to the User's Email
    try {
        // userId fetching from token (from middleware)
        const userId = req.userId;

        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Fetch user by ID
        const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }
        const user = userRows[0];

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account Already verified" });
        }

        // Generate 6 digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        // Update user with OTP and expiry
        await db.execute(
            'UPDATE users SET verifyOtp = ?, verifyOtpExpireAt = ? WHERE id = ?',
            [otp, otpExpireAt, userId]
        );

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification Otp',
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: "Verification Otp sent in email" });

    } catch (error) {
        console.log("Error in sendVerifyOtp controller",error)
        res.json({ success: false, message: error.message });
    }
}

// Verify the Email using OTP
export const verifyEmail = async (req, res) => {
    const userId = req.userId;
    const { otp } = req.body;

    if (!userId) return res.json({ success: false, message: 'Not Authorized, Please login again' });
    if (!otp) return res.json({ success: false, message: 'Missing Details' });

    try {
        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Fetch user by ID
        const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }
        const user = userRows[0];

        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid Otp' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'Otp Expired' });
        }

        // Update user as verified and clear OTP fields
        await db.execute(
            'UPDATE users SET isAccountVerified = ?, verifyOtp = ?, verifyOtpExpireAt = ? WHERE id = ?',
            [true, '', 0, userId]
        );

        return res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Check if user is Authenticated
export const isAuthenticated = async (req,res) => {
    try{
        res.json({success:true});
    } catch(error){
        res.json({success:false,message:error.message});
    }
}

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is Required' });
    }

    try {
        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Find user by email
        const [userRows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }
        const user = userRows[0];

        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpireAt = Date.now() + 15 * 60 * 1000;

        // Update user with OTP and expiry
        await db.execute(
            'UPDATE users SET resetOtp = ?, resetOtpExpireAt = ? WHERE email = ?',
            [otp, otpExpireAt, email]
        );

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };
        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Reset User Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email) return res.json({ success: false, message: 'Email is required' });
    if (!otp) return res.json({ success: false, message: 'OTP is required' });
    if (!newPassword) return res.json({ success: false, message: 'Password is required' });

    try {
        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Find user by email
        const [userRows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }
        const user = userRows[0];

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP fields
        await db.execute(
            'UPDATE users SET password = ?, resetOtp = ?, resetOtpExpireAt = ? WHERE email = ?',
            [hashPassword, '', 0, email]
        );

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset Successfully',
            html: PASSWORD_RESET_SUCCESSFULLY_TEMPLATE.replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: 'Password has been reset successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}