import React, { useContext } from 'react';
import { socketContext } from '../../../utils/socketContext';

const Answer = ({lobbyCode, answerChoice, username}) => {
    const socket = useContext(socketContext);

    const handleAnswerSelection = () => {
        socket.emit('selectReceived', lobbyCode, answerChoice, username);
    };

    return (
        <button className='btn btn-primary' onClick={handleAnswerSelection}>{answerChoice}</button>
    );
};

export default Answer;