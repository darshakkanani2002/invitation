import React from 'react';
import { useLocation } from 'react-router-dom';
export default function Header() {
    const location = useLocation();

    const getHeaderName = () => {
        switch (location.pathname) {
            case '/':
                return 'Category';
            case '/post':
                return 'Post';
            case '/services':
                return 'Services';
            case '/contact':
                return 'Contact';
            default:
                return 'Dashboard';
        }
    };
    return (
        <div>
            <div className='header-dash py-2'>
                <h2>{getHeaderName()}</h2>
            </div>
        </div>
    )
}
