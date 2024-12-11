import express from "express";
import { signup, login, logout, resendMail, mailVerification } from "../controllers/auth.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signup); // input name="username" name="email" name="password" name="confirmPassword
router.post("/login", login); // input name="username" name="password"
router.post("/logout", logout);
router.post("/verification-email", protectRoute, resendMail) // L'utilisateur demande à renvoyer un mail pour le vérifier, on peut renvoyer un mail que si l'utilisateur est connecté
router.get("/verification-email/:token", mailVerification) // L'utilisateur clique sur le lien du mail pour vérifier son email
export default router;