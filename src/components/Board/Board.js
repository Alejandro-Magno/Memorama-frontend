import { useContext, useRef, useState, useEffect, Suspense } from "react";
import MemoBlock from "../MemoBlock/MemoBlock";
import "./Board.css";

import { gameContext } from "../../context/context";
import fetchData from "../Settings/functions/fetchImages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Board = ({ animating, handleMemoClick, memoBlocks }) => {
  const {
    setGameMode,
    setDificult,
    setUser1,
    setUser2,
    setGameImages,
    gameImages,
    turnos,
    setTurnos,
    setGameWon,
    setGamePoints,
    gameWon,
    gameStart,
    setGameStart,
    setShuffledMemoBlocks,
    FnShuffle,
    gamePoints,
    user1,
    user2,
    user1Score,
    user2Score,
    userInTurn,
    setUserInTurn,
    setUser2Score,
    setUser1Score,
    gameMode,
  } = useContext(gameContext);
  const currentDificult = useRef("facil");
  const currentWinner = useRef(undefined);
  const [currentGameMode, setCurrentGameMode] = useState("1Player");
  const currentUser1 = useRef(undefined);
  const currentUser2 = useRef(undefined);
  const currentImageSelected = useRef("cats");
  const currentWinnerData = useRef(undefined);
  let pares = 0; //Contador de pares

  useEffect(() => {
    // Selecciona el modo de juego predeterminado y carga las imagenes
    SaveImages(currentDificult.current);
  }, [currentDificult.current]);

  useEffect(() => {
    // UseEffect para marcar las configuraciones cuando son  cambiadas.

    for (let index = 1; index <= 2; index++) {
      let buttonComprobation = document.querySelector(
        `#gamemode > div:nth-child(${index}) > button`
      );

      if (buttonComprobation.value === currentGameMode) {
        buttonComprobation.className = "activeButton gameBtn";
      } else {
        buttonComprobation.classList.remove("activeButton");
      }
    }

    for (let index = 1; index <= 3; index++) {
      let buttonComprobation = document.querySelector(
        `#root > div > div > div.settings > div:nth-child(2) > div > div:nth-child(${index}) > button`
      );

      if (buttonComprobation.value === currentDificult.current) {
        buttonComprobation.className = "activeButton gameBtn";
      } else {
        buttonComprobation.classList.remove("activeButton");
      }
    }

    for (let index = 1; index <= 4; index++) {
      let buttonComprobation = document.querySelector(
        `#root > div > div > div.settings > div:nth-child(3) > div > div:nth-child(${index}) > button`
      );

      if (buttonComprobation.value === currentImageSelected.current) {
        buttonComprobation.className = "activeButton gameBtn";
      } else {
        buttonComprobation.classList.remove("activeButton");
      }
    }
  }, [currentDificult.current, currentGameMode, currentImageSelected.current]);

  useEffect(() => {
    // useEffect para guardar los datos de los jugadores cuando ganen.

    if (gameWon) {
      if (gameMode === "1Player") {
        currentWinnerData.current = {
          dificultad: currentDificult.current,
          tematica: currentImageSelected.current,
          turnos: turnos,
          gamemode: gameMode,
        };

        saveinDatabase(currentWinnerData.current);
      } else if (gameMode === "2Player") {
        currentWinnerData.current = {
          gamemode: gameMode,
          P1: user1,
          P2: user2,
          turnos: turnos,
          dificultad: currentDificult.current,
          tematica: currentImageSelected.current,
          winner: currentWinner.current,
        };

        saveinDatabase(currentWinnerData.current);
      }
    }
  }, [gameWon]);

  function GuardarJugadores() {
    // Guardar los jugadores en el context.
    const pattern = new RegExp("^[A-Z]+$", "i");

    if (
      currentUser1.current == undefined ||
      currentUser2.current == undefined
    ) {
      alert("No pueden haber nombres vacios");
      return;
    }

    if (currentUser1.current === currentUser2.current) {
      alert("Los nombres no pueden  ser iguales");

      return;
    }

    if (currentUser1.current.length <= 3 || currentUser2.current.length <= 3) {
      alert("Debes introducir por lo menos 4 caracteres");
      return;
    }

    if (
      pattern.test(currentUser1.current) === false ||
      pattern.test(currentUser2.current) === false
    ) {
      alert("Solo se admiten letras en los nombres");
      return;
    }

    setUser1(currentUser1.current);
    setUser2(currentUser2.current);
  }

  function SaveUrlsDatabase(urls) {
    const SaveUrls = new Promise((resolve, reject) => {
      const req = axios({
        method: "post",
        url: "http://localhost:9000/api/imagesUrl",
        data: urls,
      });

      req.then((res) => {
        resolve();

        if (res.request.status === 204) {
          console.log("El recurso ya se encuentra cargado");
          reject();
        }
      });
    });
  }

  function SaveUrlinSessionStorage(PhotosUrl) {
     let onlyurls = JSON.parse(PhotosUrl);
  
    let saveInLocal = {
      photosUrl: onlyurls.photosUrl,
      tematica: currentImageSelected.current,
      dificult: currentDificult.current,
    };

  

    window.sessionStorage.setItem(
      `Modo-${currentDificult.current}-${currentImageSelected.current}`,
      JSON.stringify(saveInLocal)
    );

    let ToSaveDatabase = {
      name: `Modo-${currentDificult.current}-${currentImageSelected.current}`,
      urls: JSON.stringify(saveInLocal),
    };

    return ToSaveDatabase;
  }

  async function SaveImages(query) {
    // Si las url de las imagenes no estan en el sessionStorage, las solicita a la api y las guarda en el sessionStorage.

    if (
      // Le preguntamo al sessionStorage si las imagenes ya estan guardadas.
      window.sessionStorage.getItem(
        `Modo-${currentDificult.current}-${currentImageSelected.current}`
      )
    ) {
      // Si las imagenes ya estan guardadas, las cargamos en el context.
      let dataToken = JSON.parse(
        window.sessionStorage.getItem(
          `Modo-${currentDificult.current}-${currentImageSelected.current}`
        )
      );
     

      setGameImages(dataToken.photosUrl);
    } else {
      const setDataBaseImages = new Promise((resolve, reject) => {
        // Consultando imagenes desde la base de datos.
        axios({
          method: "post",
          url: "http://localhost:9000/api/imagesUrlQuery",
          data: {
            query: `Modo-${currentDificult.current}-${currentImageSelected.current}`,
          },
        })
          .then((res) => {
            const photosUrlFromDB = JSON.parse(res.data[0].urls).photosUrl;
          
            SaveUrlinSessionStorage(res.data[0].urls);
            setGameImages(photosUrlFromDB);

            resolve();
          })
          .catch(async (err) => {
            console.log("Cargando images desde la api");
            let data;

            switch (currentDificult.current) {
              case "facil":
                try {
                  data = await fetchData(6, currentImageSelected.current);
                } catch (error) {
                  sessionStorage.deleteItem(
                    "Modo-${currentDificult.current}-${currentImageSelected.current}"
                  );
                  alert(
                    "Error a cargar las imagenes desde la api, recargue la pagina"
                  );
                }
                break;
              case "normal":
                try {
                  data = await fetchData(10, currentImageSelected.current);
                } catch (error) {
                  sessionStorage.deleteItem(
                    "Modo-${currentDificult.current}-${currentImageSelected.current}"
                  );
                  alert(
                    "Error a cargar las imagenes desde la api, recargue la pagina"
                  );
                }
                break;
              case "dificil":
                try {
                  data = await fetchData(18, currentImageSelected.current);
                } catch (error) {
                  sessionStorage.deleteItem(
                    "Modo-${currentDificult.current}-${currentImageSelected.current}"
                  );
                  alert(
                    "Error a cargar las imagenes desde la api, recargue la pagina"
                  );
                }
                break;
            } // Aqui se hace la peticion a la api segun los datos actuales.
            // En este punto ya data tiene las imagenes que se necesitan.
            const PhotosUrlFacil = data.photos.map((photo) => photo.src.small); //extraemos solo las urls de  las imagenes.

            // Guardamos las imagenes en el sessionStorage.
            let UrlInlocal = SaveUrlinSessionStorage(PhotosUrlFacil); //Devuelve un  objeto con el query para guardar las urls en la base de datos
            SaveUrlsDatabase(UrlInlocal);

            // Guardamos las imagenes en el context.
            setGameImages(PhotosUrlFacil);

            reject(err);
          });
      });
    }
  }

  function restartGame() {
    // Reinicia el juego.
    currentWinner.current = undefined;
    setDificult(currentDificult.current);
    setUser1(currentUser1.current);
    setUserInTurn(undefined);
    setGameStart(false);
    setUser2(currentUser2.current);
    setGameWon(false);
    setUser1Score(0);
    setUser2Score(0);
    setGameWon(false);
    setGamePoints(0);
    setTurnos(0);

    setShuffledMemoBlocks(FnShuffle);
  }

  switch (
    currentDificult.current // Segun  la dificultad asigna el limite de pares
  ) {
    case "facil":
      pares = 6;
      break;
    case "dificil":
      pares = 18;
      break;
    case "normal":
      pares = 10;
      break;
  }

  const isTheWinner = () => {
    // Determina el resultado de la partida

    if (user1Score > user2Score) {
      currentWinner.current = user1;
      return "El ganador es " + user1;
    } else if (user2Score > user1Score) {
      currentWinner.current = user2;
      return "El ganador es " + user2;
    } else {
      currentWinner.current = "Empate";
      return "Empate";
    }
  };

  const saveinDatabase = async (res) => {
    let dataurl;

    if (gameMode === "1Player") {
      dataurl = "https://memoramabackend.herokuapp.com/api/singlemode";
    }

    if (gameMode === "2Player") {
      dataurl = "https://memoramabackend.herokuapp.com/api/twoplayer";
    }
    await axios({
      url: dataurl,
      method: "post",
      data: res,
    })
      .then((res) => {
        console.log('Datos guardados en la base de datos')
      })
      .catch((res) => {
        console.log('No se pudieron guardar los datos en la base de datos');
      });
  };

  return (
    <div className="board-container">
      {/*Recuadro de estadisticas en juego*/}
      {currentGameMode === "1Player" ? (
        <div className="estadisticas">
          <button className="btn btn-primary">TURNOS: {turnos}</button>
          <button className="btn btn-primary">PARES: {gamePoints}</button>
          <div onClick={restartGame} className="restart--button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-arrow-repeat"
              viewBox="0 0 16 16"
            >
              <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
              <path
                fillRule="evenodd"
                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
              />
            </svg>
          </div>
        </div>
      ) : (
        <>
          <div className="estadisticas">
            <button
              className={
                user1 && user1 === userInTurn
                  ? "btn btn-primary Inturno"
                  : "btn btn-primary"
              }
            >
              {user1 || "P1"}: {user1Score}
            </button>

            <button
              className={
                user2 && user2 === userInTurn
                  ? "btn btn-primary Inturno"
                  : "btn btn-primary"
              }
            >
              {user2 || "P2"}: {user2Score}
            </button>
            <div onClick={restartGame} className="restart--button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-arrow-repeat"
                viewBox="0 0 16 16"
              >
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                <path
                  fillRule="evenodd"
                  d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                />
              </svg>
            </div>
          </div>
        </>
      )}
      {/*Tablero*/}
      <main className="board">
        {gameWon && currentGameMode == "1Player" ? (
          <div className="WinMenu ">
            <h1>!GANASTE!</h1>
            <button
              onClick={() => {
                restartGame();
              }}
              btn
              btn-primary
            >
              Reiniciar
            </button>
          </div>
        ) : null}

        {gameWon && currentGameMode == "2Player" ? (
          <div className="WinMenu ">
            <h1>{isTheWinner()}</h1>
            <button
              onClick={() => {
                restartGame();
              }}
              btn
              btn-primary
            >
              Reiniciar
            </button>
          </div>
        ) : null}

        {gameImages.length === pares ? (
          <>
            {gameStart === false && currentGameMode === "1Player" ? (
              <div className="WinMenu btn-success">
                <button
                  onClick={() => {
                    setGameStart(true);
                  }}
                >
                  INICIAR JUEGO
                </button>
              </div>
            ) : null}
            {gameStart === false && currentGameMode === "2Player" ? (
              <div className="WinMenu btn-success">
                {user1 != undefined ? (
                  <button
                    onClick={() => {
                      setGameStart(true);
                      let user1copy = currentUser1.current;

                      setUserInTurn(user1copy);
                    }}
                  >
                    Comenzar
                  </button>
                ) : (
                  <h2>Ingrese a los jugadores</h2>
                )}
              </div>
            ) : null}

            <div className="cards">
              {memoBlocks.map((memoBlock, i) => {
                return (
                  <MemoBlock
                    key={i}
                    animating={animating}
                    handleMemoClick={handleMemoClick}
                    memoBlock={memoBlock}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="LoadingImages ">
            <div className="loadingio-spinner-spin-n8ddoqcp6ui">
              <div className="ldio-7s42zp5gbve">
                <div>
                  <div></div>
                </div>
                <div>
                  <div></div>
                </div>
                <div>
                  <div></div>
                </div>
                <div>
                  <div></div>
                </div>
                <div>
                  <div></div>
                </div>
                <div>
                  <div></div>
                </div>
                <div>
                  <div></div>
                </div>
                <div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {/*ormulario para ingresar jugadores*/}

      <div
        className={
          currentGameMode === "2Player" ? "UsersName showButtons" : "UsersName"
        }
      >
        <div className="input-group input-group-md inputName">
          <span className="input-group-text" id="inputGroup-sizing-md">
            P1
          </span>
          <input
            onChange={(e) => {
              currentUser1.current = e.target.value;
              const pattern = new RegExp("^[A-Z]+$", "i");
              if (!pattern.test(e.target.value)) {
                e.currentTarget.classList.add("border-danger");
              } else {
                e.currentTarget.classList.remove("border-danger");
              }
            }}
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-md"
          />
        </div>
        <button
          onClick={() => {
            GuardarJugadores();
          }}
          className="saveIcon heartbeat"
        >
          <FontAwesomeIcon icon={faFloppyDisk} />
        </button>

        <div className="input-group input-group-md inputName">
          <span className="input-group-text" id="inputGroup-sizing-md">
            P2
          </span>
          <input
            onChange={(e) => {
              currentUser2.current = e.target.value;
              const pattern = new RegExp("^[A-Z]+$", "i");
              if (!pattern.test(e.target.value)) {
                e.currentTarget.classList.add("border-danger");
              } else {
                e.currentTarget.classList.remove("border-danger");
              }
            }}
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
          />
        </div>
      </div>
      {/*Botones de configuracion del juego*/}
      <div className="settings">
        <div className="GameBtnMode">
          <p>MODO DE JUEGO: </p>
          <div id="gamemode" className="GameBtnMode--botones">
            <div>
              <button
                onClick={() => {
                  setCurrentGameMode("1Player");
                  restartGame();
                }}
                value="1Player"
                className="btn"
              >
                SOLO
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  setCurrentGameMode("2Player");
                  restartGame();
                  setGameMode("2Player");
                }}
                value="2Player"
                className="btn"
              >
                CON UN AMIGO
              </button>
            </div>
          </div>
        </div>

        <div className="GameBtnMode">
          <p>DIFICULTAD: </p>
          <div className="GameBtnMode--botones">
            <div>
              <button
                onClickCapture={(e) => {
                  currentDificult.current = e.target.value;
                  restartGame();
                  setDificult(e.target.value);
                }}
                value="facil"
                className="gameBtn"
              >
                4X3
              </button>
            </div>
            <div>
              <button
                onClickCapture={(e) => {
                  currentDificult.current = e.target.value;
                  restartGame();
                  setDificult(e.target.value);
                }}
                value="normal"
                className="gameBtn"
              >
                5X4
              </button>
            </div>
            <div>
              <button
                onClickCapture={(e) => {
                  currentDificult.current = e.target.value;
                  restartGame();
                  setDificult(e.target.value);
                }}
                value="dificil"
                className="gameBtn"
              >
                6X6
              </button>
            </div>
          </div>
        </div>

        <div className="GameBtnMode">
          <p>TEMATICA: </p>
          <div className="GameBtnMode--botones">
            <div>
              <button
                onClickCapture={(e) => {
                  console.log(e.target.value);
                  currentImageSelected.current = e.target.value;
                  restartGame();
                  SaveImages(currentDificult.current);
                }}
                value="cats"
                className="btn"
              >
                GATOS
              </button>
            </div>
            <div>
              <button
                onClickCapture={(e) => {
                  console.log(e.target.value);
                  currentImageSelected.current = e.target.value;
                  restartGame();
                  SaveImages(currentDificult.current);
                }}
                value="dogs"
                className="btn"
              >
                PERROS
              </button>
            </div>
            <div>
              <button
                onClickCapture={(e) => {
                  console.log(e.target.value);
                  currentImageSelected.current = e.target.value;
                  restartGame();
                  SaveImages(currentDificult.current);
                }}
                value="birds"
                className="btn"
              >
                AVES
              </button>
            </div>
            <div>
              <button
                onClickCapture={(e) => {
                  console.log(e.target.value);
                  currentImageSelected.current = e.target.value;
                  restartGame();
                  SaveImages(currentDificult.current);
                }}
                value="furnitures"
                className="btn"
              >
                MUEBLES
              </button>
            </div>
          </div>
        </div>

        {/* <GameSettings/> */}
      </div>
    </div>
  );
};

export default Board;
