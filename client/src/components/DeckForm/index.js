import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_TO_DECK, ADD_PROMPT } from '../../utils/mutations';

import Auth from '../../utils/auth';

const DeckForm = () => {
  const masterDeck = false;
  const [promptText, setPrompt] = useState('');

  const [addToDeck] = useMutation(ADD_TO_DECK);
  const [addPrompt, { error }] = useMutation(ADD_PROMPT);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log('Getting promptdata')
      const { data } = await addPrompt({
        variables: {promptText, masterDeck}
      });

      console.log(data);
      const promptId = data.addPrompt._id;

      await addToDeck({
            variables: {promptId},
        });

        setPrompt('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h4>Create your own Prompt</h4>

      {Auth.loggedIn() ? (
        <form
          className="flex-row justify-center justify-space-between-md align-center"
          onSubmit={handleFormSubmit}
        >
          <div className="col-12 col-lg-9">
            <input
              placeholder="Some prompt..."
              value={promptText}
              className="form-input w-100"
              onChange={(event) => setPrompt(event.target.value)}
            />
          </div>

          <div className="col-12 col-lg-3">
            <button className="btn btn-info btn-block py-3" type="submit">
              Create Prompt
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
