const mongoose = require("mongoose");
const env = require("dotenv").config();
const db_connection_string = process.env.DB_connection;
mongoose
  .connect(db_connection_string)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("database is not connected", err);
  });
