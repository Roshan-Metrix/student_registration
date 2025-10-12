import express from 'express';
import multer from 'multer';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';
import {
  addCoursesAndYears,
  deleteStudent,
  getCoursesAndYears,
  getLoggedInUserData,
  storeExtraStudentData,
  studentDetail,
  updateExtraStudentData,
  updateStudentDetail,
  viewAllStudentsData,
  viewStudentData,
} from '../controllers/rolesController.js';

// multer setup for storing image in memory (as buffer)
const upload = multer({ storage: multer.memoryStorage() });

const roleRouter = express.Router();

roleRouter.post('/students', userAuth, upload.single('photo'), studentDetail);
roleRouter.post('/students/moreData/:student_uid', userAuth, storeExtraStudentData);
roleRouter.get('/getStudentsData', userAuth, viewAllStudentsData);
roleRouter.get('/viewStudentData/:student_uid', userAuth, viewStudentData);
roleRouter.put('/updateStudentData/:student_uid', userAuth, upload.single('photo'), updateStudentDetail);
roleRouter.put('/updateExtraStudentData/:student_uid', userAuth, updateExtraStudentData);
roleRouter.delete('/deleteStudent/:student_uid', userAuth, deleteStudent);
roleRouter.get('/user/data', userAuth, getLoggedInUserData);
roleRouter.get('/get-courses-years', userAuth, getCoursesAndYears);
roleRouter.post('/admin/add-courses-and-years', userAuth, adminAuth, addCoursesAndYears);

export default roleRouter;
