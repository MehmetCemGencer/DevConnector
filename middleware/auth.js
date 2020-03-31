const jwt = require("jsonwebtoken");
const config = require("config");

//next is the callback will run when we are done
//and moves on to next piece of middleware
module.exports = (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token"); //header key that we send along with the token in

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token,authorization denied" });
  }

  //Verify token
  try {
    //decode token
    const decoded = jwt.verify(token, config.get("jwtSecret")); //verify get token and secret to decrypt

    req.user = decoded.user; //attached user in the payload with the id
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
