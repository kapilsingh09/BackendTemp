import express from 'express';
import { registerUser } from '../controllers/RegistrationController.js';
import { upload } from '../middlewares/multer.js';
import { logoutUser, userLogin } from '../controllers/AuthController.js';
import { verifyJWT } from '../middlewares/auth.js';
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



router.post('/register',registerUser)

router.route('login').post(userLogin)

router.route("/logout").post(verifyJWT,logoutUser)

export default router;
