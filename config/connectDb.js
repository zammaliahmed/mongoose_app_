const mongoose = require("mongoose");

require("dotenv").config({ path: "./config/.env" });

function connectDb() {
  const uri = process.env.ATLAS_URI ;

  const options = {
    useNewUrlParser: true ,
    useCreateIndex: true ,
    useUnifiedTopology: true
  };

  mongoose.connect(uri, options);
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("Connected to Database Successfully");
  });
}

module.exports = connectDb  ;