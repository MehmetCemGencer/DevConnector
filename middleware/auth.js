const jwt = require("jsonwebtoken");
const config = require("config");

//next is the callback will run when we are done
//and moves on to next piece of middleware
module.exports = (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token"); //header key that we send along with the token in

  //Check if no token
  if (!token) {
    //401 is unauthorized
    return res.status(401).json({ msg: "No token,authorization denied" });
  }

  //Verify token
  try {
    //decode token
    const decoded = jwt.verify(token, config.get("jwtSecret")); //verify get token and secret to decrypt
    /* This is the decoded
    {
       user: { id: '5e850374ed3b2a44fca62f91' },
       iat: 1585775476,
        exp: 1586135476
    }*/
    //when we create jwt in payload we sent user.id now we decode it and assign it
    //to the user.Now req object has a user and can access it
    //in the /api/auth
    req.user = decoded.user; //attached user in the payload with the id
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
//Because token already sent we dont have to await it
