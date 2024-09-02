import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { Heading, Button } from '@chakra-ui/react'

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
            <Heading size='lg' mb='10px' mt='10px'>Choose code block</Heading>
            {codeBlocks.map((codeBlock, index) => {
                return (
                    <Link key={index} to={`/codeblock/${codeBlock._id}`}>
                        <div>
                            <Button colorScheme='teal' mb='10px'>{codeBlock.title}</Button>
                        </div>
                    </Link>
                )})}
        </div>
    )
}