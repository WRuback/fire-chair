import React from 'react';
import { Link } from 'react-router-dom';


import Auth from '../../utils/auth';
import Logo from './Logo';

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="bg-dark text-light mb-4 py-3 display-flex align-end">
      
      <div className='container flex-column justify-start'>
        <Logo/>
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
              <button className="btn btn-sm btn-danger m-2" data-bs-toggle="modal" data-bs-target="#rulesModal">
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
              <button className="btn btn-sm btn-danger m-2" data-bs-toggle="modal" data-bs-target="#rulesModal">
                Rules
              </button>
            </>
          )}
        </div>
        <div className="modal fade" id="rulesModal" tabindex="-1" aria-labelledby="rulesModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title text-dark" id="exampleModalLabel"><strong>Instructions</strong></h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body text-dark">
                <h3><strong>Overview</strong></h3>
                <p>Each round answer a question the player currently in the Fire Chair. Try to fool other players into thinking your response was written by the player currently in the Fire Chair</p>
                <h3><strong>Getting Started</strong></h3>
                <p>Sign Up and either create a new room or join a room to join a game</p>
                <h3><strong>Game Play</strong></h3>
                <div className='text-start'>
                <h5 className='d-inline'><strong>Hot Seat Assignment & Card Assignment </strong></h5>
                <p className='d-inline'>The game will randomly select a player to be the player in the Hot Seat.</p>
                </div>
                <div className='text-start'>
                <h5 className='d-inline '><strong>Answer Prompt </strong></h5>
                <p className='d-inline'>Everyone including the player in the Fire Chair is given 60 seconds to write and answer to the prompt selected. Remember to write your answer from the perspective of the person in the Fire Chair.</p>
                </div>
                <div className='text-start'>
                <h5 className='d-inline '><strong>Guess </strong></h5>
                <p className='d-inline'>After everyone has answered the prompt, players will be shown all the answers written by everyone and given 60 second to guess which answer they believe the person in the fire chair wrote. </p>
                </div>
                <div className='text-start'>
                <h5 className='d-inline '><strong>Reveal and Scoring </strong></h5>
                <p className='d-inline'>Once every player has guessed the game will show which answer was written by the Fire Chair and will award points based off the answers given and who guessed the the Fire Chairs answers correctly.</p>
                </div>
                <h3><strong>Scoring</strong></h3>
                <h5><strong>Player In the Fire Chair </strong></h5>
                <p>1 point for each player that correctly guesses the answer you wrote</p>
                <h5><strong>All Other Players </strong></h5>
                <ul>
                  <li>1 point for each player that guesses your answer instead of the Fire Chairs</li>
                  <li>2 points for guessing the player in the Fire Chairs answer correctly</li>
                  <li>4 points for responding with the same answer as the player in the Fire Chair</li>
                </ul>
                <h3>Winning</h3>
                <p>First player to get to 25 points wins.</p>
              </div>
              <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;
