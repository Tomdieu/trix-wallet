const { checkSchema} = require("express-validator");

const pendingWithdrawal = {
    id:{
        notEmpty: true,
        errorMessage:'withdrawal id require',
        custom:{
            options:async (value,{req}) => {
                console.log(value,' enter')
                if(value){
                    const {Transaction,User, Account} = require('../');
                    const {Op} = require('sequelize')
                    const user = await User.findOne({ where:{id:req.user.id},include:Account})
                    
                    const minutes = 2
                    
                    const pending_withdrawal = await Transaction.findOne({
                        where:{
                            id:value,
                            status:'PENDING',
                            type:'WITHDRAW',
                            sender:user.account.id,
                            created_at:{
                              [Op.lte]:new Date(),
                              [Op.gte]:new Date(new Date() - minutes * 60 * 1000)
                            },
                          },
                          order:[['created_at','DESC']]
                    })

                    if(!pending_withdrawal){
                        return Promise.reject(`withdrawal with id ${value} not found`)
                    }

                }
            }
        }
    }
}

module.exports = checkSchema(pendingWithdrawal)