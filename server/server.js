import express from "express"
import dotenv from "dotenv"
import { createServer } from "node:http"
import cors from "cors"
import mongoose from "mongoose"
import { CodeBlock } from "./model/CodeBlock.js"
import { Server } from "socket.io"


dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
const server = createServer(app)
const io = new Server(server, {cors: {origin:"http://localhost:3000"}})
var codeblock = null
var numOfParticipants = 0


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

app.get("/", async (req, res) => {
    const codeblocks = await CodeBlock.find()
    res.send(codeblocks)
})

app.get("/codeblock/:id", async (req, res) => {
    codeblock = codeblock ?? await CodeBlock.findById(req.params.id)
    console.log(codeblock)
    res.send(codeblock)
})

io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`)
    socket.emit("updateRole", (numOfParticipants === 0))
    numOfParticipants++

    io.emit("updateNumOfParticipents", numOfParticipants)

    socket.on("updatedCode", (data) => {
        (data.current_code.replace(/\r\n/g, "\n") === codeblock.solution_code) && io.emit("itsAMatch");
        socket.broadcast.emit("updateCurrentCode", data)
        codeblock.current_code = data.current_code
    })

    socket.on("exit", (data) => {
        if (data) {
            io.emit("releaseStudent")
            codeblock = null 
        }
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
        numOfParticipants--
        io.emit("updateNumOfParticipents", numOfParticipants)
    })
})

server.listen(process.env.PORT, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`)
})