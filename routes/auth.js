import express from "express";
import { signup, login, logout, resendMail, mailVerification } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/resendMail", resendMail)
router.get("/mailVerification/:token", mailVerification)
export default router;