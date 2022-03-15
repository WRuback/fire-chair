import React, { useContext, useCallback } from 'react';
import auth from '../../../utils/auth';
import { socketContext } from '../../../utils/socketContext';

function DisplayScore({ lobbyId }) {
    const { socket, gameData } = useContext(socketContext);

    const testStart = useCallback(() => {
        socket.emit('startRound', lobbyId);
    }, [socket, lobbyId]);

    const testEnd = useCallback(() => {
        socket.emit('endGame', lobbyId);
    }, [socket, lobbyId]);

    return (
        <>
            <h4 className='text-light'>Round {gameData.currentRound}</h4>
            <h1 className='text-light'>Results:</h1>
            {Object.keys(gameData.answers).map(item => {
                if (item !== gameData.fireChair.username) {
                    return <p className='text-light'>{item}: {gameData.answers[item]} - selected by {gameData.selections[item].length ? gameData.selections[item].join(", ") : 'none'} - gains {gameData.selections[item].length} points.</p>
                } else {
                    return '';
                }
            })}
            <p className='text-light'>{gameData.fireChair.username}'s Answer was: {gameData.answers[gameData.fireChair.username]}</p>
            <p className='text-light'> This was picked by {gameData.selections[gameData.fireChair.username].length ? gameData.selections[gameData.fireChair.username].join(", ") : 'no one'}!</p>
            <p className='text-light'> Gained 2 points each, while {gameData.fireChair.username} got {gameData.selections[gameData.fireChair.username].length * 2} points.</p>

            <p className='text-light'>Current Scores</p>
            <ul>
                {gameData.players.map(item => {
                    return <li className='text-light'>{item.username}: {item.currentScore}</li>
                })}
            </ul>

            {gameData.host.username === auth.getUsername() ? <>
                <button className="align-self-end btn btn-danger btn-lg py-5 m-1" onClick={testStart}>Start New Round</button>
                <button className="align-self-end btn btn-danger btn-lg py-5 m-1" onClick={testEnd}>End Game</button>
            </> : <>
                <p className='text-light'>Host is selecting next step.</p>
            </>}


        </>
    );
};

export default DisplayScore;