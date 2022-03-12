import React, { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Input from '../components/Game/Input/Input';
import MessageBoard from '../components/Game/MessageBoard/MessageBoard';
import { socketContext } from '../utils/socketContext';

const Game = () => {
    const socket = useContext(socketContext);
    const { lobbyId } = useParams();
    const handlePromptSelection = useCallback(() => {
        //Modal for hot seat user to select prompt otherwise waiting modal
        socket.emit('');
    });

    useEffect(() => {
        socket.on('startingRound', handlePromptSelection)
    }, [socket, handlePromptSelection]);

    

    return (
        <main>
            {/* Message Display */}
            <MessageBoard lobbyCode={lobbyId} />
            {/* Answer Input */}
            <Input lobbyCode={lobbyId} />
        </main>
    );
};

export default Game;