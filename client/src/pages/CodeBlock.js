import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import "./CodeBlock.css"
import io from "socket.io-client"


export const CodeBlock = () => {
    axios.defaults.baseURL = "http://localhost:5000"
    const [codeblock, setCodeblock] = useState({title: "waiting for fetching the data from the server"})
    const [role, setRole] = useState("")
    const [numOfParticipants, setNumOfParticipants] = useState(0)
    const { id } = useParams()
    const socket = useRef(null)
    const nevigate = useNavigate()
    
    useEffect(() => {
        axios.get(`/codeblock/${id}`)
        .then((res) => {
            setCodeblock(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(() => {

        socket.current = io.connect("http://localhost:5000", {
            withCredentials: true,
            transports: ['websocket']
        })

        socket.current.on("updateCurrentCode", (data) => {
            return setCodeblock((p) => {
                return { ...p, current_code: data.current_code}
            })
        })

        socket.current.on("updateNumOfParticipents", (data) => {
            console.log(data)
            setNumOfParticipants(data)
        })

        socket.current.on("updateRole", (data) => {
            console.log(data)
            setRole(data)
        })

/*         socket.current.on("mentorLeftTheCodeBlock", () => {
            nevigate('/')
        }) */

        return () => {
/*             console.log(role)
            socket.current.emit("mentorGone", role) */
            socket.current.off("updateCurrentCode")
            socket.current.off("updateNumOfParticipents")
            socket.current.off("updateRole")
            socket.current.disconnect(role)
        }
    }, [])

    const handleChange = (e) => {
        socket.current.emit("updatedCode", {id: id, current_code: e.target.value})
        return setCodeblock((p) => {
            return { ...p, current_code: e.target.value}
        }
    )}

    return (
        <>
            <div className="Head">
                <span className="c1">participants:{`${numOfParticipants} | ${role}`}</span>
                <span className="c2">{codeblock.title}</span>
                <span className="c3">
                    <Link to="/"><button>return Lobby</button></Link>
                </span>
            </div>
            <textarea className="ta" value={codeblock.current_code} readOnly={role === "Mentor"} onChange={handleChange} />
        </>
    )
}