import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_TO_DECK, ADD_PROMPT } from '../../utils/mutations';

import Auth from '../../utils/auth';

const DeckForm = () => {
  const masterDeck = false;
  const [prompt, setPrompt] = useState('');

  const [addToDeck, { error }] = useMutation(ADD_TO_DECK);
  const [addPrompt, { err }] = useMutation(ADD_PROMPT);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
        const { promptData } = await addPrompt({
            variables: {prompt, masterDeck}
        });
        const data = await addToDeck({
            variables: {promptData},
        });

        setPrompt('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h4>Endorse some more skills below.</h4>

      {Auth.loggedIn() ? (
        <form
          className="flex-row justify-center justify-space-between-md align-center"
          onSubmit={handleFormSubmit}
        >
          <div className="col-12 col-lg-9">
            <input
              placeholder="Endorse some skills..."
              value={prompt}
              className="form-input w-100"
              onChange={(event) => setPrompt(event.target.value)}
            />
          </div>

          <div className="col-12 col-lg-3">
            <button className="btn btn-info btn-block py-3" type="submit">
              Endorse Skill
            </button>
          </div>
          {error && (
            <div className="col-12 my-3 bg-danger text-white p-3">
              {error.message}
            </div>
          )}
        </form>
      ) : (
        <p>
          You need to be logged in to create prompts. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default DeckForm;
