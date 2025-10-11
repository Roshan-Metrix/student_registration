import express from 'express';
import { registerUser,loginUser,logoutUser, resetPassword, getAllUsers, deleteUserByAdmin, deleteOwn, getLoggedInUserData } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js'
import adminAuth from '../middleware/adminAuth.js';

const authRouter = express.Router();

authRouter.post('/register',userAuth,adminAuth,registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/reset-password',userAuth,resetPassword);
authRouter.delete('/user/delete', userAuth,deleteOwn);
authRouter.delete('/user/admin/delete/:id', userAuth,adminAuth,deleteUserByAdmin);
authRouter.get('/all-users', userAuth,adminAuth,getAllUsers);
authRouter.get('/is-auth', userAuth,getLoggedInUserData);


export default authRouter;

