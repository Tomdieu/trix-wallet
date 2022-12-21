const express = require("express");
const cron = require("node-cron");
// const swaggerDoc = require('./utils/swagger')

const routes = require("./routes");
const { cancelAllWithdrawals } = require("./tasks");

require("./models");

const app = express();

// parse json
app.use(express.json());

//parse form data
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT | 5000;

app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome To My Nodejs TrixWallet API</h1>");
});


// run automatic tasks
cron.schedule("*/15 * * * * *",() => {
  // cancel all the withdrawals

  cancelAllWithdrawals().then(()=>{})
});

app.listen(PORT, async () => {
  console.log(`Server running on PORT ${PORT} at http://127.0.0.1:${PORT}`);
  
  // swaggerDoc(app,PORT)
});
