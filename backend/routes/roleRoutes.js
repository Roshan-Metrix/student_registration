import express from 'express';
import multer from 'multer';
import userAuth from '../middleware/userAuth.js'
import { allStudentsData, deleteStudent, storeExtraStudentData, studentDetail, updateExtraStudentData, updateStudentDetail, viewStudentData } from '../controllers/rolesController.js';
// import adminAuth from '../middleware/adminAuth.js';

// multer setup for photo
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, "uploads/");
    },
    filename: function (req,file,cb){
        const uniqueName = Date.now() + "-" + file.originalname.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9._-]/g, "");

        cb(null,uniqueName);
    }
}); // store image in memory as buffer
const upload = multer({ storage });

const roleRouter = express.Router();

roleRouter.post('/students',userAuth,upload.single('photo'),studentDetail);
roleRouter.post('/students/moreData/:student_uid',userAuth,storeExtraStudentData);
roleRouter.get('/getStudentsData',userAuth,allStudentsData);
roleRouter.get('/viewStudentData/:student_uid', userAuth, viewStudentData);
roleRouter.put('/updateStudentData/:student_uid', userAuth,upload.single('photo'), updateStudentDetail);
roleRouter.put('/updateExtraStudentData/:student_uid', userAuth, updateExtraStudentData);
roleRouter.delete('/deleteStudent/:student_uid', userAuth, deleteStudent);

export default roleRouter;