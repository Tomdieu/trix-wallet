const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version } = require("../package.json");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TrixWallet API with Swagger",
      version: version,
      description:
        "This is an API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "ivantom",
        url: "https://github.com/tomdieu",
        email: "ivantom@gmail.com",
      },
    },
    components: {
      secutitySchemas: {
        ApiKeyAuth: {
          type: "http",
          schema:"token",
          in: "header",
          name: "Authorization",
        },
      },
    },
    security:[
        {
          ApiKeyAuth: []
        }
    ],
    servers: [
      {
        description: "Development server",
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ['http://localhost:5000/api',"../index.js",'../routes/index.js',"../routes/auth/user.js","../routes/momo/account.js","../models/schema/*.js"],
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