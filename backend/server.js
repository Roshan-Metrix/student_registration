import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';

import createDB from './config/connection.js';
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js';
import roleRouter from './routes/roleRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
createDB();
const allowedOrigins = process.env.FRONTEND_URI;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API Endpoints
app.get('/',(req,res) => {
    res.send('API Working');
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/roles',roleRouter)

app.listen(port,() => {
    console.log(`Server is running at ${port}`)
})
