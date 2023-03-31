import { Grid } from "../../components/TerrainComp/Grid";
import { useTerrain } from "../../context/TerrainContext";
import map from "../../../map.json";
import ScrollContainer from "react-indiana-drag-scroll";
import SmallMap from "../../components/GameComp/SmallMap";
import { useMUD } from "../../MUDContext";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue, ComponentValue } from "@latticexyz/recs";
import { useEffect, useState } from "react";

function Game() {
  const { width, height, isCastleSettled } = useTerrain();
  const values = map;
  const { components } = useMUD();

  // Get Castle
  const castleEntities = useEntityQuery([Has(components.CastleOwnable)]);
  const [castlePositions, setCastlePositions] = useState<any[]>([]);

  useEffect(() => {
    castleEntities.forEach((entityIndex) => {
      setCastlePositions([
        ...castlePositions,
        getComponentValue(components.Position, entityIndex),
      ]);
    });

    console.log("Castle Entities effect");
  }, [castleEntities]);

  const terrainStyles = [0, 25];

  return (
    <div>
      {!isCastleSettled && (
        <div
          style={{
            position: "absolute",
            zIndex: "1",
            color: "white",
            left: "0",
            right: "0",
            top: "0",
            margin: "100px auto",
            width: "600px",
          }}
        >
          <h2 className="text-center text-3xl text-white mb-2 border-top border-bottom font-bold">
            Please settle your castle!
          </h2>
        </div>
      )}
      <SmallMap />
      <div>
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
    </div>
  );
}

export default Game;
