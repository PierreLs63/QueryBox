import express from "express";
import { signup, login, logout, resendMail, mailVerification } from "../controllers/auth.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/resendMail", protectRoute, resendMail)
router.get("/mailVerification/:token", mailVerification)
export default router;