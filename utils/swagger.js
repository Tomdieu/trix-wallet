const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version } = require("../package.json");

const options = {
  // swaggerDefinition
  definition: {
    // openapi: "3.0.0",
    info: {
      title: "TrixWallet API",
      description:"This is an API application made with Express and documented with Swagger",
      contact: {
        name: "ivantom",
      },
      servers:['http://localhost:5000']
    }
  },
  apis: ["../index.js",'../routes/index.js',"../routes/auth/user.js","../routes/momo/account.js","../models/schema/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app,port)=>{
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.get('/docs.json',(req,res)=>{
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}

module.exports = swaggerDocs