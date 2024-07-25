import {
    Box,
    Flex,
    Heading,
    Button,
    ButtonGroup,
    Spacer,
    Divider,
    VStack,
    Center,
    Square, 
    Circle,

    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,

    FormControl,
    FormLabel,
    Input,

    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Text,
    Image,

    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Select,
} from '@chakra-ui/react';
import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();


export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const checkLogin = async () => {
        try {
            const response = await Axios.get('http://127.0.0.1:5000/check_login', { withCredentials: true });
            setLoggedIn(response.data.logged_in);
            setUsername(response.data.username);
        } catch (error) {
            console.error("Error checking login status", error);
            setLoggedIn(false);
            setUsername('');
        }
    };

    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, username, setUsername, checkLogin}}>
            {children}
        </AuthContext.Provider>
    );
};

const Header = ({ onSignupOpen, onLoginOpen, onAddfolderOpen, onAddurlOpen }) => {
    const { loggedIn, username } = useContext(AuthContext);

    return (
        <Box bg="white" maxW="100%" boxShadow="sm" zIndex="10" position="relative">
            <Box px={200}>
                <Flex as="header" py="4" justifyContent="space-between" alignItems="center">
                    <Box p='0'>
                        <Heading href='http://127.0.0.1:3000/' as='a' fontSize="2xl" cursor="pointer">
                            Link Keeper
                        </Heading>
                    </Box>  
                    <Spacer />
                    {loggedIn ? (
                        <Box>
                            <Flex alignItems='center' gap='4'>
                                <Text>{username}</Text>
                                <Menu>
                                    <MenuButton>
                                        <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' boxSize='36px' borderRadius='full' />
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem color={"blackAlpha.700"} fontWeight={400} as='a' href='http://127.0.0.1:3000/Userpage'>ユーザーページ</MenuItem>
                                        <MenuGroup title='Account' fontSize='16px'>
                                            <MenuItem color={"blackAlpha.700"} fontWeight={400} as='a'>プロフィール</MenuItem>
                                            <MenuItem color={"blackAlpha.700"} fontWeight={400} as='a' href='http://127.0.0.1:5000/logout'>ログアウトする</MenuItem>
                                        </MenuGroup>
                                    </MenuList>
                                </Menu>
                                <Menu>
                                    <MenuButton colorScheme='blue' as={Button} size='md'>
                                        追加する
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem color={"blackAlpha.700"} onClick={onAddfolderOpen}>フォルダを追加する</MenuItem>
                                        <MenuItem color={"blackAlpha.700"} onClick={onAddurlOpen}>URLを追加する</MenuItem>
                                    </MenuList>
                                </Menu>
                            </Flex>
                        </Box>
                        
                    ) : (
                        <ButtonGroup gap='2'>
                            <Button colorScheme='blue' onClick={onSignupOpen}>Sign up</Button>
                            <Button colorScheme='blue' onClick={onLoginOpen}>Log in</Button>   
                        </ButtonGroup>
                    )}
                </Flex>
            </Box>
        </Box>
    )
}

const SignUp = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            name: name,
            email: email,
            password: password
        };
        console.log('Sending user data:', userData);
        Axios.post('http://127.0.0.1:5000/signup', userData)
            .then(response => {
                setAlert(response.data.message)
                onClose();
            })
            .catch(error => {
                console.error('There was an error!', error);
                setError('Error registering user');
            });
    };

    return (
        <>  
            <Modal isOpen={isOpen} onClose={onClose} className="modal" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold">Sign Up</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>User Name</FormLabel>
                            <Input 
                                type='text' 
                                placeholder='User name' 
                                margin="0 0 10px 0" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                            <FormLabel>Email</FormLabel>
                            <Input 
                                type='email' 
                                placeholder='Email ' 
                                margin="0 0 10px 0" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FormLabel>Password</FormLabel>
                            <Input 
                                type='password' 
                                placeholder='Password' 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button type='submit' colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {error && (
                <Box position="fixed" bottom="0" width="100%">
                    <Alert status='error'>
                        <AlertIcon />
                        {error}
                    </Alert>
                </Box>
            )}
            {alert && (
                <Box position="fixed" bottom="0" width="100%"> 
                    <Alert status='success'>
                        <AlertIcon />
                        {alert}
                    </Alert>
                </Box>
            )}

        </>
    )
}
const LogIn = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setLoggedIn, setUsername, checkLogin } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userData = { email, password };
        try {
            const response = await Axios.post('http://127.0.0.1:5000/login', userData, { withCredentials: true });
            setAlert(response.data.message);
            setLoggedIn(true);
            setUsername(response.data.username);
            navigate("/Userpage");
            onClose();
        } catch (error) {
            console.error('There was an error!', error);
            setError('Error logging in');
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="modal" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold">Log In</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody color={"blackAlpha.700"}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input 
                                type='email' 
                                placeholder='Email ' 
                                margin="0 0 10px 0" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FormLabel>Password</FormLabel>
                            <Input 
                                type='password' 
                                placeholder='Password ' 
                                margin="0 0 10px 0" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button type='submit' colorScheme='blue' mr={3} onClick={handleSubmit}>
                            login
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {error && (
                <Box position="fixed" bottom="0" width="100%" colorScheme='gray.500'>
                    <Alert status='error'>
                        <AlertIcon />
                        {error}
                    </Alert>
                </Box>
            )}
            {alert && (
                <Box position="fixed" bottom="0" width="100%" colorScheme='gray.500'>
                    <Alert status='success'>
                        <AlertIcon />
                        {alert}
                    </Alert>
                </Box>
            )}
        </>
    )
}


