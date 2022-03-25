import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function GameOver({lobbyId}){
    const {gameData} = useContext(socketContext);

    return (
        <>
        <h4 className='text-light'>Round {gameData.currentRound}</h4>
        <h1 className='text-light'> The host had ended the game!</h1>
        <p className='text-light'> Thank you for playing! Final Score:</p>
        <ul>
        {gameData.players.sort((a,b) => b.currentScore - a.currentScore).map(item => {
            return <li className='text-light'>{item.username}: {item.currentScore}</li>
        })}
        </ul>
        </>
    );
};

export default GameOver;