import express from 'express';
import { registerUser,loginUser,logoutUser, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword, deleteUser } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js'

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/send-verify-otp', userAuth,sendVerifyOtp);
authRouter.post('/verify-account', userAuth,verifyEmail);
authRouter.get('/is-auth', userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password', resetPassword);
<<<<<<< HEAD
authRouter.delete('/user/delete', userAuth,deleteUser);
=======
>>>>>>> e87781ca56b4ef120b138ba52d5bb9b5634791cc

export default authRouter;

