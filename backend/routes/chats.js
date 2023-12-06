import express from 'express'
import { getChats, accessChat, createGroupChat, renameGroupChat, removeFromGroupChat, addToGroupChat } from '../controllers/chats'
import protect from '../middleware/auth'

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, getChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroupChat);
router.route("/groupremove").put(protect, removeFromGroupChat);
router.route("/groupadd").put(protect, addToGroupChat);

export default router;