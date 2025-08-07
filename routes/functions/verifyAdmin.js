require("dotenv").config();

const secret = process.env.jwtSecret;

const jwt = require("jsonwebtoken");

const verifyAdmin = async (req, res, next) => {
  try {
    console.log("HEADERS =>>>", req.headers.authorization);
    const token = req.headers.authorization.substring(
      7,
      req.headers.authorization.length
    );
    console.log("TOKEN =>", token);

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.json({ error: "token verification unsuccesul" });
      }
      if (decoded.role === "admin") {
        next();
      } else {
        return res.json({ error: "access denied" });
      }
    });
  } catch (e) {
    console.log(e);
    res.json({ error: "Issue verifying user" });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    console.log("Headers !!!", req.headers);
    const stringToken = req.headers.authorization;
    console.log(stringToken);
    const token = stringToken.substring(7, stringToken.length);
    console.log(token);

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log("ERROR ", err);
        return res.json({ error: "token verification unsuccesul" });
      }
      console.log(decoded);
      if (decoded.role === "admin" || decoded.role === "user") {
        req.userId = decoded.user_id;
        console.log("****", req.userId);
        next();
      } else {
        return res.json({ error: "access denied" });
      }
    });
  } catch (e) {
    console.log(e);
    res.json({ error: "Issue verifying user" });
  }
};

module.exports = { verifyAdmin, verifyUser };
