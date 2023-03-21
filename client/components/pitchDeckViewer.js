import React, { useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { UploadContext } from '../context/UploadContext';
import { UserContext } from '../context/UserContext';

const PitchDeckViewer = (props) => {
  const [uploadContext, setUploadContext] = useContext(UploadContext);
  const [userContext, setUserContext] = useContext(UserContext);
  const pitchDeck = props.pitchDeck;
  const pitchDeckImages = pitchDeck.images;
  const reuploadDeck = () => {
    setUploadContext(() => {
      return { showReupload: true }
    });
   }
  return (
    <div className={'max-w-xl m-auto'}>
      <h2 className='text-xl justify-center align-center leading-6 text-center'>Pitch Deck Title: {pitchDeck.title}
      {(!uploadContext.showReupload && Object.keys(userContext).length !== 0) && !props.disableReupload ?
        <div className="w-60 text-center text-xs cursor-pointer bg-blue-100 hover:bg-blue-400 text-gray-800 font-bold py-1 px-4 rounded items-center m-auto my-4" onClick={reuploadDeck}>REUPLOAD PITCH DECK</div>
        : null
      }</h2>
      {pitchDeckImages.map((image, index) => 
         <img src={image} key={index} />       
      )}
    </div>
  );
};

export default PitchDeckViewer;
