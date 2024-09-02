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
const codeBlocksSessions = {}
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
    const codeblock = await CodeBlock.findById(req.params.id)
    res.send(codeblock)
})

io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`)
    if (numOfParticipants === 0) {
        socket.emit("updateRole", true)
    }
    else {
        socket.emit("updateRole", false)       
    }
    numOfParticipants++
    /* console.log(numOfParticipants) */

    io.emit("updateNumOfParticipents", numOfParticipants)

    socket.on("updatedCode", (data) => {
        CodeBlock.findByIdAndUpdate(data.id, {current_code: data.current_code})
        .then((res) => {
            socket.broadcast.emit("updateCurrentCode", data)
        }).catch((err) => {
            console.log(err)
        })
    })

/*     socket.on("mentorGone", (role) => {
        console.log("Iamhere")
        if (role === "Mentor") {
            io.emit("mentorLeftTheCodeBlock")
        }
    }) */

    socket.on("disconnect", () => {
        console.log("user disconnected")
        numOfParticipants--
        io.emit("updateNumOfParticipents", numOfParticipants)
/*      console.log(numOfParticipants)
        socket.emit("reduceNumOfParticipents", numOfParticipants) */
    })
})

server.listen(process.env.PORT, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`)
})


/* const a = new CodeBlock({title:"aaa", current_code:"bbb", solution_code:"ccc"})
await a.save() */

/* app.put("/codeblock/:id", (req, res) => {
    var data = req.body.codeblock
    res.send()
}) */