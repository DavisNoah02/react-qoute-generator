// importing necessary Libararies
import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

// APP function declaration
function App() {
  // initializing the state variables
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false); // New state to control the display of favorites
  const [isClicked, setIsClicked] = useState(false);


  // API TO FETCH FROM...
     // http://api.quotable.io/random

    // a function to fetch   quote
  const fetchNewQuote = async () => {
    try {
      const response = await fetch("http://api.quotable.io/random");
      const data = await response.json();
      // console.log(data.content);
      setQuote(data.content);
      setAuthor(data.author);
      setCopied(false);
      setIsClicked(false);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

// fetching  new quote
  useEffect(() => {
    fetchNewQuote();
  }, []);

  // copying quote to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`"${quote}" - ${author}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false); // Reset copied state after a delay
        }, 2000);//2sec
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        // Optional: Display an error message to the user
      });
  };
  // adding to favourites
 // adding to favourites
const addToFavorites = () => {
  const isDuplicate = favorites.some(fav => fav.quote === quote && fav.author === author);
  if (!isDuplicate) {
    setFavorites([...favorites, { quote, author }]);
  }
};

  // toggle display of fav
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };
  
// RENDERING THE UI
    return (
      <div className="App">
        <div className="quote">

      <button className={`favorite-btn ${isClicked ? 'clicked' : ''}`} onClick={() => {addToFavorites(); setIsClicked(true);}}>
          <FontAwesomeIcon icon={faStar} />
        </button> 
          <h2>{quote}</h2>
          <small>- {author} -</small>
        </div>

        <button className="btn" onClick={fetchNewQuote}>
          Generate New Quote
        </button>

        <div className="copy-box">
          <input type="text" value={`"${quote}" - ${author}`} readOnly />
          <button className="copy-btn" onClick={copyToClipboard}>
            {copied ? "Copied!" : "Copy Quote"}
          </button>
        </div>
        
        <div className="favorites-container">
          <button className="favorites-btn" onClick={toggleFavorites}>
            FAVOURITES
          </button>
          {showFavorites && ( // Conditionally render the favorites section
            <div className="favorites">
              <h3>Favorite Quotes</h3>
              <ul>
                {favorites.map((favorite, index) => (
                  <li key={index}>
                    <p>{favorite.quote}</p>
                    <small>- {favorite.author} -</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

export default App;
