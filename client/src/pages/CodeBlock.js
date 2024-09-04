import { Link, useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Heading, Flex, Box, Spacer, Image, Center } from '@chakra-ui/react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'


const CodeBlock = () => {
  const [codeblock, setCodeblock] = useState({title: 'Fetching the data from the server...'});
  const [isMentor, setIsMentor] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [numOfParticipants, setNumOfParticipants] = useState(0);
  const { id } = useParams();
  const socket = useRef(null);
  const navigate = useNavigate();
  axios.defaults.baseURL = 'http://localhost:5000';
  //https://onlinecodewebapp.onrender.com
    
  useEffect(() => {
    axios.get(`/codeblock/${id}`)
    .then((res) => {
      setCodeblock(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, [])

  useEffect(() => {

    socket.current = io.connect(axios.defaults.baseURL, {
      withCredentials: true,
      transports: ['websocket']
    });

    socket.current.on('updateCodeInClient', (codeBlockServer) => {
      return setCodeblock((prev) => {
        return { ...prev, currentCode: codeBlockServer.currentCode};
      });
    });

    socket.current.on('updateNumOfParticipents', (numOfParticipantsServer) => {
      setNumOfParticipants(numOfParticipantsServer)
    });

    socket.current.on('updateRole', (isMentorServer) => {
      setIsMentor(isMentorServer) 
    });

    socket.current.on('updateIsMatch', () => {
      setIsMatch(true)
    });

    socket.current.on('releaseClient', () => {
      navigate('/')
    });

    return async () => {
      socket.current.off('updateCodeInClient');
      socket.current.off('updateNumOfParticipents');
      socket.current.off('updateRole');
      socket.current.off('updateIsMatch');
      socket.current.off('releaseClient');
      socket.current.disconnect();
    }
  }, []);

  const handleChange = (value) => {
    socket.current.emit('updateCodeInServer', {
      id: id,
      currentCode: value,
      solutionCode: codeblock.solutionCode
    });
    return setCodeblock((prev) => {
      return { ...prev, currentCode: value};
    });
  }

  const handleExit = (value) => {
    console.log(value);
    socket.current.emit('exitCodeBlock', isMentor);
    navigate('/');
  }

  return (
    <>
    <Box bg='gray.100' w='100vw' h='100vh'>
      <Flex minWidth='max-content' bg='gray.100' alignItems='center' gap='2' t='10px'>
        <Image boxSize='40px' borderRadius='5px' ml='10px' src='https://i.ibb.co/mJrHwFg/logo.jpg'/>
        <Box p='3'>
          <Heading size='md'>{codeblock.title}</Heading>
        </Box>
        <Spacer />
        <ButtonGroup gap='2' mr='10px'>
          <Button colorScheme='teal' onClick={() => setIsDark(!isDark)}>switch to<br />{isDark ? 'Light' : 'Dark'} Theme</Button>
          <Button colorScheme='teal'>Participants<br />{numOfParticipants}</Button>
          <Button colorScheme='teal'>Role<br />
            {isMentor
            ? 'Mentor [ReadOnly]'
            : 'Student [Editable]'
            }
          </Button>
          <Link to='/'>
            <Button colorScheme='teal' onClick={handleExit}>return Lobby</Button>
          </Link>
        </ButtonGroup>
      </Flex>
      <Center bg='gray.100'>
        <Box>
          {isMatch
          ? <>
              <div>
                <Button colorScheme='teal' onClick={() => setIsMatch(false)}>return to CodeBlock</Button>
              </div>
              <div>
              <Image boxSize="30vw" mt='20px' src='https://www.kids-world.org.il/wp-content/uploads/Smiley-0018.jpg' alt='Good Job!'/>
              </div>
            </>
          : <CodeMirror
               style= {{textAlign:"left"}}
                value={codeblock.currentCode}
                 minWidth='100vw'
                  maxWidth='100vw'
                   minHeight='93vh'
                    maxHeight='93vh'
                     editable={!isMentor}
                      theme={isDark 
                             ? 'dark'
                             : 'light'
                      }
                       extensions={[javascript({ jsx: true })]}
                        onChange={handleChange} />
          }
        </Box>
      </Center>
    </Box>
    </>
  );
}

export default CodeBlock;

//        : <Editor height='75vh' bg='gray.100' defaultLanguage='javascript' options={{readOnly:isMentor}} value={codeblock.currentCode} onChange={handleChange}/>