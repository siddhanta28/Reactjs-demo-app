import React, { useCallback, useContext, useEffect } from 'react';
import { UserContext } from "../context/UserContext";
import { UploadContext } from "../context/UploadContext";
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Account.module.css'
import { useLocalStorage } from '../utils/localStorage';
// import Loader from "./Loader"
import DeckUpload from '../components/deckUpload';
import PitchDeckViewer from '../components/pitchDeckViewer';

const Account = () => {
  const router = useRouter();
  const [userContext, setUserContext] = useContext(UserContext);
  const [uploadContext, setUploadContext] = useContext(UploadContext);
  const [userToken, setUserToken] = useLocalStorage("userToken", "");

  const fetchUserDetails = useCallback(() => {
    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "users/me", {
      method: "GET",
      credentials: "include",
      // Pass authentication token as bearer token in header
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
        return { ...oldValues, details: data }
        })
      } else {
        if (response.status === 401) {
          // Edge case: when the token has expired.
          // This could happen if the refreshToken calls have failed due to network error or
          // User has had the tab open from previous day and tries to click on the Fetch button
          setUserContext(oldValues => {
            return { ...oldValues, token: null }
          })
          setUserToken(null)
        } else {
          setUserContext(oldValues => {
            return { ...oldValues, details: null }
          })
        }
      }
    })
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    // fetch when user details are not present but user token is present
    if (userToken && !userContext.details) {
      fetchUserDetails()
    }
  }, [userContext.details, fetchUserDetails]);

  useEffect(() => {
    // redirect if no refresh token present
    if (!userContext.token && !userToken) {
        router.push('/login');
    }
  }, [userContext, userToken]);

  return userContext.details === null ? (
    "Error Loading User details"
  ) : !userContext.details ? (
    <p>Loading...</p>
  ) : (
    <div className={styles.container}>
      <Head>
        <title>Account | WePitcher - Amazing Pitch Decks</title>
        <meta name="description" content="A Demo of my skills for the wefunder team :)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.pageBody}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome {userContext.details.firstName}! 
          </h1>
          <div className={styles.accountContainer}>
            {userContext.details.pitchDeck.images.length === 0 || uploadContext.showReupload ? <DeckUpload /> : <PitchDeckViewer pitchDeck={userContext.details.pitchDeck} /> }
          </div>
        </main>
      </div>
    </div>
  )
}

export default Account
