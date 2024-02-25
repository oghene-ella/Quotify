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
const {DateTime} = require("luxon")


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


const wishes = [
    "“Count your life by smiles, not tears.Count your age by friends, not years.Happy birthday”",
    " “Happy birthday! I hope all your birthday wishes and dreams come true.”",
    "“A wish for you on your birthday, whatever you ask may you receive, whatever you seek may you find, whatever you wish may it be fulfilled on your birthday and always. Happy birthday!”",
    "“Another adventure-filled year awaits you. Welcome it by celebrating your birthday with pomp and splendor. Wishing you a very happy and fun-filled birthday!”",
    "“May the joy that you have spread in the past come back to you on this day. Wishing you a very happy birthday!”",
    " “Happy birthday! Your life is just about to pick up speed and blast off into the stratosphere. Wear a seat belt and be sure to enjoy the journey. Happy birthday!”",
    "“This birthday, I wish you abundant happiness and love. May all your dreams turn into reality and may lady luck visit your home today. Happy birthday to one of the sweetest people I’ve ever known.”",
    " “May you be gifted with life’s biggest joys and never-ending bliss. After all, you yourself are a gift to earth, so you deserve the best. Happy birthday.”",
    " “Count not the candles…see the lights they give. Count not the years, but the life you live. Wishing you a wonderful time ahead. Happy birthday.”",
    "“Forget the past; look forward to the future, for the best things are yet to come.”",
    "“Birthdays are a new start, a fresh beginning and a time to pursue new endeavors with new goals. Move forward with confidence and courage. You are a very special person. May today and all of your days be amazing!”",
    "“Your birthday is the first day of another 365-day journey. Be the shining thread in the beautiful tapestry of the world to make this year the best ever. Enjoy the ride.”",
    "“Be happy! Today is the day you were brought into this world to be a blessing and inspiration to the people around you! You are a wonderful person! May you be given more birthdays to fulfill all of your dreams!”",
    " “Happy birthday! May your Facebook wall be filled with messages from people you never talk to.”",
    "“You’re older today than yesterday but younger than tomorrow, happy birthday!”",
    "“You’re older today than yesterday but younger than tomorrow, happy birthday!”"
] 

cron.schedule("47 21 * * *", async ()=>{
    const users = await userModel.find({verified:true})
    const index = Math.floor(Math.random()*wishes.length)
    const imagePath = path.join(__dirname, 'public', 'android-chrome-192x192.png');
    // const image1Base64 = fs.readFileSync(imagePath, 'base64');
    for(const user of users){
        if(user.dateOfBirth.getMonth() + 1 === new Date(Date.now()).getMonth() + 1 && user.dateOfBirth.getDate() === new Date(Date.now()).getDate()){
            const option = {
                email:user.email,
                subject:"Happy birthday",
                html:`<div style = "background-color:pink; padding:16px;border-radius:20px; color:black">
                <img src="${imagePath}" alt="logo" style="width:50px;height:50px; margin:10px auto 20px">
                <p style="font-size:18px">Hi, ${user.userName}</P>
                        <p style="font-size:18px">We congratulate you for adding another year today <b>${DateTime.now().toFormat('LLL d, yyyy')}.</b></p>
                        <p style="font-size:20px"><b>${wishes[index]}</b></p>
                        <h3>We got an inspirational quote for you;</h3>
                        <p style="font-size:20px"><b>"${inspiration.getQuote().text}"</b></p>
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