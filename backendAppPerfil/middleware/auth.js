const jwt = require("jsonwebtoken");
const SECRET = "CLAVE_SUPER_SECRETA";

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};
