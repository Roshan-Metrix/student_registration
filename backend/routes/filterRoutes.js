import express from 'express'
import { categoryList } from '../controllers/filterController.js';
import userAuth from '../middleware/userAuth.js';

const filterRouter = express.Router();

// Define filter routes here
filterRouter.get('/category/:year',userAuth,categoryList);


export default filterRouter;