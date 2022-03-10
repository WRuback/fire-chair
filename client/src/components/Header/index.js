import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../Header/Firechair_Logo.png"

import Auth from '../../utils/auth';

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="bg-dark text-light mb-4 py-3 display-flex align-end">
      
      <div className='container flex-column justify-start'>
        <img src={Logo} width={90} height={90} />  
        <Link className="text-danger display-flex align-center" to="/">
          <h1 className="m-0 vertical align-middle" style={{ fontSize: '2rem' }}>
            Fire Chair
          </h1>
        </Link>
      </div>
      
      <div className="container flex-column justify-space-between-lg justify-center align-end text-center ">
        <div className='justify-end align-right'>
          {Auth.loggedIn() ? (
            <>
              <Link className="btn btn-sm btn-warning m-2 float" to="/me">
                View My Profile
              </Link>
              <button className="btn btn-sm btn-warning m-2" onClick={logout}>
                Logout
              </button>
              <Link className="btn btn-sm btn-danger m-2" to="/signup">
                Rules
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-sm btn-warning m-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-sm btn-warning m-2" to="/signup">
                Signup
              </Link>
              <Link className="btn btn-sm btn-danger m-2" to="/signup">
                Rules
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
