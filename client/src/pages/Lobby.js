import React from 'react';
import auth from '../utils/auth';
import { Navigate, useParams } from 'react-router-dom';
import { socketContext } from '../utils/socketContext';

const Lobby = () => {
    return (
        <>
            <p>Is this working?</p>
            {auth.loggedIn() ? 
            <>
                <p>Welcome! Lets get a lobby going!</p>
            </>:
            <>
                <Navigate to="/login" />
            </>}
        </>
    );
};

export default Lobby;