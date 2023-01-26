const express = require('express'); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const dotenv = require('dotenv'); 
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const userRoute = require('./routes/users');

const app = express();
dotenv.config(); 


app.use(cors());
app.use(express.json());

//All Api routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);

//MongoDB connect
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}). then(() => {
    console.log("MongoDB connceted successfully")
}).catch((err) => {
    console.log(err.message);
})

const PORT = process.env.PORT || 9000;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})
module.exports = app;
