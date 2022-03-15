import React, { useContext, useCallback, useState } from 'react';
import { socketContext } from '../../../utils/socketContext';
import auth from '../../../utils/auth';

function AnswerPrompt({ lobbyId }) {
    const { socket, gameData } = useContext(socketContext);
    let [answer, setAnswer] = useState('');
    let [answerEntered, setAnswerEntered] = useState(false);
    
    const TestAnswer = useCallback(() => {
        socket.emit('answerReceived', lobbyId, answer,auth.getUsername());
        setAnswerEntered(true);
    }, [socket, lobbyId, answer]);

    const handleChange = (e) => {
        setAnswer(e.target.value);
    }

    return (
        <>
            <h4 className='text-light'>Round {gameData.currentRound}</h4>
            <h4 className='text-light'>{gameData.fireChair.username} has selected the prompt below! Please answer as if you were {gameData.fireChair.username}.</h4>
            <h1 className='text-light'>{gameData.currentPrompt}</h1>
            {!answerEntered ? (
                <>
                <input className='form-control' value={answer} onChange={handleChange}></input>
                <button className="align-self-end btn btn-danger btn-lg my-4" onClick={TestAnswer}>Answer Prompt</button>
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