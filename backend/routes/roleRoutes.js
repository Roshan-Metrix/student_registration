import express from 'express';
import userAuth from '../middleware/userAuth.js'
import { allStudentsData, deleteStudent, studentDetail, updateStudentDetail, viewStudentData } from '../controllers/rolesController.js';
// import adminAuth from '../middleware/adminAuth.js';

const roleRouter = express.Router();

roleRouter.post('/students',userAuth,studentDetail);
roleRouter.get('/getStudentsData',userAuth,allStudentsData);
roleRouter.get('/viewStudentData/:student_uid', userAuth, viewStudentData);
roleRouter.post('/updateStudentData/:student_uid', userAuth, updateStudentDetail);
roleRouter.get('/deleteStudent/:student_uid', userAuth, deleteStudent);

export default roleRouter;