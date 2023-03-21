import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useRouter } from 'next/router';
import { useLocalStorage } from '../utils/localStorage';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Login.module.css';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  toast.configure();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userContext, setUserContext] = useContext(UserContext);
  const [userToken, setUserToken] = useLocalStorage("userToken", "");

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong! Please try again later."

    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    })
    .then(async response => {
      setIsSubmitting(false);
      if (!response.ok) {
        if (response.status === 400) {
          toast("Please fill all the fields correctly!");
        } else if (response.status === 401) {
          toast("Invalid email and password combination.");
        } else {
          toast(genericErrorMessage);
        }
      } else {
        const data = await response.json();
        setUserContext(oldValues => {
          return { ...oldValues, token: data.token }
        })
        setUserToken(data.token);
        router.push('/account');
      }
    })
    .catch(error => {
      setIsSubmitting(false);
      setError(genericErrorMessage);
    })
  }

  useEffect(() => {
    // redirect if no refresh token present
    if (userContext.token || userToken) {
        router.push('/account');
    }
  }, [userContext])

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | WePitcher - Amazing Pitch Decks</title>
        <meta name="description" content="A Demo of my skills for the wefunder team :)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.pageBody}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Login To Your <Image src="/wepitcher-logo.png" alt="WePitcher Logo" width={280} height={76} /> Account
          </h1>
          <div className={styles.formContainer}>
            <form onSubmit={formSubmitHandler} className="w-full rounded-lg shadow-lg bg-gray-50 px-5 pt-5 pb-5 mt-20">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                  <input 
                    className="wepitcherInput"
                    id="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}/>
                </label>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                  <input
                    className="wepitcherInput"
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="******************" />
                  <p className="text-red-500 text-xs italic hidden">Please choose a password.</p>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  value="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    {isSubmitting ? "Signing In" : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
