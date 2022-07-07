import './MemoBlock.css';
import {useContext} from 'react';
import { gameContext } from "../../context/context";
import {Suspense} from 'react';



  
  const MemoBlock = ({animating, handleMemoClick, memoBlock}) => {
    const { dificult } = useContext(gameContext);
     
     const widthGrid =()=>{

      switch (dificult) {
        case 'facil':
          return '24.2%';
        case 'normal':
          return '19.2%';
        case 'dificil':
          return '15.866%';
        default:
          return '19.3%';

     }
    }
    const WidthTotal = widthGrid()
   
    return (
      <div
        className="memo-block"
        style={{ width: `${WidthTotal}` }}
        onClick={() =>
          !memoBlock.flipped && !animating && handleMemoClick(memoBlock)
        }
      >
        <div
          className={`memo-block-inner ${
            memoBlock.flipped && "memo-block-flipped"
          }`}
        >
          {" "}
          {/* Si la carta está girada, se agrega la clase memo-block-flipped */}
          <div className="memo-block-front"></div>
          <div className="memo-block-back">
           

            <img src={memoBlock.image} width="100%" alt="" />
           
           
          </div>
        </div>
      </div>
    );
  };
  
  export default MemoBlock;
  





