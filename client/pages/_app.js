import React, { useContext, useCallback, useEffect } from 'react';
import '../styles/globals.css';
import { UserProvider } from "../context/UserContext";
import { UploadProvider } from "../context/UploadContext";
import Layout from '../components/layout';
import { UserContext } from '../context/UserContext';
import {useLocalStorage} from '../utils/localStorage';

function MyApp({ Component, pageProps }) {
  const [userContext, setUserContext] = useContext(UserContext);

  const [userToken, setUserToken] = useLocalStorage("userToken", "");

  const verifyUser = useCallback(() => {
    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "users/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
          return { ...oldValues, token: data.token }
        })
        setUserToken(data.token);
      } else {
        setUserContext(oldValues => {
          return { ...oldValues, token: null }
        })
      }
      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000);
    })
  }, [setUserContext])

  useEffect(() => {
    verifyUser()
  }, [verifyUser]);
  
  /**
  * Sync logout across tabs
  */
  const syncLogout = useCallback(event => {
    if (event.key === "logout") {
      // If using react-router-dom, you may call history.push("/")
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    window.addEventListener("storage", syncLogout)
    return () => {
      window.removeEventListener("storage", syncLogout)
    }
  }, [syncLogout])

    
  return (
    <UserProvider>
      <UploadProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UploadProvider>
    </UserProvider>
  )
}

export default MyApp
