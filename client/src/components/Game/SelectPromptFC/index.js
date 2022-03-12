import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function SelectPromptFC({lobbyId}){
    const {gameData} = useContext(socketContext);


    return (
        <p>{gameData.gameState}</p>
    );
};

export default SelectPromptFC;