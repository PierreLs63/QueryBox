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
const api_version = process.env.API_VERSION;

export const login = async (req, res) => {
    try {
      const { username, password } = req.body
  
      if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "NoSQL injections doesn't work !" })
      }
      const sanitizedUsername = xss(username.trim())
  
      const user = await User.findOne({ username: sanitizedUsername }).lean()
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
  
      const user = await User.findOne({ $or: [{ username }, { email }] })
      if (user) {
        if (user.username === username) {
          // Username is already in use
          return res.status(400).json({ error: "Nom d'utilisateur déjà utilisé" })
        }
        if (user.email === email) {
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
        // Create a transporter object
        sendMail({
          to: email,
          subject: "Bienvenue sur QueryBox",
          text: "Bienvenue sur QueryBox",
          html:
            `<h1>Bienvenue sur QueryBox</h1><p>Vous avez rejoint la communauté QueryBox avec succès</br /><a href='${baseURL}/mailVerification/` +
            token +
            "'>Cliquez pour vérifier votre email</a></p>"
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
      user.token = null
      user.isVerified = true
      await user.save()
      generateTokenAndSetCookie(res, user._id);
		  res.status(201).json({ _id: user._id, username: user.username, email: user.email, isVerified: user.isVerified});
    } catch (error) {
      console.log("Error in verifyMail : ", error.message || "Unknown error occurred")
      res.status(500).json({ error: "Internal server error" })
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
            error: "Veuillez attendre 1 minute avant de renvoyer un email"
          })
      }
  
      const token = crypto.randomUUID()
      user.token = token
      await user.save()
  
      const port = process.env.PORT;
      const verificationLink = `${baseURL}:${port}/api/${api_version}/mailVerification/${token}`;
  
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