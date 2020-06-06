require('dotenv').config();
const express= require("express")

const dbConnect = require("./DB/DBConnect")
const authRoutes = require("./routes/auth");
const userRoutes= require("./routes/users");
const profileRoutes = require('./routes/profile');
const postRoutes = require("./routes/posts");

const app = express();
dbConnect();

app.use(express.json({
    extended:false
}))

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("App is Running");
})

app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/profile",profileRoutes);


app.listen(PORT, ()=> {
    console.log(`App is running on ${PORT}`);
})