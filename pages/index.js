import { useState } from 'react';
import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';

export default function Home() {
  const [query, setQuery] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/query');
      const data = await res.json();

      if (Array.isArray(data)) {
        setQuery(data);
      } else {
        console.error('API response is not an array:', data);
        setQuery([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setQuery([]);
    }
  };
  fetchData();
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {/* <button onClick={fetchData}>Get Data</button> */}
      <div>
        <h2>Extracted Data:</h2>
        {query.map((item, index) => (
          <div key={index}>
            <h3>{item.title}</h3>
            <p>Link: {item.link}</p>
            <p>Publication Date: {item.pubDate}</p>
            <hr />
          </div>
        ))}
      </div>
    </Layout>
  );
}