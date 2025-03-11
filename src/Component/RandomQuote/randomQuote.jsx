import React, { useState, useEffect } from 'react';
import './randomQuote.css';
import twitter_icon from '../assets/twitter.png';
import linkedIn_icon from '../assets/linkedin.png';
import whatsapp_icon from '../assets/whatsapp.png';

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
      console.log("Fetching quote...");
      const response = await fetch("http://api.quotable.io/random");
    
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quotes: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data); // Debugging log
  
      setQuote({
        text: data.content,
        author: data.author || "Unknown"
      });
      setCopied(false);
    } catch (error) {
      console.error("Error fetching quote:", error.message);
      setQuote({
        text: "An error occurred while fetching the quote. Please try again.",
        author: "Error"
      });
    } finally {
      setLoading(false);
    }
  };



  
  // const fetchNewQuote = async () => {
  //   setLoading(true);
  //   try {
  //     console.log("Fetching quote...");
      
  //     const response = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"));
  
  
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch quotes: ${response.status} ${response.statusText}`);
  //     }
  
  //     const rawData = await response.json();
  //     const data = JSON.parse(rawData.contents);
  
  //     console.log("API Response:", data); // Debugging log
  
  //     if (Array.isArray(data) && data.length > 0) {
  //       setQuote({
  //         text: data[0].q,
  //         author: data[0].a || "Unknown"
  //       });
  //     } else {
  //       throw new Error("Unexpected API response format");
  //     }
  
  //     setCopied(false);
  //   } catch (error) {
  //     console.error("Error fetching quote:", error.message);
  //     setQuote({
  //       text: `Error: ${error.message}`,
  //       author: "Error"
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
 
  
  
  
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
   * share current quotes on Socials
   */
    const shareOnLinkedIn = () => {
      const quoteText = `"${quote.text}" - ${quote.author}`;
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(quoteText)}`;
      window.open(linkedInUrl, "_blank");
    };
    const shareOnWhatsApp = () => {
      const quoteText = `"${quote.text}" - ${quote.author}`;
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(quoteText)}`;
      window.open(whatsappUrl, "_blank");
    };
    
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

        <div className="share">
          
          <div className="icons">
            <img src={twitter_icon} onClick={ () => tweetQuote() } alt="Share on Twitter" />
            <img src={ linkedIn_icon} onClick={ () => shareOnLinkedIn() } alt="Share on LinkedIn" />
            <img src={whatsapp_icon} onClick={ () => shareOnWhatsApp() } alt="Share on WhatsApp" />
          </div>
        </div>
        

      </div>
      <button className="btn" onClick={fetchNewQuote} disabled={loading}>
        Generate Quote
      </button>
     
    </div>
  );
}

export default App;