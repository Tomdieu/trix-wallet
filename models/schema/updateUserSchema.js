const { User } = require("../");
const { checkSchema,check} = require("express-validator");

const updateUserSchema = {
    id:{
      notEmpty:true,
      errorMessage:'user id require',
      custom:{
        options:async (value)=>{
          if(value){
            const user = await User.findByPk(value)
            if(!user){
              return Promise.reject('user id doesn\'t exixts')
            }
          }
        }
      }
    },
    username: {
      custom: {
        options: async (value,{req}) => {
          if(value){
            const user = await User.findOne({ where: { username: value } });
            if (user != null && user.id !== req.user.id)  {
              return Promise.reject("username already exists");
            }
          }
        },
      },
    },
    first_name: {
      errorMessage: "first_name required",
    },
    email: {
      custom:{
        options:async (value)=>{
          if(value){
            if(!/^([A-Za-z0-9\.-]+)@([A-Za-z0-9\.-]+)\.([A-Za-z]+){2}$/.test(value)){
              return Promise.reject('invalid email')
            }
          }
        }
      }
    },
    phone_number: {
      // custom:{
      //   options: async (value)=>{
      //     if(value!==undefined){
      //     console.log(value)
      //       console.log(check('phone_number','invalid phone number'))
      //       return check('phone_number','invalid phone number').isMobilePhone()
      //     }
      //   }
      // },
      // errorMessage: "phone number required",
    }
  };


module.exports = checkSchema(updateUserSchema)