import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import "./CodeBlock.css"
import io from "socket.io-client"
const socket = io.connect("http://localhost:5000")

export const CodeBlock = () => {
    axios.defaults.baseURL = "http://localhost:5000"
    const [codeblock, setCodeblock] = useState({title: "waiting for fetching the data from the server"})
    const { id } = useParams()

    useEffect(() => {
        socket.on("updateCurrentCode", (data) => {
            return setCodeblock((p) => {
                return { ...p, current_code: data.current_code}
            })
        })
    }, [socket])
  
    useEffect(() => {
        axios.get(`/codeblock/${id}`)
        .then((res) => {
            setCodeblock(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const handleClick = () => {
        axios.put(`/`, {codeblock})
        .then((res) => {
            console.log(res)
            console.log(codeblock)
        }).catch((err) => {
            console.log(err)
        })       
    }

    const handleChange = (e) => {
        socket.emit("updatedCode", {current_code: e.target.value})
        console.log(e)
        return setCodeblock((p) => {
            return { ...p, current_code: e.target.value}
        }
    )}

    return (
        <>
            <div className="Head">
                <span className="c1">properties:</span>
                <span className="c2">{codeblock.title}</span>
                <span className="c3">
                    <Link to="/"><button>return Lobby</button></Link>
                </span>
            </div>
            <textarea className="ta" value={codeblock.current_code} onChange={handleChange} />
            <button onClick={handleClick}>send</button>
        </>

    )
}