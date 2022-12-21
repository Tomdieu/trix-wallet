const {Notification,User} = require('../models/')

const getNotifications = async (req,res) =>{
	const user = await User.findOne({where:{id:req.user.id},include:Notification})

	res.status(200).send({success:true,data:user.notification})
}

module.exports = {getNotifications}