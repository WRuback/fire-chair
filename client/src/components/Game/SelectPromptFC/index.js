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

    let idx = 0;
    while (idx < 3){
        let temp = Math.floor(Math.random() * prompts.length);
        if (prompts[temp] in chosen){
            continue;
        }
        chosen.push(prompts[temp]);
        idx++;
    };

    return (
        <>
        <h1> You are in the fire Chair!</h1>
        <p> Please select a prompt.</p>
        {loading ? (
            <div>Getting Prompts...</div>
        ) : (
            <>
            <button onClick={()=>{TestPrompt(chosen[0])}}>{chosen[0]}</button>
            <button onClick={()=>{TestPrompt(chosen[1])}}>{chosen[1]}</button>
            <button onClick={()=>{TestPrompt(chosen[2])}}>{chosen[2]}</button>
            </>
        )}
        </>
    );
};

export default SelectPrompt;