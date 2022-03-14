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
            <h1 className='text-light'>{gameData.currentPrompt}</h1>
            {!answerEntered ? (
                <>
                <input className='form-control' value={answer} onChange={handleChange}></input>
                <button className="align-self-end btn btn-danger btn-lg" onClick={TestAnswer}>AnswerPrompt</button>
                </>
            ):(
                <>
                    <p className='text-light'>Awaiting other player's answers.</p>
                </>
            )}

        </>
    );
};

export default AnswerPrompt;