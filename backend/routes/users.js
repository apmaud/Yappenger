import express from 'express'
import { allUsers, registerUser, authUser } from '../controllers/users.js'
import protect from '../middleware/auth.js'

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);

export default router;