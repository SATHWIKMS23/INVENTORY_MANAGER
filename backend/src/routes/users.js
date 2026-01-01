import express from 'express';
import { login, logout, signup } from '../controllers/usersController.js';

const router = express.Router();

router.get("/" , (req,res) =>{
    res.json({messege : "Users"})
})

router.post('/signup',signup);
router.post('/login' , login);
router.post('/logout' , logout);

export default router;