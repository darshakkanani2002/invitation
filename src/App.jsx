import React, { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Category from './component/pages/Category';
import Sidebar from './component/Sidebar';
import Post from './component/pages/Post';
import Header from './component/Header';

function App() {
  return (
    <>
      <div>
        <Router>
          <div className="App">
            <Sidebar></Sidebar>
            <div className="content">
              <Header></Header>
              <Routes >
                <Route path="/" element={<Category />} />
                <Route path="/post" element={<Post />} />
              </Routes>
            </div>
          </div>
        </Router>
      </div>
    </>
  )
}

export default App
