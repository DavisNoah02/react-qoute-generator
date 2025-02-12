import React, { useState, useEffect } from 'react';
import './randomQuote.css';
import twitter_icon from '../assets/X ICON2.png';

function App() {
  // Initialize the state variables
  const [quote, setQuote] = useState({ // stores the current quote
    text: "",
    author: ""
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);


  //  function to fetch a new quote
  const fetchNewQuote = async () => {
    setLoading(true);
    try {
      console.log("Fetching quotes...");
      // Make a GET request to the API to fetch a new quote
      const response = await fetch("http://api.quotable.io/random");
      if (!response.ok) {
        throw new Error(`Failed to fetch quotes: ${response.status} ${response.statusText}`);
      }
      // Parse the response data as JSON
      const data = await response.json();

      setQuote({
        text: data.content,
        author: data.author || "Unknown"
      });
      setCopied(false);
    } catch (error) {
      // console.error("Error fetching quote:", error);
      setQuote({
        text: "An error occurred while fetching the quote. Please try again.",
        author: "Error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuote();
  }, []);



  /**
   * Copies the current quote to the clipboard.
   * If the quote is empty, logs an error message.
   */
  const copyToClipboard = () => {
    if (!quote.text) {
      console.error("No quote to copy.");
      return;
    }
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };
    /**
   * Tweets the current quote.
   */
    const tweetQuote = () => {
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote.text}" - ${quote.author}`)}`;
      window.open(tweetUrl, "_blank");
    };


  // rendering the component
  return (
    <div className="App">
      <div className="quote">
      
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2>{quote.text}</h2>
            <small>- {quote.author} -</small>
          </>
        )}
        <span className="copy-icon" onClick={copyToClipboard} title="Copy to clipboard">
        <i className="fas fa-copy" />
        {copied && <span className="copied-tooltip">Copied!</span>}
      </span>

        <div className="icons">
        <img src={twitter_icon} onClick={ () => tweetQuote() } alt="Share on Twitter" />
      </div>
      
      </div>
      <button className="btn" onClick={fetchNewQuote} disabled={loading}>
        Generate Quote
      </button>
     
    </div>
  );
}

export default App;