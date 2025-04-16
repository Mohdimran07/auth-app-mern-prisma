import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  console.log("[token]:", token);

  if (!token) {
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode", decoded);
    if (!decoded) {
      res
        .status(400)
        .json({ error: true, message: "Unauthorized - invalid Token!" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: true, message: "Not authorized" });
  }
};

export default protect;
