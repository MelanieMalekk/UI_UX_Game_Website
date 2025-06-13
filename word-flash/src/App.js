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

function App() {
  const [shownWords, setShownWords] = useState([]);
  const [userInputs, setUserInputs] = useState(["", "", "", ""]);
  const [isVisible, setIsVisible] = useState(true);
  const [score, setScore] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");


  useEffect(() => {
    startNewRound();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputWords = userInputs.map(word => word.toLowerCase().trim());
    const correct = shownWords.filter((word) => inputWords.includes(word));
    setScore(correct.length);

    // setTimeout(() => {
    //   startNewRound();
    // }, 1000);
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

  setTimeout(() => {
    setIsVisible(false);
  }, displayTime);
};


  return (
    <div className="level-selector">
  <label>Select difficulty:</label>
  <select onChange={(e) => setDifficulty(e.target.value)} value={difficulty}>
    <option value="easy">Easy</option>
    <option value="medium">Medium</option>
    <option value="hard">Hard</option>
  </select>


    <div className="container">
      <h1>Word Flash Game</h1>

      {isVisible ? (
        <div className="word-box">
          <h2>Memorize these words:</h2>
          <p className="words">{shownWords.join(" - ")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="input-section">
          <h2>Enter the words you remember:</h2>
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

          <button type="submit">Submit</button>
        </form>
      )}

      {score !== null && (
        <div className="score-section">
          <h3>
            You remembered {score} / {shownWords.length} correctly!
          </h3>

          {score < shownWords.length && (
            <div className="answer-reveal">
              <p>Words you were shown:</p>
              <div className="revealed-words">
                {shownWords.map((word, index) => (
                  <span key={index} className="word-pill">{word}</span>
                ))}
              </div>
            </div>
          )}

          <button className="next-button" onClick={startNewRound}>
            Next
          </button>
        </div>
      )}

    </div>
    </div>
  );
}

export default App;
