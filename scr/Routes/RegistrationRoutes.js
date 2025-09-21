import express from 'express';
import { registerUser } from '../controllers/RegistrationController.js';
import { upload } from '../middlewares/multer.js';
// import { registerUser } from '../controllers/RegistrationController.js';

const router = express.Router();

// router.post('/register',registerUser );
// when user have to add img or  profile img
// router.route('/register',upload.fields([
//     {
//         name:'avatar',
//         maxCount:1,

//     },
//     {
//         name:'coverImage',
//         maxCount:1
//     }
// ]),registerUser)



router.route('/register',registerUser)


export default router;
