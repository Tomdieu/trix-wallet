const { checkSchema} = require("express-validator");

const loginSchema = {
    username:{
        notEmpty:true,
        errorMessage:"username required"
    },
    password:{
        notEmpty:true,
        errorMessage:"password required"
    }
}


module.exports = checkSchema(loginSchema)