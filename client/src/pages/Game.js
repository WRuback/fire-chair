import React, { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AnswerPrompt from '../components/Game/AnswerPrompt';
import DisplayScore from '../components/Game/DisplayScores';
import SelectAnswer from '../components/Game/SelectAnswer';
import SelectAnswerFC from '../components/Game/SelectAnswerFC';
import SelectPrompt from '../components/Game/SelectPrompt';
import SelectPromptFC from '../components/Game/SelectPromptFC';
import GameOver from '../components/Game/GameOver';
import Timer from '../components/Game/Timer';
// import Input from '../components/Game/Input/Input';
// import MessageBoard from '../components/Game/MessageBoard/MessageBoard';
import { socketContext } from '../utils/socketContext';

const Game = () => {
    const { socket, gameData, setGameData } = useContext(socketContext);
    const { lobbyId } = useParams();
    // const handlePromptSelection = useCallback(() => {
    //     //Modal for hot seat user to select prompt otherwise waiting modal
    //     socket.emit('');
    // });

    useEffect(() => {
        socket.on('requestPrompt', clientData => {
            setGameData(clientData);
        });
        socket.on('requestPromptFC', clientData => {
            setGameData(clientData);
        });
        socket.on('answerPrompt', clientData => {
            setGameData(clientData);
        });
        socket.on('selectAnswers', clientData => {
            setGameData(clientData);
        });
        socket.on('selectAnswersFC', clientData => {
            setGameData(clientData);
        });
        socket.on('displaySelectionScore', clientData => {
            setGameData(clientData);
        });
        socket.on('gameOver', clientData => {
            setGameData(clientData);
        });
        return () => {
            socket.off('requestPrompt', clientData => {
                setGameData(clientData);
            });
            socket.off('requestPromptFC', clientData => {
                setGameData(clientData);
            });
            socket.off('answerPrompt', clientData => {
                setGameData(clientData);
            });
            socket.off('selectAnswers', clientData => {
                setGameData(clientData);
            });
            socket.off('selectAnswersFC', clientData => {
                setGameData(clientData);
            });
            socket.off('displaySelectionScore', clientData => {
                setGameData(clientData);
            });
            socket.off('gameOver', clientData => {
                setGameData(clientData);
            });
        }
    }, [socket, setGameData]);


    const testSwitch = () => {
        console.log(gameData.gameState);
        switch (gameData.gameState) {
            case 'Select Prompt':
                return <SelectPrompt lobbyId={lobbyId}></SelectPrompt>;

            case 'Select PromptFC':
                return <SelectPromptFC lobbyId={lobbyId}></SelectPromptFC>;

            case 'Answer Prompt':
                return <AnswerPrompt lobbyId={lobbyId}></AnswerPrompt>;

            case 'Select Answer':
                return <SelectAnswer lobbyId={lobbyId}></SelectAnswer>;

            case 'Select AnswerFC':
                return <SelectAnswerFC lobbyId={lobbyId}></SelectAnswerFC>;
 
            case 'Display Score':
                return <DisplayScore lobbyId={lobbyId}></DisplayScore>;
            case 'Game Over':
                return <GameOver lobbyId={lobbyId}></GameOver>;
            default:
                return <p className='text-light'>This game no longer exists, sorry!</p>;
        }
    }
    return (
        <>
            {testSwitch()}
        </>
    );
};

export default Game;