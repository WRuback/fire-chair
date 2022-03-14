import React, { useContext, useCallback, useState } from 'react';
import { socketContext } from '../../../utils/socketContext';
import { useQuery } from '@apollo/client';
import { QUERY_PROMPTS } from '../../../utils/queries';

function SelectPrompt({lobbyId}){
    const {socket,gameData} = useContext(socketContext);
    const { loading, data } = useQuery(QUERY_PROMPTS);
    const prompts = data?.prompts || [];
    
    const TestPrompt = useCallback((prompt) => {
        socket.emit('promptSelected', lobbyId, prompt);
    }, [socket, lobbyId]);

    const chosen = [];
    
    const choosePrompts = () => {
        let idx = 0;
        while (idx < 3){
            let temp = Math.floor(Math.random() * prompts.length);
            if (prompts[temp] in chosen){
                continue;
            }
            chosen.push(prompts[temp]);
            idx++;
        };
    };

    choosePrompts();
    console.log(chosen);

    return (
        <>
        <h1> You are in the fire Chair!</h1>
        <p> Please select a prompt.</p>
        <button onClick={()=>{TestPrompt(chosen[0].promptText)}}>{chosen[0].promptText}</button>
        <button onClick={()=>{TestPrompt(chosen[1].promptText)}}>{chosen[1].promptText}</button>
        <button onClick={()=>{TestPrompt(chosen[2].promptText)}}>{chosen[2].promptText}</button>
        </>
    );
};

export default SelectPrompt;