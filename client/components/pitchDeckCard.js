import React from 'react';
import PropTypes from 'prop-types';
import Link from "next/link";

const PitchDeckCard = ({ profile }) => {
  return (
    <Link href={'/decks/' + profile._id}><a>
      <div className="p-10">  
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
              <img className="w-full" src={profile.pitchDeck.images[0]} alt="Mountain" />
              <div className="px-6 pt-4">
                  <div className="font-bold text-xl mb-2">{profile.pitchDeck.title}</div>
                  <p className="text-gray-700 text-base">
                  </p>
              </div>
              <div className="px-6 pb-4">
                  By: {profile.firstName + ' ' + profile.lastName}
              </div>
          </div>
      </div>
    </a></Link>
  );
};

PitchDeckCard.propTypes = {
  profile: PropTypes.object.isRequired
};

export default PitchDeckCard;
