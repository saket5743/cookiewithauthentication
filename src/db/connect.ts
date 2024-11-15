import mongoose from "mongoose";

const URL = "mongodb+srv://user:root1234@cluster0.oqq1mdt.mongodb.net/cookiewithauthentication?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = () => {
  return mongoose.connect(URL)
}

export default connectDB;