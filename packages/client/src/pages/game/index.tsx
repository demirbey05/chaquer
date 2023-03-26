import { Grid } from "../../components/TerrainComp/Grid";
import { useTerrain } from "../../context/TerrainContext";
import map from '../../../map.json';
import ScrollContainer from 'react-indiana-drag-scroll';

function Game() {
    const { width, height } = useTerrain();
    const values = map;

    const terrainStyles = [ 0, 25 ];
    const smallMap = [1,2];

    return (
      <div>
        <div style={{position:"fixed", zIndex:"1", bottom:"0", left:"0", marginLeft:"2px",marginBottom:"2px"}}>
          <Grid width={width} height={height} values={values} pixelStyles={smallMap} isBorder={true}/>
        </div>
        <div>
          <ScrollContainer className="scroll-container" style={{ zIndex:"0", height:"100vh", overflow:"scroll"}}>
            <Grid width={width} height={height} values={values} pixelStyles={terrainStyles} isBorder={false}/>
          </ScrollContainer>
        </div>
      </div>
    )
}

export default Game