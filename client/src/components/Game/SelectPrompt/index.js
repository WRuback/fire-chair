import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function SelectPrompt({lobbyId}){
    const {gameData} = useContext(socketContext);

    return (
        <>
        <h1 className='text-light'> {gameData.fireChair.username} is in the fire Chair!</h1>
        <p className='text-light'> Please wait for them to select a prompt.</p>
        </>
    );
};

export default SelectPrompt;