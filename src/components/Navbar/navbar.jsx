import React, {useEffect,useState,useContext} from 'react'
import scoreIcon from '../../assets/images/scoreboard.png'
import axios from 'axios'
import { gameContext } from "../../context/context";
require ('./navbar.css')

const requstGameDatafromDB = async() => {


    const response = await axios.get("http://localhost:9000/api/twoplayers")
    return response.data
 
  
}




export default function Navbar() { 
  const {gameWon} = useContext(gameContext)
 
  const [data, setData] = useState([]);

  useEffect(() => {
    async function request() {
      let reqData = await requstGameDatafromDB();
  
      setData(reqData);
    }
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
        <tr>
          <th scope="col">Ganador</th>
          <th scope="col">P1</th>
          <th scope="col">P2</th>
          <th scope="col">Dificultad</th>
        </tr>
      </thead>
      <tbody>
      { data.map((item, index) => {
           return <tr key={index}>
              <th scope="row">{item.winner}</th>
              <td>{item.P1}</td>
              <td>{item.P2}</td>
              <td>{item.dificultad}</td>
            </tr>;
          })}
      </tbody>
    </table>
              </div>
              <div className="modal-footer">
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
