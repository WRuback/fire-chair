import React, { useContext, useCallback } from 'react';
import { socketContext } from '../../../utils/socketContext';
import { useQuery } from '@apollo/client';
import { QUERY_PROMPTS } from '../../../utils/queries';
import Timer from '../Timer';

function SelectPrompt({lobbyId}){
    const {socket,gameData} = useContext(socketContext);
    const { loading, data } = useQuery(QUERY_PROMPTS);
    const prompts = data?.prompts || [];
    
    const TestPrompt = useCallback((prompt) => {
        socket.emit('promptSelected', lobbyId, prompt);
    }, [socket, lobbyId]);
    
    const choosePrompts = () => {
        const chosen = [{promptText: ''}, {promptText: ''}, {promptText: ''}];
        let idx = 0;
        while (idx < 3){
            let temp = Math.floor(Math.random() * prompts.length);
            if (prompts[temp] in chosen){
                continue;
            }
            chosen[idx] = prompts[temp];
            idx++;
        };
        return chosen;
    };
    
    
    return (
        <>
        <h4 className='text-light'>Round {gameData.currentRound}</h4>
        <h1 className='text-light'> You are in the fire Chair!</h1>
        <Timer lobbyId={lobbyId}></Timer>
        <p className='text-light'> Please select a prompt.</p>
        {loading ? (
            <p>Pulling Prompts...</p>
        ) : (
            <div className='flex-row justify-space-between my-4'>
                {choosePrompts().map((prompt) => {
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