import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function SelectAnswer({ lobbyId }) {
    const { socket, gameData } = useContext(socketContext);

    const testSelect = useCallback((selected) => {
        socket.emit('selectReceived', lobbyId, selected, 'Testman');
    }, [socket, lobbyId]);


    return (
        <>
            <h1> Which answer did {gameData.fireChair.username} select for the prompt '{gameData.currentPrompt}'</h1>
            {Object.keys(gameData.answers).map(item => (
                <>
                    <button onClick={()=>{testSelect(item)}}>{gameData.answers[item]}</button>
                </>
            ))}
        </>
    );
};

export default SelectAnswer;