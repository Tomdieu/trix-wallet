const AuthMiddleWare = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    res
      .status(400)
      .send({ error: true, message: "Authorization require" });
  } else {
    const [_, token] = req.headers["authorization"].split(" ");
    if (_ !== "token" || !token) {
      res
        .status(400)
        .send({ error: true, message: "Authorization required" });
    } else {
      const { Token, User } = require("../models/");
      const tk = await Token.findOne({ where: { key: token } });
      if (tk) {
        const user = await User.findByPk(tk.user_id);
        const authenticated_user = user.toJSON();
        req.user = authenticated_user;
        next();
      } else {
        res
          .status(400)
          .send({ error: true, message: "Please provide a valid token" });
      }
    }
  }
};

module.exports = AuthMiddleWare