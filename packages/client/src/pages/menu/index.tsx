import { Grid } from "../../components/TerrainComp/Grid";
import { generatePerlinValues } from "../../terrain-helper/utils";
import { MouseEvent } from "react";
import MySpinner from "../../components/ChakraComp/TerrainSpinner";
import MyModal from "../../components/ChakraComp/TerrainInfoModal";
import { Button } from "@chakra-ui/react";
import { useTerrain } from "../../context/TerrainContext.js";
import map from "../../../map.json";
import dungeonImg from "../../images/dungeon.png";
import castleImg from "../../images/castle.png";
import { Link } from "react-router-dom";
import { useMUD } from "../../MUDContext";
import { flatten2D } from "../../utils/terrainArray";
import { ethers, Contract } from "ethers";
import { getContractAddress } from "../../utils/getContractAddress";
import { config } from "../../mud/config";
import worldJ from "../../../../contracts/abi/World.json";
import { useComponentValue } from "@latticexyz/react";
import { EntityID } from "@latticexyz/recs";

function Menu() {
  const {
    setIsLoading,
    width,
    height,
    setValues,
    setRefresh,
    refresh,
    isLoading,
    setPermArray,
    saveTerrain,
  } = useTerrain();

  const { components, systems, singletonEntity, world } = useMUD();

  const handleRefresh = (event: MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const { valuesArray, perm } = generatePerlinValues(height, width);
    setValues(valuesArray);
    setPermArray(perm);
    setRefresh(refresh + 1);
  };

  const mapConfigH = useComponentValue(
    components.MapConfig,
    singletonEntity
  )?.value;

  const handleTerrain = async () => {
    saveTerrain();

    const mapConfigAddress = getContractAddress("MapConfigComponent");
    const provider = new ethers.providers.JsonRpcProvider(
      config.provider.jsonRpcUrl
    );
    const mapConfig = new Contract(config.worldAddress, worldJ.abi, provider);
    const data: string = ethers.utils.hexlify(flatten2D(map));
    const tx = await systems["system.Init"].execute(data);
    const tc = await tx.wait();
  };

  const terrainStyles = [8, 7];
  const values = map;

  return (
    <div
      style={{
        backgroundImage: `url(${dungeonImg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center h-screen items-center">
          {isLoading === true ? (
            <div className="col-8 align-items-center justify-content-center">
              ( <MySpinner></MySpinner> )
            </div>
          ) : (
            <>
              {refresh === 0 ? null : (
                <div className="col-8 align-items-center justify-content-center">
                  <Grid
                    width={width}
                    height={height}
                    values={values}
                    pixelStyles={terrainStyles}
                    isBorder={true}
                  />
                </div>
              )}
            </>
          )}
          <div className="col align-items-center justify-content-center">
            <h2 className="text-center text-white mb-2 display-4 border-top border-bottom font-bold">
              Chaquer
            </h2>
            <img
              className="m-auto mb-5"
              src={castleImg}
              style={{
                width: "250px",
                height: "250px",
                justifyContent: "center",
              }}
            ></img>
            {refresh !== 0 && (
              <div className="text-center mt-2 mb-2">
                <Link to="/game">
                  <Button
                    colorScheme="blackAlpha"
                    border="solid"
                    width="200px"
                    isDisabled={isLoading}
                    textColor="white"
                    variant="ghost"
                    p="7"
                    onClick={handleTerrain}
                  >
                    Start the Game
                  </Button>
                </Link>
              </div>
            )}
            <div className="text-center mb-2">
              <Button
                colorScheme="blackAlpha"
                border="solid"
                width="200px"
                isDisabled={isLoading}
                textColor="white"
                variant="ghost"
                onClick={handleRefresh}
                p="7"
              >
                {refresh === 0 ? "Generate Terrain" : "Regenerate the Terrain"}
              </Button>
            </div>
            {refresh !== 0 && (
              <div className="text-center">
                <MyModal />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
