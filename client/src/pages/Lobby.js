import { Link } from "react-router-dom"

export const Lobby = () => {
    return (
        <>
            <h1>Choose code block</h1>
            <Link to="/codeblock">
               <div>async code</div>            
            </Link>
            <div>sum 2 integers code</div>
            <div>DFS code</div>
            <div>event based code</div>
        </>
    )
}