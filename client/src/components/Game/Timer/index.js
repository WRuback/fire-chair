import React, { useContext, useState, useEffect } from 'react';
import { socketContext } from '../../../utils/socketContext';

function SelectPrompt({lobbyId}){
    const {gameData} = useContext(socketContext);
    const [seconds, setSeconds] = useState(gameData.currentTime);
    const [timer, setTimer] = useState('');
    useEffect(()=>{
        setSeconds(gameData.currentTime);
        clearInterval(timer);
        const newTimer = setInterval(() => {
            setSeconds(seconds => seconds - 1);
        },1000);
        setTimer(newTimer);
        return () => {
            clearInterval(timer);
            clearInterval(newTimer);
        };
    },[gameData]);
    return (
        <>
        <p className='text-light'> Time Remaining: {seconds > 0 ? seconds : "Wating for Server..."}</p>
        {gameData.error ? <p className='alert alert-info'>{gameData.error}</p>:<></>}
        </>
    );
};

export default SelectPrompt;