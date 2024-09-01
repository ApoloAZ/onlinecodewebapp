import express from "express"
import dotenv from "dotenv"
import http from "http"

dotenv.config()
const app = express()

app.get("/", (req, res) => {
    res.send("hello from server!")
})

http.createServer(app).listen(process.env.PORT, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`)
})