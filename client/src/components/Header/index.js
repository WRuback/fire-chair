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
              <button className="btn btn-lg btn-light m-2" >
                Rules
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-sm btn-warning m-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-sm btn-warning m-2" to="/signup">
                Signup
              </Link>
              <button className="btn btn-lg btn-light m-2" data-bs-toggle="modal" data-bs-target="#rulesModal">
                Rules
              </button>
            </>
          )}
        </div>
        <div class="modal fade" id="rulesModal" tabindex="-1" aria-labelledby="rulesModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title" id="exampleModalLabel">Instructions</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <h3>Overview</h3>
                <p>Each round answer a question the player currently in the Fire Chair. Try to fool other players into thinking your response was written by the player currently in the Fire Chair</p>
                <h3>Getting Started</h3>
                <p>Sign Up </p>
              </div>
              <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;
