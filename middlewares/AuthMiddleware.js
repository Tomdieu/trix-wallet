const AuthMiddleWare = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    res.status(400).send({ success: false, message: "Authorization require" });
  } else {
    const [_, token] = req.headers["authorization"].split(" ");
    if ((_ !== "token" && !token) || _ !== "Bearer" || !token) {
      res
        .status(400)
        .send({ success: false, message: "Authorization required" });
    } else {
      const { Token, User } = require("../models/");
      const tk = await Token.findOne({ where: { key: token } });
      if (tk) {
        const user = await User.findByPk(tk.user_id);
        req.user = user;
        // const authenticated_user = user.toJSON();
        // req.user = authenticated_user;
        next();
      } else {
        res
          .status(400)
          .send({ success: false, message: "Please provide a valid token" });
      }
    }
  }
};

module.exports = AuthMiddleWare;
