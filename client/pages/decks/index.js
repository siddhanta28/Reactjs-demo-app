import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PitchDeckCard from '../../components/pitchDeckCard';
import styles from '../../styles/Decks.module.css';

const Decks = ({ profiles }) => {
  const router = useRouter();
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const { id } = router.query;

  useEffect(() => {
    if(!data || (data && Object.keys(data).length === 0)){
      setLoading(true)
      fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "users")
        .then((res) => res.json())
        .then((data) => {
          setData(data)
          setLoading(false);
      })
    }
    
  }, [data])
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No User Profiles Available</p>
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Explore Pitch Decks | WePitcher - Amazing Pitch Decks</title>
        <meta name="description" content="A Demo of my skills for the wefunder team :)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.pageBody}>
        <div className={styles.main}>
          <h1 className={styles.title}>
            Explore Pitch Decks
          </h1>
          <div className={styles.decksContainer}>
            {data.users.map((profile, index) => (
              <PitchDeckCard key={index} profile={profile} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Decks;

