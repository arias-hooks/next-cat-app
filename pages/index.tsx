import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Loader } from 'semantic-ui-react';
import styles from '../styles/Home.module.scss';

interface SearchCatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface IndexPageProps {
  initialSearchCatUrl: string;
}

const fetchCatImage = async (): Promise<SearchCatImage> => {
  const response = await fetch('https://api.thecatapi.com/v1/images/search');
  const data = await response.json();
  return data[0];
}

const Home: NextPage<IndexPageProps> = ({initialSearchCatUrl}: IndexPageProps) => {
  const [catImageUrl, setCatImageUrl] = React.useState<string>(initialSearchCatUrl);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleClick = async () => {
    setIsLoading(true);
    const catImage = await fetchCatImage();
    setCatImageUrl(catImage.url);
    setIsLoading(false);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }
    }>
      <h1>猫画像アプリ</h1>
      {isLoading ? <Loader active size='huge' inline="centered"/>
      :
      <div className={styles.imageContainer}>
        <Image className={styles.image} src={catImageUrl} alt='cat' layout="fill" objectFit="contain" />
      </div>
      }
      <button className="ui button" style={{
        marginTop: "30px"
      }} onClick={handleClick}>猫をもっと見る</button>
    </div>
  )
}

// SSR
export const getServerSideProps: GetServerSideProps<IndexPageProps> = async () => {
  const catImage = await fetchCatImage();
  return {
    props: {
      initialSearchCatUrl: catImage.url
    }
  }
}

export default Home
