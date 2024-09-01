import express from "express"
import dotenv from "dotenv"
import http from "http"
import cors from "cors"
import mongoose from "mongoose"
import { CodeBlock } from "./model/CodeBlock.js"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit()
    }
}

connectDB()

/* const a = new CodeBlock({title:"aaa", current_code:"bbb", solution_code:"ccc"})
await a.save() */

const d = async () => {
    const codeblocks = await CodeBlock.find()
    return codeblocks
}

const codeblocks = await d()
console.log(codeblocks)

app.get("/", (req, res) => {
    res.send(codeblock)
})

app.put("/", (req, res) => {
    var data = req.body.codeblock
    res.send()
})

http.createServer(app).listen(process.env.PORT, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`)
})