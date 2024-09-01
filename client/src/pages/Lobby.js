import { Link } from "react-router-dom"
import "./Lobby.css"

export const Lobby = () => {
    return (
        <>
            <h1>Choose code block</h1>
            <Link to="/codeblock">
               <div className="Case">async code</div>            
            </Link>
            <div className="Case">sum 2 integers code</div>
            <div className="Case">DFS code</div>
            <div className="Case">event based code</div>
        </>
    )
}