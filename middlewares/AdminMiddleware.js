const AdminMiddleware = (req, res, next) => {
  const user = req.user;

  if (user.is_superuser) {
  next();
  } else {
    res
      .status(400)
      .send({ success: false, error: true, message: "Not allowed" });
  }
};

module.exports = AdminMiddleware;
