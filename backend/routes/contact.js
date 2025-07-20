import express from 'express';
import { createContactMessage, getContactMessages } from '../controllers/contactMessageController.js';

const router = express.Router();

// Anyone can send a message
router.post('/', createContactMessage);
// Admin can view all messages
router.get('/', getContactMessages);

export default router; 