import React, { useContext, useRef, useEffect, useState } from "react";
import { gameContext } from "../../context/context";
import "./gameSettings.css";
import fetchData from "./functions/fetchImages";
import axios from "axios";
const GameSettings = () => {
  const { setGameMode, setDificult, setUser1, setUser2, setGameImages } =
    useContext(gameContext);
  const currentDificult = useRef("facil");
  const currentGameMode = useRef("0");
  const currentUser1 = useRef(undefined);
  const currentUser2 = useRef(undefined);
  const [userInputVisibility, setUserInputVisibility] = useState(false);
  const currentImageSelected = useRef("cats");
  async function SaveImages() {
    let data;

    if (currentDificult.current === "facil") {
      data = await fetchData(6, currentImageSelected.current);
    }
    if (currentDificult.current === "dificil") {
      data = await fetchData(18, currentImageSelected.current);
    }
    if (currentDificult.current === "normal") {
      data = await fetchData(10, currentImageSelected.current);
    }

    if (data) {
      const PhotosUrl = data.photos.map((photo) => photo.src.small);

      setGameImages(PhotosUrl);
    } else {
      alert("Hubo un problema con el servidor intente de nuevo");
    }
  }
  return (
    <div className="panel">
      <div className="container">
       
       <div className="input-group ajustes">

        <div className="input-group tematica">
          <label
            className="input-group-text categoria"
            for="inputGroupSelect01"
          >
            Tematica
          </label>
          <select
            id="inputGroupSelect01"
            className="form-select form-select-md categoria"
            aria-label=".form-select-lg example"
            onChange={(e) => {
              currentImageSelected.current = e.target.value;
            }}
          >
            <option defaultValue>Tematica</option>
            <option value="cats">Gatos</option>
            <option value="dogs">Perros</option>
            <option value="furniture">muebles</option>
            <option value="bird">Aves</option>
            <option value="toy">Juguetes</option>
          </select>
        </div>
        {/* end input-group Tematica */}

        <div className="input-group  tematica">
          <label className="input-group-text" for="inputGroupSelect01">
            Dificultad
          </label>
          <select
            className="form-select  "
            aria-label=".form-select-lg example"
            onChange={(e) => {
              let value = e.target.value;
              currentDificult.current = value;
              //console.log(value)
            }}
          >
            <option defaultValue value="facil">
              Facil
            </option>
            <option value="normal">Normal</option>
            <option value="dificil">Dificil</option>
          </select>
        </div>

        {/* end input-group Dificultad*/}
       </div>

        <div className="input-group  tematica">
          <label className="input-group-text" for="inputGroupSelect01">
            Modo de juego
          </label>
          <select
            className="form-select "
            aria-label=".form-select-lg example"
            onChange={(e) => {
              let value = e.target.value;
              if (value == 1) {
                setUserInputVisibility(true);
              } else {
                setUserInputVisibility(false);
              }
              currentGameMode.current = value;
              //console.log(value)
            }}
          >
            <option name="solitario" value="0">
              Solitario
            </option>
            <option value="1">Multijugador</option>
          </select>
        </div>
        {/* end input-group GameMode  */}

        <div className={`usersInput ${userInputVisibility && `show`}`}>
          <div
            className={`usersInputContainer input-group mb-3 ${
              userInputVisibility && "showInput"
            }`}
          >
            <span className="input-group-text" id="inputGroup-sizing-default">
              Jugador 1
            </span>
            <input
              type="text"
              required
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              onChange={(e) => {
                let value = e.target.value;
                currentUser1.current = value;
              }}
            />
          </div>
          <div
            className={`usersInputContainer input-group mb-3 ${
              userInputVisibility && "showInput"
            }`}
          >
            <span className="input-group-text" id="inputGroup-sizing-default">
              Jugador 2
            </span>
            <input
              type="text"
              required
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              onChange={(e) => {
                let value = e.target.value;
                currentUser2.current = value;
              }}
            />
          </div>
        </div> {/* end usersInput */}

        <button
          onClick={() => {
            if (currentGameMode.current === "1") {
              if (
                currentUser1.current === undefined ||
                currentUser2.current === undefined
              ) {
                alert("Los nombres no pueden estar vacios");
                return;
              }

              if (currentUser1.current === "" || currentUser2.current === "") {
                alert("Los nombres no pueden estar vacios");
                return;
              }

              if (currentUser1.current === currentUser2.current) {
                alert("Los nombres no pueden ser iguales");
                return;
              }

              setGameMode(currentGameMode.current);
              setDificult(currentDificult.current);
              setUser1(currentUser1.current);
              setUser2(currentUser2.current);
              SaveImages();
              console.log("Success 1");
            } else {
              setGameMode(currentGameMode.current);
              setDificult(currentDificult.current);
              setUser1(currentUser1.current);
              setUser2(currentUser2.current);

              SaveImages();
              console.log("Success 2");
            }
          }}
          type="button"
          className="btn btn-success start"
        >
          INICIAR
        </button>
      </div>
    </div>
  );
};

export default GameSettings;
