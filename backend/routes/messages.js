import express from 'express'
import { allMessages, sendMessage } from '../controllers/messages.js'
import protect from '../middleware/auth.js'

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

export default router;