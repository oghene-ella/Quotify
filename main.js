const path = require("path")
const express = require("express")
require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userRoute = require("./users/route")
const userModel = require("./model/user")
const {connectToDataBase} = require("./config/mongoose")
const cron = require("node-cron")

const {sendEmail} = require("./utils/nodemailer")
const {DateTime} = require("luxon");

const PORT = process.env.PORT  

const app = express()

connectToDataBase()

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs")
app.set("views", "views")

app.use(cookieParser());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/user", userRoute)
app.use("/public", express.static("public"))


app.get("/", (req,res)=>{
    res.render("index");
})

app.get("/createUser", (req,res)=>{
    res.render("createUser");
})


cron.schedule("00 07 * * *", async () => {
    try {
        // Calculate start and end of today: also calculate 6 hours behind what's on the db
        const now = DateTime.utc().minus({ hours: 6 });
        const todayStart = now.startOf('day');
        const todayEnd = now.endOf('day');

        // console.log(todayStart.toISO(), todayEnd.toISO());

        // Find users whose birthday matches today
        const users = await userModel.find({
            dob: {
                $gte: todayStart,
                $lte: todayEnd
            }
        });

        // console.log(users)

        if (users.length === 0) {
            console.log("No users with a birthday today.");
            return;
        }

        // Construct email content
        const emailPromises = users.map(user => {
            const option = {
                email: user.email,
                subject: `Happy Birthday ${user.username}`,
                html: 
                `<div style="background-color: #F8F8F8; color: #1e293b; border-radius: 20px;">
                <p style="font-size: 1.125rem; color: #1e293b; font-weight: bold; padding-top: 50px; padding-left: 50px; padding-right: 30px;">Dear ${user.username},</p>
                <p style="font-size: 1.125rem; color: #1e293b; font-weight: semi-bold; padding-left: 50px; padding-right: 30px;">Happy Birthday! 🎉🎂</p>
            
                <p style="font-size: 1.125rem; color: #1e293b; font-weight: light; padding-left: 50px; padding-right: 30px;">
                    On this special day, we want to extend our warmest wishes to you. May your day be filled with joy, laughter, and wonderful memories. As you celebrate another year of life, we want to express our gratitude for being a part of our community. Your presence brightens our days, and we are grateful for the opportunity to share in your journey. Here's to another amazing year ahead filled with success, happiness, and fulfillment. May all your dreams and aspirations come true.
                    <br/>
                    Once again, Happy Birthday! Enjoy your special day to the fullest.
                    <br/>
                    <br/>
                    Best regards,
                    <br/>
                    Ellahhh_Quotify</b>
                </p>
            
                <div style="background-color: #7C3AED; text-align: center; color: #fff; padding:10px; border-radius: 0px 0px 20px 20px; font-size: 1.1rem"> From Birthday_Quotify ❤️ </div>
            </div>`
            };
            return sendEmail(option);
        });

        // Wait for all emails to be sent
        await Promise.all(emailPromises);
        console.log("Birthday emails sent successfully.");
    } catch (error) {
        console.error("Error sending birthday emails:", error);
    }
});

app.get("*", (req,res)=>{
    res.render("error")
    
})

app.use((err, req, res, next)=>{
    const message = err.message
    res.render("error", {message}) 
})

app.listen(PORT, ()=>{
    console.log(`app is listening at http://localhost:${PORT}`)
})