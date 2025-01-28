import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import sendMail from "../utils/sendMail.js";
import crypto from "crypto";
import validator from "email-validator";
import xss from "xss";
import dotenv from 'dotenv';

dotenv.config();
const baseURL = process.env.BASE_URL || "http://localhost";
const api_version = process.env.API_VERSION || "v1";

export const login = async (req, res) => {
    try {
      const { username, password } = req.body
  
      if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "NoSQL injections doesn't work !" })
      }
      const sanitizedUsername = xss(username.trim())
  
      const user = await User.findOne({ username: sanitizedUsername }).collation({ locale: 'en', strength: 2 })
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user?.password || ""
      )
      if (!user || !isPasswordCorrect) {
        return res
          .status(400)
          .json({ error: "Identifiant ou mot de passe erroné" })
      }
      generateTokenAndSetCookie(res, user._id)
      res
        .status(200)
        .json({
          _id: user._id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified
        })
    } catch (error) {
      console.log("Error in login : ", error.message || "Unknown error occurred")
      res.status(500).json({ error: "Internal server error" })
    }
  }
  
  export const signup = async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body
  
      if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof confirmPassword !== "string"
      ) {
        return res.status(400).json({ error: "Nice try hacker !" })
      }
  
      const usernameRegex = /^[a-zA-Z0-9]*$/
      if (!usernameRegex.test(username)) {
        return res
          .status(400)
          .json({
            error:
              "Le nom d'utilisateur ne doit contenir que des lettres et des chiffres"
          })
      }
  
      if (!validator.validate(email)) {
        return res.status(400).json({ error: "Adresse email invalide" })
      }
  
      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Le mot de passe doit contenir au moins 8 caractères" })
      }
  
      const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
      if (!passwordRegex.test(password)) {
        return res
          .status(400)
          .json({
            error:
              "Le mot de passe ne doit contenir que des lettres, des chiffres et des caractères spéciaux, les espaces sont interdits"
          })
      }
  
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ error: "Les mots de passe ne correspondent pas" })
      }
  
      const user = await User.findOne({ $or: [{ username }, { email }] }).collation({ locale: 'en', strength: 2 })
      if (user) {
        if (user.username.toLowerCase() === username.toLowerCase()) {
          // Username is already in use
          return res.status(400).json({ error: "Nom d'utilisateur déjà utilisé" })
        }
        if (user.email.toLowerCase() === email.toLowerCase()) {
          // Email is already in use
          return res.status(400).json({ error: "Email déjà utilisé" })
        }
      }
  
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      const token = crypto.randomUUID()
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        token: token
      })
  
      if (newUser) {
        await newUser.save()
        generateTokenAndSetCookie(res, newUser._id)

        const clientURL = process.env.CLIENT_URL || "http://localhost:5173";

        const verificationLink = `${clientURL}/verificationEmail/${token}`;
        
        sendMail({
          to: email,
          subject: "Bienvenue sur QueryBox",
          text: "Bienvenue sur QueryBox",
          html:
            `<h1>Bienvenue sur QueryBox</h1><p>Vous avez rejoint la communauté QueryBox avec succès</br /><a href='${verificationLink}'>Cliquez pour vérifier votre email</a></p>`
        })

        res.status(201).json({
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          isVerified: newUser.isVerified
        })
      } else {
        res.status(400).json({ error: "Données utilisateur invalides" })
      }
    } catch (error) {
      console.log("Error in signup: ", error.message || "Unknown error occurred")
      res.status(500).json({ error: "Internal server error" })
    }
  }
  
  export const logout = async (req, res) => {
    try {
      res.clearCookie("jwt")
      res.status(200).json({ message: "Deconnexion avec succès" })
    } catch (error) {
      console.log("Error in logout: ", error.message || "Unknown error occurred")
      res.status(500).json({ error: "Internal server error" })
    }
  }
  
  export const mailVerification = async (req, res) => {
    try {
      const token = req.params.token
      if (!token) {
        return res.status(400).json({ error: "Token invalide" })
      }
      const user = await User.findOne({ token: token })
      if (!user) {
        return res.status(400).json({ error: "Token invalide" })
      }

      if (user.isVerified) {
        return res.status(400).json({ error: "Email déjà vérifié" })
      }

      user.token = null
      user.isVerified = true
      await user.save()
      generateTokenAndSetCookie(res, user._id);
		  res.status(201).json({ _id: user._id, username: user.username, email: user.email, isVerified: user.isVerified});
    } catch (error) {
      console.log("Error in verifyMail : ", error.message || "Unknown error occurred")
      res.status(500).json({ error: error.message || "Internal server error" })
    }
  }

  // Reset password from the login page or the reset password page if the user is already logged in
  export const sendResetPassword = async (req, res) => {
    try {
      const { email } = req.body
      
      if (!email) {
        return res.status(400).json({ error: "Email requis" })
      }

      if (!validator.validate(email)) {
        return res.status(400).json({ error: "Adresse email invalide" })
      }

      const user = await User.findOne({ email: email })
      if (!user) {
        return res.status(400).json({ error: "Aucun utilisateur trouvé avec cet email" })
      }

      if (user.updatedAt.getTime() > Date.now() - 60000) {
        return res
          .status(400)
          .json({
            error: "Veuillez attendre 1 minute avant de renvoyer un mail"
          })
      }

      const token = crypto.randomUUID()
      user.token = token
      await user.save()

      if (!user.isVerified) {
        const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
        const verificationLink = `${clientURL}/verificationEmail/${token}`;
  
        sendMail({
          to: email,
          subject: "Bienvenue sur QueryBox",
          text: "Bienvenue sur QueryBox",
          html:
            `<h1>Bienvenue sur QueryBox</h1><p>Vous avez rejoint la communauté QueryBox avec succès</br /><a href='${verificationLink}'>Cliquez pour vérifier votre email</a></p>`
        })

        return res.status(400).json({ error: "Veuillez vérifier votre email avant de réinitialiser votre mot de passe, un mail vous a été renvoyé" })
      }

      const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
      const resetPasswordLink = `${clientURL}/resetPassword/${token}`;

      sendMail({
        to: email,
        subject: "Réinitialisation du mot de passe",
        text: "Réinitialisation du mot de passe",
        html:
          `<h1>Réinitialisation du mot de passe</h1><p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe</br /><a href='${resetPasswordLink}'>Cliquez pour réinitialiser votre mot de passe</a></p>`
      });

      return res.status(201).json({ message: "Mail de réinitialisation de mot de passe envoyé avec succès" })


    } catch (error) {
      console.log("Error in sendResetPassword : ", error.message || "Unknown error occurred")
      return res.status(500).json({ error: "Internal server error" })
    }
  }

  export const checkTokenPassword = async (req, res) => {
    try {
      const token = req.params.token
      if (!token) {
        return res.status(400).json({ error: "Token invalide" })
      }
      const user = await User.findOne({ token: token })
      if (!user) {
        return res.status(400).json({ error: "Token invalide" })
      }
      return res.status(200).json({ message: "Token valide, vous pouvez réinitialiser le mot de passe" })
    } catch (error) {
      console.log("Error in checkTokenPassword : ", error.message || "Unknown error occurred")
      return res.status(500).json({ error: "Internal server error" })
    }
  }

  export const resetPassword = async (req, res) => {
    try {

      const token = req.params.token
      const {password, confirmPassword } = req.body

      if (!token || !password || !confirmPassword) {
        return res.status(400).json({ error: "Tous les champs sont requis" })
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Le mot de passe doit contenir au moins 8 caractères" })
      }
  
      const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
      if (!passwordRegex.test(password)) {
        return res
          .status(400)
          .json({
            error:
              "Le mot de passe ne doit contenir que des lettres, des chiffres et des caractères spéciaux, les espaces sont interdits"
          })
      }
  
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ error: "Les mots de passe ne correspondent pas" })
      }

      const user = await User.findOne({ token: token })
      if (!user) {
        return res.status(400).json({ error: "Token invalide" })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      user.password = hashedPassword;
      user.token = null;
      await user.save()
      return res.status(201).json({ message: "Mot de passe réinitialisé avec succès" })
    } catch (error) {
      console.log("Error in resetPassword : ", error.message || "Unknown error occurred")
      return res.status(500).json({ error: "Internal server error" })
    }
  }

  
  export const resendMail = async (req, res) => {
    try {
      const user = req.user
  
      if (user.isVerified) {
        return res.status(400).json({ error: "Email déjà vérifié" })
      }
  
      if (user.updatedAt.getTime() > Date.now() - 60000) {
        return res
          .status(400)
          .json({
            error: "Veuillez attendre 1 minute avant de renvoyer un mail"
          })
      }
  
      const token = crypto.randomUUID()
      user.token = token
      await user.save()
  
      const clientURL = process.env.CLIENT_URL || "http://localhost:5173";

      const verificationLink = `${clientURL}/verificationEmail/${token}`;
  
      sendMail({
        to: user.email,
        subject: "Bienvenue sur QueryBox",
        text: "Bienvenue sur QueryBox",
        html:
          `<h1>Bienvenue sur QueryBox</h1><p>Vous avez rejoint la communauté QueryBox avec succès</br /><a href='${verificationLink}'>Cliquez pour vérifier votre email</a></p>`
      })
  
      res.status(201).json({ message: "Email renvoyé avec succès" })
    } catch (error) {
      console.log(
        "Error in resendMail : ",
        error.message || "Unknown error occurred"
      )
      res.status(500).json({ error: "Internal server error" })
    }
  }