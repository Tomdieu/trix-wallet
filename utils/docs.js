const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
    info: {
      version: '3.0.0',
      title: 'Trix Wallet',
      description:"This is an API application made with Express and documented with Swagger",
      license: {
        name: 'MIT',
        url: 'http://example.com',
      },
      contact: {
        name: 'Ivantom',
        url: 'http://github.com/tomdieu',
        email: 'ivantomdio@gmail.com',
      },
    },
    security: {
      BasicAuth: {
        type: 'http',
        scheme: 'basic',
      },
      BearerAuth:{
        type:'http',
        scheme:'bearer'
      }
    },
    // Base directory which we use to locate your JSDOC files
    baseDir: __dirname,
    // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
    filesPattern: '../**/*.js',
    // URL where SwaggerUI will be rendered
    swaggerUIPath: '/api-docs',
    // Expose OpenAPI UI
    exposeSwaggerUI: true,
    // Expose Open API JSON Docs documentation in `apiDocsPath` path.
    exposeApiDocs: false,
    // Open API JSON Docs endpoint.
    apiDocsPath: '/v3/api-docs',
    // Set non-required fields as nullable by default
    notRequiredAsNullable: false,
    // You can customize your UI options.
    // you can extend swagger-ui-express config. You can checkout an example of this
    // in the `example/configuration/swaggerOptions.js`
    swaggerUiOptions: {},
    // multiple option in case you want more that one instance
    multiple: true,
  };


const Setup = (app) => {
    return expressJSDocSwagger(app)(options);
}

module.exports = Setup