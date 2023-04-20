import armyImg from '../../images/army.png';
import swordsmanImg from '../../images/swordsman.png';
import { Button } from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useTerrain } from '../../context/TerrainContext';

function ArmyStageComp() {
  const { setIsArmyStage, isArmyStage } = useTerrain();

  const handleArmyStage = () => {
    if (isArmyStage) {
      setIsArmyStage(false);
    }
    else {
      setIsArmyStage(true);
    }
  }
  return (
    <div style={{
      width: "150px",
      height: "85px",
      borderRadius: "25px",
      border: "2px solid white",
      padding: "10px 20px",
      left: "0",
      right: "0",
      top: "0",
      margin: "12.5px auto",
      zIndex: "1",
      position: "absolute",
      backgroundColor: "rgb(148,163,184,0.5)"
    }}>
      <div className='row text-center text-white bg-opacity-0'>
        <div className='col align-items-center' >
          <div className='row justify-content-center'>
            <div className='col-6 align-items-center'>
              <img src={swordsmanImg} style={{ height: "60px", width: "35px" }}></img>
            </div>
            <div className='col align-items-center'>
              <Button onClick={() => handleArmyStage()} colorScheme={'blackAlpha'} style={{ width: "25px", height: "40px", marginTop: "10px" }}>{!isArmyStage ? <AddIcon></AddIcon> : <MinusIcon></MinusIcon>}</Button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default ArmyStageComp
