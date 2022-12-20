const IsAgentMiddleware = async (req, res, next) => {
    const user = req.user;
    const {Account} = require('../models')
    const user_account = await Account.findOne({where:{user_id:user.id}})
    console.log(user_account)
    if (user_account?.is_agent) {
      return next();
    } else {
      res
        .status(400)
        .send({ success: false, error: true, message: "Not allowed" });
    }
  };
  
  module.exports = IsAgentMiddleware;
  