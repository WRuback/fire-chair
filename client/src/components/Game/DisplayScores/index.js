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
                    return <p className='text-light'><span className='text-warning'>{item}</span>: {gameData.answers[item]} - selected by {gameData.selections[item].length ? <span className='text-warning'>{gameData.selections[item].join(", ")}</span> : 'none'} - gains {gameData.selections[item].length} points.</p>
                } else {
                    return '';
                }
            })}
            <p className='text-light'><span className='text-warning'>{gameData.fireChair.username}'s</span> answer was: {gameData.answers[gameData.fireChair.username]}</p>
            <p className='text-light'> This was picked by {gameData.selections[gameData.fireChair.username].length ? <span className='text-warning'>{gameData.selections[gameData.fireChair.username].join(", ")}</span> : 'no one'}!</p>
            <p className='text-light'> Gained 2 points each, while <span className='text-warning'>{gameData.fireChair.username}</span> got {gameData.selections[gameData.fireChair.username].length * 2} points.</p>

            <p className='text-light'>Current Scores</p>
            <ul>
                {gameData.players.sort((a,b) => b.currentScore - a.currentScore).map(item => {
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