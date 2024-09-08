import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Button } from 'react-bootstrap';
import './Sidebar.css';

export default function Sidebar() {
    const [show, setShow] = useState(false);
    const [activeMenu, setActiveMenu] = useState(() => {
        return localStorage.getItem('activeMenu') || 'category';
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        localStorage.setItem('activeMenu', menu); // Save the active menu to localStorage
        handleClose(); // Close the offcanvas when an item is selected
    };

    return (
        <div>
            <>
                <Button variant="primary" onClick={handleShow} className="mb-3 d-md-none">
                    <i className="fa-solid fa-bars"></i>
                </Button>

                <div className="sidebar d-none d-md-block">
                    <h2>Sidebar</h2>
                    <ul className="side-menu">
                        <li className={`my-2 ${activeMenu === 'category' ? 'active' : ''}`}>
                            <Link to="/" className='nav-link' onClick={() => handleMenuClick('category')}>
                                Category
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'post' ? 'active' : ''}`}>
                            <Link to="/post" className='nav-link' onClick={() => handleMenuClick('post')}>
                                {/* <i className="fa-solid fa-signs-post me-3 sidebar-icon"></i> */}
                                Post
                            </Link>
                        </li>
                    </ul>
                </div>

                <Offcanvas show={show} onHide={handleClose} className="d-md-none">
                    <Offcanvas.Header closeButton>
                        <h2>Crafto</h2>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ul className="side-menu">
                            <li className={`my-3 ${activeMenu === 'category' ? 'active' : ''}`}>
                                <Link to="/" className='nav-link' onClick={() => handleMenuClick('category')}>
                                    Category
                                </Link>
                            </li>
                            <li className={`my-3 ${activeMenu === 'post' ? 'active' : ''}`}>
                                <Link to="/post" className='nav-link' onClick={() => handleMenuClick('post')}>
                                    Post
                                </Link>
                            </li>
                        </ul>
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        </div>
    )
}
