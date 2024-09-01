const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ExpenseRoute = require("./routes/expense");
dotenv.config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.use('/expenses', ExpenseRoute);

// Connecting Database 
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database is connected");
}).catch((err) => {
    console.log(err)
})
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})