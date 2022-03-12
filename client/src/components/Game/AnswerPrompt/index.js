import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';

function AnswerPrompt({lobbyId}){
    const {socket,gameData} = useContext(socketContext);

    const TestAnswer = useCallback(() => {
        socket.emit('answerReceived', lobbyId);
    }, [socket, lobbyId]);

    return (
        <button onClick={TestAnswer}>AnswerPrompt</button>
    );
};

export default AnswerPrompt;