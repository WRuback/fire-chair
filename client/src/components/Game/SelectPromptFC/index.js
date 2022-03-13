import React, { useContext, useCallback, useState } from 'react';
import { socketContext } from '../../../utils/socketContext';

function SelectPrompt({lobbyId}){
    const {socket,gameData} = useContext(socketContext);
    
    const TestPrompt = useCallback((promptt) => {
        socket.emit('promptSelected', lobbyId, promptt);
    }, [socket, lobbyId]);
    
    const prompts = ["What's my favorite food?", "What will a rob a bank to buy?", "Who do I bring with me to fight god?"]

    return (
        <>
        <h1> You are in the fire Chair!</h1>
        <p> Please select a prompt.</p>
        <button onClick={()=>{TestPrompt(prompts[0])}}>{prompts[0]}</button>
        <button onClick={()=>{TestPrompt(prompts[1])}}>{prompts[1]}</button>
        <button onClick={()=>{TestPrompt(prompts[2])}}>{prompts[2]}</button>
        </>
    );
};

export default SelectPrompt;