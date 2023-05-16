import armyImg from "../../images/army.png";
import { Button } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useTerrain } from "../../context/TerrainContext";
import ArmyProgressComp from "./ArmyProgressComp";
import { Tooltip } from '@chakra-ui/react'

function ArmyStageComp() {
  const { setIsArmyStage, isArmyStage, numberOfArmy, isArmyMoveStage } = useTerrain();

  const handleArmyStage = () => {
    if (isArmyStage) {
      setIsArmyStage(false);
    } else {
      setIsArmyStage(true);
    }
  };
  return (
    <>
      <div
        style={{
          width: "200px",
          height: "60px",
          borderRadius: "25px",
          border: "2px solid white",
          padding: "0px 20px",
          left: "0",
          right: "0",
          top: "0",
          margin: "10px auto",
          zIndex: "1",
          position: "absolute",
          backgroundColor: "rgb(148,163,184,0.5)",
        }}
      >
        <div className="row text-center text-white bg-opacity-0">
          <div className="col align-items-center">
            <div className="row justify-content-center">
              <div className="col align-items-center">
                <img
                  src={armyImg}
                  style={{ height: "55px", width: "55px" }}
                ></img>
              </div>
              <div className="col align-items-center">
                <Tooltip hasArrow label='You have placed your all army' openDelay={300} closeDelay={300} bg='red.600' placement='right-start' isDisabled={numberOfArmy !== 3 || (isArmyMoveStage && !isArmyMoveStage)}>
                  <Button
                    onClick={() => handleArmyStage()}
                    colorScheme={"blackAlpha"}
                    style={{ width: "25px", height: "40px", marginTop: "8.75px" }}
                    isDisabled={numberOfArmy === 3 || (isArmyMoveStage && isArmyMoveStage)}
                  >
                    {!isArmyStage ? <AddIcon></AddIcon> : <MinusIcon></MinusIcon>}
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ArmyProgressComp></ArmyProgressComp>
    </>
  );
}

export default ArmyStageComp;
