import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Button } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = () => {
    const [show, setShow] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleMenuClick = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
        setActiveSubmenu(null); // Reset submenu on main menu click
    };

    const handleSubmenuClick = (submenu) => {
        setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="mb-3 d-md-none">
                Toggle Sidebar
            </Button>

            <div className="sidebar d-none d-md-block">
                <h2>Sidebar</h2>
                <ul className="side-menu">
                    <li className={`my-3 ${activeMenu === 'category' ? 'active' : ''}`}>
                        <Link to="/" onClick={() => handleMenuClick('category')}>
                            Category
                        </Link>
                    </li>
                    <li className="my-3"><Link to="/post">Post</Link>
                    </li>
                    <li className="my-3"><Link to="/help">help</Link></li>
                    <li className="my-3"><Link to="/contact">Contact</Link></li>
                </ul>
            </div>

            <Offcanvas show={show} onHide={handleClose} className="d-md-none">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Sidebar</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ul className="side-menu">
                        <li className={`my-3 ${activeMenu === 'category' ? 'active' : ''}`}>
                            <Link to="/" onClick={() => handleMenuClick('category')}>
                                Category
                            </Link>
                        </li>
                        <li className="my-3"><Link to="/post" onClick={handleClose}>Post</Link></li>
                        <li className="my-3"><Link to="/services" onClick={handleClose}>Services</Link></li>
                        <li className="my-3"><Link to="/contact" onClick={handleClose}>Contact</Link></li>
                    </ul>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;
