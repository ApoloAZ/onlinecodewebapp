import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import "./Lobby.css"

export const Lobby = () => {
    const [codeBlocks, setCodeBlocks] = useState([])
    axios.defaults.baseURL = "http://localhost:5000"

    useEffect(() => {
            axios.get("/")
            .then((res) => {
                setCodeBlocks(res.data)
            }).catch((err) => {
                console.log(err)
            })
        }, [])

    return (
        <div>
            <div className="headers">Choose code block</div>
            {codeBlocks.map((codeBlock, index) => {
                return (
                    <Link key={index} to={`/codeblock/${codeBlock._id}`}>
                        <div><button>{codeBlock.title}</button></div>
                    </Link>
                )})}
        </div>
    )
}