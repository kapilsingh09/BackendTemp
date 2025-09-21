import express from 'express';
import { registerUser } from '../controllers/RegistrationController.js';
// import { registerUser } from '../controllers/RegistrationController.js';

const router = express.Router();

// router.post('/register',registerUser );
router.route('/register',registerUser)
export default router;
