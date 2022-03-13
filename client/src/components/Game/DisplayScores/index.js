import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function DisplayScore({lobbyId}){
    const {socket, gameData} = useContext(socketContext);
    const testStart = useCallback(() => {
        socket.emit('startRound', lobbyId);
    }, [socket, lobbyId]);

    return (
        <>
        <h1>Results:</h1>
        {Object.keys(gameData.answers).map(item =>{
            return <p>{item}: {gameData.answers[item]} - selected by {gameData.selections[item].join(", ")}</p>
        })}
        <button onClick={testStart}>Start New Round</button>
        </>
    );
};

export default DisplayScore;