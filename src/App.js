import "./App.css";
import { useEffect, useState, useContext } from "react";
import Board from "./components/Board/Board";
import { gameContext } from "./context/context";


const App = () => {
  
  const [selectedMemoBlock, setselectedMemoBlock] = useState(null); //
  const [animating, setAnimating] = useState(false);
  const {
    gameImages,
    setGamePoints,
    gamePoints,
    gameMode,
    setGameWon,
    setTurnos,
    turnos,
    setShuffledMemoBlocks,
    shuffledMemoBlocks,
    FnShuffle,
    setDetectPar,
    detectPar,
    setUserInTurn,
    userInTurn,
    setUser1Score,
    setUser2Score,
    user2Score,
    user1Score,
    user1,
    user2
  } = useContext(gameContext);
  const ImageList = gameImages;
  useEffect(() => {
   
    setShuffledMemoBlocks(FnShuffle);
  
  }, [gameImages]);

 
  const handleMemoClick = (memoBlock) => {
    const flippedMemoBlock = { ...memoBlock, flipped: true }; //Recibimos el objeto memoBlock y lo copiamos y le agregamos la propiedad flipped TRUE

    
    let shuffledMemoBlocksCopy = [...shuffledMemoBlocks]; //Copiamos el array de objetos original

    shuffledMemoBlocksCopy.splice(memoBlock.index, 1, flippedMemoBlock); //Reemplazamos el objeto original por el objeto con la propiedad flipped TRUE

    setShuffledMemoBlocks(shuffledMemoBlocksCopy); //Actualizamos el array de objetos con el objeto con la propiedad flipped TRUE y lo guardamos en el estado de la aplicación para que se renderize en el componente Board (Board.js) y se muestre la carta girada en el componente MemoBlock (MemoBlock.js)
  

   if (gameMode === "1Player") {


 

     if (selectedMemoBlock === null) {
       setselectedMemoBlock(memoBlock); // Si no hay ninguna carta seleccionada, seleccionamos la carta que se hizo click
     } else {
       //Si ya hay una carta seleccionada, seleccionamos la carta que se hizo click

       let turnosCopy = turnos + 1;
       setTurnos(turnosCopy);

       if (selectedMemoBlock.image === memoBlock.image) {
         //

         setselectedMemoBlock(null);
         let gamePointsCopy = gamePoints + 1;
         setGamePoints(gamePointsCopy);

         if (gamePointsCopy === ImageList.length) {
           setGameWon(true);
         }

        
       } else {
         // Si seleccionamos una carta que no es la misma que la seleccionada, se deselecciona la carta seleccionada

         setAnimating(true);
         setTimeout(() => {
           //Despues de un segundo, se deselecciona la carta seleccionada

           shuffledMemoBlocksCopy.splice(memoBlock.index, 1, memoBlock); // Revertimos en la copia de la carta girada con el objeto original.
           shuffledMemoBlocksCopy.splice(
             selectedMemoBlock.index,
             1,
             selectedMemoBlock
           ); // Dejamos la carta seleccionada sin girar.
           setShuffledMemoBlocks(shuffledMemoBlocksCopy); // Dejamos el array de cartas con los objetos originales.
           setselectedMemoBlock(null); // Deseleccionamos la carta seleccionada.
           setAnimating(false);
         }, 800);
       }
     } 
   }
   

    if(gameMode === "2Player"){
    
       
       if (selectedMemoBlock === null) {
         setselectedMemoBlock(memoBlock); // Si no hay ninguna carta seleccionada, seleccionamos la carta que se hizo click
       } else {
         //Si ya hay una carta seleccionada, seleccionamos la carta que se hizo click

         let turnosCopy = turnos + 1;
         setTurnos(turnosCopy);

         if (selectedMemoBlock.image === memoBlock.image) {
           //

           setselectedMemoBlock(null);
           let gamePointsCopy = gamePoints + 1;
           setGamePoints(gamePointsCopy);

           if (gamePointsCopy === ImageList.length) {
             setGameWon(true);
           }

           ///////////////////////////////////////////////
             
           

              if (user1 === userInTurn) {
                console.log("Cambiando turno a user2");
                let user1ScoreCopy = user1Score + 1;
                setUser1Score(user1ScoreCopy);
                console.log('Punto para',user1);
              
              } 
              
              else if (user2 === userInTurn) {
                let user2ScoreCopy = user2Score + 1;
                setUser2Score(user2ScoreCopy);
                console.log("Punto para", user1);
               
              }

            
            
         } else {
           // Si seleccionamos una carta que no es la misma que la seleccionada, se deselecciona la carta seleccionada
             if (user1 === userInTurn) {
               setUserInTurn(user2);
             } else {
               setUserInTurn(user1);
             }

           setAnimating(true);
           
           setTimeout(() => {
             
             //Despues de un segundo, se deselecciona la carta seleccionada

             shuffledMemoBlocksCopy.splice(memoBlock.index, 1, memoBlock); // Revertimos en la copia de la carta girada con el objeto original.
             shuffledMemoBlocksCopy.splice(
               selectedMemoBlock.index,
               1,
               selectedMemoBlock
             ); // Dejamos la carta seleccionada sin girar.
             setShuffledMemoBlocks(shuffledMemoBlocksCopy); // Dejamos el array de cartas con los objetos originales.
             setselectedMemoBlock(null); // Deseleccionamos la carta seleccionada.
             setAnimating(false);
           }, 800);
         }
       } 

    }

   
    
   
  };

  return (
    <div className="Landing">
      <Board
        memoBlocks={shuffledMemoBlocks}
        animating={animating}
        handleMemoClick={handleMemoClick}
      />
    </div>
  );
};

export default App;
