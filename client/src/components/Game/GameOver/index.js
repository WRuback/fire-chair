import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function GameOver({lobbyId}){
    const {gameData} = useContext(socketContext);

    return (
        <>
        <h1 className='text-light'> The host had ended the game!</h1>
        <p className='text-light'> Thank you for playing! Final Score:</p>
        <ul>
        {gameData.players.map(item => {
            return <li className='text-light'>{item.username}: {item.currentScore}</li>
        })}
        </ul>
        </>
    );
};

export default GameOver;