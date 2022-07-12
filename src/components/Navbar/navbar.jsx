import React, { useEffect, useState, useContext,useRef } from "react";
import axios from "axios";
import { gameContext } from "../../context/context";
require("./navbar.css");


export default function Navbar() {
  const { gameWon } = useContext(gameContext);
  const [defaultScore, setDefaultScore] = useState(true);
  const [data, setData] = useState([]);
   const [data1Player, setData1Player] = useState([]);

  



  const requstGameDatafromDB = async () => {
    const twoplayers = await axios.get("https://memoramabackend.herokuapp.com/api/twoplayers");
    const responseSingleMode= await axios.get("https://memoramabackend.herokuapp.com/api/singlemode");
    

    return  {
      twoplayers: twoplayers.data,
      singlemode: responseSingleMode.data,
    }
  };

  async function request() {
     const twoplayers = await axios.get(
       "https://memoramabackend.herokuapp.com/api/twoplayers"
     );
     const responseSingleMode = await axios.get(
       "https://memoramabackend.herokuapp.com/api/singlemode"
     );
   
    setData(twoplayers.data);
    setData1Player(responseSingleMode.data);
  }
  useEffect(() => {
    request();
  }, [gameWon]);

  return (
    <div className="navbar--container">
      <h3>MEMORAMA</h3>
     


      <div className="scoreBoard">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Ver el Historial
        </button>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Historial de partidas
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <thead>
                    {defaultScore ? (
                      <tr>
                        <th scope="col">Ganador</th>
                        <th scope="col">P1</th>
                        <th scope="col">P2</th>
                        <th scope="col">Dificultad</th>
                      </tr>
                    ) : (
                      <tr>
                        <th scope="col">Turnos</th>
                        <th scope="col">Dificultad</th>
                        <th scope="col">Tematica</th>
                        <th scope="col">Modo de juego</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="tBody">
                    {defaultScore
                      ? data.map((item, index) => {
                          return (
                            <tr key={index}>
                              <th scope="row">{item.winner}</th>
                              <td>{item.P1}</td>
                              <td>{item.P2}</td>
                              <td>{item.dificultad}</td>
                            </tr>
                          );
                        })
                      : data1Player.map((item, index) => {
                          return (
                            <tr key={index}>
                              <th scope="row">{item.turnos}</th>
                              <td>{item.dificultad}</td>
                              <td>{item.tematica}</td>
                              <td>{item.gamemode}</td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    setDefaultScore(!defaultScore);
                    request();
                 
                  }}
                  type="button"
                  className="btn btn-secondary"
                >
                 {defaultScore? "Modo de 1 jugador": "Modo de 2 jugadores"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
