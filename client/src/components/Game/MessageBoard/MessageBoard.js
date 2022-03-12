import React, { useContext, useEffect, useState } from 'react';
import Answer from '../Answer/Answer';
import { socketContext } from '../../../utils/socketContext';

const MessageBoard = ({ lobbyCode }) => {
    const socket = useContext(socketContext);
    const [answers, setAnswers] = useState([]);
    const [allReceived, setReceived] = useState(false);

    //Pull from localstorage or elsewhere
    let username;

    useEffect(() => {
        socket.on('selectAnswers', (clientData) => {
            setAnswers(clientData.answers);
            setReceived(true);
        });

        socket.on('startingRound', () => {
            setAnswers([]);
            setReceived(false);
        });

    }, [socket]);

    return (
        <div className='messageDisplay container'>
            {!allReceived ? null : answers.map(answer => <Answer key={answer} lobbyCode={lobbyCode} answerChoice={answer} username={username}/>)}
        </div>
    )
};

export default MessageBoard;