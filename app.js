require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const mongoose = require("mongoose");
const Sequelize = require("sequelize");
const user = require("./src/users/route");

const app = express();
app.use(cors());
app.use(express.json());

//routes
app.use("/user", user);

//if not found
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(process.env.PORT, () => {
  // // mongodb connection
  // mongoose.connect(`mongodb://localhost:27017/SG-PMT`, (err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("Success Connect to mongoDB Database");
  //   }
  // });

  // sqlite connection
  const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PWD,
    {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      dialect: "mysql",
    },
  );

  sequelize
    .authenticate()
    .then(() => {
      console.log("Success Connect to MYSQL Database");
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("HELLO WORLD FROM " + process.env.PORT);
});
