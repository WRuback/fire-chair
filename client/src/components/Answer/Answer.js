import React from 'react';

const Answer = ({answer}) => {
    return (
        <button className='btn btn-primary'>{answer.text}</button>
    );
};

export default Answer;