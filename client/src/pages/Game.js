import React, { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AnswerPrompt from '../components/Game/AnswerPrompt';
import DisplayScore from '../components/Game/DisplayScores';
import SelectAnswer from '../components/Game/SelectAnswer';
import SelectPrompt from '../components/Game/SelectPrompt';
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

    useEffect(()=>{
        socket.on('requestPrompt', clientData => {
            setGameData(clientData);
        });
        socket.on('answerPrompt', clientData => {
            setGameData(clientData);
        });
        socket.on('selectAnswers', clientData => {
            setGameData(clientData);
        });
        socket.on('displaySelectionScore', clientData => {
            setGameData(clientData);
        });
        return () =>{
            socket.off('requestPrompt', clientData => {
                setGameData(clientData);
            });
            socket.off('answerPrompt', clientData => {
                setGameData(clientData);
            });
            socket.off('selectAnswers', clientData => {
                setGameData(clientData);
            });
            socket.off('displaySelectionScore', clientData => {
                setGameData(clientData);
            });
        }
    }, [socket, setGameData]);

    const testStart = useCallback(() => {
        socket.emit('startRound', lobbyId);
    }, [socket, lobbyId]);


    const testSwitch=() => {
        console.log(gameData.gameState);
        switch (gameData.gameState) {
            case 'Testing':
                return <button onClick={testStart}>StartGame</button>;
            case 'Select Prompt':
                return <SelectPrompt lobbyId={lobbyId}></SelectPrompt>;
            case 'Answer Prompt':
                return <AnswerPrompt lobbyId={lobbyId}></AnswerPrompt>;
            case 'Select Answer':
                return <SelectAnswer lobbyId={lobbyId}></SelectAnswer>;
            default:
                return <DisplayScore lobbyId={lobbyId}></DisplayScore>;
        }
    }
    return (
        <>
        {testSwitch()}
        </>
    );
};

export default Game;