import { Link } from "react-router-dom"

export const NoPage = () => {
    return (
        <>
            <div>Invalid Page</div>
            <Link to="/">Click here to return to the Lobby</Link>
        </>
    )
}