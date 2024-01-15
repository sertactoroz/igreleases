import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';

export default function Home() {
  const [query, setQuery] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/query');
      const data = await res.json();
      console.log(data);
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

  useEffect(() => {
    fetchData();
  }, []); // Use useEffect to fetch data on component mount

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div>
        <h2>Extracted Data:</h2>
        {query.map((item, index) => (
          <div key={index}>
            <h2>{index + 1}</h2>
            <h3><a href={item.link}>{item.name}</a></h3>
            <h4>{item.pubDate}</h4>
            <h4>{item.variantInfo} available</h4>
            {Array.isArray(item.variants) ? (
              <div>
                <p>Variants:</p>
                <ul>
                  {item.variants.map((variant, variantIndex) => (
                    <li key={variantIndex}>
                      <p>Variant: {variant.Variant}</p>
                      <p>Architecture: {variant.Architecture}</p>
                      <p>Version: {variant.Version}</p>
                      <p>DPI: {variant.DPI}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No variants available</p>
            )}
            <hr />
          </div>
        ))}
      </div>
    </Layout>
  );
}