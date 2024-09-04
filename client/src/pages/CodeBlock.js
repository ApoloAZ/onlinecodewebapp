import { Link, useParams, useNavigate} from "react-router-dom"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import io from "socket.io-client"
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Heading, Flex, Box, Spacer, Image, Center } from '@chakra-ui/react'
import Editor from '@monaco-editor/react';


export const CodeBlock = () => {
    axios.defaults.baseURL = "http://localhost:5000"
    const [codeblock, setCodeblock] = useState({title: "waiting for fetching the data from the server"})
    const [isMentor, setIsMentor] = useState(false)
    const [isMatch, setIsMatch] = useState(false)
    const [numOfParticipants, setNumOfParticipants] = useState(0)
    const { id } = useParams()
    const socket = useRef(null)
    const navigate = useNavigate()
    
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
            setNumOfParticipants(data)
        })

        socket.current.on("updateRole", (data) => {
            setIsMentor(data) 
        })

        socket.current.on("itsAMatch", () => {
            setIsMatch(true)
        })

        socket.current.on("releaseStudent", () => {
            navigate("/")
        })

        return async () => {
            socket.current.off("updateCurrentCode")
            socket.current.off("updateNumOfParticipents")
            socket.current.off("updateRole")
            socket.current.off("releaseStudent")
            socket.current.off("itsAMatch")
            socket.current.disconnect()
        }
    }, [])

    const handleChange = (value) => {
        console.log(value)
        socket.current.emit("updatedCode", {id: id, current_code: value, solution_code: codeblock.solution_code})
        return setCodeblock((p) => {
            return { ...p, current_code: value}
        }
    )}

    const handleExit = (value) => {
        console.log(value)
        socket.current.emit("exit", isMentor)
        navigate("/")
        }

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
                    <Link to="/"><Button colorScheme='teal' onClick={handleExit}>return Lobby</Button></Link>
                </ButtonGroup>
            </Flex>
            <Center mt="10px">
                {isMatch ?
                <>
                    <Image src="https://www.kids-world.org.il/wp-content/uploads/Smiley-0018.jpg"/>
                    <div>
                        <Button colorScheme='teal' onClick={() => setIsMatch(false)}>return to CodeBlock</Button>
                    </div>
                </> :
                 <Editor height="75vh" defaultLanguage="javascript" options={{readOnly:isMentor}} value={codeblock.current_code} onChange={handleChange}/>}
            </Center>
        </>
    )
}