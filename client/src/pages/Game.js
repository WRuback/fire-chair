import React from 'react';
import Input from '../components/Game/Input/Input';
import MessageBoard from '../components/Game/MessageBoard/MessageBoard';

const Game = () => {

    return (
        <div>
            {/* Message Display */}
            <MessageBoard />
            {/* Answer Input */}
            <Input />
        </div>
    );
};

export default Game;