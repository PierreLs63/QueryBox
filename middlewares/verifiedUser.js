const userVerified = async (req, res, next) => {
    try {
      const user = req.user
      if (!user.isVerified) {
        return res.status(401).json({ error: "Unauthorized - User not verified" })
      }
      
      next()
    } catch (error) {
      console.log("Error in userVerified : ", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
  
export default userVerified