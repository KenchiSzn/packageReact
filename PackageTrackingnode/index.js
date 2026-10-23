require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express")
const dotenv = require("dotenv")
const app = express()
const mongoose = require("mongoose")
dotenv.config()
const cors = require("cors")
const UserModel = require("./models/user.model")
app.set("view engine", "ejs")
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())

const userRoutes = require("./routers/user.route")
const packageRoutes = require("./routers/package.route")
const packageHistory = require("./routers/tracking.route")

app.use("/api/v1", userRoutes)
app.use("/api/v1/packages", packageRoutes)
app.use("/api/v1/track", packageHistory)

// app.use((err, req, res, next) => {
//     if (err.type === "entity.parse.failed") {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid JSON request body. Send a valid JSON object.",
//         })
//     }

//     return next(err)
// })


const URI = process.env.DB_URI
mongoose.connect(URI)
    .then(() => {
        console.log("database connected successfully");

    })
    .catch((err) => {
        console.log(err, "cannot connect to db");

    })






const PORT = process.env.PORT;
app.listen(PORT, (err) => {
    if (err) {
        console.log(err)
        console.log("cannot start server at this time");

    } else {
        console.log(`server is running on port ${PORT}`);
    }
})