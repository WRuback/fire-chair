import React, { useContext } from 'react';
import { socketContext } from '../../../utils/socketContext';
import Timer from '../Timer';

function SelectPrompt({lobbyId}){
    const {gameData} = useContext(socketContext);

    return (
        <>
        <h4 className='text-light'>Round {gameData.currentRound}</h4>
        <h1 className='text-light'> {gameData.fireChair.username} is in the fire Chair!</h1>
        <p className='text-light'> Please wait for them to select a prompt.</p>
        <Timer lobbyId={lobbyId}></Timer>
        </>
    );
};

export default SelectPrompt;