import { Link, useParams} from "react-router-dom"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import "./CodeBlock.css"
import io from "socket.io-client"
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Heading, Flex, Box, Spacer } from '@chakra-ui/react'
import Editor from '@monaco-editor/react';


export const CodeBlock = () => {
    axios.defaults.baseURL = "http://localhost:5000"
    const [codeblock, setCodeblock] = useState({title: "waiting for fetching the data from the server"})
    const [isMentor, setIsMentor] = useState(false)
    const [numOfParticipants, setNumOfParticipants] = useState(0)
    const { id } = useParams()
    const socket = useRef(null)
    
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
            setIsMentor(data)
        })

        //socket.currect.on("")

/*         socket.current.on("mentorLeftTheCodeBlock", () => {
            nevigate('/')
        }) */

        return () => {
/*             console.log(role)
            socket.current.emit("mentorGone", role) */
            socket.current.off("updateCurrentCode")
            socket.current.off("updateNumOfParticipents")
            socket.current.off("updateRole")
            socket.current.disconnect()
        }
    }, [])

    const handleChange = (value) => {
        if (codeblock.solution_code === value) {
            alert("\uD83D\uDE00")
        }
        console.log(value)
        socket.current.emit("updatedCode", {id: id, current_code: value})
        return setCodeblock((p) => {
            return { ...p, current_code: value}
        }
    )}

    return (
        <>
            <Flex minWidth='max-content' alignItems='center' gap='2'>
                <Box p='2'>
                    <Heading size='md'>{codeblock.title}</Heading>
                </Box>
                <Spacer />
                <ButtonGroup gap='2'>
                    <Button colorScheme='teal'>Participants:<br />{numOfParticipants}</Button>
                    <Button colorScheme='teal'>Role:<br />{isMentor ? "Mentor [ReadOnly]" : "Student [Editable]"}</Button>
                    <Link to="/"><Button colorScheme='teal'>return Lobby</Button></Link>
                </ButtonGroup>
            </Flex>
            <Box mt="10px">
                <Editor height="75vh" defaultLanguage="javascript" value={codeblock.current_code} onChange={handleChange} options={{ readOnly:isMentor }}/>
            </Box>
        </>
    )
}