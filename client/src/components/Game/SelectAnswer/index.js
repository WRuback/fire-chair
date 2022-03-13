import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function SelectAnswer({lobbyId}){
    const {socket,gameData} = useContext(socketContext);

    const testSelect = useCallback(() => {
        socket.emit('selectReceived', lobbyId);
    }, [socket, lobbyId]);


    return (
        <>
        {Object.values(gameData.answers).map(item => <p>{item}</p>)}
        <button onClick={testSelect}>SelectAnswer</button>
        </>
    );
};

export default SelectAnswer;