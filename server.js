const express= require("express")

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("App is Running");
})

app.listen(PORT, ()=> {
    console.log(`App is running on ${PORT}`);
})