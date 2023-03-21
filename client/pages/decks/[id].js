import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import PitchDeckViewer from '../../components/pitchDeckViewer';
import styles from '../../styles/Decks.module.css'

const PitchDeck = () => {
    const router = useRouter();
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const { id } = router.query;

    useEffect(() => {
     if(!data || (data && Object.keys(data).length === 0)){
        setLoading(true)
        fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "users/" +  id)
          .then((res) => res.json())
          .then((data) => {
            setData(data)
            setLoading(false);
        })
     }
     
    }, [data])
    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>

    return (
        <div className={styles.container}>
            <Head>
            <title>{data.profile.firstName + " " + data.profile.lastName}'s Pitch Deck | WePitcher - Amazing Pitch Decks</title>
            <meta name="description" content="A Demo of my skills for the wefunder team :)" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.pageBody}>
                <div className={styles.main}>
                    <h1 className={styles.title}>
                    {data.profile.firstName + " " + data.profile.lastName}'s Pitch Deck
                    </h1>
                    <div className={styles.profileContainer}>
                        <PitchDeckViewer pitchDeck={data.profile.pitchDeck} disableReupload={true} /> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PitchDeck