import express from "express";
import { signup, login, logout, resendMail, mailVerification, sendResetPassword, checkTokenPassword, resetPassword } from "../controllers/auth.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signup); // input name="username" name="email" name="password" name="confirmPassword
router.post("/login", login); // input name="username" name="password"
router.post("/logout", logout);
router.post("/verification-email", protectRoute, resendMail) // L'utilisateur demande à renvoyer un mail pour le vérifier, on peut renvoyer un mail que si l'utilisateur est connecté
router.get("/verification-email/:token", mailVerification) // L'utilisateur clique sur le lien du mail pour vérifier son email
router.post("/sendResetPassword", sendResetPassword) // L'utilisateur demande à renvoyer un mail pour réinitialiser son mot de passe, ou envoie un mail si l'utilisateur a pas encore vérifié son email
router.get("/resetPassword/:token", checkTokenPassword) // On vérifie si le token est valide pour réinitialiser le mot de passe
router.post("/resetPassword/:token", resetPassword) // On réinitialise le mot de passe avec le token et le nouveau mot de passe en body
export default router;