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

    const chosen = [{promptText: ''}, {promptText: ''}, {promptText: ''}];
    
    const choosePrompts = () => {
        let idx = 0;
        while (idx < 3){
            let temp = Math.floor(Math.random() * prompts.length);
            if (prompts[temp] in chosen){
                continue;
            }
            chosen[idx] = prompts[temp];
            idx++;
        };
    };

    choosePrompts();
    return (
        <>
        <h1> You are in the fire Chair!</h1>
        <p> Please select a prompt.</p>
        {loading ? (
            <p>Pulling Prompts...</p>
        ) : (
            <div className='flex-row justify-space-between my-4'>
                {chosen.map((prompt) => {
                    return ( <div className='col-12 col-xl-6'>
                        <div className='card mb-3'>
                            <h4 className='card-header bg-dark text-light p-2 m-0 display-flex align-center'>
                                <span>{prompt.promptText}</span>
                                <button className='btn btn-sm btn-danger ml-auto' onClick={()=>{TestPrompt(prompt.promptText)}}>Choose Me!</button>
                            </h4>
                        </div>
                    </div>)
                })}
            </div>
        )}
        
        </>
    );
};

export default SelectPrompt;