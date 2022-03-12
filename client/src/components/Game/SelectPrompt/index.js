import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function SelectPrompt({lobbyId}){
    const {socket,gameData} = useContext(socketContext);

    const TestPrompt = useCallback(() => {
        socket.emit('promptSelected', lobbyId);
    }, [socket, lobbyId]);

    return (
        <button onClick={TestPrompt}>SelectPrompt</button>
    );
};

export default SelectPrompt;