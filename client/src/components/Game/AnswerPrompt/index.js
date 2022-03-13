import React, { useContext, useCallback, useState } from 'react';
import { socketContext } from '../../../utils/socketContext';

function AnswerPrompt({ lobbyId }) {
    const { socket, gameData } = useContext(socketContext);
    let [answer, setAnswer] = useState('');
    let [answerEntered, setAnswerEntered] = useState(false);
    
    const TestAnswer = useCallback(() => {
        socket.emit('answerReceived', lobbyId, answer,'Testman');
        setAnswerEntered(true);
    }, [socket, lobbyId, answer]);

    const handleChange = (e) => {
        setAnswer(e.target.value);
    }

    return (
        <>
            <h1>{gameData.currentPrompt}</h1>
            {!answerEntered ? (
                <>
                <input value={answer} onChange={handleChange}></input>
                <button onClick={TestAnswer}>AnswerPrompt</button>
                </>
            ):(
                <>
                    <p>Awaiting other player's answers.</p>
                </>
            )}

        </>
    );
};

export default AnswerPrompt;