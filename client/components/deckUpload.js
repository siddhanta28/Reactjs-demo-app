import React, { Fragment, useState, useContext } from 'react';
import Progress from './Progress';
import axios from 'axios';
import { useLocalStorage } from '../utils/localStorage';
import { UserContext } from "../context/UserContext";
import { UploadContext } from '../context/UploadContext';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image'
import styles from '../styles/DeckUpload.module.css'
import imageUpload from '../public/icons/imageUpload.svg';
import spinner from '../public/icons/spinner.svg';

const DeckUpload = (props) => {
  toast.configure();
  const [pitchDeckTitle, setPitchDeckTitle] = useState("");
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [userToken, setUserToken] = useLocalStorage("userToken", "");
  const [userContext, setUserContext] = useContext(UserContext);
  const [uploadContext, setUploadContext] = useContext(UploadContext);
  const [showReupload, setShowReupload] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = e => {
    if (!e.target.files[0]) {
      setFile('');
      setFilename('');
    } else {
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
    }
  };

  const formSubmitHandler = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pitchDeckTitle', pitchDeckTitle);

    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT + 'users/uploadDeck', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userToken}`,
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        }
      });
      setUploadContext(() => {
        return { showReupload: false }
      });

      // Clear percentage
      // setTimeout(() => setUploadPercentage(0), 5000);

      const { fileName, filePath, user } = res.data;
      
      setUserContext(oldValues => {
        return { ...oldValues, details: user }
      });
    
      setUploadedFile({ fileName, filePath });
      setIsSubmitting(false);
      toast('Pitch Deck Successfully Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        toast('There was a problem with the server');
        setIsSubmitting(false);
      } else {
        toast(err.response.data.msg);
        setIsSubmitting(false);
      }
      setUploadPercentage(0)
    }
  };
  const cancelReupload = () => {
    setUploadContext(() => {
      return { showReupload: false }
    });
  }

  return (
    <Fragment>
      {(uploadPercentage === 0 && userContext.details.pitchDeck.images.length === 0 && !isSubmitting)
        || (uploadContext.showReupload && !isSubmitting)
         ? 
        <div>
          <h2>Upload Your Pitch Deck To Get Started
          {!showReupload && userContext.details.pitchDeck.images.length !== 0  ?
            <div className="w-60 text-center text-xs cursor-pointer bg-red-100 hover:bg-red-400 text-gray-800 font-bold py-1 px-4 rounded items-center m-auto my-4" onClick={cancelReupload}>CANCEL REUPLOAD</div>
            : null
          }
          </h2>
          <form onSubmit={formSubmitHandler} className={styles.uploadForm}>
              <div className="my-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                      Title of Pitch Deck:
                      <input
                      className="wepitcherInput"
                      id="pitchDeckTitle"
                      type="text"
                      value={pitchDeckTitle}
                      placeholder="Enter Pitch Deck Title" 
                      onChange={e => setPitchDeckTitle(e.target.value)} />
                  </label>
              </div>
            
              <div className="my-6">
                  <label className={styles.uploadFormLabel}>Upload Your Pitch Deck (PDF or PPT):</label>
                  <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full h-32 border-4 border-gray-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                          <div className="flex flex-col items-center justify-center pt-7">
                              <Image src={imageUpload} alt="me" width="32" height="32" className="w-8 h-8 text-gray-300 group-hover:text-gray-600" />
                              <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                              {filename}</p>
                          </div>
                          <input type="file" name="pitchDeck" className="opacity-0" onChange={onChange} />
                      </label>
                  </div>
              </div>
            
              <input
                  type='submit'
                  value='Add Pitch Deck'
                  className="w-full box-border px-4 py-2 text-white bg-blue-500 rounded shadow-xl "
              />
          </form>
        </div> 
      : null }
      {uploadPercentage !== 0 ? <Progress percentage={uploadPercentage} /> : null }
      {isSubmitting ? <Image src={spinner} alt="me" width="60" height="60" /> : null }

    </Fragment>
  );
};

export default DeckUpload;
