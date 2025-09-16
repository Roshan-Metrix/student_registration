import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    // decode & store token
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodeToken && decodeToken.role === "admin") {
      req.role = "admin";
    } else {
      return res.json({
        success: false,
        message: "Not Authorized. Admin access required.",
      });
    }

    next();
  } catch (error) {
    console.log("Error in adminAuth middleware", error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
