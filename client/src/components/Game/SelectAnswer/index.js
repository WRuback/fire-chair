import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function SelectAnswer({lobbyId}){
    const {socket,gameData} = useContext(socketContext);

    const testSelect = useCallback(() => {
        socket.emit('selectReceived', lobbyId);
    }, [socket, lobbyId]);

    return (
        <button onClick={testSelect}>SelectAnswer</button>
    );
};

export default SelectAnswer;