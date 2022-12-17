const express = require("express");
const sequelize = require("./utils/database");
const {user} = require('./routes/auth')

require("./models");

sequelize
  .sync()
  .then(() => console.log("Db is ready!"))
  .catch(() => {
    console.log("An Error Occur Could Not Created Tables");
  });

const app = express();

// parse json
app.use(express.json());

//parse form data 
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT | 5000;
console.log(process.env.PORT)

app.use('/user',user);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome To My Nodejs TrixWallet API</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT} at http://127.0.0.1:${PORT}`);
});
