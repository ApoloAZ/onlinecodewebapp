import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heading, Button } from '@chakra-ui/react';
import { Box, Container, Flex, AbsoluteCenter, Center, Image } from '@chakra-ui/react';

const Lobby = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);
  axios.defaults.baseURL = 'http://localhost:5000';

  useEffect(() => {
    axios.get('/')
    .then((res) => {
      setCodeBlocks(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div>
      <Flex w='100%' h='100vh'>
        <Center bg='gray.100' w='65%' color='black'>
          <div>
            <Heading size='xl' mb='15px'>Welcome to OnlineCodeWebApp</Heading>
            <Heading size='lg' align='left' mb='15px' mt='10px'>Choose code block</Heading>
            <Box align='left'>
              {
                  codeBlocks.map((codeBlock, index) => {
                    return (
                      <Link key={index} to={`/codeblock/${codeBlock._id}`}>
                        <div>
                          <Button colorScheme='teal' mb='10px'>{codeBlock.title}</Button>
                        </div>
                      </Link>
                    )
                  })
                }
            </Box>
          </div>
        </Center>
        <Center bg='white' w='35%'>
          <Image src='https://i.ibb.co/mJrHwFg/logo.jpg'/>
        </Center>
      </Flex>
    </div>
  );
}

export default Lobby;