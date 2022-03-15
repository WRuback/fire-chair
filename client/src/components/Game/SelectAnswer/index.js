import React, { useContext, useCallback, useState } from 'react';
import { socketContext } from '../../../utils/socketContext';
import auth from '../../../utils/auth';

function SelectAnswer({ lobbyId }) {
    const { socket, gameData } = useContext(socketContext);
    let [answerEntered, setAnswerEntered] = useState(false);

    const testSelect = useCallback((selected) => {
        socket.emit('selectReceived', lobbyId, selected, auth.getUsername());
        setAnswerEntered(true);
    }, [socket, lobbyId]);


    return (
        <div>
            <h1 className='text-light'> Which answer did {gameData.fireChair.username} select for the prompt '{gameData.currentPrompt}'</h1>
            {answerEntered ? <>
                <p>Awaiting other answers.</p>
            </> : <>
                {Object.keys(gameData.answers).map(item => (
                    <>
                        <button className="align-self-end btn btn-danger btn-lg py-5 m-1" onClick={() => { testSelect(item) }}>{gameData.answers[item]}</button>
                    </>
                ))}
            </>}
        </div>
    );
};

export default SelectAnswer;