import React, { useContext, useCallback, useState } from 'react';
import { socketContext } from '../../../utils/socketContext';
import auth from '../../../utils/auth';
import Timer from '../Timer';

function SelectAnswer({ lobbyId }) {
    const { socket, gameData } = useContext(socketContext);
    let [answerEntered, setAnswerEntered] = useState(false);

    const testSelect = useCallback((selected) => {
        socket.emit('selectReceived', lobbyId, selected, auth.getUsername());
        setAnswerEntered(true);
    }, [socket, lobbyId]);

    function shuffle(array){
        for(let i = array.length-1; i>0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    return (
        <div>
            <h4 className='text-light'>Round {gameData.currentRound}</h4>
            <h1 className='text-light'> Which answer did <span className='text-warning'>{gameData.fireChair.username}</span> select for the prompt '{gameData.currentPrompt}'</h1>
            <Timer lobbyId={lobbyId}></Timer>
            {answerEntered ? <>
                <p>Awaiting other answers.</p>
            </> : <>
                {shuffle(Object.keys(gameData.answers)).map(item => {
                    if (item !== auth.getUsername()) {
                        return (
                            <>
                                <button className="align-self-end btn btn-danger btn-lg py-5 m-1" onClick={() => { testSelect(item) }}>{gameData.answers[item]}</button>
                            </>
                        )
                    }else{
                        return <></>;
                    }
                })}
            </>}
        </div>
    );
};

export default SelectAnswer;