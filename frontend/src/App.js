import React from 'react'
import { useEffect } from 'react';
import Headers from './components/Headers.js';
import Home from './components/Home.js';
import Userpage from './components/Userpage.js';


import './App.css';

import { 
  BrowserRouter as Router, Route, Routes,
} from 'react-router-dom';

import {
  ChakraProvider, Box, extendTheme
} from '@chakra-ui/react';

import { Helmet } from 'react-helmet';

function App() {
  return (
    <>
      <Helmet> 
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet" />
      </Helmet>
      <ChakraProvider
        theme={extendTheme({
          fonts: {
            heading: '"Noto Sans JP", sans-serif',
            body: '"Noto Sans JP", sans-serif',
          },
          styles: {
            global: {
              // 全体のスタイルを定義
              heading: {
                fontWeight: 'mediom',  
                fontStyle: 'normal',
              },
              body: {
                fontWeight: 'medium',  
                fontStyle: 'normal',  
              },
            },
          },
        })}
      >
        <Router>
          <Headers /> 
          <Box>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Userpage" element={<Userpage />} />
            </Routes>
          </Box>
        </Router>
      </ChakraProvider>  
    </>
  )
}

export default App;