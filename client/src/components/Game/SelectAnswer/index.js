import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';


function SelectAnswer({ lobbyId }) {
    const { socket, gameData } = useContext(socketContext);

    const testSelect = useCallback((selected) => {
        socket.emit('selectReceived', lobbyId, selected, 'Testman');
    }, [socket, lobbyId]);


    return (
        <div>
            <h1 className='text-light'> Which answer did {gameData.fireChair.username} select for the prompt '{gameData.currentPrompt}'</h1>
            {Object.keys(gameData.answers).map(item => (
                <>
                    <button className="align-self-end btn btn-danger btn-lg py-5 m-1" onClick={()=>{testSelect(item)}}>{gameData.answers[item]}</button>
                </>
            ))}
        </div>
    );
};

export default SelectAnswer;