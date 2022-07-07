import React, { useState } from "react";

export const gameContext = React.createContext();

export default function Provider({ children }) {
  const [gameMode, setGameMode] = useState("1Player");
  const [dificult, setDificult] = useState("facil");
  const [user1, setUser1] = useState(undefined);
  const [user2, setUser2] = useState(undefined);
  const [user1Score, setUser1Score] = useState(0);
  const [user2Score, setUser2Score] = useState(0);
  const [turn, setTurn] = useState(0);

  const [gameStarted, setGameStarted] = useState(false);


  const [gameWon, setGameWon] = useState(false);
  const [gameDraw, setGameDraw] = useState(false);
  const [gameImages, setGameImages] = useState([]);

  const [gamePoints, setGamePoints] = useState(0);
  const [turnos, setTurnos] = useState(0);
  const [gameStart, setGameStart] = useState(false);
  const [userInTurn, setUserInTurn] = useState(undefined);
  const [detectPar,setDetectPar] = useState(false);

  // console.log(window.navigator.language);
  const shuffleArray = (a) => {
    //Mezclar el array de emojis y devolverlo como un nuevo array con los mismos elementos
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const shuffledImageList = shuffleArray([...gameImages, ...gameImages]);
  const FnShuffle = shuffledImageList.map((image, i) => ({
    index: i,
    image,
    flipped: false,
  }));

  const [shuffledMemoBlocks, setShuffledMemoBlocks] = useState();

  const values = {
    gameMode,
    dificult,
    setDificult,
    setGameMode,
    user1,
    setUser1,
    user2,
    setUser2,
    user1Score,
    setUser1Score,
    setUser2Score,   
    user2Score,
    turn,
    setTurn,
    gameStarted,
    setGameStarted,
    gameWon,
    setGameWon,
    gameDraw,
    setGameDraw,
    setGameImages,
    gameImages,
    gamePoints,
    setGamePoints,
    turnos,
    setTurnos,
    gameStart,
    setGameStart,
    setShuffledMemoBlocks,
    FnShuffle,
    shuffledMemoBlocks,
    userInTurn,
    setUserInTurn,
    detectPar,
    setDetectPar,
  };
  return <gameContext.Provider value={values}>{children}</gameContext.Provider>;
}
