const fs = require("fs")
const path = require("path")
const express = require("express")
require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userRoute = require("./users/route")
const userModel = require("./model/user")
const {connectToDataBase} = require("./config/mongoose")
const session = require("express-session")
const cron = require("node-cron")
const flash = require("connect-flash")

const {sendEmail} = require("./utils/nodemailer")
const {DateTime} = require("luxon");
const user = require("./model/user");


const PORT = process.env.PORT  

const app = express()

connectToDataBase()

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "html")
app.set("views", "views")

app.use(cookieParser());
app.use(session({
  secret:"ellahhh57",
  cookie:{maxAge:60000},
  resave:true,
  saveUninitialized:true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(flash())

app.use("/users", userRoute)
app.use("/public", express.static("public"))


app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.get("/createUser", (req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'createUser.html'));
})


cron.schedule("47 21 * * *", async ()=>{
    const users = await userModel.find({username:username})
    const imagePath = path.join(__dirname, 'public', 'wishes.png');
    for(const user of users){
        if(user.dob.getMonth() + 1 === new Date(Date.now()).getMonth() + 1 && user.dob.getDate() === new Date(Date.now()).getDate()){
            const option = {
                email:user.email,
                subject:`Happy birthday ${user.username}`,
                html:`<div style = "background-color:pink; padding:16px;border-radius:20px; color:black">
                <img src="${imagePath}" alt="logo" style="width:50px;height:50px; margin:10px auto 20px">
                <p style="font-size:18px">Hi, ${user.username}</P>
                        <p style="font-size:18px">We congratulate you for adding another year today <b>${DateTime.now().toFormat('LLL d, yyyy')}.</b></p>
                        <h3>We got an inspirational quote for you;</h3>
                        <p style="font-size:18px">Happy birthday to you.</P>
                    </div>`,
            }

            sendEmail(option)
        }
    }
})

app.get("*", (req,res)=>{
    res.render("pageNotFound")
    
})

app.use((err, req, res, next)=>{
    const message = err.message
    res.render("error", {message})
    
})

app.listen(PORT, ()=>{
    console.log(`app is listening at http://localhost:${PORT}`)
})