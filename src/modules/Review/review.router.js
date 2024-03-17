import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import UserReview from "../Review/review.controlller";
const router = Router();

router.post('/',
    auth([systemRoles.USER]),
    expressAsyncHandler(UserReview.addReview))
router.delete('/', auth(), expressAsyncHandler(UserReview.deleteReview))
router.get('/', auth(), expressAsyncHandler(UserReview.getReviews))

