import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Link,
    Flex,
    List,
    ListItem,
    ListIcon,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
    UnorderedList,
} from '@chakra-ui/react'
import {
    ChevronRightIcon,
    ChevronDownIcon,
} from '@chakra-ui/icons'



const Folders = () => {
    return (
        <List spacing={3} w={200} h="100%" p={4} backgroundColor='gray.50'>
            <ListItem fontWeight={600} fontSize={16}>
                全てのファイル
            </ListItem>
            <UnorderedList spacing={1}>
                <ListItem>
                    React
                </ListItem>
                <ListItem>
                    React
                </ListItem>
            </UnorderedList>
        </List>
    )
}


const UrlTable = () => {
    return (
        <>
            <TableContainer p={4} w="100%">
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Url</Th>
                            <Th>Domain</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>test</Td>
                            <Td>
                                <Link href='https://chakra-ui.com' isExternal>
                                    https://chakra-ui.com 
                                </Link>
                            </Td>
                            <Td>chakra-ui.com</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )
}

const Userpage = () => {
    return (
        <Flex>
            <Folders />
            <UrlTable />
        </Flex>
    )
};

export default Userpage;
