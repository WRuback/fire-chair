import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <footer className="w-100 mt-auto text-dark p-4">
      <div className="container text-center text-light mb-5">
        {location.pathname !== '/' && (
          <button
            className="btn btn-dark mb-3"
            onClick={() => navigate(-1)}
          >
            &larr; Go Back
          </button>
        )}
        <h4>&copy; {new Date().getFullYear()} - A Pack of Lone Wolves</h4>
        <h5>Inspired by Hot Seat - support the offical game here : <a style={{color: 'yellow'}} href='https://playerten.com/products/hot-seat'>playerten.com/products/hot-seat</a></h5>
      </div>
    </footer>
  );
};

export default Footer;
