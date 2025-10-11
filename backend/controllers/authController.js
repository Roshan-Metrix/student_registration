import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createDB from '../config/connection.js';

// Register New User 
export const registerUser = async (req, res) => {
    const { name, email, dept, password } = req.body;

    if (!name || !email || !password || !dept) {
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
            'INSERT INTO users (name, email, dept, password) VALUES (?, ?, ?, ?)',
            [name, email, dept, hashedPassword]
        );

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

        const token = jwt.sign({ id: user.id,role: user.role}, process.env.JWT_SECRET, { expiresIn: '7d' });

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

// Reset User Password (Admin)
export const resetPassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email) return res.json({ success: false, message: 'Email is required' });
    if (!oldPassword) return res.json({ success: false, message: 'Previous Password required' });
    if (!newPassword) return res.json({ success: false, message: 'New Password required' });

    try {
        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Find user by email
        const [userRows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }
        const user = userRows[0];

        // Compare password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Password' });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP fields
        await db.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashPassword, email]
        );

        return res.json({ success: true, message: 'Password has been reset successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete Own Account
export const deleteOwn = async (req,res) => {
   
    try {
        // userId fetching from token (from middleware)
        const userId = req.userId;

        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Fetch user by ID
        const [userRows] = await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: "Account deleted successfully" });

    } catch (error) {
        console.log("Error in deleteUser controller",error)
        res.json({ success: false, message: error.message });
    }
}

// Get All Users (Admin Only)
export const getAllUsers = async (req,res) => {
    try {
        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        const [userRows] = await db.execute('SELECT * FROM users'); 

        return res.json({ success: true, users: userRows.map(user => ({ id: user.id, name: user.name, email: user.email, dept:user.dept ,role: user.role })) });
    } catch (error) {
        console.log("Error in getAllUsers controller",error)
        res.json({ success: false, message: error.message });
    }
}

// DELETE /api/auth/delete/:id (Admin Only)
export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const db = (await createDB.getConnection)
      ? await createDB.getConnection()
      : await createDB();

    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "User deleted successfully" });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.json({ success: false, message: error.message });
  }
};

// session
export const getLoggedInUserData = async (req, res) => {
  try {
    const userId = req.userId; // extracted from JWT or session middleware

    const db =
      (await createDB.getConnection)
        ? await createDB.getConnection()
        : await createDB();

    const [userRows] = await db.execute(
      "SELECT name, email, role, dept FROM users WHERE id = ?",
      [userId]
    );

    if (!userRows.length)
      return res.json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      userData: userRows[0],
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.json({ success: false, message: error.message });
  }
};
