import React from 'react';

import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import DeckList from '../components/DeckList';
import DeckForm from '../components/DeckForm';

import { QUERY_SINGLE_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';

const Profile = () => {

  const { userId } = useParams();

  // If there is no `profileId` in the URL as a parameter, execute the `QUERY_ME` query instead for the logged in user's information
  const { loading, data } = useQuery(
    userId ? QUERY_SINGLE_USER : QUERY_ME,
    {
      variables: { userId: userId },
    }
  );

  // Check if data is returning from the `QUERY_ME` query, then the `QUERY_SINGLE_PROFILE` query
  const user = data?.me || data?.user || {};

  // Use React Router's `<Redirect />` component to redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getUser().data._id === userId) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4 className='text-light'>
        You need to be logged in to see your profile page. Use the navigation
        links above to sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <h1 className='text-light'>Welcome, {user.username}</h1>
      <h2 className='text-light' >Your Custom Prompts</h2>
      {user.deck.length > 0 ? (
        <DeckList
          deck={user.deck}
        />
      ) : (<h3 className='text-light'>Nothing in Your Deck Yet</h3>)}

      <h2 className='text-light'>Create a Prompt</h2>

      <div className="my-4 p-4" style={{ border: '1px dotted #1a1a1a' }}>
        <DeckForm profileId={user._id} />
      </div>
    </div>
  );
};




export default Profile;

