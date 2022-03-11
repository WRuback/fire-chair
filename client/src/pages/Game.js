import React, { useState } from 'react';
import Answer from '../components/Answer/Answer';

const Game = ({ lobbyCode }) => {
    const [answers, setAnswers] = useState([]);
    const [allReceived, setReceived] = useState(false);

    return (
        <div>
            {/* Message Display */}
            <div className='messageDisplay container'>
                {!allReceived ? null : answers.map(answer => <Answer key={answer} answer={answer}/>)}
            </div>
            {/* Answer Input */}
            <div className='input-group'>
                <span className='input-group-text'>Answer</span>
                <input type='text' className='form-control' />
                <button className='btn btn-outline-secondary' type='button'>Submit</button>
            </div>
        </div>
    );
};

export default Game;