const AddFolder = ({ isOpen, onClose }) => {
    const [foldername, setFolderName] = useState('');

    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    const [username, setUsername] = useState('');


    useEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = async () => {
        try {
            const response = await Axios.get('http://127.0.0.1:5000/check_login', { withCredentials: true });
            console.log('Login check response:', response.data);
            setUsername(response.data.username);
        } catch (error) {
            console.error("Error checking login status", error);
            setUsername('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const folderData = {
                foldername: foldername,
                username: username,
            };
            
            const response = await Axios.post('http://127.0.0.1:5000/add_folder', folderData, { withCredentials: true });
            setAlert(response.data.message);
            setUsername(response.data.username);
            onClose();
        } catch (error) {
            console.error('There was an error!', error);
            setError('Error registering user');
            onClose();
        }
    };

    return (
        <>  
            <Modal isOpen={isOpen} onClose={onClose} className="modal" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold">Add Folder</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Folder Name</FormLabel>
                            <Input 
                                type='text' 
                                placeholder='Folder name' 
                                margin="0 0 10px 0" 
                                value={foldername} 
                                onChange={(e) => setFolderName(e.target.value)} 
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button type='submit' colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Add
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {error && (
                <Box position="fixed" bottom="0" width="100%">
                    <Alert status='error'>
                        <AlertIcon />
                        {error}
                    </Alert>
                </Box>
            )}
            {alert && (
                <Box position="fixed" bottom="0" width="100%"> 
                    <Alert status='success'>
                        <AlertIcon />
                        {alert}
                    </Alert>
                </Box>
            )}

        </>
    )
}

const Addurl = ({ isOpen, onClose }) => {
    const [urlname, setUrlName] = useState('');
    const [link, setlink] = useState('');

    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    const [username, setUsername] = useState('');
    const [folderid, setFolderid] = useState('');



    useEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = async () => {
        try {
            const response = await Axios.get('http://127.0.0.1:5000/check_login', { withCredentials: true });
            console.log('Login check response:', response.data);
            setUsername(response.data.username);
        } catch (error) {
            console.error("Error checking login status", error);
            setUsername('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const folderData = {
                urlname: urlname,
                link: link,
                username: username,
                folderid: folderid,
            };
            
            const response = await Axios.post('http://127.0.0.1:5000/add_url', folderData, { withCredentials: true });
            setAlert(response.data.message);
            setUsername(response.data.username);
            onClose();
        } catch (error) {
            console.error('There was an error!', error);
            setError('Error registering user');
            onClose();
        }
    };

    const [Folders, setFolders] = useState([]);

    const checkFolder = async () => {
        try {
            const response = await Axios.get('http://127.0.0.1:5000/check_folder', { withCredentials: true });
            setFolders(response.data);
        } catch (error) {
            console.error("Error checking login status", error);
            setFolders(['']);
        }
    };

    useEffect(() => {
        checkFolder();
    }, []);

    

    return (
        <>  
            <Modal isOpen={isOpen} onClose={onClose} className="modal" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold">Add Url</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Url Name</FormLabel>
                            <Input 
                                type='text' 
                                placeholder='Folder name' 
                                margin="0 0 10px 0" 
                                value={urlname} 
                                onChange={(e) => setUrlName(e.target.value)} 
                            />
                            <FormLabel>Link</FormLabel>
                            <Input 
                                type='text' 
                                placeholder='Link' 
                                margin="0 0 10px 0" 
                                value={link} 
                                onChange={(e) => setlink(e.target.value)} 
                            />
                            <FormLabel>フォルダに追加</FormLabel>
                            <Select
                                placeholder='フォルダに追加しない'
                                color="gray.600"
                                onChange={(e) => setFolderid(e.target.value)}
                            >
                                {Folders.map(item => (
                                <option value={item.id} key={item.id}>{item.name}</option>            
                                ))}
                            </Select>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button type='submit' colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Add
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {error && (
                <Box position="fixed" bottom="0" width="100%">
                    <Alert status='error'>
                        <AlertIcon />
                        {error}
                    </Alert>
                </Box>
            )}
            {alert && (
                <Box position="fixed" bottom="0" width="100%"> 
                    <Alert status='success'>
                        <AlertIcon />
                        {alert}
                    </Alert>
                </Box>
            )}

        </>
    )
}

function Headers() {
    // 共通の親コンポーネントに持ち上げる
    const { isOpen: isSignUpOpen, onOpen: onSignupOpen, onClose: onSignUpClose } = useDisclosure();
    const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
    const { isOpen: isAddfolderOpen, onOpen: onAddfolderOpen, onClose: onAddfolderClose } = useDisclosure();
    const { isOpen: isAddurlOpen, onOpen: onAddurlOpen, onClose: onAddurlClose } = useDisclosure();


    return (
        <AuthProvider>
            <Header onSignupOpen={onSignupOpen} onLoginOpen={onLoginOpen} onAddfolderOpen={onAddfolderOpen} onAddurlOpen={onAddurlOpen} />
            <SignUp isOpen={isSignUpOpen} onClose={onSignUpClose} />
            <LogIn isOpen={isLoginOpen} onClose={onLoginClose} />
            <AddFolder isOpen={isAddfolderOpen} onClose={onAddfolderClose} />
            <Addurl isOpen={isAddurlOpen} onClose={onAddurlClose} />

        </AuthProvider>
    );
}

export default Headers