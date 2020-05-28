const jwt = require("jsonwebtoken");
const accessTokenSecret = "healthy-meal-planner";

// desc     api login for admin
// route    /api/admin/login
// param    username, password

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.query;
    if (username === "admin" && password === "healthymealplanner") {
      const accessToken = jwt.sign(
        {
          username: users[0].username,
        },
        accessTokenSecret
      );
      res.json({ success: true, token: accessToken });
    } else {
        res.json({success: false, message: 'Login failed'});
    }
  } catch (error) {}
};
