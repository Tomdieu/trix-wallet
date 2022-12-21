/**
 * This function cancel automaticaly all the pending withdrawals expire
 */
const cancelAllWithdrawals = async () => {
    const {Transaction} = require("../models")
    const {Op} = require('sequelize')

    const minute = 2
    
    const pending_withdrawals = await Transaction.findAll({
        where:{
          status:'PENDING',
          type:'WITHDRAW',
          created_at:{
            [Op.lte]:new Date(),
            [Op.lt]:new Date(new Date() - minute*60*1000) 
          },
        },
        order:[['created_at','DESC']]
      })
      // console.log(pending_withdrawals)
      pending_withdrawals?.map(async (trx)=>{
        // trx.status = 'CANCEL';
        await trx.update({status:'CANCEL'})
        
        console.info(`Transaction ${trx.id} Cancel successfully!`)
      })
}

module.exports = {
    cancelAllWithdrawals
}