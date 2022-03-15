import React from 'react';
import { useMutation } from '@apollo/client';

import { REMOVE_FROM_DECK, REMOVE_PROMPT } from '../../utils/mutations';
import { QUERY_ME } from '../../utils/queries';

const DeckList = ({ deck, isLoggedInUser = false }) => {
  const [removeFromDeck, { error }] = useMutation(REMOVE_FROM_DECK, {
    update(cache, { data: { removeFromDeck } }) {
      try {
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: removeFromDeck },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const [removePrompt] = useMutation(REMOVE_PROMPT, {
    update(cache, {data: {removePrompt}}) {
      try {
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: removePrompt},
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const handleRemovePrompt = async (prompt) => {
    try {
      await removeFromDeck({
        variables: { prompt },
      });

      const { data } = await removePrompt({
        variables: {prompt},
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!deck.length) {
    return <h3>Nothing in Your Deck Yet</h3>;
  }

  return (
    <div>
      <div className="flex-row justify-space-between my-4">
        {deck &&
          deck.map((prompt) => (
            <div key={prompt} className="col-12 col-xl-6">
              <div className="card mb-3">
                <h4 className="card-header bg-dark text-light p-2 m-0 display-flex align-center">
                  <span>{prompt}</span>
                  {isLoggedInUser && (
                    <button
                      className="btn btn-sm btn-danger ml-auto"
                      onClick={() => handleRemovePrompt(prompt)}
                    >
                      X
                    </button>
                  )}
                </h4>
              </div>
            </div>
          ))}
      </div>
      {error && (
        <div className="my-3 p-3 bg-danger text-white">{error.message}</div>
      )}
    </div>
  );
};

export default DeckList;
