import React, { useContext } from 'react';
import { socketContext } from '../../../utils/socketContext';
import Timer from '../Timer';


function SelectAnswerFC({lobbyId}){
    const {gameData} = useContext(socketContext);


    return (
        <>
        <h4 className='text-light'>Round {gameData.currentRound}</h4>
        <p className='text-light'>Await for player selections.</p>
        <Timer lobbyId={lobbyId}></Timer>
        {Object.values(gameData.answers).map(item => <p className='text-light'>{item}</p>)}
        </>
    );
};


export default SelectAnswerFC;