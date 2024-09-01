import express from "express"
import dotenv from "dotenv"
import http from "http"
import cors from "cors"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const codeblocks = [
    {
        id: 0,
        title: "async code",
        currentCode: `enter your code here 1`,
        solutionCode: `solution code 1`
    },
    {
        id: 1,
        title: "sum 2 integers code",
        currentCode: `enter your code here 2`,
        solutionCode: `solution code 2`
    },
    {
        id: 2,
        title: "DFS code",
        currentCode: `enter your code here 3`,
        solutionCode: `solution code 3`
    },
    {
        id: 3,
        title: "event based code",
        currentCode: `enter your code here 4`,
        solutionCode: `solution code 4`
    },
]

app.get("/", (req, res) => {
    res.send(codeblocks[1])
})

app.put("/", (req, res) => {
    console.log(req.body)
    codeblocks[1] = req.body.codeblock
    console.log(codeblocks)
    res.send()
})

http.createServer(app).listen(process.env.PORT, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`)
})