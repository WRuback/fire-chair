import React from "react";
import auth from "../utils/auth";
import { Navigate, useParams } from "react-router-dom";
import { socketContext } from "../utils/socketContext";
import { Link } from "react-router-dom";

const Lobby = () => {
  return (
    <>
      <h1 className="text-light text-center">
        Are you ready for your seat to get warm?
      </h1>

      {auth.loggedIn() ? (
        <>
        <div className="centered">
            <h1 className="text-light text-center bg-primary">Lobby Code: ABCD </h1>
            {/* Placeholder for dynamic to be added */}

            <div className="text-center bg-light">
              <h1>Test</h1>
              <h1>User</h1>
            </div>
        </div>
            {/* Plug in socket to dynamically add user when lobby is joined */}
        
        <button className="btn-danger btn-lg py-5 align-item-center justify-content-center">
          <h1>START</h1>
        </button>
          
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Lobby;
