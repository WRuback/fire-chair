import React from 'react';
import { useMutation } from '@apollo/client';

import { REMOVE_FROM_DECK, REMOVE_PROMPT } from '../../utils/mutations';
import { QUERY_ME } from '../../utils/queries';

const DeckList = ({ deck }) => {
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

  const handleRemovePrompt = async (promptId) => {
    try {
      await removeFromDeck({
        variables: { promptId },
      });

      await removePrompt({
        variables: {promptId},
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex-row justify-space-between my-4">
        {
          deck.map((promptData) => (
            <div key={promptData._id} className="col-12 col-xl-6">
              <div className="card mb-3">
                <h4 className="card-header bg-dark text-light p-2 m-0 display-flex align-center">
                  <span>{promptData.promptText}</span>
                  <button
                    className="btn btn-sm btn-danger ml-auto"
                    onClick={() => handleRemovePrompt(promptData._id)}
                  >
                    X
                  </button>
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
