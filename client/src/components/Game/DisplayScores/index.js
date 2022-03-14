import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function DisplayScore({lobbyId}){
    const {socket, gameData} = useContext(socketContext);
    const testStart = useCallback(() => {
        socket.emit('startRound', lobbyId);
    }, [socket, lobbyId]);

    return (
        <>
        <h1 className='text-light'>Results:</h1>
        {Object.keys(gameData.answers).map(item =>{
            return <p className='text-light'>{item}: {gameData.answers[item]} - selected by {gameData.selections[item].join(", ")}</p>
        })}
        <button className="align-self-end btn btn-danger btn-lg py-5" onClick={testStart}>Start New Round</button>
        </>
    );
};

export default DisplayScore;