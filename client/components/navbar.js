import React, { useContext } from 'react';
import { UserContext } from "../context/UserContext";
import { useLocalStorage } from '../utils/localStorage';
import { useRouter } from 'next/router';
import Link from "next/link";
import Image from 'next/image'
import styles from '../styles/Layout.module.css'
import hamburgerMenu from '../public/icons/hamburgerMenu.svg';

const Navbar = () => {
  const router = useRouter();
  const [userContext, setUserContext] = useContext(UserContext);
  const [userToken, setUserToken] = useLocalStorage("userToken", "");
  const isLoggedOut = !userContext.token && (userToken === "" || !userToken);

  const logoutHandler = () => {
    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "users/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    }).then(async response => {
      setUserContext(oldValues => {
        return { ...oldValues, details: undefined, token: null }
      })
      setUserToken(null);
      window.localStorage.setItem("logout", Date.now());
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push('/login');
    })
  }

  return (
    <nav className={styles.navbar}>
      <div className="flex items-center flex-shrink-0 text-white mr-20">
      <Link href="/">
        <a>
          <Image src="/wepitcher-logo.png" alt="WePitcher Logo" width={122} height={34} />
        </a>
      </Link>
      </div>
      <div className="block lg:hidden">
        <a className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-500 hover:text-gray-300 hover:border-gray-300">
          <Image src="/icons/hamburgerMenu.svg" alt="Hamburger Menu" width={20} height={20} />
        </a>
      </div>
      <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow content-center	justify-center">
        </div>
        <div className="hidden lg:inline-block">
          <Link href="/decks"><a className="uppercase inline-block text-sm px-4 py-2 leading-none text-black hover:text-gray-500 hover:underline mt-4 lg:mt-2 lg:mr-4">Explore Pitch Decks</a></Link>
          |
          {isLoggedOut
            ? <><Link href="/login"><a className="wepitcherButton wepitcherNavbarButton">LOGIN</a></Link><Link href="/register"><a href="#" className="wepitcherButton wepitcherNavbarButton lg:ml-2">REGISTER</a></Link></> 
            : <><Link href="/account"><a className="wepitcherButton wepitcherNavbarButton">ACCOUNT</a></Link><Link href="#"><a className="wepitcherButton wepitcherNavbarButton lg:ml-2" onClick={logoutHandler}>LOGOUT</a></Link></>
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


