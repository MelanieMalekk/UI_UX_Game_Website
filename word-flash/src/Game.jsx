import React, { useState, useEffect } from "react";
import "./App.css";

const wordBank = [
  "apple", "banana", "orange", "grape", "mango", "peach", "cherry", "lemon", "lime", "melon",
  "car", "train", "plane", "boat", "bike", "truck", "bus", "scooter", "subway", "taxi",
  "dog", "cat", "bird", "fish", "horse", "lion", "tiger", "bear", "monkey", "zebra",
  "table", "chair", "desk", "lamp", "sofa", "shelf", "mirror", "window", "door", "bed",
  "book", "pen", "paper", "notebook", "folder", "chalk", "marker", "eraser", "stapler", "tape",
  "sky", "sun", "moon", "star", "cloud", "rain", "storm", "wind", "snow", "fog",
  "red", "blue", "green", "yellow", "purple", "pink", "white", "black", "orange", "brown",
  "happy", "sad", "angry", "tired", "excited", "nervous", "bored", "scared", "surprised", "confused",
  "run", "walk", "jump", "swim", "read", "write", "sleep", "eat", "drink", "think"
];

function Game() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "guest";
  });

  const [totalScore, setTotalScore] = useState(0);
  const [shownWords, setShownWords] = useState([]);
  const [userInputs, setUserInputs] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [score, setScore] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [stage, setStage] = useState("home");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem("scores")) || {};
    if (storedScores[username]) {
      setTotalScore(storedScores[username]);
    }
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputWords = userInputs.map(word => word.toLowerCase().trim());
    const correct = shownWords.filter((word) => inputWords.includes(word));
    setScore(correct.length);
    setTotalScore(prev => {
      const updated = prev + correct.length;
      const storedScores = JSON.parse(localStorage.getItem("scores")) || {};
      storedScores[username] = updated;
      localStorage.setItem("scores", JSON.stringify(storedScores));
      return updated;
    });
  };

  const handleInputChange = (index, value) => {
    const updatedInputs = [...userInputs];
    updatedInputs[index] = value;
    setUserInputs(updatedInputs);
  };

  const startNewRound = () => {
    let wordCount, displayTime;

    switch (difficulty) {
      case "easy":
        wordCount = 3;
        displayTime = 5000;
        break;
      case "medium":
        wordCount = 4;
        displayTime = 4000;
        break;
      case "hard":
        wordCount = 5;
        displayTime = 3000;
        break;
      default:
        wordCount = 3;
        displayTime = 5000;
    }

    const newWords = wordBank.sort(() => 0.5 - Math.random()).slice(0, wordCount);
    setShownWords(newWords);
    setUserInputs(new Array(wordCount).fill(""));
    setIsVisible(true);
    setScore(null);
    setStage("game");
    setShowMenu(false);

    setTimeout(() => {
      setIsVisible(false);
    }, displayTime);
  };

  const resetScore = () => {
    const scores = JSON.parse(localStorage.getItem("scores")) || {};
    scores[username] = 0;
    localStorage.setItem("scores", JSON.stringify(scores));
    setTotalScore(0);
  };

  return (
    <div className="container">
      {/* Floating Buttons */}
      {stage !== "home" && (
        <div className="menu-bar-wrapper">
          <div className="top-left">
            
            <button className="restart-button-top" onClick={startNewRound}>
              ⟳ Restart
            </button>
          </div>
          <div className="top-right">
            <button className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
              ☰
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button className="menu-item" onClick={() => setStage("home")}>
                  Change Difficulty
                </button>
                {/* <button className="menu-item" onClick={resetScore}>
                  Reset Score
                </button> */}
                <button className="menu-item" onClick={() => window.location.replace("../../index.html")}>
                  Return Home
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Score Display */}
      <div style={{ textAlign: "right", fontSize: "1rem", fontWeight: "bold", color: "var(--subtitle-color)" }}>
        Total Score: {totalScore}
      </div>

      {/* Game Content */}
      {stage === "home" ? (
        <div className="level-selector">
          <label htmlFor="difficulty">Select Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <div className="button-group">
            <button className="start-button" onClick={startNewRound}>
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <h1 className="game-title">Word Flash Game</h1>

          {isVisible ? (
            <div className="word-box">
              <h2 className="game-subtitle">Memorize these words:</h2>
              <p className="words">{shownWords.join(" - ")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="input-section">
              <h2 className="game-subtitle">Enter the words you remember:</h2>
              {userInputs.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Word ${index + 1}`}
                  className="input-box"
                />
              ))}
              <div className="submit-button-wrapper">
                <button type="submit" className="submit-full">
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Score Popup */}
      {score !== null && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <p style={{ fontSize: "1rem", color: "#FFD600", marginBottom: "1rem" }}>
              Total Score: {totalScore}
            </p>
            <h3>You remembered {score} / {shownWords.length} correctly!</h3>
            {score < shownWords.length && (
              <>
                <p style={{ marginTop: "1rem" }}>Words you were shown:</p>
                <div className="revealed-words">
                  {shownWords.map((word, index) => (
                    <span key={index} className="word-pill">
                      {word}
                    </span>
                  ))}
                </div>
              </>
            )}
            <div className="button-group" style={{ marginTop: "2rem" }}>
              <button className="next-button" onClick={() => {
                setScore(null);
                startNewRound();
              }}>Next</button>
              <button className="restart-button" onClick={() => {
                setScore(null);
                setStage("home");
              }}>Change Difficulty</button>
              <button className="home-button" onClick={() => window.location.replace("../../index.html")}>
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
