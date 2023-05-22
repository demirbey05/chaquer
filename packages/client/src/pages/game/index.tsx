import { Grid } from "../../components/TerrainComp/Grid";
import { useTerrain } from "../../context/TerrainContext";
import map from "../../../map.json";
import ScrollContainer from "react-indiana-drag-scroll";
import ArmyInfoModal from "../../components/BootstrapComp/ArmyInfoModal";
import CastleWarning from "../../components/GameComp/CastleWarning";
import ArmyWarning from "../../components/GameComp/ArmyWarning";
import ArmyMoveWarning from "../../components/GameComp/ArmyMoveWarning";
import LoserWarning from "../../components/GameComp/LoserWarning";
import { useCastlePositionByAddress } from "../../hooks/useCastlePositionByAddress";
import { getBurnerWallet } from "../../mud/getBurnerWallet";
import ArmyProgressComp from "../../components/GameComp/ArmyProgressComp";
import AudioControlComp from "../../components/BootstrapComp/AudioControlComp";

function Game() {
  const { width, height, isCastleSettled, isArmyStage, isArmyMoveStage, isCastleDeployedBefore } = useTerrain();
  const values = map;
  const myCastlePosition = useCastlePositionByAddress(getBurnerWallet().address.toLocaleLowerCase());

  const terrainStyles = [0, 40];

  return (
    <div>
      {!isCastleSettled && <CastleWarning />}
      {isCastleSettled && isArmyStage && <ArmyWarning />}
      {isArmyMoveStage && <ArmyMoveWarning />}
      {isCastleSettled && <ArmyProgressComp />}
      {(myCastlePosition && (myCastlePosition.length === 0) && isCastleDeployedBefore && isCastleSettled) && <LoserWarning />}
      {isCastleSettled && <ArmyInfoModal />}
      {isCastleSettled && <AudioControlComp />}
      <ScrollContainer
        className="scroll-container"
        style={{ zIndex: "0", height: "100vh", overflow: "scroll" }}
      >
        <Grid
          width={width}
          height={height}
          values={values}
          pixelStyles={terrainStyles}
          isBorder={false}
        />
      </ScrollContainer>
    </div>
  );
}

export default Game;
