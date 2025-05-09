const express = require("express");
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const app = express()
require("dotenv").config()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected Successfully"))
    .catch((err) => console.log("DB Connection Failed", err))
const credential = mongoose.model("credential", { user: String, pass: String }, "Bulkmail")

app.get("/",function(req,res){
    res.send("Welcome to API")
})
// Mail Trigger API
app.post("/sendmail", function (req, res) {
    const content = req.body.content
    const subject = req.body.subject
    const emailList = req.body.emailList

    credential.find().then(function (data) {
        const jsonpassData = data[0].toJSON()
        const transport = nodemailer.createTransport(

            {
                service: "gmail",
                auth: {
                    user: jsonpassData.user,
                    pass: jsonpassData.pass
                }
            }
        )
        new Promise(async function (resolve, reject) {
            try {
                for (i = 0; i < emailList.length; i++) {
                    await transport.sendMail(
                        {
                            from: "jovin1261999@gmail.com",
                            to: emailList[i],
                            subject: subject,
                            text: content
                        }
                    )
                }
                resolve("Success")
            }
            catch {
                reject("Failed")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            ressend(false)
        })
    }).catch(function (err) {
        console.log(err)
    })


})

app.listen(5000, function () {
    console.log("Server Started...")
})