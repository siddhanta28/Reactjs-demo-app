import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Login.module.css'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocalStorage } from '../utils/localStorage';


export default function Register() {
  toast.configure();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [userContext, setUserContext] = useContext(UserContext);
  const [userToken, setUserToken] = useLocalStorage("userToken", "");

  const formSubmitHandler = e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong! Please try again later."

    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "users/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, username: email, password, companyName: companyName }),
    })
      .then(async response => {
        setIsSubmitting(false)
        if (!response.ok) {
          if (response.status === 400) {
            toast("Please fill all the fields correctly!");
          } else if (response.status === 401) {
            toast("Invalid email and password combination.");
          } else if (response.status === 500) {
            const data = await response.json();
            if (data.message) toast(data.message || genericErrorMessage);
          } else {
            setError(genericErrorMessage);
          }
        } else {
          const data = await response.json();
          setUserContext(oldValues => {
            return { ...oldValues, token: data.token }
          })
          setUserToken(data.token)
        }
      })
      .catch(error => {
        setIsSubmitting(false)
        toast(genericErrorMessage)
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
        <title>Register | WePitcher - Amazing Pitch Decks</title>
        <meta name="description" content="A Demo of my skills for the wefunder team :)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.pageBody}>
        <h1 className={styles.title}>
          Create Your <Image src="/wepitcher-logo.png" alt="WePitcher Logo" width={280} height={76} /> Account
        </h1>
        <div className={styles.formContainer}>
          <form onSubmit={formSubmitHandler} className={styles.registerForm}>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  First Name
                  <input 
                    className="wepitcherInput"
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    onChange={e => setFirstName(e.target.value)}
                    value={firstName}
                  />
                </label>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Last Name
                  <input 
                    className="wepitcherInput"
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    onChange={e => setLastName(e.target.value)}
                    value={lastName}
                    />
                </label>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Email
                  <input
                    className="wepitcherInput"
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Password
                  <input
                    className="wepitcherInput"
                    id="password"
                    type="password"
                    placeholder="*****************"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </label>
                <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Company Name
                  <input
                    className="wepitcherInput"
                    id="companyName"
                    type="text"
                    placeholder="Acme Inc."
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                  />
                </label>
                {/* <p className="text-gray-600 text-xs italic">This will double as your deck's "slug"</p> */}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button 
                disabled={isSubmitting}
                type="submit"
                value="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
