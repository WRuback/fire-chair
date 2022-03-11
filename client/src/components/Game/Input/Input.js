import React, { useContext, useEffect, useState } from 'react';
import { socketContext } from '../../../utils/socketContext';

const Input = ({lobbyCode, username}) => {
    const socket = useContext(socketContext);
    const [answer, setAnswer] = useState('');
    const [disabled, setDisabled] = useState(false);
    
    useEffect(() => {
        socket.on('answerPrompt', setDisabled(false));
    });

    
    const handleAnswerSubmit = () => {
        if (answer === '' || disabled){
            return;
        }
        socket.emit('answerReceived', lobbyCode, answer, username);
        setDisabled(true);
        return;
    };

    return (
        <div className='input-group'>
            <span className='input-group-text'>Answer</span>
            <input type='text' className='form-control' onChange={(event) => setAnswer(event.target.value)}/>
            <button className='btn btn-outline-secondary' type='button' onClick={handleAnswerSubmit}>Submit</button>
        </div>
    );
};

export default Input;