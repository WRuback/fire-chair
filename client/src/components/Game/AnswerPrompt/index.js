import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function AnswerPrompt({ lobbyId }) {
    const { socket, gameData } = useContext(socketContext);

    const TestAnswer = useCallback(() => {
        socket.emit('answerReceived', lobbyId);
    }, [socket, lobbyId]);

    return (
        <>
            <h1>{gameData.currentPrompt}</h1>
            <button onClick={TestAnswer}>AnswerPrompt</button>
        </>
    );
};

export default AnswerPrompt;