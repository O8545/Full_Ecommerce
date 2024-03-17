
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import userController from './user.controller.js'
const router = Router();
router.get('/', auth(), expressAsyncHandler(userController.getUserProfile))
router.post('/', auth(), expressAsyncHandler(userController.forgotPassword))
router.post('/', auth(), expressAsyncHandler(userController.resetPassword)) 
router.post('/', auth(), expressAsyncHandler(userController.updatePassword))
router.put('/', auth(), expressAsyncHandler(userController.updateAccount))
router.delete('/', auth(), expressAsyncHandler(userController.deleteAccount))
export default router;


