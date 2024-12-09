import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: parseInt(process.env.PORT_MAIL),
    secure: true, // use SSL
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD
    }
  })

  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.MAIL,
    ...options
  }

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent : " + info.response)
    return true
  } catch (error) {
    console.log("Error mail : " + error)
    return false
  }
}

export default sendMail
