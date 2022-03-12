import React, { useContext, useEffect, useState } from 'react';
import Answer from '../Answer/Answer';
import { socketContext } from '../../../utils/socketContext';

const MessageBoard = () => {
    const socket = useContext(socketContext);
    const [answers, setAnswers] = useState([]);
    const [allReceived, setReceived] = useState(false);
    let lobbyCode;
    let username;

    useEffect(() => {
        socket.on('selectAnswers', (clientData) => {
            setAnswers(clientData.answers);
            lobbyCode = clientData.lobbyCode;
            setReceived(true);
        });

        socket.on('startingRound', () => {
            setAnswers([]);
            setReceived(false);
        });

    });

    return (
        <div className='messageDisplay container'>
            {!allReceived ? null : answers.map(answer => <Answer key={answer} lobbyCode={lobbyCode} answerChoice={answer} username={username}/>)}
        </div>
    )
};

export default MessageBoard;